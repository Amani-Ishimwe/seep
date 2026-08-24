"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Client {
  id: string;
  name: string;
  rate: number;
  retainerCap: number | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO datetime
  duration: number; // in hours
  clientId: string | null;
  billable: boolean;
  suggestedClientId?: string; // for auto-suggestions
  confidence?: "high" | "medium" | "low";
  reason?: string; // why it was detected
  status?: "detected" | "confirmed" | "ignored" | "recovered";
}

export interface InvoicedHours {
  id: string;
  clientId: string;
  weekStart: string; // YYYY-MM-DD
  hours: number;
}

export interface HistoricalSnapshot {
  clientId: string;
  weekStart: string; // YYYY-MM-DD
  hoursWorked: number;
  hoursInvoiced: number;
  leakAmount: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "seep";
  text: string;
}

export interface UserProfile {
  name: string;
  email: string;
  billingRate: number;
  billingCurrency: string;
  billingStructure: "hourly" | "retainer" | "project" | "mixed";
  audienceType: "clients" | "agencies" | "startups" | "companies" | "other";
  tier: "free" | "pro";
}

interface SeepContextType {
  onboarded: boolean;
  onboardingStep: number;
  calendarConnected: boolean;
  clients: Client[];
  events: CalendarEvent[];
  invoicedHours: InvoicedHours[];
  historicalSnapshots: HistoricalSnapshot[];
  recoveredThisMonth: number;
  isLoading: boolean;
  simulateErrors: boolean;
  syncErrorMessage: string | null;
  activeClientId: string | null;
  activeSection: string;
  searchQuery: string;
  aiChatMessages: ChatMessage[];
  userProfile: UserProfile;
  setOnboardingStep: (step: number) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setActiveClientId: (id: string | null) => void;
  setActiveSection: (section: string) => void;
  setSearchQuery: (query: string) => void;
  setSimulateErrors: (val: boolean) => void;
  connectCalendar: () => Promise<void>;
  addClient: (name: string, rate: number, retainerCap: number | null) => Promise<void>;
  updateClientRate: (id: string, rate: number) => Promise<void>;
  toggleEventBillable: (id: string) => Promise<void>;
  linkEventToClient: (id: string, clientId: string | null) => Promise<void>;
  logInvoicedHours: (clientId: string, weekStart: string, hours: number) => Promise<void>;
  sendChatMessage: (text: string) => Promise<void>;
  setEventStatus: (id: string, status: "detected" | "confirmed" | "ignored" | "recovered") => Promise<void>;
  markLeakAsRecovered: (clientId: string, amount: number) => Promise<void>;
  resetApp: () => void;
  completeOnboarding: () => void;
}

const SeepContext = createContext<SeepContextType | undefined>(undefined);

const CURRENT_WEEK = "2026-08-24";
const PREV_WEEKS = ["2026-08-17", "2026-08-10", "2026-08-03"];

const MOCK_EVENTS_TEMPLATE: Omit<CalendarEvent, "id">[] = [
  {
    title: "acme kickoff sync",
    start: "2026-08-24T10:00:00Z",
    duration: 1.5,
    clientId: null,
    billable: false,
    suggestedClientId: "acme-corp",
    confidence: "high",
    reason: "contains client keyword 'acme' and sync label",
    status: "detected"
  },
  {
    title: "weekly figma review",
    start: "2026-08-25T14:00:00Z",
    duration: 2.0,
    clientId: null,
    billable: false,
    suggestedClientId: "acme-corp",
    confidence: "high",
    reason: "figma design link found in meeting invites",
    status: "detected"
  },
  {
    title: "email technical response",
    start: "2026-08-26T09:00:00Z",
    duration: 0.8,
    clientId: null,
    billable: false,
    suggestedClientId: "zenith-design",
    confidence: "medium",
    reason: "sent during core hours to client domains",
    status: "detected"
  },
  {
    title: "zenith roadmap alignment",
    start: "2026-08-27T11:00:00Z",
    duration: 1.2,
    clientId: null,
    billable: false,
    suggestedClientId: "zenith-design",
    confidence: "high",
    reason: "attendee emails match client records",
    status: "detected"
  },
  {
    title: "untracked slack followups",
    start: "2026-08-28T16:00:00Z",
    duration: 1.0,
    clientId: null,
    billable: false,
    suggestedClientId: "zenith-design",
    confidence: "low",
    reason: "slack activity spike outside logged tools",
    status: "detected"
  },
  {
    title: "personal administrative tasks",
    start: "2026-08-27T15:00:00Z",
    duration: 1.5,
    clientId: null,
    billable: false,
    confidence: "low",
    reason: "non-client admin calendar label",
    status: "ignored"
  },
];

export function SeepProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [calendarConnected, setCalendarConnected] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [invoicedHours, setInvoicedHours] = useState<InvoicedHours[]>([]);
  const [historicalSnapshots, setHistoricalSnapshots] = useState<HistoricalSnapshot[]>([]);
  const [recoveredThisMonth, setRecoveredThisMonth] = useState<number>(680);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [simulateErrors, setSimulateErrors] = useState<boolean>(false);
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "amani",
    email: "amani@gemini.net",
    billingRate: 75,
    billingCurrency: "usd",
    billingStructure: "hourly",
    audienceType: "clients",
    tier: "free",
  });

  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init-1",
      sender: "seep",
      text: "hi amani. i parsed your calendar logs relative to logged client hours. what would you like me to check?",
    },
  ]);

  // Load from local storage
  useEffect(() => {
    setIsLoading(true);
    const storedOnboarded = localStorage.getItem("seep_onboarded") === "true";
    const storedStep = localStorage.getItem("seep_onboarding_step");
    const storedConnected = localStorage.getItem("seep_connected") === "true";
    const storedClients = localStorage.getItem("seep_clients");
    const storedEvents = localStorage.getItem("seep_events");
    const storedInvoiced = localStorage.getItem("seep_invoiced");
    const storedSnapshots = localStorage.getItem("seep_snapshots");
    const storedChat = localStorage.getItem("seep_chat");
    const storedRecovered = localStorage.getItem("seep_recovered");
    const storedProfile = localStorage.getItem("seep_profile");

    setOnboarded(storedOnboarded);
    if (storedStep) setOnboardingStep(parseInt(storedStep));
    setCalendarConnected(storedConnected);
    
    if (storedClients) setClients(JSON.parse(storedClients));
    if (storedEvents) setEvents(JSON.parse(storedEvents));
    if (storedInvoiced) setInvoicedHours(JSON.parse(storedInvoiced));
    if (storedSnapshots) setHistoricalSnapshots(JSON.parse(storedSnapshots));
    if (storedChat) setAiChatMessages(JSON.parse(storedChat));
    if (storedRecovered) setRecoveredThisMonth(parseFloat(storedRecovered));
    if (storedProfile) setUserProfile(JSON.parse(storedProfile));
    
    // Simulate loading fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const saveToStorage = (
    updatedOnboarded: boolean,
    updatedConnected: boolean,
    updatedClients: Client[],
    updatedEvents: CalendarEvent[],
    updatedInvoiced: InvoicedHours[],
    updatedSnapshots: HistoricalSnapshot[],
    updatedChat?: ChatMessage[],
    updatedRecovered?: number,
    updatedProfile?: UserProfile,
    updatedStep?: number
  ) => {
    localStorage.setItem("seep_onboarded", String(updatedOnboarded));
    localStorage.setItem("seep_connected", String(updatedConnected));
    localStorage.setItem("seep_clients", JSON.stringify(updatedClients));
    localStorage.setItem("seep_events", JSON.stringify(updatedEvents));
    localStorage.setItem("seep_invoiced", JSON.stringify(updatedInvoiced));
    localStorage.setItem("seep_snapshots", JSON.stringify(updatedSnapshots));
    if (updatedChat) localStorage.setItem("seep_chat", JSON.stringify(updatedChat));
    if (updatedRecovered !== undefined) localStorage.setItem("seep_recovered", String(updatedRecovered));
    if (updatedProfile) localStorage.setItem("seep_profile", JSON.stringify(updatedProfile));
    if (updatedStep !== undefined) localStorage.setItem("seep_onboarding_step", String(updatedStep));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...profile };
    setUserProfile(updated);
    saveToStorage(onboarded, calendarConnected, clients, events, invoicedHours, historicalSnapshots, aiChatMessages, recoveredThisMonth, updated, onboardingStep);
  };

  const handleSetOnboardingStep = (step: number) => {
    setOnboardingStep(step);
    localStorage.setItem("seep_onboarding_step", String(step));
  };

  const resetApp = () => {
    setOnboarded(false);
    setOnboardingStep(1);
    setCalendarConnected(false);
    setClients([]);
    setEvents([]);
    setInvoicedHours([]);
    setHistoricalSnapshots([]);
    setRecoveredThisMonth(680);
    setAiChatMessages([
      {
        id: "msg-init-1",
        sender: "seep",
        text: "hi amani. i parsed your calendar logs relative to logged client hours. what would you like me to check?",
      },
    ]);
    setUserProfile({
      name: "amani",
      email: "amani@gemini.net",
      billingRate: 75,
      billingCurrency: "usd",
      billingStructure: "hourly",
      audienceType: "clients",
      tier: "free",
    });
    setActiveClientId(null);
    setActiveSection("dashboard");
    localStorage.clear();
  };

  const completeOnboarding = () => {
    setOnboarded(true);
    saveToStorage(true, calendarConnected, clients, events, invoicedHours, historicalSnapshots, aiChatMessages, recoveredThisMonth, userProfile, onboardingStep);
  };

  const connectCalendar = async () => {
    setCalendarConnected(true);
    const generatedEvents: CalendarEvent[] = MOCK_EVENTS_TEMPLATE.map((evt, idx) => ({
      ...evt,
      id: `evt-${Date.now()}-${idx}`,
    }));
    setEvents(generatedEvents);
    saveToStorage(onboarded, true, clients, generatedEvents, invoicedHours, historicalSnapshots, aiChatMessages, recoveredThisMonth, userProfile, onboardingStep);
  };

  const addClient = async (name: string, rate: number, retainerCap: number | null) => {
    const newClient: Client = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.toLowerCase(),
      rate,
      retainerCap,
    };
    
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);

    const seededSnapshots: HistoricalSnapshot[] = [
      ...historicalSnapshots,
      {
        clientId: newClient.id,
        weekStart: PREV_WEEKS[2],
        hoursWorked: 5.5,
        hoursInvoiced: 4.0,
        leakAmount: (5.5 - 4.0) * rate,
      },
      {
        clientId: newClient.id,
        weekStart: PREV_WEEKS[1],
        hoursWorked: 7.0,
        hoursInvoiced: 4.5,
        leakAmount: (7.0 - 4.5) * rate,
      },
      {
        clientId: newClient.id,
        weekStart: PREV_WEEKS[0],
        hoursWorked: 6.2,
        hoursInvoiced: 5.0,
        leakAmount: (6.2 - 5.0) * rate,
      },
    ];
    setHistoricalSnapshots(seededSnapshots);

    const seededInvoiced: InvoicedHours[] = [
      ...invoicedHours,
      { id: `inv-${Date.now()}-1`, clientId: newClient.id, weekStart: PREV_WEEKS[2], hours: 4.0 },
      { id: `inv-${Date.now()}-2`, clientId: newClient.id, weekStart: PREV_WEEKS[1], hours: 4.5 },
      { id: `inv-${Date.now()}-3`, clientId: newClient.id, weekStart: PREV_WEEKS[0], hours: 5.0 },
      { id: `inv-${Date.now()}-4`, clientId: newClient.id, weekStart: CURRENT_WEEK, hours: 0 },
    ];
    setInvoicedHours(seededInvoiced);

    // Auto-link any matching template events for this client name
    const autoLinkedEvents = events.map((evt) => {
      if (evt.suggestedClientId === newClient.id) {
        return { ...evt, clientId: newClient.id, billable: true, status: "confirmed" as const };
      }
      return evt;
    });
    setEvents(autoLinkedEvents);

    saveToStorage(onboarded, calendarConnected, updatedClients, autoLinkedEvents, seededInvoiced, seededSnapshots, aiChatMessages, recoveredThisMonth, userProfile, onboardingStep);
  };

  const updateClientRate = async (id: string, rate: number) => {
    const oldClients = [...clients];
    const oldSnapshots = [...historicalSnapshots];
    
    const updated = clients.map((c) => (c.id === id ? { ...c, rate } : c));
    setClients(updated);

    const updatedSnapshots = historicalSnapshots.map((snap) => {
      if (snap.clientId === id) {
        return { ...snap, leakAmount: (snap.hoursWorked - snap.hoursInvoiced) * rate };
      }
      return snap;
    });
    setHistoricalSnapshots(updatedSnapshots);

    setTimeout(() => {
      if (simulateErrors) {
        setClients(oldClients);
        setHistoricalSnapshots(oldSnapshots);
        setSyncErrorMessage("sync failed: server did not respond. rate update rolled back.");
        setTimeout(() => setSyncErrorMessage(null), 4000);
      } else {
        saveToStorage(onboarded, calendarConnected, updated, events, invoicedHours, updatedSnapshots, aiChatMessages, recoveredThisMonth, userProfile, onboardingStep);
      }
    }, 1200);
  };

  const toggleEventBillable = async (id: string) => {
    const oldEvents = [...events];
    const updated = events.map((evt) =>
      evt.id === id ? { ...evt, billable: !evt.billable, status: (!evt.billable ? "confirmed" : "ignored") as any } : evt
    );
    setEvents(updated);

    setTimeout(() => {
      if (simulateErrors) {
        setEvents(oldEvents);
        setSyncErrorMessage("sync failed: database write timed out. event tag rolled back.");
        setTimeout(() => setSyncErrorMessage(null), 4000);
      } else {
        saveToStorage(onboarded, calendarConnected, clients, updated, invoicedHours, historicalSnapshots, aiChatMessages, recoveredThisMonth, userProfile, onboardingStep);
      }
    }, 1200);
  };

  const linkEventToClient = async (id: string, clientId: string | null) => {
    const oldEvents = [...events];
    const updated = events.map((evt) =>
      evt.id === id ? { ...evt, clientId, billable: clientId !== null, status: (clientId ? "confirmed" : "detected") as any } : evt
    );
    setEvents(updated);

    setTimeout(() => {
      if (simulateErrors) {
        setEvents(oldEvents);
        setSyncErrorMessage("sync failed: network error. client tagging rolled back.");
        setTimeout(() => setSyncErrorMessage(null), 4000);
      } else {
        saveToStorage(onboarded, calendarConnected, clients, updated, invoicedHours, historicalSnapshots, aiChatMessages, recoveredThisMonth, userProfile, onboardingStep);
      }
    }, 1200);
  };

  const logInvoicedHours = async (clientId: string, weekStart: string, hours: number) => {
    const oldInvoiced = [...invoicedHours];
    const exists = invoicedHours.some((inv) => inv.clientId === clientId && inv.weekStart === weekStart);

    let updated: InvoicedHours[];
    if (exists) {
      updated = invoicedHours.map((inv) =>
        inv.clientId === clientId && inv.weekStart === weekStart ? { ...inv, hours } : inv
      );
    } else {
      updated = [...invoicedHours, { id: `inv-${Date.now()}`, clientId, weekStart, hours }];
    }
    setInvoicedHours(updated);

    setTimeout(() => {
      if (simulateErrors) {
        setInvoicedHours(oldInvoiced);
        setSyncErrorMessage("sync failed: connection reset. invoiced hours rolled back.");
        setTimeout(() => setSyncErrorMessage(null), 4000);
      } else {
        saveToStorage(onboarded, calendarConnected, clients, events, updated, historicalSnapshots, aiChatMessages, recoveredThisMonth, userProfile, onboardingStep);
      }
    }, 1200);
  };

  const setEventStatus = async (id: string, status: "detected" | "confirmed" | "ignored" | "recovered") => {
    const oldEvents = [...events];
    const updated = events.map((evt) =>
      evt.id === id ? { ...evt, status, billable: status === "confirmed" || status === "recovered" } : evt
    );
    setEvents(updated);

    // If marked recovered, add to recoveredThisMonth
    let newRecovered = recoveredThisMonth;
    if (status === "recovered") {
      const match = events.find((e) => e.id === id);
      if (match && match.clientId) {
        const client = clients.find((c) => c.id === match.clientId);
        if (client) {
          newRecovered += match.duration * client.rate;
          setRecoveredThisMonth(newRecovered);
        }
      }
    }

    setTimeout(() => {
      if (simulateErrors) {
        setEvents(oldEvents);
        setSyncErrorMessage("sync failed: status update failed.");
        setTimeout(() => setSyncErrorMessage(null), 4000);
      } else {
        saveToStorage(onboarded, calendarConnected, clients, updated, invoicedHours, historicalSnapshots, aiChatMessages, newRecovered, userProfile, onboardingStep);
      }
    }, 1200);
  };

  const markLeakAsRecovered = async (clientId: string, amount: number) => {
    const newRecovered = recoveredThisMonth + amount;
    setRecoveredThisMonth(newRecovered);

    // Update current week's invoiced hours automatically to match total worked hours to zero the leak
    const clientEvents = events.filter((evt) => evt.clientId === clientId && evt.billable);
    const duration = clientEvents.reduce((acc, curr) => acc + curr.duration, 0);

    const oldInvoiced = [...invoicedHours];
    const updated = invoicedHours.map((inv) =>
      inv.clientId === clientId && inv.weekStart === CURRENT_WEEK ? { ...inv, hours: duration } : inv
    );
    setInvoicedHours(updated);

    // Set matching events status to recovered
    const updatedEvents = events.map((evt) =>
      evt.clientId === clientId && evt.billable ? { ...evt, status: "recovered" as const } : evt
    );
    setEvents(updatedEvents);

    setTimeout(() => {
      if (simulateErrors) {
        setInvoicedHours(oldInvoiced);
        setSyncErrorMessage("sync failed to log recovery.");
        setTimeout(() => setSyncErrorMessage(null), 4000);
      } else {
        saveToStorage(onboarded, calendarConnected, clients, updatedEvents, updated, historicalSnapshots, aiChatMessages, newRecovered, userProfile, onboardingStep);
      }
    }, 1200);
  };

  // AI assistant conversational simulation
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: "user",
      text: text.toLowerCase(),
    };

    const newMessages = [...aiChatMessages, userMsg];
    setAiChatMessages(newMessages);

    setTimeout(() => {
      const promptLower = text.toLowerCase();
      let reply = "";

      if (promptLower.includes("client") || promptLower.includes("cost") || promptLower.includes("leak")) {
        let highestLeakClient = "";
        let maxLeak = 0;
        
        clients.forEach((c) => {
          const clientEvents = events.filter((evt) => evt.clientId === c.id && evt.billable);
          const hoursWorked = clientEvents.reduce((acc, curr) => acc + curr.duration, 0);
          const invoiceRecord = invoicedHours.find(
            (inv) => inv.clientId === c.id && inv.weekStart === CURRENT_WEEK
          );
          const hoursInvoiced = invoiceRecord ? invoiceRecord.hours : 0;
          const leak = Math.max(0, hoursWorked - hoursInvoiced) * c.rate;
          
          if (leak > maxLeak) {
            maxLeak = leak;
            highestLeakClient = c.name;
          }
        });

        if (maxLeak > 0) {
          reply = `client ${highestLeakClient} has been quiet but still costing you time. this client has generated $${maxLeak.toFixed(2)} in unbilled leaks this week. i recommend sending a scope notice to recover this.`;
        } else {
          reply = "i ran an active audit. you currently have no unbilled leaks. all client interactions match your logged invoicing.";
        }
      } else if (promptLower.includes("draft") || promptLower.includes("message") || promptLower.includes("notice")) {
        let leakingClient: Client | null = null;
        let leakVal = 0;
        let durationVal = 0;
        let invoicedVal = 0;

        for (const c of clients) {
          const clientEvents = events.filter((evt) => evt.clientId === c.id && evt.billable);
          const hoursWorked = clientEvents.reduce((acc, curr) => acc + curr.duration, 0);
          const invoiceRecord = invoicedHours.find(
            (inv) => inv.clientId === c.id && inv.weekStart === CURRENT_WEEK
          );
          const hoursInvoiced = invoiceRecord ? invoiceRecord.hours : 0;
          const leak = Math.max(0, hoursWorked - hoursInvoiced) * c.rate;
          if (leak > 0) {
            leakingClient = c;
            leakVal = leak;
            durationVal = hoursWorked;
            invoicedVal = hoursInvoiced;
            break;
          }
        }

        if (leakingClient) {
          reply = `here is a professional scope notice for ${leakingClient.name}:
          
"hi sarah, i noticed we've had a few additional meetings and revisions this week beyond the original billing. we spent ${durationVal.toFixed(1)}h worked vs ${invoicedVal.toFixed(1)}h logged on invoices. let's check if you'd like me to update the project estimate or adjust the next log. best, amani"

you can copy this draft directly to recover the $${leakVal.toFixed(2)} leak.`;
        } else {
          reply = "you don't have any client leaks right now. if you connect your calendar or log client work, i can draft a scope notice.";
        }
      } else {
        const totalLeakSum = clients.reduce((acc, c) => {
          const clientEvents = events.filter((evt) => evt.clientId === c.id && evt.billable);
          const hoursWorked = clientEvents.reduce((a, curr) => a + curr.duration, 0);
          const invoiceRecord = invoicedHours.find(
            (inv) => inv.clientId === c.id && inv.weekStart === CURRENT_WEEK
          );
          const hoursInvoiced = invoiceRecord ? invoiceRecord.hours : 0;
          return acc + Math.max(0, hoursWorked - hoursInvoiced) * c.rate;
        }, 0);

        if (totalLeakSum > 0) {
          reply = `seep detected $${totalLeakSum.toFixed(2)} of potentially unbilled work across your active clients. i recommend reviewing your leaks or drafting a scope notice for quick recovery.`;
        } else {
          reply = "i am monitoring your active channels. currently, all client communications align with your invoice estimates.";
        }
      }

      const seepMsg: ChatMessage = {
        id: `msg-${Date.now()}-s`,
        sender: "seep",
        text: reply,
      };

      const finalMessages = [...newMessages, seepMsg];
      setAiChatMessages(finalMessages);
      saveToStorage(onboarded, calendarConnected, clients, events, invoicedHours, historicalSnapshots, finalMessages, recoveredThisMonth, userProfile, onboardingStep);
    }, 850);
  };

  return (
    <SeepContext.Provider
      value={{
        onboarded,
        onboardingStep,
        calendarConnected,
        clients,
        events,
        invoicedHours,
        historicalSnapshots,
        recoveredThisMonth,
        isLoading,
        simulateErrors,
        syncErrorMessage,
        activeClientId,
        activeSection,
        searchQuery,
        aiChatMessages,
        userProfile,
        setOnboardingStep: handleSetOnboardingStep,
        updateUserProfile,
        setActiveClientId,
        setActiveSection,
        setSearchQuery,
        setSimulateErrors,
        connectCalendar,
        addClient,
        updateClientRate,
        toggleEventBillable,
        linkEventToClient,
        logInvoicedHours,
        sendChatMessage,
        setEventStatus,
        markLeakAsRecovered,
        resetApp,
        completeOnboarding,
      }}
    >
      {children}
    </SeepContext.Provider>
  );
}

export function useSeep() {
  const context = useContext(SeepContext);
  if (!context) throw new Error("useseep must be used within a seepprovider");
  return context;
}
