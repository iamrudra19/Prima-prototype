import React, { useState, useEffect } from 'react';
import { 
  SidebarView, 
  EnquiryItem, 
  ApprovalTrigger, 
  FollowUpItem 
} from '../types';
import { leadBankData, LeadItem } from '../data/leadBank';
import { 
  Inbox, 
  Cpu, 
  Radar, 
  Send, 
  BarChart3, 
  FileText, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Check, 
  Search, 
  Plus, 
  Sparkles, 
  RotateCw, 
  Clock, 
  Calendar, 
  Play, 
  Server, 
  Database,
  Sliders,
  Terminal,
  Activity,
  Workflow,
  X,
  Mail,
  Globe,
  MessageSquare,
  QrCode,
  Phone,
  ChevronRight,
  UserCheck,
  ExternalLink,
  ListTodo,
  User,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlaceholderViewProps {
  viewName: SidebarView;
  enquiries: EnquiryItem[];
  setEnquiries: React.Dispatch<React.SetStateAction<EnquiryItem[]>>;
  approvals: ApprovalTrigger[];
  setApprovals: React.Dispatch<React.SetStateAction<ApprovalTrigger[]>>;
  searchQuery: string;
}

export default function PlaceholderView({ 
  viewName, 
  enquiries, 
  setEnquiries,
  approvals,
  setApprovals,
  searchQuery
}: PlaceholderViewProps) {
  
  // Channel filter state
  const [activeChannel, setActiveChannel] = useState<'All' | 'Email' | 'IndiaMART' | 'Website Form' | 'WhatsApp' | 'Expo Scan' | 'Phone'>('All');
  const [assigningEnquiryId, setAssigningEnquiryId] = useState<string | null>(null);

  // States for interactive simulations
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [newEnquiryModal, setNewEnquiryModal] = useState(false);
  const [newEnquiryForm, setNewEnquiryForm] = useState({
    company: '',
    contactPerson: '',
    designation: '',
    location: '',
    product: 'CEMS (Continuous Emission Monitoring System)',
    details: ''
  });

  // --- REAL AI SPEC COLLECTOR STATE ---
  const [collectorRawEnquiry, setCollectorRawEnquiry] = useState<string>('');
  const [collectorChatMessages, setCollectorChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([]);
  const [isCollectorLoading, setIsCollectorLoading] = useState<boolean>(false);
  const [collectorError, setCollectorError] = useState<string | null>(null);
  const [collectorInput, setCollectorInput] = useState<string>('');
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(false);
  
  // The 8 specifications we extract
  const [collectorSpecs, setCollectorSpecs] = useState<{
    industryPlantType: string | null;
    complianceDriver: string | null;
    parametersToMonitor: string | null;
    monitoringPointsCount: string | null;
    stackDetails: string | null;
    newOrRetrofit: string | null;
    timeline: string | null;
    budgetStage: string | null;
    isResellerTrader: boolean;
    isEndCustomerClarified: boolean;
    emailDraft: string | null;
  }>({
    industryPlantType: null,
    complianceDriver: null,
    parametersToMonitor: null,
    monitoringPointsCount: null,
    stackDetails: null,
    newOrRetrofit: null,
    timeline: null,
    budgetStage: null,
    isResellerTrader: false,
    isEndCustomerClarified: false,
    emailDraft: null,
  });

  // For visual green flash animations
  const [flashFields, setFlashFields] = useState<string[]>([]);

  // --- PLANT APPROVAL RADAR STATE ---
  const [radarItems, setRadarItems] = useState([
    {
      id: "PAR-001",
      company: "Mewar Super Cement Ltd.",
      district: "Udaipur",
      state: "Rajasthan",
      industry: "Cement",
      approvalType: "Consent to Establish",
      approvalDate: "2026-07-28",
      projectSize: "2×3000 TPD kilns",
      whyItMatters: "New CtE — Particulate matter and Gaseous CEMS must be commissioned before trials.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-002",
      company: "Ankleshwar Bulk Drugs Phase II",
      district: "Bharuch",
      state: "Gujarat",
      industry: "Pharma",
      approvalType: "Consent to Establish",
      approvalDate: "2026-07-29",
      projectSize: "Active Pharmaceutical Ingredients (API) line",
      whyItMatters: "CtE Condition — VOC recovery and multi-point VOC sensor leak grid mandatory.",
      heat: "Medium" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-003",
      company: "Avadh Bio-fuels & Distillery",
      district: "Gorakhpur",
      state: "Uttar Pradesh",
      industry: "Distillery",
      approvalType: "Consent to Operate",
      approvalDate: "2026-07-29",
      projectSize: "200 KLD grain-based distillery",
      whyItMatters: "CtO Granted — Zero Liquid Discharge (ZLD) flow and COD/BOD monitor online.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-004",
      company: "Kalinga Ispat & Power Ltd.",
      district: "Jharsuguda",
      state: "Odisha",
      industry: "Steel",
      approvalType: "Environmental Clearance",
      approvalDate: "2026-07-30",
      projectSize: "3.2 MTPA blast furnace",
      whyItMatters: "EC Condition — Real-time stack emissions and ambient grid connection required.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-005",
      company: "Gujarat Fluorochemicals Ltd.",
      district: "Dahej",
      state: "Gujarat",
      industry: "Chemicals",
      approvalType: "Consent to Operate",
      approvalDate: "2026-07-30",
      projectSize: "150 TPD chemical expansion",
      whyItMatters: "CtO Renewal — SPCB mandate for HF/HCl gaseous analyzer integration.",
      heat: "Medium" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-006",
      company: "JSW Energy Thermal Expansion",
      district: "Ratnagiri",
      state: "Maharashtra",
      industry: "Power",
      approvalType: "Environmental Clearance",
      approvalDate: "2026-07-25",
      projectSize: "2×300 MW thermal units",
      whyItMatters: "Greenfield EC — Continuous opacity & gaseous flue stack monitoring mandatory.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-007",
      company: "Solapur Waste-to-Energy Hub",
      district: "Solapur",
      state: "Maharashtra",
      industry: "Waste-to-Energy",
      approvalType: "CPCB Direction",
      approvalDate: "2026-07-24",
      projectSize: "15 MW waste combustor",
      whyItMatters: "CPCB 18(1)(b) — Urgent mandate for continuous dioxin & heavy metal feedback.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-008",
      company: "UltraTech Cement Grinding",
      district: "Jharsuguda",
      state: "Odisha",
      industry: "Cement",
      approvalType: "Consent to Establish",
      approvalDate: "2026-07-29",
      projectSize: "1.5 MTPA grinding unit",
      whyItMatters: "New grinding facility requires high-efficiency baghouse PM monitors.",
      heat: "Medium" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-009",
      company: "NTPC Super Critical Block",
      district: "Singrauli",
      state: "Uttar Pradesh",
      industry: "Power",
      approvalType: "Consent to Operate",
      approvalDate: "2026-07-30",
      projectSize: "500 MW thermal super critical",
      whyItMatters: "CtO expansion — FGD installation & online SO2 compliance required instantly.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-010",
      company: "Aurobindo Life Intermediates",
      district: "Vizag",
      state: "Andhra Pradesh",
      industry: "Pharma",
      approvalType: "Consent to Establish",
      approvalDate: "2026-07-28",
      projectSize: "Bulk drug intermediates block",
      whyItMatters: "Local pollution board condition — Solvents area requires 8-channel Cl2/NH3 detection.",
      heat: "Medium" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-011",
      company: "Dahej Organics Ltd.",
      district: "Bharuch",
      state: "Gujarat",
      industry: "Chemicals",
      approvalType: "Consent to Operate",
      approvalDate: "2026-07-29",
      projectSize: "Chlor-Alkali electrolysis cell",
      whyItMatters: "CtO mandate — Continuous online chlorine gas analyzer for bottling plant.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-012",
      company: "Radico Khaitan Distillery",
      district: "Rampur",
      state: "Uttar Pradesh",
      industry: "Distillery",
      approvalType: "Environmental Clearance",
      approvalDate: "2026-07-26",
      projectSize: "300 KLD ethanol expansion",
      whyItMatters: "EC Condition — Stack CO2 tracking and effluent discharge pH telemetry.",
      heat: "Watch" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-013",
      company: "Pune Municipal Waste Power",
      district: "Pune",
      state: "Maharashtra",
      industry: "Waste-to-Energy",
      approvalType: "Consent to Establish",
      approvalDate: "2026-07-25",
      projectSize: "500 TPD municipal incinerator",
      whyItMatters: "CtE Condition — Continuous stack flue gas analyzer for HCl/HF parameters.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-014",
      company: "Ambuja Cements Storage Silos",
      district: "Pali",
      state: "Rajasthan",
      industry: "Cement",
      approvalType: "CPCB Direction",
      approvalDate: "2026-07-27",
      projectSize: "Captive clinker storage silos",
      whyItMatters: "CPCB Direction — Ambient PM10/PM2.5 dust telemetry grid required immediately.",
      heat: "High" as const,
      isLeadCreated: false
    },
    {
      id: "PAR-015",
      company: "Jindal Steel Pellet Plant",
      district: "Barbil",
      state: "Odisha",
      industry: "Steel",
      approvalType: "Consent to Operate",
      approvalDate: "2026-07-28",
      projectSize: "Pellet plant burner system",
      whyItMatters: "CtO condition — High temp NOx/SO2 continuous flue tracking mandatory.",
      heat: "Medium" as const,
      isLeadCreated: false
    }
  ]);

  const [filterState, setFilterState] = useState<string>('All');
  const [filterIndustry, setFilterIndustry] = useState<string>('All');
  const [filterApprovalType, setFilterApprovalType] = useState<string>('All');
  const [filterDateRange, setFilterDateRange] = useState<string>('All');

  const [radarToast, setRadarToast] = useState<{ show: boolean; message: string } | null>(null);

  // --- MEETINGS & ANALYTICS INTERACTIVE STATES ---
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [activeMissingSpec, setActiveMissingSpec] = useState<string | null>(null);

  // --- LEAD FINDER NEW STATES ---
  const [leadFinderActiveTab, setLeadFinderActiveTab] = useState<'Find Leads' | 'Approval Radar'>('Find Leads');
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedProductFits, setSelectedProductFits] = useState<string[]>([]);
  const [selectedBuyingSignals, setSelectedBuyingSignals] = useState<string[]>([]);
  const [selectedDecisionMakers, setSelectedDecisionMakers] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
  const [isFindingLeadsLoading, setIsFindingLeadsLoading] = useState(false);
  const [leadFindingStep, setLeadFindingStep] = useState(0);
  const [showLeadResults, setShowLeadResults] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [selectedLeadBrief, setSelectedLeadBrief] = useState<LeadItem | null>(null);
  const [leadFinderToast, setLeadFinderToast] = useState<{ show: boolean; message: string } | null>(null);
  const [displayedLeadCount, setDisplayedLeadCount] = useState(0);

  // Filter matched leads based on current selections
  const getFilteredLeadsList = () => {
    return leadBankData.filter(lead => {
      if (selectedGeographies.length > 0 && !selectedGeographies.includes(lead.state)) {
        return false;
      }
      if (selectedIndustries.length > 0 && !selectedIndustries.includes(lead.industry)) {
        return false;
      }
      if (selectedProductFits.length > 0 && !selectedProductFits.includes(lead.productFit)) {
        return false;
      }
      if (selectedBuyingSignals.length > 0 && !selectedBuyingSignals.includes(lead.buyingSignal)) {
        return false;
      }
      if (selectedDecisionMakers.length > 0 && !selectedDecisionMakers.includes(lead.decisionMaker)) {
        return false;
      }
      return true;
    });
  };

  useEffect(() => {
    if (!showLeadResults) {
      setDisplayedLeadCount(0);
      return;
    }
    const filteredLeads = getFilteredLeadsList();
    const target = filteredLeads.length;
    if (target === 0) {
      setDisplayedLeadCount(0);
      return;
    }
    let start = 0;
    const duration = 500; // ms
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayedLeadCount(target);
        clearInterval(timer);
      } else {
        setDisplayedLeadCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [showLeadResults, selectedGeographies, selectedIndustries, selectedProductFits, selectedBuyingSignals, selectedDecisionMakers]);

  useEffect(() => {
    setShowLeadResults(false);
  }, [selectedGeographies, selectedIndustries, selectedProductFits, selectedBuyingSignals, selectedDecisionMakers]);

  // --- OUTREACH & NURTURE STATE ---
  interface NurtureLead {
    id: string;
    company: string;
    contactPerson: string;
    designation: string;
    location: string;
    status: 'Active in Sequence' | 'Replied — Needs Human' | 'Meeting Booked' | 'Paused';
    source: 'Enquiry Inbox' | 'Plant Approval Radar';
    triggerContext?: string;
    currentStepIndex: number;
    email1Draft: string;
    isFlashed: boolean;
    phone: string;
  }

  const [nurtureLeads, setNurtureLeads] = useState<NurtureLead[]>([
    {
      id: "NUR-101",
      company: "Mewar Super Cement Ltd.",
      contactPerson: "Mr. R.K. Sharma",
      designation: "EHS Director",
      location: "Udaipur, Rajasthan",
      status: "Active in Sequence",
      source: "Plant Approval Radar",
      triggerContext: "Consent to Establish granted for 2×3000 TPD kilns. CEMS commissioning needed.",
      currentStepIndex: 0,
      email1Draft: "",
      isFlashed: false,
      phone: "+91 98290 12345"
    },
    {
      id: "NUR-102",
      company: "Ankleshwar Bulk Drugs Phase II",
      contactPerson: "Dr. Anil Patel",
      designation: "Plant Head",
      location: "Bharuch, Gujarat",
      status: "Active in Sequence",
      source: "Plant Approval Radar",
      triggerContext: "Consent to Establish granted. VOC recovery grid mandatory.",
      currentStepIndex: 1,
      email1Draft: "",
      isFlashed: false,
      phone: "+91 99044 67890"
    },
    {
      id: "NUR-103",
      company: "Avadh Bio-fuels & Distillery",
      contactPerson: "Vipin Mishra",
      designation: "Compliance Officer",
      location: "Gorakhpur, Uttar Pradesh",
      status: "Replied — Needs Human",
      source: "Plant Approval Radar",
      triggerContext: "Consent to Operate granted. Zero Liquid Discharge (ZLD) flow monitor required.",
      currentStepIndex: 2,
      email1Draft: "",
      isFlashed: false,
      phone: "+91 94150 11223"
    },
    {
      id: "NUR-104",
      company: "Sanghi Cement Plant",
      contactPerson: "Karan Singh",
      designation: "EHS Engineer",
      location: "Kutch, Gujarat",
      status: "Active in Sequence",
      source: "Enquiry Inbox",
      currentStepIndex: 2,
      email1Draft: "",
      isFlashed: false,
      phone: "+91 97243 44556"
    },
    {
      id: "NUR-105",
      company: "Kalinga Ispat & Power",
      contactPerson: "Manas Das",
      designation: "Technical Manager",
      location: "Jharsuguda, Odisha",
      status: "Meeting Booked",
      source: "Enquiry Inbox",
      currentStepIndex: 4,
      email1Draft: "",
      isFlashed: false,
      phone: "+91 88950 22334"
    },
    {
      id: "NUR-106",
      company: "Deccan Chemical Works",
      contactPerson: "N. Venkat",
      designation: "General Manager",
      location: "Vizag, Andhra Pradesh",
      status: "Paused",
      source: "Enquiry Inbox",
      currentStepIndex: 1,
      email1Draft: "",
      isFlashed: false,
      phone: "+91 89125 55667"
    },
    {
      id: "NUR-107",
      company: "Som Distilleries",
      contactPerson: "Rajesh Tomar",
      designation: "EHS Lead",
      location: "Bhopal, Madhya Pradesh",
      status: "Active in Sequence",
      source: "Enquiry Inbox",
      currentStepIndex: 0,
      email1Draft: "",
      isFlashed: false,
      phone: "+91 94250 88990"
    },
    {
      id: "NUR-108",
      company: "Ultratech Cement Grinding",
      contactPerson: "S. K. Jena",
      designation: "Operations Head",
      location: "Jharsuguda, Odisha",
      status: "Paused",
      source: "Plant Approval Radar",
      triggerContext: "Consent to Establish. PM dust monitors needed.",
      currentStepIndex: 3,
      email1Draft: "",
      isFlashed: false,
      phone: "+91 70081 23456"
    }
  ]);

  const [selectedLeadId, setSelectedLeadId] = useState<string>("NUR-101");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [simulationText, setSimulationText] = useState("");
  const [routingRole, setRoutingRole] = useState("Salesperson (Rutvij)");
  const [replyAlert, setReplyAlert] = useState<{
    leadId: string;
    company: string;
    replyText: string;
    timestamp: string;
  } | null>(null);

  // Live Gemini generation of email 1
  const generateAIDraft = async (lead: NurtureLead) => {
    setIsGeneratingEmail(true);
    try {
      const response = await fetch('/api/generate-outreach-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company: lead.company,
          contactPerson: lead.contactPerson,
          designation: lead.designation,
          location: lead.location,
          triggerContext: lead.triggerContext || "Interested in state-of-the-art CEMS compliant analyzers"
        })
      });

      const data = await response.json();
      if (data.draft) {
        setNurtureLeads(prev => prev.map(l => {
          if (l.id === lead.id) {
            return { ...l, email1Draft: data.draft };
          }
          return l;
        }));
      } else if (data.error) {
        console.error("AI Draft Error:", data.error);
        alert("Failed to generate draft: " + data.error);
      }
    } catch (err: any) {
      console.error("Error calling live AI draft generator:", err);
      alert("Error generating AI draft: " + err.message);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  // Simulate reply trigger
  const handleSimulateReply = (leadId: string, text: string) => {
    if (!text.trim()) return;

    // Flash the card
    setNurtureLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, isFlashed: true };
      }
      return l;
    }));

    setTimeout(() => {
      setNurtureLeads(prev => prev.map(l => {
        if (l.id === leadId) {
          return { ...l, isFlashed: false };
        }
        return l;
      }));
    }, 2000);

    // Update status to Replied
    setNurtureLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status: 'Replied — Needs Human' };
      }
      return l;
    }));

    const targetLead = nurtureLeads.find(l => l.id === leadId);
    setReplyAlert({
      leadId,
      company: targetLead ? targetLead.company : "Plant facility",
      replyText: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setSimulationText("");
  };

  const handleCreateLead = (itemId: string, company: string, approvalType: string) => {
    // 1. Update local radarItems state
    setRadarItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, isLeadCreated: true };
      }
      return item;
    }));

    // 2. Add to global approvals state if it exists or matches
    const existingGlobal = approvals.find(a => a.plantName === company);
    if (existingGlobal) {
      setApprovals(prev => prev.map(a => {
        if (a.plantName === company) {
          return { ...a, status: 'converted' };
        }
        return a;
      }));
    } else {
      // Create new global approval trigger if needed
      const newGlobalApproval: ApprovalTrigger = {
        id: `AP-${Math.floor(950 + Math.random() * 50)}`,
        plantName: company,
        state: filterState === 'All' ? 'Gujarat' : filterState,
        industry: filterIndustry === 'All' ? 'Cement' : filterIndustry,
        approvalType: approvalType as any,
        dateTriggered: '2026-07-30',
        status: 'converted'
      };
      setApprovals(prev => [newGlobalApproval, ...prev]);
    }

    // 3. Show a toast
    setRadarToast({
      show: true,
      message: `${company}`
    });

    // 4. Clear toast after 3.5 seconds
    setTimeout(() => {
      setRadarToast(null);
    }, 3500);
  };

  const handleCreateEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCompanySlug = newEnquiryForm.company.toLowerCase().replace(/[^a-z0-9]/g, "");
    const newEnq: EnquiryItem = {
      id: `ENQ-${Math.floor(300 + Math.random() * 600)}`,
      company: newEnquiryForm.company,
      contactPerson: newEnquiryForm.contactPerson,
      designation: newEnquiryForm.designation,
      location: newEnquiryForm.location,
      product: newEnquiryForm.product,
      status: 'New',
      dateReceived: new Date().toISOString().split('T')[0],
      details: newEnquiryForm.details,
      
      // Default rich properties for manual entries
      channel: 'Website Form',
      productInterestTag: 'CEMS',
      leadScore: 65,
      specCompletenessCount: 3,
      totalSpecsCount: 7,
      timeAgo: 'Just now',
      email: `contact@${cleanCompanySlug || 'industrial'}.in`,
      phone: '+91 98110 54321',
      providedSpecsList: ["Company name & location verified", "Product scope listed", "Raw message parsed"],
      missingSpecsList: ["Stack height metric", "Flue temperature profile", "Internal diameter", "OSPCB/CPCB protocol requirements"],
      suggestedOwner: 'Ramesh Patel',
      timeline: [
        { time: 'Just now', event: 'Manual entry logged by Sales Administrator', type: 'user' }
      ]
    };
    setEnquiries(prev => [newEnq, ...prev]);
    setNewEnquiryForm({
      company: '',
      contactPerson: '',
      designation: '',
      location: '',
      product: 'CEMS (Continuous Emission Monitoring System)',
      details: ''
    });
    setNewEnquiryModal(false);
  };

  // Real live Gemini action & high-fidelity rule-based simulation fallback
  const sendToCollectorBackend = async (
    raw: string,
    history: Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>,
    newAnswer?: string
  ) => {
    setIsCollectorLoading(true);
    setCollectorError(null);

    // Prepare message history
    const updatedHistory = [...history];
    if (newAnswer) {
      updatedHistory.push({
        sender: 'user',
        text: newAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setCollectorChatMessages(updatedHistory);
    }

    try {
      const response = await fetch('/api/spec-collector', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rawEnquiry: raw,
          messages: updatedHistory.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      setIsSimulationActive(false);

      // Find which fields got filled to trigger flash animation
      const newlyFilled: string[] = [];
      const keys: Array<keyof typeof collectorSpecs> = [
        'industryPlantType',
        'complianceDriver',
        'parametersToMonitor',
        'monitoringPointsCount',
        'stackDetails',
        'newOrRetrofit',
        'timeline',
        'budgetStage'
      ];

      keys.forEach(k => {
        if (!collectorSpecs[k] && data[k]) {
          newlyFilled.push(k as string);
        }
      });

      if (newlyFilled.length > 0) {
        setFlashFields(newlyFilled);
        setTimeout(() => {
          setFlashFields([]);
        }, 2500);
      }

      // Update specs
      setCollectorSpecs({
        industryPlantType: data.industryPlantType,
        complianceDriver: data.complianceDriver,
        parametersToMonitor: data.parametersToMonitor,
        monitoringPointsCount: data.monitoringPointsCount,
        stackDetails: data.stackDetails,
        newOrRetrofit: data.newOrRetrofit,
        timeline: data.timeline,
        budgetStage: data.budgetStage,
        isResellerTrader: !!data.isResellerTrader,
        isEndCustomerClarified: !!data.isEndCustomerClarified,
        emailDraft: data.emailDraft
      });

      // Append AI's next response/question to the message stream
      setCollectorChatMessages(prev => [
        ...updatedHistory,
        {
          sender: 'ai',
          text: data.nextQuestion || "Thank you for the information. Let's proceed.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

    } catch (err: any) {
      console.warn("API Error, falling back to local simulation:", err.message);
      setIsSimulationActive(true);
      runLocalSimulation(newAnswer || raw, updatedHistory);
    } finally {
      setIsCollectorLoading(false);
    }
  };

  const runLocalSimulation = (userInput: string, updatedHistory: Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>) => {
    const text = userInput.toLowerCase();
    const nextSpecs = { ...collectorSpecs };
    const updatedFlash: string[] = [];

    // Helper to update and mark flash
    const updateField = (key: keyof typeof collectorSpecs, val: any) => {
      if (!collectorSpecs[key] && val) {
        (nextSpecs as any)[key] = val;
        updatedFlash.push(key as string);
      }
    };

    // Heuristics extraction
    if (text.includes("cement")) updateField("industryPlantType", "Cement Plant");
    else if (text.includes("pharma") || text.includes("pharmaceutical")) updateField("industryPlantType", "Pharmaceutical Facility");
    else if (text.includes("chemical")) updateField("industryPlantType", "Chemical Plant");
    else if (text.includes("boiler")) updateField("industryPlantType", "Industrial Boiler Facility");

    if (text.includes("cpcb") || text.includes("ocems")) updateField("complianceDriver", "CPCB OCEMS mandate");
    else if (text.includes("spcb") || text.includes("cto") || text.includes("consent to operate")) updateField("complianceDriver", "SPCB consent condition");
    else if (text.includes("cte") || text.includes("consent to establish")) updateField("complianceDriver", "SPCB consent condition");
    else if (text.includes("moefcc") || text.includes("ec condition") || text.includes("environmental clearance")) updateField("complianceDriver", "MoEFCC EC condition");
    else if (text.includes("internal") || text.includes("self-monitoring")) updateField("complianceDriver", "internal");

    // Parameters
    const paramsFound: string[] = [];
    if (text.includes("so2")) paramsFound.push("SO2");
    if (text.includes("nox")) paramsFound.push("NOx");
    if (text.includes("pm") || text.includes("dust") || text.includes("pm10") || text.includes("pm2.5")) paramsFound.push("PM");
    if (text.includes("co")) paramsFound.push("CO");
    if (text.includes("o2")) paramsFound.push("O2");
    if (text.includes("flow")) paramsFound.push("Flow");
    if (text.includes("cl2")) paramsFound.push("Cl2");
    if (text.includes("h2s")) paramsFound.push("H2S");
    if (text.includes("nh3")) paramsFound.push("NH3");
    if (paramsFound.length > 0) {
      updateField("parametersToMonitor", paramsFound.join(", "));
    }

    // Monitoring points
    if (text.includes("1 stack") || text.includes("one stack") || text.includes("single stack") || text.includes("total 1")) updateField("monitoringPointsCount", "1 Stack");
    else if (text.includes("2 stack") || text.includes("two stack") || text.includes("2 boiler")) updateField("monitoringPointsCount", "2 Stacks");
    else if (text.includes("3 stack") || text.includes("three stack") || text.includes("3 boiler")) updateField("monitoringPointsCount", "3 Stacks");
    else {
      const match = userInput.match(/(\d+)\s*(stack|boiler|point|discharge)/i);
      if (match) {
        updateField("monitoringPointsCount", `${match[1]} ${match[2]}${parseInt(match[1]) > 1 ? 's' : ''}`);
      }
    }

    // Stack details
    const heightMatch = userInput.match(/(\d+)\s*(meter|m|mtr)/i);
    const tempMatch = userInput.match(/(\d+)\s*(°c|celsius|degree)/i);
    const dustMatch = userInput.match(/(\d+)\s*(mg)/i);
    let detailParts = [];
    if (heightMatch) detailParts.push(`Height: ${heightMatch[1]}m`);
    if (tempMatch) detailParts.push(`Temp: ${tempMatch[1]}°C`);
    if (dustMatch) detailParts.push(`Dust: ${dustMatch[1]} mg/Nm³`);
    if (detailParts.length > 0) {
      updateField("stackDetails", detailParts.join(", "));
    }

    // New or retrofit
    if (text.includes("retrofit") || text.includes("replacement") || text.includes("replace") || text.includes("existing")) {
      updateField("newOrRetrofit", "Retrofit/replacement");
    } else if (text.includes("new") || text.includes("greenfield") || text.includes("expansion") || text.includes("upcoming")) {
      updateField("newOrRetrofit", "New installation");
    }

    // Timeline
    if (text.includes("immediate") || text.includes("now") || text.includes("asap") || text.includes("urgent")) {
      updateField("timeline", "Immediate");
    } else if (text.includes("3 month") || text.includes("three month") || text.includes("90 days")) {
      updateField("timeline", "Within 3 months");
    } else if (text.includes("budgetary") || text.includes("budget") || text.includes("pricing only")) {
      updateField("timeline", "Budgetary stage only");
    }

    // Budget
    if (text.includes("approved") || text.includes("sanctioned") || text.includes("funded")) {
      updateField("budgetStage", "Approved budget");
    } else if (text.includes("estimation") || text.includes("budgetary quote") || text.includes("rough") || text.includes("pricing") || text.includes("quotation") || text.includes("cost")) {
      updateField("budgetStage", "Budgetary pricing needed");
    }

    // Reseller check
    if (text.includes("consultant") || text.includes("reseller") || text.includes("trader") || text.includes("dealer") || text.includes("agent") || text.includes("contractor") || text.includes("procurement")) {
      nextSpecs.isResellerTrader = true;
    }
    if (nextSpecs.isResellerTrader) {
      if (text.includes("end customer") || text.includes("client is") || text.includes("plant is") || text.includes("facility is") || text.includes("located in") || text.includes("name of")) {
        nextSpecs.isEndCustomerClarified = true;
      }
    }

    // Next question logic based on missing fields
    let nextQ = "";
    const isHindi = text.includes("humare") || text.includes("chahiye") || text.includes("hume") || text.includes("hai") || text.includes("ko") || text.includes("aap") || text.includes("hum");

    if (nextSpecs.isResellerTrader && !nextSpecs.isEndCustomerClarified) {
      nextQ = isHindi 
        ? "कृप्या क्या आप अंत ग्राहक (End Customer) और प्लांट के स्थान का नाम स्पष्ट कर सकते हैं?"
        : "As you mentioned representing a client, could you please specify the name and location of the end customer/facility where the systems will be installed?";
    } else if (!nextSpecs.industryPlantType) {
      nextQ = isHindi
        ? "कृप्या अपने उद्योग का प्रकार बताएं (जैसे कि सीमेंट, केमिकल, शुगर, या थर्मल पावर)?"
        : "Could you please specify the industry and plant type (e.g., Cement Plant, Chemical Plant) for this monitoring setup?";
    } else if (!nextSpecs.monitoringPointsCount) {
      nextQ = isHindi
        ? "इस प्लांट में कुल कितनी चिमनियों (Stacks) या मॉनिटरिंग पॉइंट की संख्या है?"
        : "How many stacks or monitoring points require monitoring at this facility?";
    } else if (!nextSpecs.parametersToMonitor) {
      nextQ = isHindi
        ? "आपको किन गैसों या पैरामीटरों की निगरानी करनी है? (जैसे कि SO2, NOx, PM, CO, O2)?"
        : "What specific pollutants or parameters do you need to monitor? (e.g., SO2, NOx, PM, CO, O2, flow)?";
    } else if (!nextSpecs.stackDetails) {
      nextQ = isHindi
        ? "क्या चिमनी (Stack) का विवरण जैसे कि ऊंचाई (height), तापमान (temperature) या डस्ट लोड (dust load) ज्ञात है?"
        : "Could you please share some stack physical details, such as stack height, flue gas temperature, or typical dust load?";
    } else if (!nextSpecs.newOrRetrofit) {
      nextQ = isHindi
        ? "क्या यह एक नया प्लांट इंस्टॉलेशन है या मौजूदा पुराने सिस्टम का रेट्रोफिट/रिप्लेसमेंट है?"
        : "Is this a new greenfield installation or a retrofit/replacement of an existing monitoring system?";
    } else if (!nextSpecs.timeline) {
      nextQ = isHindi
        ? "इस परियोजना को लागू करने की अपेक्षित समय-सीमा (Timeline) क्या है?"
        : "What is your target implementation timeline for this project? (e.g., immediate, 3 months, 6 months)?";
    } else if (!nextSpecs.budgetStage) {
      nextQ = isHindi
        ? "यह बजट के किस चरण में है? क्या आपके पास स्वीकृत बजट है या अभी केवल बजट अनुमान (Budgetary Pricing) की आवश्यकता है?"
        : "What is the current budget stage? Do you have an approved budget or is this for initial budgetary/commercial estimation?";
    } else {
      nextQ = isHindi
        ? "बहुत-बहुत धन्यवाद! आपके सभी विवरण एकत्र कर लिए गए हैं। आपकी विस्तृत पूछताछ ब्रीफ तैयार है।"
        : "Thank you so much! All 8 key specification fields have been successfully collected. The Technical Enquiry Brief is now ready.";

      const specsSummary = `
- **Industry & Plant Type**: ${nextSpecs.industryPlantType}
- **Compliance Driver**: ${nextSpecs.complianceDriver || 'CPCB OCEMS mandate'}
- **Parameters to Monitor**: ${nextSpecs.parametersToMonitor}
- **Monitoring Points**: ${nextSpecs.monitoringPointsCount}
- **Stack Details**: ${nextSpecs.stackDetails}
- **Project Type**: ${nextSpecs.newOrRetrofit}
- **Timeline**: ${nextSpecs.timeline}
- **Budget Stage**: ${nextSpecs.budgetStage}
      `.trim();

      nextSpecs.emailDraft = `Subject: Quotation & Technical Proposal Enquiry - continuous monitoring systems

Dear Team,

Thank you for contacting Prima Equipment. We have successfully compiled your Technical Enquiry Brief based on our conversation.

Here is a summary of the technical specifications captured for your facility:
${specsSummary}

Our sales and engineering team is reviewing these details and will prepare a customized technical-commercial proposal for your project. If we require any further physical dimensions, our regional engineer will contact you shortly.

Best regards,
Prima Technical Support Team
Prima Equipment (CEMS, CAAQMS & Analyzer Division)
`;
    }

    if (updatedFlash.length > 0) {
      setFlashFields(updatedFlash);
      setTimeout(() => setFlashFields([]), 2500);
    }

    setCollectorSpecs(nextSpecs);
    setCollectorChatMessages(prev => [
      ...updatedHistory,
      {
        sender: 'ai',
        text: nextQ,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleInitializeCollector = (text: string) => {
    setCollectorRawEnquiry(text);
    setCollectorInput('');
    const initialHist: Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }> = [
      {
        sender: 'user',
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setCollectorChatMessages(initialHist);
    setCollectorSpecs({
      industryPlantType: null,
      complianceDriver: null,
      parametersToMonitor: null,
      monitoringPointsCount: null,
      stackDetails: null,
      newOrRetrofit: null,
      timeline: null,
      budgetStage: null,
      isResellerTrader: false,
      isEndCustomerClarified: false,
      emailDraft: null
    });
    setFlashFields([]);
    sendToCollectorBackend(text, initialHist);
  };

  const handleSendMessage = () => {
    if (!collectorInput.trim() || isCollectorLoading) return;
    const userAnswer = collectorInput.trim();
    setCollectorInput('');
    sendToCollectorBackend(collectorRawEnquiry, collectorChatMessages, userAnswer);
  };

  // Helper functions for Enquiry Inbox UI
  const getChannelCount = (chan: string) => {
    if (chan === 'All') return enquiries.length;
    return enquiries.filter(e => e.channel === chan).length;
  };

  const getChannelIcon = (chan: string) => {
    switch (chan) {
      case 'Email': return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'IndiaMART': return <Globe className="w-4 h-4 text-emerald-500" />;
      case 'Website Form': return <FileText className="w-4 h-4 text-amber-500" />;
      case 'WhatsApp': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'Expo Scan': return <QrCode className="w-4 h-4 text-purple-500" />;
      case 'Phone': return <Phone className="w-4 h-4 text-sky-500" />;
      default: return <Inbox className="w-4 h-4 text-slate-500" />;
    }
  };

  const getChannelDetails = (chan: string) => {
    switch (chan) {
      case 'Email': return { bg: 'bg-indigo-50/50 border-indigo-100', icon: Mail };
      case 'IndiaMART': return { bg: 'bg-emerald-50/50 border-emerald-100', icon: Globe };
      case 'Website Form': return { bg: 'bg-amber-50/50 border-amber-100', icon: FileText };
      case 'WhatsApp': return { bg: 'bg-green-50/50 border-green-100', icon: MessageSquare };
      case 'Expo Scan': return { bg: 'bg-purple-50/50 border-purple-100', icon: QrCode };
      case 'Phone': return { bg: 'bg-sky-50/50 border-sky-100', icon: Phone };
      default: return { bg: 'bg-slate-50/50 border-slate-100', icon: Inbox };
    }
  };

  const renderRadialGauge = (score: number) => {
    const radius = 11;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    let strokeClass = "stroke-slate-400";
    let bgClass = "bg-slate-50 text-slate-700 border-slate-200/50";
    if (score > 70) {
      strokeClass = "stroke-emerald-600";
      bgClass = "bg-emerald-50/60 text-emerald-800 border-emerald-100/60";
    } else if (score >= 40) {
      strokeClass = "stroke-amber-500";
      bgClass = "bg-amber-50/60 text-amber-800 border-amber-100/60";
    }

    return (
      <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${bgClass}`}>
        <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
          <svg className="absolute w-7 h-7 -rotate-90">
            <circle cx="14" cy="14" r={radius} className="stroke-slate-200 fill-none" strokeWidth="2" />
            <circle 
              cx="14" 
              cy="14" 
              r={radius} 
              className={`fill-none transition-all duration-500 ${strokeClass}`} 
              strokeWidth="2" 
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[9px] font-mono font-bold leading-none">{score}</span>
        </div>
        <div className="leading-none text-left shrink-0">
          <div className="text-[7px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-0.5">LEAD SCORE</div>
          <span className="text-[10px] font-bold">
            {score > 70 ? 'Hot Lead' : score >= 40 ? 'Warm Lead' : 'Cold Lead'}
          </span>
        </div>
      </div>
    );
  };

  const renderSpecCompleteness = (completed: number, total: number) => {
    const pct = Math.min(100, Math.max(0, (completed / total) * 100));
    let colorClass = "bg-slate-400";
    if (pct > 70) colorClass = "bg-emerald-500";
    else if (pct >= 40) colorClass = "bg-amber-500";

    return (
      <div className="w-[110px] text-left shrink-0">
        <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400 mb-1">
          <span>SPECS MET</span>
          <span className="text-slate-600">{completed}/{total}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-black/5">
          <div 
            className={`h-full ${colorClass} rounded-full transition-all duration-300`} 
            style={{ width: `${pct}%` }} 
          />
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: EnquiryItem['status']) => {
    switch (status) {
      case 'New':
        return { text: 'New', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'AI Collecting Specs':
        return { text: 'AI Collecting Specs', classes: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'Brief Ready':
        return { text: 'Brief Ready', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'Human Review':
        return { text: 'Human Review', classes: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'Routed':
        return { text: 'Routed', classes: 'bg-slate-50 text-slate-700 border-slate-200' };
      default:
        return { text: status, classes: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const handleSendToSpecCollector = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEnquiries(prev => prev.map(enq => {
      if (enq.id === id) {
        const t = enq.timeline || [];
        return {
          ...enq,
          status: 'AI Collecting Specs',
          timeline: [
            { time: 'Just now', event: 'Sent to Spec Collector for autonomous follow-up', type: 'ai' },
            ...t
          ]
        };
      }
      return enq;
    }));
  };

  const handleAssignOwner = (id: string, ownerName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEnquiries(prev => prev.map(enq => {
      if (enq.id === id) {
        const t = enq.timeline || [];
        return {
          ...enq,
          suggestedOwner: ownerName,
          timeline: [
            { time: 'Just now', event: `Assigned sales representative to ${ownerName}`, type: 'user' },
            ...t
          ]
        };
      }
      return enq;
    }));
    setAssigningEnquiryId(null);
  };

  // Filter inquiries with global query
  const query = searchQuery.toLowerCase();
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesChannel = activeChannel === 'All' || enq.channel === activeChannel;
    const matchesQuery = !query ||
      enq.company.toLowerCase().includes(query) ||
      (enq.contactPerson && enq.contactPerson.toLowerCase().includes(query)) ||
      (enq.location && enq.location.toLowerCase().includes(query)) ||
      (enq.product && enq.product.toLowerCase().includes(query)) ||
      (enq.productInterestTag && enq.productInterestTag.toLowerCase().includes(query)) ||
      (enq.details && enq.details.toLowerCase().includes(query));

    return matchesChannel && matchesQuery;
  });

  const drawerEnquiry = selectedEnquiry 
    ? enquiries.find(e => e.id === selectedEnquiry.id) || selectedEnquiry 
    : null;

  return (
    <div className="space-y-6">      {/* 1. ENQUIRY INBOX VIEW */}
      {viewName === 'Enquiry Inbox' && (
        <div id="enquiry-inbox-section" className="space-y-6">
          
          {/* Header section with subtitle & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                Industrial Leads Feed
              </p>
              <h2 className="text-xl font-display font-bold text-brand-navy">
                Enquiry Inbox
              </h2>
              <p className="text-xs text-brand-slate mt-0.5">
                Consolidated feed of all inbound technical enquiries. Direct response tracking to prevent sales leakage.
              </p>
            </div>
            
            <button
              id="btn-manual-enquiry"
              onClick={() => setNewEnquiryModal(true)}
              className="self-start sm:self-center bg-brand-green hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-150 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Manual Enquiry
            </button>
          </div>

          {/* Channel Filter Chips with Counts */}
          <div className="flex flex-wrap items-center gap-2 border-b border-brand-border pb-4">
            {(['All', 'Email', 'IndiaMART', 'Website Form', 'WhatsApp', 'Expo Scan', 'Phone'] as const).map((chan) => {
              const count = getChannelCount(chan);
              const isActive = activeChannel === chan;
              const { icon: IconComponent, bg: iconBg } = getChannelDetails(chan);

              return (
                <button
                  key={chan}
                  onClick={() => setActiveChannel(chan)}
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-navy border-brand-navy text-white shadow-xs'
                      : 'bg-white border-brand-border text-brand-slate hover:bg-slate-50 hover:text-brand-navy'
                  }`}
                >
                  <span className={isActive ? 'text-brand-green' : 'text-slate-400'}>
                    {getChannelIcon(chan)}
                  </span>
                  <span>{chan}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive 
                      ? 'bg-brand-green text-brand-navy font-bold' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Core Feed Grid layout */}
          <div className="grid grid-cols-1 gap-4">
            {filteredEnquiries.length === 0 ? (
              <div className="bg-brand-card rounded-xl border border-dashed border-brand-border p-12 text-center text-brand-slate space-y-3">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-semibold text-sm">No enquiries match your current filters</p>
                <p className="text-xs">Try selecting a different channel filter chip or clearing your top header search query.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEnquiries.map((enq) => {
                  const chanDetails = getChannelDetails(enq.channel || 'Email');
                  const statusDetails = getStatusBadge(enq.status);
                  const isAssigningThis = assigningEnquiryId === enq.id;

                  // Product tag design mapping
                  let tagBg = 'bg-slate-50 text-slate-700 border-slate-200';
                  if (enq.productInterestTag === 'OCEMS') tagBg = 'bg-teal-50 text-teal-700 border-teal-200/60';
                  else if (enq.productInterestTag === 'CEMS') tagBg = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
                  else if (enq.productInterestTag === 'CAAQMS') tagBg = 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
                  else if (enq.productInterestTag === 'Gas Detection') tagBg = 'bg-amber-50 text-amber-700 border-amber-200/60';
                  else if (enq.productInterestTag === 'Gas Analyzer') tagBg = 'bg-blue-50 text-blue-700 border-blue-200/60';
                  else if (enq.productInterestTag === 'Dew Point Meter') tagBg = 'bg-purple-50 text-purple-700 border-purple-200/60';

                  return (
                    <div
                      key={enq.id}
                      onClick={() => setSelectedEnquiry(enq)}
                      className="group relative bg-white rounded-xl border border-brand-border p-4 hover:border-brand-green/40 hover:shadow-sm cursor-pointer transition-all duration-200"
                    >
                      {/* Flex layout for Enquiry row */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* 1. Left metadata segment */}
                        <div className="flex items-start gap-3 min-w-[280px] lg:max-w-[340px]">
                          <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${chanDetails.bg}`}>
                            {getChannelIcon(enq.channel || 'Email')}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-sm text-brand-navy group-hover:text-brand-green transition-colors">
                                {enq.company}
                              </h4>
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">
                                {enq.id}
                              </span>
                            </div>
                            <p className="text-xs text-brand-slate font-medium">
                              {enq.contactPerson} <span className="text-slate-400 font-normal">| {enq.designation}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Location: {enq.location}
                            </p>
                          </div>
                        </div>

                        {/* 2. Product tag and excerpt */}
                        <div className="flex flex-col gap-1 lg:max-w-[220px]">
                          <span className={`self-start text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${tagBg}`}>
                            {enq.productInterestTag || 'CEMS'}
                          </span>
                          <p className="text-xs text-slate-500 line-clamp-1 italic font-sans">
                            "{enq.details}"
                          </p>
                        </div>

                        {/* 3. Radial Lead score gauge */}
                        <div className="shrink-0 flex items-center">
                          {renderRadialGauge(enq.leadScore ?? 50)}
                        </div>

                        {/* 4. Spec completeness progress */}
                        <div className="shrink-0 flex items-center">
                          {renderSpecCompleteness(enq.specCompletenessCount ?? 3, enq.totalSpecsCount ?? 7)}
                        </div>

                        {/* 5. Right side time and status container */}
                        <div className="flex items-center justify-between lg:justify-end gap-3 lg:w-[190px] shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                            {enq.timeAgo || '1h ago'}
                          </span>
                          
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${statusDetails.classes}`}>
                            {statusDetails.text}
                          </span>
                        </div>

                      </div>

                      {/* Hover action overlay panel (reveals on hover of row) */}
                      <div className="absolute inset-0 bg-slate-50/95 rounded-xl border border-brand-green/30 px-6 flex items-center justify-between opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-brand-navy font-bold">
                            Configure Enquiry <span className="text-brand-slate">[{enq.id}]</span>:
                          </span>
                          <span className="text-[11px] text-brand-slate">
                            {enq.company} &middot; {enq.contactPerson}
                          </span>
                        </div>

                        {/* Action buttons list */}
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {/* Send to Spec Collector */}
                          {enq.status !== 'AI Collecting Specs' && enq.status !== 'Brief Ready' && (
                            <button
                              onClick={(e) => handleSendToSpecCollector(enq.id, e)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Cpu className="w-3.5 h-3.5" />
                              <span>Harvest Specs</span>
                            </button>
                          )}

                          {/* Quick Assign Dropdown trigger */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAssigningEnquiryId(isAssigningThis ? null : enq.id);
                              }}
                              className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Assign ({enq.suggestedOwner ? enq.suggestedOwner.split(' ')[0] : 'None'})</span>
                            </button>

                            {/* Quick Owner Select overlay */}
                            {isAssigningThis && (
                              <div className="absolute right-0 bottom-full mb-1.5 bg-white border border-brand-border rounded-xl shadow-xl p-2 w-48 z-20 space-y-1">
                                <p className="text-[9px] font-mono font-bold text-brand-slate uppercase px-2 py-1">Assign Sales Owner</p>
                                {['Ramesh Patel', 'Neha Sharma', 'Sanjay Mishra', 'Vikram Sen'].map((rep) => (
                                  <button
                                    key={rep}
                                    onClick={(e) => handleAssignOwner(enq.id, rep, e)}
                                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                                      enq.suggestedOwner === rep 
                                        ? 'bg-brand-green/10 text-brand-navy font-bold' 
                                        : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <span>{rep}</span>
                                    {enq.suggestedOwner === rep && <Check className="w-3 h-3 text-brand-green" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Open detailed drawer */}
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="bg-brand-navy hover:bg-brand-navy/90 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                          >
                            <span>Open Details</span>
                            <ChevronRight className="w-3.5 h-3.5 text-brand-green" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sliding detail drawer from right (250ms) */}
          <AnimatePresence>
            {selectedEnquiry && drawerEnquiry && (
              <>
                {/* Backdrop shade */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedEnquiry(null)}
                  className="fixed inset-0 bg-brand-navy z-40 cursor-pointer"
                />

                {/* Right side panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
                  className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white shadow-2xl border-l border-brand-border z-50 flex flex-col overflow-hidden"
                >
                  {/* Drawer Header segment */}
                  <div className="p-4 bg-brand-navy text-white flex items-center justify-between border-b border-brand-navy">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md border text-brand-green border-brand-green/20`}>
                        {getChannelIcon(drawerEnquiry.channel || 'Email')}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase text-brand-green">
                          Enquiry Inspector &middot; {drawerEnquiry.id}
                        </span>
                        <h3 className="font-display font-bold text-sm leading-tight">
                          {drawerEnquiry.company}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer main scroll area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* 1. Contact profile header */}
                    <div className="bg-slate-50 border border-brand-border rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-navy">{drawerEnquiry.contactPerson}</p>
                          <p className="text-[11px] text-slate-500">{drawerEnquiry.designation}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">{drawerEnquiry.location}</p>
                        </div>
                        {renderRadialGauge(drawerEnquiry.leadScore ?? 50)}
                      </div>

                      {/* Details with direct click metrics */}
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-2 text-[11px] font-mono text-brand-navy">
                        {drawerEnquiry.email && (
                          <a 
                            href={`mailto:${drawerEnquiry.email}`}
                            className="bg-white hover:bg-slate-100 p-2 rounded border border-brand-border flex items-center gap-1.5 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="truncate">{drawerEnquiry.email}</span>
                          </a>
                        )}
                        {drawerEnquiry.phone && (
                          <a 
                            href={`tel:${drawerEnquiry.phone}`}
                            className="bg-white hover:bg-slate-100 p-2 rounded border border-brand-border flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{drawerEnquiry.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* 2. Raw enquiry text quote */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider block">
                        Raw Message / Enquiry Text
                      </span>
                      <div className="bg-emerald-50/30 border border-brand-green/20 p-3.5 rounded-xl text-slate-700 text-xs italic leading-relaxed shadow-3xs">
                        "{drawerEnquiry.details}"
                      </div>
                    </div>

                    {/* 3. Interactive state control center inside drawer */}
                    <div className="bg-slate-50/60 border border-brand-border p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                          Current Action Status
                        </span>
                        <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border">
                          {drawerEnquiry.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {drawerEnquiry.status !== 'AI Collecting Specs' && drawerEnquiry.status !== 'Brief Ready' && (
                          <button
                            onClick={() => handleSendToSpecCollector(drawerEnquiry.id)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Cpu className="w-4 h-4 animate-pulse" />
                            <span>Harvest Specs</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setEnquiries(prev => prev.map(e => e.id === drawerEnquiry.id ? { ...e, status: 'Brief Ready' } : e));
                          }}
                          disabled={drawerEnquiry.status === 'Brief Ready'}
                          className="bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/20 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>Ready Brief</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setEnquiries(prev => prev.map(e => e.id === drawerEnquiry.id ? { ...e, status: 'Routed' } : e));
                        }}
                        className="w-full bg-brand-navy hover:bg-brand-navy/95 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4 text-brand-green" />
                        <span>Route to Local Office</span>
                      </button>
                    </div>

                    {/* 4. Provided vs Missing parameter Checklist */}
                    <div className="space-y-3 border-t border-brand-border pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider block">
                          Parameter Verification Checklist
                        </span>
                        <span className="text-[10px] font-mono text-brand-green font-bold">
                          {drawerEnquiry.specCompletenessCount ?? 3} of {drawerEnquiry.totalSpecsCount ?? 7} Specs Verified
                        </span>
                      </div>

                      {/* Physical progress indicator */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-black/5">
                        <div 
                          className="h-full bg-brand-green rounded-full transition-all duration-300"
                          style={{ width: `${((drawerEnquiry.specCompletenessCount ?? 3) / (drawerEnquiry.totalSpecsCount ?? 7)) * 100}%` }}
                        />
                      </div>

                      {/* Checklist nodes */}
                      <div className="space-y-2 pt-1">
                        {/* Provided specs */}
                        {drawerEnquiry.providedSpecsList && drawerEnquiry.providedSpecsList.map((spec) => (
                          <div key={spec} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/40 p-2 rounded-lg border border-emerald-100/30">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="font-semibold">{spec}</span>
                          </div>
                        ))}

                        {/* Missing specs */}
                        {drawerEnquiry.missingSpecsList && drawerEnquiry.missingSpecsList.map((spec) => (
                          <div key={spec} className="flex items-start gap-2 text-xs text-brand-slate bg-amber-50/30 p-2 rounded-lg border border-amber-100/20">
                            <Minus className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-slate-500 font-medium italic">{spec}</span>
                          </div>
                        ))}

                        {(!drawerEnquiry.providedSpecsList || drawerEnquiry.providedSpecsList.length === 0) && (
                          <p className="text-xs text-slate-400 italic">No parameter checks conducted yet.</p>
                        )}
                      </div>
                    </div>

                    {/* 5. Assigned Owner config segment */}
                    <div className="space-y-3 border-t border-brand-border pt-4">
                      <span className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider block">
                        Suggested Sales Owner
                      </span>
                      
                      <div className="bg-slate-50 border border-brand-border p-3.5 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-navy text-brand-green flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                            {drawerEnquiry.suggestedOwner ? drawerEnquiry.suggestedOwner.split(' ').map(n=>n[0]).join('') : 'UN'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-brand-navy">{drawerEnquiry.suggestedOwner || 'Unassigned'}</p>
                            <p className="text-[10px] text-slate-400">Regional Technical Support</p>
                          </div>
                        </div>

                        {/* Owner changer dropdown */}
                        <select
                          value={drawerEnquiry.suggestedOwner || ''}
                          onChange={(e) => handleAssignOwner(drawerEnquiry.id, e.target.value)}
                          className="text-xs p-1.5 rounded-lg border border-brand-border bg-white focus:outline-none text-slate-700"
                        >
                          <option value="" disabled>Reassign...</option>
                          <option value="Ramesh Patel">Ramesh Patel</option>
                          <option value="Neha Sharma">Neha Sharma</option>
                          <option value="Sanjay Mishra">Sanjay Mishra</option>
                          <option value="Vikram Sen">Vikram Sen</option>
                        </select>
                      </div>
                    </div>

                    {/* 6. Activity Timeline block */}
                    <div className="space-y-4 border-t border-brand-border pt-4">
                      <span className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider block">
                        Enquiry Activity Timeline
                      </span>

                      <div className="relative pl-4 border-l-2 border-slate-100 space-y-4 ml-1.5">
                        {drawerEnquiry.timeline && drawerEnquiry.timeline.map((event, index) => {
                          let iconBg = 'bg-slate-100 text-slate-600';
                          let Icon = Activity;
                          if (event.type === 'ai') {
                            iconBg = 'bg-amber-50 text-amber-600 border border-amber-200/50';
                            Icon = Sparkles;
                          } else if (event.type === 'user') {
                            iconBg = 'bg-sky-50 text-sky-600 border border-sky-200/50';
                            Icon = User;
                          }

                          return (
                            <div key={index} className="relative group/time">
                              {/* Dot marker node */}
                              <div className={`absolute -left-[23px] top-0.5 p-1 rounded-full ${iconBg} shrink-0`}>
                                <Icon className="w-2.5 h-2.5" />
                              </div>

                              <div className="space-y-0.5 leading-tight">
                                <span className="text-[9px] font-mono text-slate-400 font-bold block">
                                  {event.time}
                                </span>
                                <p className="text-xs text-brand-navy font-medium">
                                  {event.event}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {(!drawerEnquiry.timeline || drawerEnquiry.timeline.length === 0) && (
                          <p className="text-xs text-slate-400 italic">No timeline entries recorded.</p>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Drawer Footer bottom strip */}
                  <div className="p-4 bg-slate-50 border-t border-brand-border flex items-center justify-between text-[10px] font-mono text-brand-slate">
                    <span>RECEIVED: {drawerEnquiry.dateReceived}</span>
                    <span>LINKED_CRM_ID: {drawerEnquiry.id.replace('ENQ-', 'CRM_')}</span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* New enquiry modal simulator */}
          {newEnquiryModal && (
            <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl border border-brand-border max-w-md w-full overflow-hidden">
                <div className="p-4 bg-brand-navy text-white flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm">Add New Manual Enquiry</h3>
                  <button onClick={() => setNewEnquiryModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleCreateEnquirySubmit} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-semibold text-brand-slate uppercase block">Company Name</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 rounded border border-brand-border focus:border-brand-green focus:outline-none"
                      placeholder="e.g. Mewar Portland Ltd."
                      required
                      value={newEnquiryForm.company}
                      onChange={e => setNewEnquiryForm(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold text-brand-slate uppercase block">Contact Name</label>
                      <input
                        type="text"
                        className="w-full text-xs p-2.5 rounded border border-brand-border focus:border-brand-green focus:outline-none"
                        placeholder="e.g. Dr. Verma"
                        required
                        value={newEnquiryForm.contactPerson}
                        onChange={e => setNewEnquiryForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold text-brand-slate uppercase block">Designation</label>
                      <input
                        type="text"
                        className="w-full text-xs p-2.5 rounded border border-brand-border focus:border-brand-green focus:outline-none"
                        placeholder="e.g. EHS VP"
                        required
                        value={newEnquiryForm.designation}
                        onChange={e => setNewEnquiryForm(prev => ({ ...prev, designation: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-semibold text-brand-slate uppercase block">Location (State/City)</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 rounded border border-brand-border focus:border-brand-green focus:outline-none"
                      placeholder="e.g. Udaipur, Rajasthan"
                      required
                      value={newEnquiryForm.location}
                      onChange={e => setNewEnquiryForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-semibold text-brand-slate uppercase block">Equipment Scope</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 rounded border border-brand-border focus:border-brand-green focus:outline-none"
                      required
                      value={newEnquiryForm.product}
                      onChange={e => setNewEnquiryForm(prev => ({ ...prev, product: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-semibold text-brand-slate uppercase block">Description & Notes</label>
                    <textarea
                      rows={3}
                      className="w-full text-xs p-2.5 rounded border border-brand-border focus:border-brand-green focus:outline-none font-mono text-[11px]"
                      placeholder="CPCB reporting parameters, stack temperature..."
                      required
                      value={newEnquiryForm.details}
                      onChange={e => setNewEnquiryForm(prev => ({ ...prev, details: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t font-sans">
                    <button type="button" onClick={() => setNewEnquiryModal(false)} className="px-4 py-2 border text-xs text-slate-500 rounded cursor-pointer">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-brand-green text-white text-xs font-semibold rounded cursor-pointer">Save Enquiry</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 2. AI SPEC COLLECTOR VIEW */}
      {viewName === 'AI Spec Collector' && (
        <div id="ai-spec-collector-section" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                Automated Customer Interaction & Compliance Diagnostics
              </p>
              <h2 className="text-xl font-display font-bold text-brand-navy flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-green" />
                <span>AI Technical Specification Collector</span>
              </h2>
              <p className="text-xs text-brand-slate mt-1 font-sans">
                A real-time dialogue and extraction engine powered by Gemini AI. Feed raw enquiries to build a completed Technical Brief.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400">STATUS:</span>
              {isSimulationActive ? (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded text-[11px] font-mono font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>LOCAL HEURISTIC ENGINE</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded text-[11px] font-mono font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>GEMINI PRO ACTIVE</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick paste sample templates */}
          {collectorChatMessages.length === 0 && (
            <div className="bg-white border border-brand-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-green" />
                <h4 className="text-xs font-bold text-brand-navy">Select a Raw Enquiry Template to Initialize Spec Collector</h4>
              </div>
              <p className="text-xs text-brand-slate">
                Select one of these typical inbound enquiries to simulate how the agent extracts 8 crucial physical dimensions & qualification states:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => handleInitializeCollector("We need online emission monitoring for our cement plant, please send quotation.")}
                  className="p-3.5 border border-brand-border bg-slate-50 hover:border-brand-green hover:bg-emerald-50/20 text-left rounded-lg transition-all duration-150 cursor-pointer"
                >
                  <p className="text-[10px] font-mono font-bold text-indigo-600 mb-1">CEMENT STACK CEMS</p>
                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    "We need online emission monitoring for our cement plant, please send quotation."
                  </p>
                </button>
                <button
                  onClick={() => handleInitializeCollector("Requirement of multi gas detection system for pharmaceutical solvent storage zone. Need H2S, Cl2, NH3 parameters. 3 points.")}
                  className="p-3.5 border border-brand-border bg-slate-50 hover:border-brand-green hover:bg-emerald-50/20 text-left rounded-lg transition-all duration-150 cursor-pointer"
                >
                  <p className="text-[10px] font-mono font-bold text-emerald-600 mb-1">PHARMA GAS DETECTION</p>
                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    "Requirement of multi gas detection system for pharmaceutical solvent storage zone. Need H2S, Cl2, NH3 parameters. 3 points."
                  </p>
                </button>
                <button
                  onClick={() => handleInitializeCollector("We are setting up a 10 TPH coal fired boiler in Udaipur, Rajasthan. SPCB requires continuous monitoring SO2 and PM. It is a retrofit. Quick quote needed.")}
                  className="p-3.5 border border-brand-border bg-slate-50 hover:border-brand-green hover:bg-emerald-50/20 text-left rounded-lg transition-all duration-150 cursor-pointer"
                >
                  <p className="text-[10px] font-mono font-bold text-amber-600 mb-1">BOILER EMISSION CEMS</p>
                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    "We are setting up a 10 TPH coal fired boiler in Udaipur, Rajasthan. SPCB requires continuous monitoring SO2 and PM..."
                  </p>
                </button>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
                <label className="text-[10px] font-mono font-bold text-brand-slate uppercase block">Or Paste Custom Raw Enquiry (English or Hindi)</label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    placeholder="E.g. Humare chemical plant me 2 stack ke liye emission analyzer chahiye compliance ke liye. Stack temperature is 120C..."
                    className="flex-1 text-xs p-2.5 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none font-mono"
                    id="custom-raw-enquiry-input"
                  />
                  <button
                    onClick={() => {
                      const el = document.getElementById("custom-raw-enquiry-input") as HTMLTextAreaElement;
                      if (el && el.value.trim()) {
                        handleInitializeCollector(el.value.trim());
                      }
                    }}
                    className="bg-brand-navy text-white hover:bg-brand-green hover:text-brand-navy px-4 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Initialize
                  </button>
                </div>
              </div>
            </div>
          )}

          {collectorChatMessages.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT SIDE PANEL: Dialogue Console */}
              <div className="lg:col-span-7 bg-white border border-brand-border rounded-xl flex flex-col h-[580px] overflow-hidden shadow-sm">
                
                {/* Panel Header */}
                <div className="bg-brand-navy p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
                    <div>
                      <p className="text-xs font-bold leading-tight font-display">Prima Technical Enquiry Assistant</p>
                      <p className="text-[9px] text-slate-400 font-mono">CHANNEL: DOCK_INTELLIGENCE_API</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCollectorChatMessages([]);
                      setCollectorSpecs({
                        industryPlantType: null,
                        complianceDriver: null,
                        parametersToMonitor: null,
                        monitoringPointsCount: null,
                        stackDetails: null,
                        newOrRetrofit: null,
                        timeline: null,
                        budgetStage: null,
                        isResellerTrader: false,
                        isEndCustomerClarified: false,
                        emailDraft: null
                      });
                    }}
                    className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>RESET</span>
                  </button>
                </div>

                {/* Raw Enquiry Origin Strip */}
                <div className="bg-slate-50 border-b border-slate-150 p-3 flex items-start gap-2.5">
                  <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-1.5 py-0.5 shrink-0 font-bold uppercase">
                    ORIGIN TEXT
                  </span>
                  <p className="text-xs text-slate-600 font-mono italic truncate flex-1" title={collectorRawEnquiry}>
                    "{collectorRawEnquiry}"
                  </p>
                </div>

                {/* Message Bubble Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  {collectorChatMessages.map((msg, i) => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div key={i} className={`flex ${isAi ? 'justify-start' : 'justify-end'} items-start gap-2.5`}>
                        {isAi && (
                          <div className="w-7 h-7 rounded-full bg-brand-navy text-brand-green flex items-center justify-center text-xs shrink-0 font-bold shadow-sm">
                            AI
                          </div>
                        )}
                        <div className={`max-w-[85%] rounded-xl p-3.5 shadow-xs border ${
                          isAi 
                            ? 'bg-white border-slate-200 text-brand-navy rounded-tl-none' 
                            : 'bg-indigo-900 border-indigo-950 text-white rounded-tr-none'
                        }`}>
                          <p className="text-xs leading-relaxed font-sans font-medium whitespace-pre-line">{msg.text}</p>
                          <span className={`text-[9px] font-mono mt-1.5 block text-right ${isAi ? 'text-slate-400' : 'text-indigo-200'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {isCollectorLoading && (
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-navy text-brand-green flex items-center justify-center text-xs shrink-0 font-bold">
                        AI
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 rounded-tl-none flex items-center gap-2 text-slate-400 text-xs font-mono animate-pulse">
                        <RotateCw className="w-3.5 h-3.5 animate-spin text-brand-green" />
                        <span>AI extracts specs and drafts next query...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input area */}
                <div className="p-3 border-t border-brand-border bg-white flex gap-2">
                  <input
                    type="text"
                    value={collectorInput}
                    onChange={e => setCollectorInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type technical parameter answers or details here..."
                    disabled={isCollectorLoading}
                    className="flex-1 text-xs p-3 rounded-lg border border-brand-border bg-slate-50 focus:bg-white focus:outline-none font-medium text-brand-navy"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!collectorInput.trim() || isCollectorLoading}
                    className="bg-brand-navy hover:bg-brand-green hover:text-brand-navy text-white font-bold px-4 rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 transition-colors duration-150"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE PANEL: LIVE SPECIFICATIONS BRIEF */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Specification Table Status */}
                <div className="bg-white border border-brand-border rounded-xl p-5 space-y-4 shadow-sm flex-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold font-display text-brand-navy">Technical Enquiry Brief</h3>
                      <p className="text-[10px] text-brand-slate font-mono uppercase mt-0.5">Specifications Extracted</p>
                    </div>
                    
                    {/* Progress Badge */}
                    <div className="bg-slate-100 border border-brand-border px-2.5 py-1 rounded text-[11px] font-mono font-bold text-brand-navy flex items-center gap-1">
                      <span>SPECS COLLECTED:</span>
                      <span className="text-brand-green font-extrabold">
                        {
                          Object.values(collectorSpecs).filter(v => v !== null && v !== false && v !== '').length
                        } / 8
                      </span>
                    </div>
                  </div>

                  {/* Reseller Warnings Banner */}
                  {collectorSpecs.isResellerTrader && (
                    <div className={`p-3.5 border rounded-lg flex items-start gap-2.5 ${
                      collectorSpecs.isEndCustomerClarified 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${collectorSpecs.isEndCustomerClarified ? 'text-emerald-600' : 'text-red-600'}`} />
                      <div className="text-xs font-sans leading-relaxed">
                        <span className="font-bold block">Reseller / Consultant Detected</span>
                        {collectorSpecs.isEndCustomerClarified ? (
                          <p>End customer clarified. Approved for active dispatch to sales engineers.</p>
                        ) : (
                          <p>CRITICAL: Missing end customer name & physical installation location. Awaiting verification.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Specifications List */}
                  <div className="space-y-2.5">
                    
                    {/* Item 1: Industry Type */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      flashFields.includes('industryPlantType') ? 'bg-emerald-100/40 border-brand-green shadow-sm' :
                      collectorSpecs.industryPlantType ? 'bg-slate-50/50 border-brand-border' : 'bg-amber-50/30 border-amber-100'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">1. INDUSTRY & PLANT TYPE</span>
                        <p className="text-xs font-bold text-brand-navy">
                          {collectorSpecs.industryPlantType || <span className="text-amber-600/70 italic font-normal">Awaiting extraction...</span>}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {collectorSpecs.industryPlantType ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-brand-green/30 flex items-center justify-center text-brand-green">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-600/80">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Item 2: Compliance Driver */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      flashFields.includes('complianceDriver') ? 'bg-emerald-100/40 border-brand-green shadow-sm' :
                      collectorSpecs.complianceDriver ? 'bg-slate-50/50 border-brand-border' : 'bg-amber-50/30 border-amber-100'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">2. COMPLIANCE DRIVER</span>
                        <p className="text-xs font-bold text-brand-navy">
                          {collectorSpecs.complianceDriver || <span className="text-amber-600/70 italic font-normal">Awaiting extraction...</span>}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {collectorSpecs.complianceDriver ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-brand-green/30 flex items-center justify-center text-brand-green">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-600/80">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Item 3: Parameters to Monitor */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      flashFields.includes('parametersToMonitor') ? 'bg-emerald-100/40 border-brand-green shadow-sm' :
                      collectorSpecs.parametersToMonitor ? 'bg-slate-50/50 border-brand-border' : 'bg-amber-50/30 border-amber-100'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">3. PARAMETERS TO MONITOR</span>
                        <p className="text-xs font-bold text-brand-navy">
                          {collectorSpecs.parametersToMonitor || <span className="text-amber-600/70 italic font-normal">Awaiting extraction...</span>}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {collectorSpecs.parametersToMonitor ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-brand-green/30 flex items-center justify-center text-brand-green">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-600/80">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Item 4: Monitoring Points */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      flashFields.includes('monitoringPointsCount') ? 'bg-emerald-100/40 border-brand-green shadow-sm' :
                      collectorSpecs.monitoringPointsCount ? 'bg-slate-50/50 border-brand-border' : 'bg-amber-50/30 border-amber-100'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">4. STACKS / MONITORING POINTS</span>
                        <p className="text-xs font-bold text-brand-navy">
                          {collectorSpecs.monitoringPointsCount || <span className="text-amber-600/70 italic font-normal">Awaiting extraction...</span>}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {collectorSpecs.monitoringPointsCount ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-brand-green/30 flex items-center justify-center text-brand-green">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-600/80">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Item 5: Stack Sizing physical details */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      flashFields.includes('stackDetails') ? 'bg-emerald-100/40 border-brand-green shadow-sm' :
                      collectorSpecs.stackDetails ? 'bg-slate-50/50 border-brand-border' : 'bg-amber-50/30 border-amber-100'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">5. STACK SIZING DETAILS</span>
                        <p className="text-xs font-bold text-brand-navy">
                          {collectorSpecs.stackDetails || <span className="text-amber-600/70 italic font-normal">Awaiting extraction...</span>}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {collectorSpecs.stackDetails ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-brand-green/30 flex items-center justify-center text-brand-green">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-600/80">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Item 6: Project Type */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      flashFields.includes('newOrRetrofit') ? 'bg-emerald-100/40 border-brand-green shadow-sm' :
                      collectorSpecs.newOrRetrofit ? 'bg-slate-50/50 border-brand-border' : 'bg-amber-50/30 border-amber-100'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">6. INSTALLATION STATUS (NEW/RETROFIT)</span>
                        <p className="text-xs font-bold text-brand-navy">
                          {collectorSpecs.newOrRetrofit || <span className="text-amber-600/70 italic font-normal">Awaiting extraction...</span>}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {collectorSpecs.newOrRetrofit ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-brand-green/30 flex items-center justify-center text-brand-green">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-600/80">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Item 7: Timeline */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      flashFields.includes('timeline') ? 'bg-emerald-100/40 border-brand-green shadow-sm' :
                      collectorSpecs.timeline ? 'bg-slate-50/50 border-brand-border' : 'bg-amber-50/30 border-amber-100'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">7. EXPECTED IMPLEMENTATION TIMELINE</span>
                        <p className="text-xs font-bold text-brand-navy">
                          {collectorSpecs.timeline || <span className="text-amber-600/70 italic font-normal">Awaiting extraction...</span>}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {collectorSpecs.timeline ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-brand-green/30 flex items-center justify-center text-brand-green">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-600/80">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Item 8: Budget Stage */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      flashFields.includes('budgetStage') ? 'bg-emerald-100/40 border-brand-green shadow-sm' :
                      collectorSpecs.budgetStage ? 'bg-slate-50/50 border-brand-border' : 'bg-amber-50/30 border-amber-100'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">8. COMMERCIAL & BUDGET STAGE</span>
                        <p className="text-xs font-bold text-brand-navy">
                          {collectorSpecs.budgetStage || <span className="text-amber-600/70 italic font-normal">Awaiting extraction...</span>}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {collectorSpecs.budgetStage ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-brand-green/30 flex items-center justify-center text-brand-green">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-amber-600/80">Pending</span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* EMAIL DRAFT BOX - SHOWN WHEN GENERATED */}
                {collectorSpecs.emailDraft && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#050B14] border border-slate-850 rounded-xl p-5 space-y-4 shadow-md text-slate-300 font-mono text-xs flex flex-col"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-green" />
                        <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">AI Autodrafted Proposal Reply</span>
                      </div>
                      <span className="text-[9px] bg-brand-green/20 text-brand-green border border-brand-green/30 rounded px-1.5 py-0.5 uppercase font-bold">
                        BRIEF READY
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded border border-slate-800 max-h-[180px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text font-mono text-[11px] text-slate-300">
                      {collectorSpecs.emailDraft}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 font-sans">
                      <button
                        onClick={() => {
                          if (collectorSpecs.emailDraft) {
                            navigator.clipboard.writeText(collectorSpecs.emailDraft);
                          }
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded text-[11px] flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-brand-green" />
                        <span>Copy Draft Text</span>
                      </button>
                      <button
                        onClick={() => {
                          // Simulate dispatch
                          alert("Technical Enquiry Brief successfully dispatched and synchronized to internal CRM.");
                        }}
                        className="w-full bg-brand-green hover:bg-green-700 text-slate-950 font-bold py-2 rounded text-[11px] flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Route to CRM Team</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>

            </div>
          )}
        </div>
      )}


      {/* 3. LEAD FINDER */}
      {viewName === 'Lead Finder' && (() => {
        const applyPreset = (presetId: string) => {
          setSelectedPreset(presetId);
          if (presetId === 'gujarat_chemical') {
            setSelectedGeographies(["Gujarat"]);
            setSelectedIndustries(["Pesticides", "Dyes & Dye Intermediates", "Pharma", "Chlor-Alkali"]);
            setSelectedProductFits([]);
            setSelectedBuyingSignals([]);
            setSelectedDecisionMakers([]);
          } else if (presetId === 'cement_raj_mp') {
            setSelectedGeographies(["Rajasthan", "MP"]);
            setSelectedIndustries(["Cement"]);
            setSelectedProductFits([]);
            setSelectedBuyingSignals([]);
            setSelectedDecisionMakers([]);
          } else if (presetId === 'ncr_metal_food') {
            setSelectedGeographies(["UP/NCR"]);
            setSelectedIndustries(["Metal Processing", "Food Processing", "Iron & Steel"]);
            setSelectedProductFits([]);
            setSelectedBuyingSignals([]);
            setSelectedDecisionMakers([]);
          } else if (presetId === 'gcc_export') {
            setSelectedGeographies(["GCC"]);
            setSelectedIndustries(["Cement", "Petrochemicals", "Oil Refinery"]);
            setSelectedProductFits([]);
            setSelectedBuyingSignals([]);
            setSelectedDecisionMakers([]);
          }
        };

        const startFindingLeads = () => {
          setIsFindingLeadsLoading(true);
          setLeadFindingStep(0);
          setShowLeadResults(false);
          setProgressWidth(0);

          const stepInterval = 750; // Total 3 seconds for 4 steps
          
          let currentProgress = 0;
          const progressTimer = setInterval(() => {
            currentProgress += 1;
            if (currentProgress >= 100) {
              currentProgress = 100;
              clearInterval(progressTimer);
            }
            setProgressWidth(currentProgress);
          }, 30); // fills in 3 seconds

          setTimeout(() => {
            setLeadFindingStep(1);
          }, stepInterval);

          setTimeout(() => {
            setLeadFindingStep(2);
          }, stepInterval * 2);

          setTimeout(() => {
            setLeadFindingStep(3);
          }, stepInterval * 3);

          setTimeout(() => {
            setIsFindingLeadsLoading(false);
            setShowLeadResults(true);
            clearInterval(progressTimer);
            setProgressWidth(100);
          }, stepInterval * 4);
        };

        const getMostRestrictiveFilterName = () => {
          let mostRestrictiveName = 'Geography';
          let minMatches = 48;

          if (selectedGeographies.length > 0) {
            const matchCount = leadBankData.filter(l => selectedGeographies.includes(l.state)).length;
            if (matchCount < minMatches) {
              minMatches = matchCount;
              mostRestrictiveName = 'Geography';
            }
          }
          if (selectedIndustries.length > 0) {
            const matchCount = leadBankData.filter(l => selectedIndustries.includes(l.industry)).length;
            if (matchCount < minMatches) {
              minMatches = matchCount;
              mostRestrictiveName = 'Industry';
            }
          }
          if (selectedProductFits.length > 0) {
            const matchCount = leadBankData.filter(l => selectedProductFits.includes(l.productFit)).length;
            if (matchCount < minMatches) {
              minMatches = matchCount;
              mostRestrictiveName = 'Product Fit';
            }
          }
          if (selectedBuyingSignals.length > 0) {
            const matchCount = leadBankData.filter(l => selectedBuyingSignals.includes(l.buyingSignal)).length;
            if (matchCount < minMatches) {
              minMatches = matchCount;
              mostRestrictiveName = 'Buying Signal';
            }
          }
          if (selectedDecisionMakers.length > 0) {
            const matchCount = leadBankData.filter(l => selectedDecisionMakers.includes(l.decisionMaker)).length;
            if (matchCount < minMatches) {
              minMatches = matchCount;
              mostRestrictiveName = 'Decision-Maker Target';
            }
          }

          return { name: mostRestrictiveName, count: minMatches };
        };

        const filteredRadarItems = radarItems.filter(item => {
          // State Filter
          if (filterState !== 'All' && item.state !== filterState) return false;
          // Industry Filter
          if (filterIndustry !== 'All' && item.industry !== filterIndustry) return false;
          // Approval Type Filter
          if (filterApprovalType !== 'All' && item.approvalType !== filterApprovalType) return false;
          // Date Range Filter
          if (filterDateRange === 'Last 7 Days') {
            const dateLimit = new Date('2026-07-23');
            const itemDate = new Date(item.approvalDate);
            if (itemDate < dateLimit) return false;
          } else if (filterDateRange === 'Last 30 Days') {
            const dateLimit = new Date('2026-06-30');
            const itemDate = new Date(item.approvalDate);
            if (itemDate < dateLimit) return false;
          }
          // Search Query Filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchCompany = item.company.toLowerCase().includes(query);
            const matchDistrict = item.district.toLowerCase().includes(query);
            const matchState = item.state.toLowerCase().includes(query);
            const matchIndustry = item.industry.toLowerCase().includes(query);
            const matchType = item.approvalType.toLowerCase().includes(query);
            if (!matchCompany && !matchDistrict && !matchState && !matchIndustry && !matchType) return false;
          }
          return true;
        });

        const filteredLeads = getFilteredLeadsList();

        const handleAddLeadToSequence = (lead: LeadItem) => {
          const newNurtureLead: NurtureLead = {
            id: `NUR-${Math.floor(200 + Math.random() * 100)}`,
            company: lead.company,
            contactPerson: lead.decisionMaker.split(" (")[0] || "Compliance Officer",
            designation: lead.decisionMaker.includes(" (") ? lead.decisionMaker.split(" (")[1].replace(")", "") : "Head EHS",
            location: `${lead.city}, ${lead.state}`,
            status: "Active in Sequence",
            source: "Plant Approval Radar",
            triggerContext: lead.whyThisLead,
            currentStepIndex: 0,
            email1Draft: lead.firstTouchAngle,
            isFlashed: true,
            phone: "+91 98765 43210"
          };
          setNurtureLeads(prev => [newNurtureLead, ...prev]);

          setLeadFinderToast({
            show: true,
            message: `${lead.company} has been routed to Outreach & Nurture.`
          });

          setTimeout(() => {
            setLeadFinderToast(null);
          }, 3500);
        };

        return (
          <div id="lead-finder-section" className="space-y-6 select-none pb-12">
            
            {/* Header Section with Tab Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                  Industrial Compliance Scraper
                </p>
                <h2 className="text-xl font-display font-bold text-brand-navy">
                  {leadFinderActiveTab === 'Find Leads' ? 'Lead Finder' : 'Plant Approval Radar'}
                </h2>
              </div>
              
              {/* Premium Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
                <button
                  id="tab-find-leads"
                  onClick={() => setLeadFinderActiveTab('Find Leads')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 cursor-pointer ${
                    leadFinderActiveTab === 'Find Leads'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/50'
                      : 'text-slate-650 hover:text-slate-900'
                  }`}
                >
                  Find Leads
                </button>
                <button
                  id="tab-approval-radar"
                  onClick={() => setLeadFinderActiveTab('Approval Radar')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 cursor-pointer ${
                    leadFinderActiveTab === 'Approval Radar'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/50'
                      : 'text-slate-650 hover:text-slate-900'
                  }`}
                >
                  Approval Radar
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-mono font-semibold">
                <Radar className="w-4 h-4 animate-pulse text-indigo-600" />
                <span>Real-time SPCB & Parivesh Database Feed</span>
              </div>
            </div>

            {/* CONDITIONAL RENDERING BASED ON ACTIVE TAB */}
            {leadFinderActiveTab === 'Approval Radar' ? (
              <div className="space-y-6 animate-fade-in">
                {/* Sources Monitored Strip */}
                <div 
                  id="sources-monitored-strip"
                  className="flex flex-wrap items-center justify-between gap-4 bg-white border border-brand-border px-4 py-3.5 rounded-xl shadow-xs"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Monitored Feeds:
                    </span>
                    
                    {/* PARIVESH */}
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-medium">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span>PARIVESH (EC)</span>
                    </div>

                    {/* OCMMS */}
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-medium">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span>OCMMS (CTE/CTO)</span>
                    </div>

                    {/* CPCB Directions */}
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-medium">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span>CPCB Directions</span>
                    </div>
                  </div>

                  <div 
                    id="last-sync-timestamp"
                    className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>LAST SYNC: 2026-07-30 09:45 AM (5m ago)</span>
                  </div>
                </div>

                {/* Featured Analytics Card with stylized India Map Outline */}
                <div 
                  id="featured-radar-card"
                  className="bg-slate-900 text-white rounded-xl border border-slate-800 p-6 shadow-md overflow-hidden relative"
                >
                  {/* Background subtle radial light */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-brand-green/10 to-transparent pointer-events-none" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                    
                    {/* Highlight Stats Info */}
                    <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider">
                          Target Intelligence Matching
                        </div>
                        <h3 className="text-lg md:text-xl font-display font-bold text-white tracking-tight">
                          This week: 9 new approvals match Prima's target industries
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-medium">
                          Our compliance crawler has identified 9 highly relevant Greenfield & Expansion approvals matching our ideal customer profile (ICP). SPCB regulatory standard terms mandate continuous online emissions or discharge feedback (CEMS/OCEMS) integration within 90 to 180 days.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Priority Corridor Activity</span>
                          <span className="text-sm font-bold text-white block mt-1">Rajasthan & Gujarat Belts</span>
                          <span className="text-[10px] text-brand-green block mt-0.5">⭐ Accounts for 65% of weekly volume</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">ICP Classification</span>
                          <span className="text-sm font-bold text-white block mt-1">Large Scale Projects</span>
                          <span className="text-[10px] text-brand-green block mt-0.5">⚡ 6 expansion sizes exceeding regulatory trigger bar</span>
                        </div>
                      </div>
                    </div>

                    {/* Stylized Network India Map Visual */}
                    <div 
                      id="stylized-india-map"
                      className="lg:col-span-4 bg-[#0c1220] border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[180px] shadow-inner"
                    >
                      <div className="absolute top-2 left-3 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-brand-green animate-pulse" />
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Active Hubs</span>
                      </div>

                      <svg viewBox="0 0 200 180" className="w-full h-full max-h-[160px] text-brand-green/30" stroke="currentColor" fill="none" strokeWidth="1.2">
                        {/* Abstract outline of India or stylized boundary lines */}
                        <path d="M 50 40 L 90 20 L 110 30 L 120 45 L 140 60 L 125 90 L 135 110 L 110 135 L 95 160 L 85 170 L 80 150 L 70 120 L 55 105 L 35 100 L 25 85 L 30 65 Z" className="stroke-slate-700" strokeDasharray="3 3" />
                        
                        {/* Dotted network paths */}
                        <path d="M 55 70 L 85 62 M 85 62 L 110 75 M 110 75 L 125 100 M 125 100 L 70 115 M 70 115 L 35 95 M 35 95 L 55 70 L 70 115" className="stroke-slate-800" strokeDasharray="2 2" />

                        {/* Active state nodes with pulsing green circles */}
                        {/* Rajasthan (RJ) */}
                        <g transform="translate(55, 70)">
                          <circle r="7" className="fill-brand-green/20 stroke-brand-green/60 animate-pulse" strokeWidth="1.5" />
                          <circle r="2.5" className="fill-brand-green" />
                          <text x="9" y="3" className="fill-slate-400 font-mono text-[8px] font-bold" stroke="none">RJ</text>
                        </g>

                        {/* Gujarat (GJ) */}
                        <g transform="translate(35, 95)">
                          <circle r="7" className="fill-brand-green/20 stroke-brand-green/60 animate-pulse" strokeWidth="1.5" />
                          <circle r="2.5" className="fill-brand-green" />
                          <text x="-16" y="3" className="fill-slate-400 font-mono text-[8px] font-bold" stroke="none">GJ</text>
                        </g>

                        {/* Uttar Pradesh (UP) */}
                        <g transform="translate(100, 65)">
                          <circle r="7" className="fill-brand-green/20 stroke-brand-green/60 animate-pulse" strokeWidth="1.5" />
                          <circle r="2.5" className="fill-brand-green" />
                          <text x="9" y="3" className="fill-slate-400 font-mono text-[8px] font-bold" stroke="none">UP</text>
                        </g>

                        {/* Maharashtra (MH) */}
                        <g transform="translate(70, 115)">
                          <circle r="7" className="fill-brand-green/20 stroke-brand-green/60 animate-pulse" strokeWidth="1.5" />
                          <circle r="2.5" className="fill-brand-green" />
                          <text x="9" y="3" className="fill-slate-400 font-mono text-[8px] font-bold" stroke="none">MH</text>
                        </g>

                        {/* Odisha (OD) */}
                        <g transform="translate(125, 100)">
                          <circle r="7" className="fill-brand-green/20 stroke-brand-green/60 animate-pulse" strokeWidth="1.5" />
                          <circle r="2.5" className="fill-brand-green" />
                          <text x="9" y="3" className="fill-slate-400 font-mono text-[8px] font-bold" stroke="none">OD</text>
                        </g>
                      </svg>
                    </div>

                  </div>
                </div>

                {/* Filter Controls Panel */}
                <div 
                  id="radar-filters-bar"
                  className="bg-white border border-brand-border p-5 rounded-xl shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-sm">
                      <Sliders className="w-4 h-4 text-slate-500" />
                      <span>Filter Signals</span>
                    </div>
                    
                    {(filterState !== 'All' || filterIndustry !== 'All' || filterApprovalType !== 'All' || filterDateRange !== 'All') && (
                      <button
                        id="filter-reset-btn"
                        onClick={() => {
                          setFilterState('All');
                          setFilterIndustry('All');
                          setFilterApprovalType('All');
                          setFilterDateRange('All');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors duration-150 animate-fade-in"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* State Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wide">State</label>
                      <select
                        id="filter-state-select"
                        value={filterState}
                        onChange={e => setFilterState(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-250 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white text-brand-navy font-medium"
                      >
                        <option value="All">All States</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                      </select>
                    </div>

                    {/* Industry Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wide">Industry Type</label>
                      <select
                        id="filter-industry-select"
                        value={filterIndustry}
                        onChange={e => setFilterIndustry(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-250 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white text-brand-navy font-medium"
                      >
                        <option value="All">All Industries</option>
                        <option value="Cement">Cement</option>
                        <option value="Steel">Steel</option>
                        <option value="Power">Power</option>
                        <option value="Pharma">Pharma</option>
                        <option value="Chemicals">Chemicals</option>
                        <option value="Distillery">Distillery</option>
                        <option value="Waste-to-Energy">Waste-to-Energy</option>
                      </select>
                    </div>

                    {/* Approval Type Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wide">Approval Type</label>
                      <select
                        id="filter-type-select"
                        value={filterApprovalType}
                        onChange={e => setFilterApprovalType(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-250 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white text-brand-navy font-medium"
                      >
                        <option value="All">All Clearance Types</option>
                        <option value="Environmental Clearance">Environmental Clearance</option>
                        <option value="Consent to Establish">Consent to Establish</option>
                        <option value="Consent to Operate">Consent to Operate</option>
                        <option value="CPCB Direction">CPCB Direction</option>
                      </select>
                    </div>

                    {/* Date Range Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wide">Clearance Date</label>
                      <select
                        id="filter-date-select"
                        value={filterDateRange}
                        onChange={e => setFilterDateRange(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-250 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white text-brand-navy font-medium"
                      >
                        <option value="All">All Dates</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Results Summary count */}
                <div className="flex items-center justify-between text-xs text-brand-slate font-sans px-1">
                  <p>
                    Showing <span className="font-bold text-brand-navy">{filteredRadarItems.length}</span> active signals 
                    {searchQuery && <span> matching keyword "<span className="font-semibold text-indigo-700">{searchQuery}</span>"</span>}
                  </p>
                  <span className="text-[11px] font-mono text-slate-500">Corridors Monitored: 5 State Zones</span>
                </div>

                {/* Table Container */}
                <div 
                  id="approvals-table-wrapper"
                  className="bg-white border border-brand-border rounded-xl shadow-xs overflow-hidden"
                >
                  {filteredRadarItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table 
                        id="approvals-data-table"
                        className="w-full text-left border-collapse table-auto"
                      >
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-mono text-slate-500 uppercase border-b border-brand-border tracking-wider">
                            <th className="py-4 px-5">Plant / Enterprise</th>
                            <th className="py-4 px-4">State & District</th>
                            <th className="py-4 px-4">Sector</th>
                            <th className="py-4 px-4">Clearance Detail</th>
                            <th className="py-4 px-4">Project Scope</th>
                            <th className="py-4 px-4">Compliance sales trigger (Why it matters)</th>
                            <th className="py-4 px-4 text-center">Opportunity Heat</th>
                            <th className="py-4 px-4 text-right w-[160px]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border font-sans text-[12px] text-brand-navy">
                          {filteredRadarItems.map(item => {
                            const isHigh = item.heat === 'High';
                            const isMedium = item.heat === 'Medium';
                            
                            return (
                              <tr 
                                key={item.id}
                                id={`approval-row-${item.id}`}
                                className={`group transition-all duration-150 hover:bg-slate-50/50 ${
                                  item.isLeadCreated ? 'bg-emerald-50/15' : ''
                                }`}
                              >
                                {/* Company Name */}
                                <td className="py-4.5 px-5">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-[13px] text-brand-navy group-hover:text-indigo-900 transition-colors duration-150">
                                      {item.company}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">ID: {item.id}</span>
                                  </div>
                                </td>

                                {/* State & District */}
                                <td className="py-4.5 px-4">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-slate-750">{item.state}</span>
                                      <span className="text-[10px] text-slate-400">{item.district}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Sector */}
                                <td className="py-4.5 px-4">
                                  <span className="inline-flex items-center bg-slate-100 text-slate-750 font-semibold px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wide">
                                    {item.industry}
                                  </span>
                                </td>

                                {/* Clearance Detail */}
                                <td className="py-4.5 px-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className={`text-[11px] font-mono font-bold ${
                                      item.approvalType === 'Environmental Clearance' ? 'text-indigo-600' :
                                      item.approvalType === 'Consent to Establish' ? 'text-blue-600' :
                                      item.approvalType === 'Consent to Operate' ? 'text-emerald-600' : 'text-amber-600'
                                    }`}>
                                      {item.approvalType}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">{item.approvalDate}</span>
                                  </div>
                                </td>

                                {/* Project Scope */}
                                <td className="py-4.5 px-4 font-medium text-slate-600 text-[11px]">
                                  {item.projectSize}
                                </td>

                                {/* Sales Trigger / Why it matters */}
                                <td className="py-4.5 px-4">
                                  <p className="text-[11px] text-indigo-950 font-medium italic border-l-2 border-indigo-200 pl-2 leading-relaxed max-w-sm">
                                    "{item.whyItMatters}"
                                  </p>
                                </td>

                                {/* Opportunity Heat */}
                                <td className="py-4.5 px-4 text-center">
                                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${
                                    isHigh 
                                      ? 'bg-rose-50 text-rose-700 border-rose-100' 
                                      : isMedium
                                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                                      : 'bg-slate-50 text-slate-700 border-slate-150'
                                  }`}>
                                    {item.heat}
                                  </span>
                                </td>

                                {/* Action button */}
                                <td className="py-4.5 px-4 text-right">
                                  {item.isLeadCreated ? (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 font-sans">
                                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                      <span>Lead Active</span>
                                    </span>
                                  ) : (
                                    <div className="relative h-8 flex items-center justify-end">
                                      <button
                                        id={`btn-create-lead-${item.id}`}
                                        onClick={() => handleCreateLead(item.id, item.company, item.approvalType)}
                                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] flex items-center gap-1.5 shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap hover:scale-102 animate-fade-in"
                                      >
                                        <Send className="w-3 h-3" />
                                        <span>Create Trigger Lead</span>
                                      </button>
                                      
                                      <span className="group-hover:hidden text-xs text-slate-400 font-medium transition-opacity duration-150 pr-2">
                                        Hover to act
                                      </span>
                                    </div>
                                  )}
                                </td>

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center space-y-3 bg-white">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
                        <Sliders className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-navy">No signals match criteria</h4>
                        <p className="text-xs text-brand-slate mt-1 max-w-md mx-auto">
                          Try clearing some filters or searching for another sector, state, or enterprise keyword to locate active opportunities.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setFilterState('All');
                          setFilterIndustry('All');
                          setFilterApprovalType('All');
                          setFilterDateRange('All');
                        }}
                        className="mt-2 text-xs bg-indigo-50 text-indigo-700 border border-indigo-150 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Sliding Toast Overlay container */}
                <AnimatePresence>
                  {radarToast && (
                    <motion.div
                      id="radar-trigger-toast"
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3.5 rounded-xl border border-slate-800 shadow-2xl max-w-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-xs font-bold font-sans text-slate-100">Trigger Lead Created</h4>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
                          Added to Outreach & Nurture with trigger context: <span className="font-semibold text-slate-200">{radarToast.message}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => setRadarToast(null)}
                        className="text-slate-500 hover:text-slate-300 ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* TAB 1: FIND LEADS (NEW DYNAMIC INTERFACE) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-left">
                
                {/* Left Criteria Filter Panel */}
                <div className="lg:col-span-4 bg-white border border-brand-border rounded-xl p-5 space-y-6 shadow-xs">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-650" />
                      Filter Criteria
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedPreset(null);
                          setSelectedGeographies(["Gujarat", "Maharashtra", "Rajasthan", "MP", "Tamil Nadu", "Telangana", "UP/NCR", "Odisha", "Chhattisgarh", "West Bengal", "Karnataka", "GCC", "SE Asia", "Africa", "South Asia"]);
                          setSelectedIndustries(["Thermal Power", "Cement", "Iron & Steel", "Oil Refinery", "Petrochemicals", "Pulp & Paper", "Sugar", "Distillery", "Food Processing", "Waste-to-Energy", "Municipal / Industrial Estate", "Dyes & Dye Intermediates", "Pharma", "Aluminium Smelter", "Copper Smelter", "Zinc Smelter", "Tannery", "Chemicals"]);
                          setSelectedProductFits(["OCEMS Stack Gas", "PM/Dust Monitor", "CAAQMS Station", "Safety Gas Detection", "Portable Analyzers"]);
                          setSelectedBuyingSignals(["New EC approval", "Consent to Operate", "Consent to Establish", "CPCB/SPCB direction", "Capacity expansion", "Tender published", "Website/IndiaMART enquiry", "Expo visitor"]);
                          setSelectedDecisionMakers(["EHS Head", "Plant Head", "Purchase Head", "Director/Owner"]);
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        Select All
                      </button>
                      {(selectedGeographies.length > 0 || selectedIndustries.length > 0 || selectedProductFits.length > 0 || selectedBuyingSignals.length > 0 || selectedDecisionMakers.length > 0) && (
                        <button
                          onClick={() => {
                            setSelectedPreset(null);
                            setSelectedGeographies([]);
                            setSelectedIndustries([]);
                            setSelectedProductFits([]);
                            setSelectedBuyingSignals([]);
                            setSelectedDecisionMakers([]);
                          }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                        >
                          Reset All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Geography states selection */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Target Geographies
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto border border-slate-100 p-2 rounded-lg bg-slate-50/55">
                      {["Gujarat", "Maharashtra", "Rajasthan", "MP", "Tamil Nadu", "Telangana", "UP/NCR", "Odisha", "Chhattisgarh", "West Bengal", "Karnataka", "GCC", "SE Asia", "Africa", "South Asia"].map(state => {
                        const isChecked = selectedGeographies.includes(state);
                        return (
                          <button
                            key={state}
                            onClick={() => {
                              setSelectedPreset(null);
                              setSelectedGeographies(prev => 
                                prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
                              );
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-350'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            <span>{state}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Industry multi-select */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Target Industries
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto border border-slate-100 p-2 rounded-lg bg-slate-50/55">
                      {["Thermal Power", "Cement", "Iron & Steel", "Oil Refinery", "Petrochemicals", "Pulp & Paper", "Sugar", "Distillery", "Food Processing", "Waste-to-Energy", "Municipal / Industrial Estate", "Dyes & Dye Intermediates", "Pharma", "Aluminium Smelter", "Copper Smelter", "Zinc Smelter", "Tannery", "Chemicals"].map(ind => {
                        const isChecked = selectedIndustries.includes(ind);
                        return (
                          <button
                            key={ind}
                            onClick={() => {
                              setSelectedPreset(null);
                              setSelectedIndustries(prev => 
                                prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
                              );
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-350'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            <span>{ind}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Product Fit multi-select */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Product Fit Scope
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto border border-slate-100 p-2 rounded-lg bg-slate-50/55">
                      {["OCEMS Stack Gas", "PM/Dust Monitor", "CAAQMS Station", "Safety Gas Detection", "Portable Analyzers"].map(prod => {
                        const isChecked = selectedProductFits.includes(prod);
                        return (
                          <button
                            key={prod}
                            onClick={() => {
                              setSelectedPreset(null);
                              setSelectedProductFits(prev => 
                                prev.includes(prod) ? prev.filter(p => p !== prod) : [...prev, prod]
                              );
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-355'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            <span>{prod}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buying Signals multi-select */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Buying Signals & Triggers
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto border border-slate-100 p-2 rounded-lg bg-slate-50/55">
                      {["New EC approval", "Consent to Operate", "Consent to Establish", "CPCB/SPCB direction", "Capacity expansion", "Tender published", "Website/IndiaMART enquiry", "Expo visitor"].map(sig => {
                        const isChecked = selectedBuyingSignals.includes(sig);
                        return (
                          <button
                            key={sig}
                            onClick={() => {
                              setSelectedPreset(null);
                              setSelectedBuyingSignals(prev => 
                                prev.includes(sig) ? prev.filter(s => s !== sig) : [...prev, sig]
                              );
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-355'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            <span>{sig}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decision Maker multi-select */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Decision Maker Target
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto border border-slate-100 p-2 rounded-lg bg-slate-50/55">
                      {["EHS Head", "Plant Head", "Purchase Head", "Director/Owner"].map(dm => {
                        const isChecked = selectedDecisionMakers.includes(dm);
                        return (
                          <button
                            key={dm}
                            onClick={() => {
                              setSelectedPreset(null);
                              setSelectedDecisionMakers(prev => 
                                prev.includes(dm) ? prev.filter(d => d !== dm) : [...prev, dm]
                              );
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-355'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            <span>{dm}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Find Leads Action Button */}
                  <div className="pt-2">
                    <button
                      id="btn-find-leads-action"
                      onClick={startFindingLeads}
                      disabled={isFindingLeadsLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 text-sm shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-55 animate-fade-in"
                    >
                      <Radar className="w-4 h-4 animate-pulse text-indigo-205" />
                      <span>Find Leads</span>
                    </button>
                  </div>

                </div>

                {/* Right Results & Visual Search Progress Column */}
                <div className="lg:col-span-8 bg-white border border-brand-border rounded-xl p-6 shadow-xs min-h-[640px] flex flex-col justify-between relative">
                  
                  {isFindingLeadsLoading ? (
                    /* SCANNING LOADER WINDOW */
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-12 max-w-md mx-auto text-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping scale-150 duration-1000 animate-pulse" />
                        <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-ping scale-200 duration-1500" />
                        <div className="w-20 h-20 bg-indigo-50 border border-indigo-150 rounded-2xl flex items-center justify-center relative z-10 shadow-inner">
                          <Radar className="w-10 h-10 text-indigo-600 animate-spin duration-3000" />
                        </div>
                      </div>

                      <div className="space-y-2 text-center w-full">
                        <h4 className="text-sm font-bold font-sans text-brand-navy">Scraping Compliances & Lead Database...</h4>
                        <div className="w-full bg-slate-100 border border-slate-200/80 h-2.5 rounded-full overflow-hidden relative">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-100 animate-pulse"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold pt-1">
                          <span>PROGRESS</span>
                          <span className="text-indigo-600">{progressWidth}% COMPLETE</span>
                        </div>
                      </div>

                      {/* Timeline steps */}
                      <div className="w-full space-y-3 pt-2 text-left">
                        {[
                          { step: 0, text: "Querying SPCB & Parivesh clearance databases..." },
                          { step: 1, text: "Scanning inbound B2B queries and IndiaMART portals..." },
                          { step: 2, text: "Matching technical product fits and compliance scopes..." },
                          { step: 3, text: "Synthesizing EHS decision-maker contact records..." }
                        ].map((s) => {
                          const isActive = leadFindingStep === s.step;
                          const isCompleted = leadFindingStep > s.step;
                          return (
                            <div 
                              key={s.step} 
                              className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                                isActive 
                                  ? 'text-indigo-700 font-bold translate-x-1' 
                                  : isCompleted 
                                  ? 'text-slate-500 font-medium' 
                                  : 'text-slate-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                isCompleted 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : isActive 
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-600 animate-pulse' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400'
                              }`}>
                                {isCompleted ? (
                                  <Check className="w-3 h-3 stroke-[3]" />
                                ) : (
                                  <span className="text-[10px] font-mono">{s.step + 1}</span>
                                )}
                              </div>
                              <span className="font-sans text-[12px]">{s.text}</span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ) : !showLeadResults ? (
                    /* EMPTY/GATED SCREEN (BEFORE SEARCH TRIPPED) */
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-16 text-center">
                      <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
                        <Database className="w-8 h-8" />
                      </div>
                      <div className="space-y-2 max-w-sm">
                        <h3 className="text-base font-bold text-brand-navy">Lead Bank Explorer</h3>
                        <p className="text-xs text-brand-slate font-medium leading-relaxed font-sans">
                          Configure your target market state boundaries, industry sectors, and triggers on the left, then click **Find Leads** to query our lead bank. No preview is displayed before querying.
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-xs font-semibold">
                        <Check className="w-4 h-4 text-indigo-500 animate-bounce" />
                        <span>Ready to query our lead database</span>
                      </div>
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    /* EMPTY RESULTS */
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-405 flex items-center justify-center">
                        <X className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-brand-navy">No Leads Match Filters</h4>
                        <p className="text-xs text-slate-400 max-w-xs leading-normal font-sans font-medium">
                          No matching records are registered under this strict combination of signals, states, or decision makers. Expand your criteria to pull records.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPreset(null);
                          setSelectedGeographies([]);
                          setSelectedIndustries([]);
                          setSelectedProductFits([]);
                          setSelectedBuyingSignals([]);
                          setSelectedDecisionMakers([]);
                        }}
                        className="text-xs bg-slate-100 text-slate-705 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors font-semibold cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (() => {
                    /* SPLIT RESULTS & DETAILS PANEL */
                    const activeLead = selectedLeadBrief || filteredLeads[0];

                    return (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                        
                        {/* Match List Selector */}
                        <div className="md:col-span-5 flex flex-col h-[580px] overflow-hidden pr-2">
                          <div className="flex items-center justify-between mb-3 shrink-0">
                            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                              MATCHES ({displayedLeadCount})
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold">
                              Ranked by ICP
                            </span>
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {filteredLeads.map((lead) => {
                              const isSelected = activeLead.id === lead.id;
                              return (
                                <button
                                  key={lead.id}
                                  onClick={() => setSelectedLeadBrief(lead)}
                                  className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col gap-2.5 cursor-pointer hover:scale-[1.01] ${
                                    isSelected
                                      ? 'bg-indigo-50/75 border-indigo-200 shadow-xs'
                                      : 'bg-white border-brand-border hover:bg-slate-50/60'
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-indigo-600" />
                                  )}
                                  
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-xs font-bold text-brand-navy font-sans tracking-wide leading-tight limit-lines-1">
                                      {lead.company}
                                    </h4>
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                      lead.icpScore >= 90
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                                    }`}>
                                      {lead.icpScore} ICP
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-sans text-brand-slate font-medium flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{lead.city}, {lead.state}</span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-mono font-semibold">
                                      {lead.industry}
                                    </span>
                                    <span className="text-[9px] bg-indigo-50/60 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-mono font-semibold limit-lines-1">
                                      {lead.productFit}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Inspector Detail Screen */}
                        <div className="md:col-span-7 border-l border-slate-100 pl-4 flex flex-col justify-between h-[580px] overflow-hidden">
                          
                          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                            
                            {/* Lead Corporate Profile Header */}
                            <div className="space-y-2 border-b border-slate-100 pb-4">
                              <div className="flex items-center gap-2">
                                <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                  {activeLead.industry} Profile
                                </span>
                                <span className="text-slate-400 text-xs font-mono">• Signal Date: {activeLead.signalDate}</span>
                              </div>
                              <h3 className="text-base font-display font-bold text-brand-navy leading-snug">
                                {activeLead.company}
                              </h3>
                              <p className="text-[11px] font-sans text-brand-slate font-medium flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                <span>{activeLead.city}, {activeLead.state} • Verified Plant Location</span>
                              </p>
                            </div>

                            {/* Compliance Signal & Trigger */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                Compliance Challenge & Trigger
                              </span>
                              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-700 leading-relaxed font-sans font-medium">
                                <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1.5">
                                  <Sparkles className="w-3.5 h-3.5 fill-indigo-100" />
                                  <span>{activeLead.buyingSignal}</span>
                                </div>
                                {activeLead.whyThisLead}
                              </div>
                            </div>

                            {/* Contacts & Sources */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                  Primary Target Contact
                                </span>
                                <div className="border border-slate-150 p-2.5 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-700">
                                  <User className="w-4 h-4 text-slate-400" />
                                  <span>{activeLead.decisionMaker}</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                  Intelligence Source
                                </span>
                                <div className="border border-slate-150 p-2.5 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-650 truncate">
                                  <Database className="w-4 h-4 text-indigo-500" />
                                  <span className="truncate">{activeLead.signalSource}</span>
                                </div>
                              </div>
                            </div>

                            {/* Generative First Touch Angle */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                Personalized First-Touch Angle (AI-Crafted)
                              </span>
                              <div className="bg-slate-950 text-slate-200 p-3.5 rounded-xl text-xs font-mono border border-slate-800 leading-relaxed max-h-[140px] overflow-y-auto whitespace-pre-wrap select-text selection:bg-emerald-500/30 selection:text-white">
                                {activeLead.firstTouchAngle}
                              </div>
                            </div>

                          </div>

                          {/* Trigger outreach action */}
                          <div className="pt-4 shrink-0 border-t border-slate-100">
                            <button
                              id="btn-route-to-nurture"
                              onClick={() => handleAddLeadToSequence(activeLead)}
                              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-150 text-xs cursor-pointer hover:scale-101 active:scale-99"
                            >
                              <Send className="w-3.5 h-3.5 text-brand-green" />
                              <span>Route to Nurture Sequence</span>
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })()}

                </div>

                {/* Sliding Toast for Lead Finder */}
                <AnimatePresence>
                  {leadFinderToast && (
                    <motion.div
                      id="lead-finder-toast"
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3.5 rounded-xl border border-slate-800 shadow-2xl max-w-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-xs font-bold font-sans text-slate-100">Lead Routed</h4>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
                          {leadFinderToast.message}
                        </p>
                      </div>
                      <button 
                        onClick={() => setLeadFinderToast(null)}
                        className="text-slate-500 hover:text-slate-300 ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </div>
        );
      })()}


      {/* 4. OUTREACH & NURTURE */}
      {viewName === 'Outreach & Nurture' && (() => {
        const selectedLead = nurtureLeads.find(l => l.id === selectedLeadId) || nurtureLeads[0];

        // Group categories as requested
        const groups = [
          { 
            name: 'Active in Sequence', 
            status: 'Active in Sequence' as const, 
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100' 
          },
          { 
            name: 'Replied — Needs Human', 
            status: 'Replied — Needs Human' as const, 
            badgeColor: 'bg-amber-50 text-amber-700 border-amber-100' 
          },
          { 
            name: 'Meeting Booked (sequence stopped)', 
            status: 'Meeting Booked' as const, 
            badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100 font-bold' 
          },
          { 
            name: 'Paused', 
            status: 'Paused' as const, 
            badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' 
          }
        ];

        // Vertical Stepper Steps configuration
        const getNurtureSteps = (lead: typeof selectedLead) => [
          {
            day: 0,
            type: 'Email' as const,
            label: "Day 0 • Email 1 (trigger-personalized)",
            subject: `CEMS Compliance Integration - ${lead.company}`,
            preview: lead.email1Draft || `Dear ${lead.contactPerson},\n\nI noticed that ${lead.company} recently received approvals regarding environmental clearances. Prima Equipment manufactures certified continuous emission monitoring systems (CEMS) designed to meet Indian regulatory standards.\n\nCould we schedule a quick call to discuss your stack specifications?\n\nBest regards,\nPrima Sales Team`,
            description: "Personalized introduction referencing the plant's recent regulatory consent or clearance."
          },
          {
            day: 3,
            type: 'WhatsApp' as const,
            label: "Day 3 • WhatsApp nudge",
            subject: "WhatsApp Message Template",
            preview: `Hello ${lead.contactPerson}, Nilesh here from Prima Equipment. Hope you had a chance to review my email regarding stack CEMS. I have shared our CPCB-compliant dust analyzer brochures via email. Let me know if you would like to arrange a survey call.`,
            description: "Friendly automated check-in with compliance files and technical specifications catalog."
          },
          {
            day: 7,
            type: 'Email' as const,
            label: "Day 7 • Email 2 (case study)",
            subject: "OCEMS Integration Case Study: Compliance at Gujarat Cement Plant",
            preview: `Dear ${lead.contactPerson},\n\nWe wanted to share our latest case study detailing a seamless continuous emission monitoring integration completed at a major 5000 TPD cement kiln in Gujarat in under 15 days.\n\nRead the study to see our emission feedback uptime specs.\n\nWarm regards,\nPrima Support`,
            description: "Educational case study highlighting successful SPCB connectivity."
          },
          {
            day: 12,
            type: 'Call' as const,
            label: "Day 12 • Call task for salesperson",
            subject: "Physical Qualification Call",
            preview: `Task Description: Call ${lead.contactPerson} at ${lead.phone} to qualify duct diameters, flue gas temperatures, particulate load metrics, and prepare draft proposals.`,
            description: "Manual phone outreach trigger dispatched to salesperson's field dashboard."
          },
          {
            day: 18,
            type: 'Email' as const,
            label: "Day 18 • Email 3 (senior engineer offer)",
            subject: "Complimentary Compliance Consultation Offer - CEMS Ducting",
            preview: `Dear ${lead.contactPerson},\n\nOur Chief Environmental Engineer will be visiting your industrial corridor next week. We would be pleased to offer a complimentary physical assessment of your stacks to ensure seamless CPCB integration.\n\nLet me know if you would like to schedule a slot.\n\nBest regards,\nEngineering Division, Prima`,
            description: "Consultative engineering offer to perform free stack layout site surveys."
          }
        ];

        const currentSteps = getNurtureSteps(selectedLead);

        // Predefined Quick templates for simulation
        const quickReplies = [
          "Yes, send us the catalog. Our CTO requires CEMS stack height of 40m.",
          "Can we schedule a call for Nilesh from Nilesh Consultants to discuss our chemical plant CEMS next Monday?",
          "Please share a quote for Mewar Super Cement, we have an immediate requirement for 2 PM stack analyzers."
        ];

        return (
          <div id="outreach-nurture-section" className="space-y-6 pb-12">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                  Nurture Automation Sequences
                </p>
                <h2 className="text-xl font-display font-bold text-brand-navy">
                  Active Outreach & Nurture Sequences
                </h2>
                <p className="text-xs text-brand-slate mt-1 font-sans">
                  Oversee the automated drip campaigns dispatching compliance catalogs and brochures to high-intent plant stakeholders.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-lg border border-brand-green/20 text-xs font-mono font-semibold shrink-0">
                <Radar className="w-4 h-4 animate-pulse" />
                <span>Sequence Engine Online</span>
              </div>
            </div>

            {/* Main Grid View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column - Leads List Grouped by State */}
              <div 
                id="outreach-left-column"
                className="lg:col-span-4 bg-white border border-brand-border rounded-xl p-5 space-y-6 shadow-xs max-h-[850px] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-brand-navy uppercase tracking-wider font-mono">
                    Nurture Leads ({nurtureLeads.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    4 States Tracked
                  </span>
                </div>

                <div className="space-y-5">
                  {groups.map(group => {
                    const groupLeads = nurtureLeads.filter(l => l.status === group.status);
                    
                    return (
                      <div key={group.name} className="space-y-2">
                        {/* Group Header Badge */}
                        <div className="flex items-center justify-between px-1">
                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${group.badgeColor}`}>
                            {group.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            {groupLeads.length}
                          </span>
                        </div>

                        {/* List of Leads in Group */}
                        <div className="space-y-2">
                          {groupLeads.length > 0 ? (
                            groupLeads.map(lead => {
                              const isSelected = lead.id === selectedLeadId;
                              const fromRadar = lead.source === 'Plant Approval Radar';
                              
                              return (
                                <div
                                  key={lead.id}
                                  id={`nurture-card-${lead.id}`}
                                  onClick={() => setSelectedLeadId(lead.id)}
                                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer relative overflow-hidden ${
                                    isSelected 
                                      ? 'bg-indigo-50/40 border-indigo-500 shadow-sm' 
                                      : 'bg-white border-brand-border hover:bg-slate-50/50'
                                  } ${
                                    lead.isFlashed ? 'animate-pulse border-emerald-500 bg-emerald-50/20' : ''
                                  }`}
                                >
                                  {/* Left selection bar accent */}
                                  {isSelected && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                  )}

                                  <div className="space-y-1.5">
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="text-xs font-bold text-brand-navy leading-tight">
                                        {lead.company}
                                      </h4>
                                      <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                                        fromRadar 
                                          ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                                      }`}>
                                        {lead.source === 'Plant Approval Radar' ? 'Approval Radar' : 'Enquiry'}
                                      </span>
                                    </div>

                                    <div className="space-y-0.5 text-[11px] text-slate-500">
                                      <div className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="font-medium text-slate-700">{lead.contactPerson}</span>
                                        <span className="text-[10px] text-slate-400 font-sans">({lead.designation})</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{lead.location}</span>
                                      </div>
                                    </div>

                                    {/* Trigger chip visible on lead card for Radar sources */}
                                    {fromRadar && lead.triggerContext && (
                                      <div className="mt-1 bg-amber-50/60 border border-amber-100/70 p-1.5 rounded text-[10px] text-amber-800 font-medium leading-normal flex items-start gap-1">
                                        <Sparkles className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                        <span>Trigger: {lead.triggerContext}</span>
                                      </div>
                                    )}

                                    {/* Small indicator of sequence progress */}
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-50">
                                      <span>Day {lead.currentStepIndex * 3 === 0 ? 0 : lead.currentStepIndex * 3 === 3 ? 3 : lead.currentStepIndex === 2 ? 7 : lead.currentStepIndex === 3 ? 12 : 18} Sequence Status</span>
                                      <span className="font-bold text-indigo-600">Step {lead.currentStepIndex + 1}/5</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-[10px] text-slate-400 text-center italic py-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                              No active leads in this group
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center Column - Stepper timeline */}
              <div 
                id="outreach-center-column"
                className="lg:col-span-5 bg-white border border-brand-border rounded-xl p-5 space-y-6 shadow-xs"
              >
                {/* Selected Lead Profile Strip */}
                <div className="bg-slate-50 border border-brand-border rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                      Sequence Focus Target
                    </span>
                    <h3 className="text-sm font-bold text-brand-navy">
                      {selectedLead.company}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans">
                      {selectedLead.contactPerson} • {selectedLead.designation} • {selectedLead.location}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-1 rounded-lg border uppercase font-bold shrink-0 ${
                    selectedLead.status === 'Active in Sequence' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    selectedLead.status === 'Replied — Needs Human' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                    selectedLead.status === 'Meeting Booked' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {selectedLead.status === 'Meeting Booked' ? 'Meeting Booked' : selectedLead.status}
                  </span>
                </div>

                {/* Banner: Stop Conditions */}
                <div 
                  id="stop-conditions-banner"
                  className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900 font-sans shadow-inner"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-amber-950">Sequence Auto-Stops When:</p>
                    <p className="text-amber-850 leading-relaxed text-[11px]">
                      Reply is received (immediately routed to human salesperson) OR when a meeting is booked (lead is moved to Meetings & Analytics).
                    </p>
                  </div>
                </div>

                {/* Stepper Vertical Timeline */}
                <div className="space-y-0 relative pl-6 border-l border-slate-200 ml-4 py-1">
                  {currentSteps.map((step, index) => {
                    const isCompleted = index < selectedLead.currentStepIndex;
                    const isCurrent = index === selectedLead.currentStepIndex && selectedLead.status === 'Active in Sequence';
                    const isFuture = index > selectedLead.currentStepIndex || selectedLead.status !== 'Active in Sequence';
                    
                    // Style indicators based on step status
                    const circleClass = isCompleted 
                      ? 'bg-emerald-500 text-white border-emerald-500' 
                      : isCurrent 
                      ? 'bg-amber-500 text-white border-amber-500 animate-pulse ring-4 ring-amber-100' 
                      : 'bg-white text-slate-400 border-slate-200';

                    const cardClass = isCompleted 
                      ? 'border-emerald-100 bg-emerald-50/15' 
                      : isCurrent 
                      ? 'border-amber-200 bg-amber-50/15 ring-2 ring-amber-50' 
                      : 'border-slate-200 bg-white opacity-85';

                    return (
                      <div key={index} className="relative mb-6 last:mb-0">
                        {/* Bullet Icon Left Anchor */}
                        <div 
                          className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 text-[10px] font-bold ${circleClass}`}
                        >
                          {isCompleted ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span>D{step.day}</span>
                          )}
                        </div>

                        {/* Step Card Details */}
                        <div className={`p-4 rounded-xl border text-left space-y-3 transition-all duration-150 ${cardClass}`}>
                          <div className="flex items-center justify-between border-b border-dashed border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              {step.type === 'Email' ? (
                                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                              ) : step.type === 'WhatsApp' ? (
                                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                              <span className="text-xs font-bold text-brand-navy font-display">
                                {step.label}
                              </span>
                            </div>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              isCompleted ? 'bg-emerald-100 text-emerald-800' :
                              isCurrent ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isCompleted ? 'Completed' : isCurrent ? 'Pulsing Active' : 'Future Queue'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                              Description & Goal:
                            </span>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                              {step.description}
                            </p>
                          </div>

                          {/* Email Body Draft Box */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                              {step.type === 'Email' ? 'Subject & Draft:' : 'Message Copy Preview:'}
                            </span>
                            <div className="font-mono text-[11px] p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-wrap max-h-44 overflow-y-auto font-medium leading-relaxed shadow-inner">
                              {step.type === 'Email' && (
                                <div className="border-b border-slate-200 pb-1.5 mb-1.5 text-slate-900 font-semibold">
                                  Subject: {step.subject}
                                </div>
                              )}
                              {step.preview}
                            </div>
                          </div>

                          {/* Action Buttons for Drafts */}
                          <div className="flex items-center justify-between pt-1">
                            <div>
                              {index === 0 && (
                                <button
                                  onClick={() => generateAIDraft(selectedLead)}
                                  disabled={isGeneratingEmail}
                                  className="bg-indigo-50 hover:bg-indigo-100 disabled:bg-slate-50 text-indigo-700 border border-indigo-200 rounded-lg py-1.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-all duration-150 disabled:opacity-50 cursor-pointer hover:scale-102"
                                >
                                  {isGeneratingEmail ? (
                                    <>
                                      <RotateCw className="w-3 h-3 animate-spin text-indigo-600" />
                                      <span>Gemini drafting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                                      <span>Generate Live AI Draft</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => alert("Draft edit state initialized. Custom values saved locally.")}
                                className="text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                              >
                                Edit Draft
                              </button>
                              <button
                                onClick={() => {
                                  alert("Sequence template approved and send scheduled successfully.");
                                  // Optionally nudge step forward
                                  if (isCurrent) {
                                    setNurtureLeads(prev => prev.map(l => {
                                      if (l.id === selectedLead.id) {
                                        return { ...l, currentStepIndex: Math.min(4, l.currentStepIndex + 1) };
                                      }
                                      return l;
                                    }));
                                  }
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer hover:scale-102 transition-all shadow-xs"
                              >
                                Approve & Send
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column - Reply Detection Panel & Mock Reply Trigger */}
              <div 
                id="outreach-right-column"
                className="lg:col-span-3 bg-white border border-brand-border rounded-xl p-5 space-y-6 shadow-xs"
              >
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-brand-navy uppercase tracking-wider font-mono block">
                    Automation Simulation Hub
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Trigger incoming plant responses to test routing.
                  </span>
                </div>

                {/* Predefined Quick replies templates */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                    Predefined Mock Templates:
                  </span>
                  <div className="flex flex-col gap-2">
                    {quickReplies.map((qr, qidx) => (
                      <button
                        key={qidx}
                        onClick={() => setSimulationText(qr)}
                        className="text-left text-[11px] p-2.5 rounded-lg border border-slate-150 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 text-slate-700 leading-normal transition-all text-ellipsis overflow-hidden whitespace-normal cursor-pointer"
                      >
                        "{qr}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulation input form */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                    Custom Simulated Reply:
                  </span>
                  <textarea
                    value={simulationText}
                    onChange={e => setSimulationText(e.target.value)}
                    placeholder="Type customized prospect reply here to trigger routing engine..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans min-h-[90px]"
                  />
                  <button
                    onClick={() => handleSimulateReply(selectedLead.id, simulationText)}
                    disabled={!simulationText.trim()}
                    className="w-full bg-slate-900 hover:bg-slate-950 disabled:bg-slate-100 disabled:text-slate-400 text-white py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed hover:scale-102"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simulate Incoming Reply</span>
                  </button>
                </div>

                {/* Real-time routing alert card */}
                {replyAlert && replyAlert.leadId === selectedLead.id ? (
                  <div 
                    id="reply-detection-alert-card"
                    className="bg-indigo-900 text-white rounded-xl border border-indigo-950 p-4 shadow-lg space-y-4 animate-bounce-short relative overflow-hidden"
                  >
                    {/* Pulsing red decorative indicator */}
                    <span className="absolute top-3 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Reply Detected Live</span>
                      </div>
                      <h4 className="text-xs font-bold font-display text-white">
                        Alert sent → Rutvij (Sales) + WhatsApp notification
                      </h4>
                      <p className="text-[11px] text-indigo-200 italic font-medium border-l border-indigo-400 pl-2 leading-relaxed">
                        "{replyAlert.replyText}"
                      </p>
                      <span className="text-[9px] font-mono text-indigo-300 block">
                        Received at: {replyAlert.timestamp}
                      </span>
                    </div>

                    {/* Routing Selector dropdown */}
                    <div className="space-y-1.5 pt-2 border-t border-indigo-800">
                      <label className="text-[9px] font-mono text-indigo-300 uppercase font-semibold block">
                        Direct Lead Router:
                      </label>
                      <select
                        value={routingRole}
                        onChange={e => {
                          setRoutingRole(e.target.value);
                          alert(`Lead routed directly to ${e.target.value}. Notification dispatched.`);
                        }}
                        className="w-full text-[11px] bg-indigo-950 text-white border border-indigo-800 p-2 rounded focus:outline-none font-sans font-medium"
                      >
                        <option value="Salesperson (Rutvij)">Salesperson (Rutvij)</option>
                        <option value="Service Team (Nilesh)">Service Team (Nilesh)</option>
                        <option value="Management Hub (Mr. Shah)">Management Hub (Mr. Shah)</option>
                      </select>
                    </div>

                    {/* Action buttons on alert */}
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => {
                          // Change status to Meeting Booked
                          setNurtureLeads(prev => prev.map(l => {
                            if (l.id === selectedLead.id) {
                              return { ...l, status: 'Meeting Booked' as const };
                            }
                            return l;
                          }));
                          // Clear alert
                          setReplyAlert(null);
                          alert("Meeting booked successfully! Sequence automatically terminated for " + selectedLead.company);
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Book Meeting & Stop Sequence</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setNurtureLeads(prev => prev.map(l => {
                              if (l.id === selectedLead.id) {
                                return { ...l, status: 'Paused' as const };
                              }
                              return l;
                            }));
                            setReplyAlert(null);
                            alert("Campaign sequence paused manually.");
                          }}
                          className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 py-1 px-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Force Pause
                        </button>
                        <button
                          onClick={() => setReplyAlert(null)}
                          className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 py-1 px-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Dismiss Alert
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 p-5 rounded-xl text-center text-slate-400 space-y-2">
                    <Clock className="w-7 h-7 mx-auto text-slate-300 animate-pulse" />
                    <p className="text-[11px] leading-normal font-sans italic">
                      Awaiting response telemetry. Try using the simulator above to trigger a reply and watch the real-time pipeline auto-stop in action!
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        );
      })()}


      {/* 5. MEETINGS & ANALYTICS */}
      {viewName === 'Meetings & Analytics' && (() => {
        const meetingsWeeklyData = [
          { week: "Wk 1", count: 4, dateRange: "July 01 - July 07", details: "3 Cement (Rajasthan), 1 Distillery (UP)" },
          { week: "Wk 2", count: 6, dateRange: "July 08 - July 14", details: "4 Chemical (Gujarat), 2 Steel (Odisha)" },
          { week: "Wk 3", count: 5, dateRange: "July 15 - July 21", details: "2 Sugar (UP), 3 Fertilizer (Gujarat)" },
          { week: "Wk 4", count: 8, dateRange: "July 22 - July 28", details: "5 Cement (MP), 2 Bulk Drugs (Gujarat), 1 Power" },
          { week: "Wk 5", count: 7, dateRange: "July 29 - Aug 04", details: "4 Paper (Odisha), 3 Chemical (Rajasthan)" },
          { week: "Wk 6", count: 9, dateRange: "Aug 05 - Aug 11", details: "6 Refinery (Gujarat), 2 Distillery (UP), 1 Steel" },
          { week: "Wk 7", count: 11, dateRange: "Aug 12 - Aug 18", details: "8 Cement (Rajasthan), 3 Bulk Drugs (Gujarat)" },
          { week: "Wk 8", count: 12, dateRange: "Aug 19 - Aug 25", details: "7 Petrochemical, 4 Power (Odisha), 1 Sugar" },
        ];

        const channelData = [
          { id: "chan-email", channel: "Email", count: 142, percentage: 38, icon: Mail, color: "bg-indigo-600", textColor: "text-indigo-600" },
          { id: "chan-indiamart", channel: "IndiaMART", count: 115, percentage: 31, icon: Inbox, color: "bg-blue-500", textColor: "text-blue-600" },
          { id: "chan-website", channel: "Website", count: 58, percentage: 16, icon: Globe, color: "bg-emerald-500", textColor: "text-emerald-600" },
          { id: "chan-expo", channel: "Expo Scans", count: 37, percentage: 10, icon: QrCode, color: "bg-purple-600", textColor: "text-purple-600" },
          { id: "chan-whatsapp", channel: "WhatsApp", count: 21, percentage: 5, icon: MessageSquare, color: "bg-teal-500", textColor: "text-teal-600" },
        ];

        const missingSpecs = [
          { 
            id: "spec-1", 
            name: "Stack Height & Diameter", 
            percentage: 89, 
            timeChasing: "4.2 hrs per deal", 
            resolution: "AI parsing extracts heights from SPCB NOC PDFs automatically, otherwise triggers automated templated reminders.", 
            icon: Sliders,
            color: "text-rose-600",
            bgColor: "bg-rose-50"
          },
          { 
            id: "spec-2", 
            name: "Compliance Driver / SPCB Mandate", 
            percentage: 76, 
            timeChasing: "3.5 hrs per deal", 
            resolution: "AI matches plant district with specific local state regulatory deadlines on record.", 
            icon: FileText,
            color: "text-amber-600",
            bgColor: "bg-amber-50"
          },
          { 
            id: "spec-3", 
            name: "Budget Stage & Purchase Timeline", 
            percentage: 68, 
            timeChasing: "2.8 hrs per deal", 
            resolution: "AI cross-references plant size/MW capacity to estimate budget sizing, qualifying high-intent prospects.", 
            icon: Activity,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50"
          },
          { 
            id: "spec-4", 
            name: "Flue Gas Temp & Particulate Load", 
            percentage: 55, 
            timeChasing: "2.1 hrs per deal", 
            resolution: "AI system automatically infers initial physical probe grade parameters based on industry sector norms.", 
            icon: Cpu,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
          },
          { 
            id: "spec-5", 
            name: "ZLD Flow Monitor Grid Layout", 
            percentage: 42, 
            timeChasing: "1.9 hrs per deal", 
            resolution: "Interactive grid web layout forms are delivered via automated WhatsApp to self-fill specs on a simple canvas.", 
            icon: Layers,
            color: "text-teal-600",
            bgColor: "bg-teal-50"
          },
        ];

        return (
          <div id="meetings-analytics-section" className="space-y-6 pb-12">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                  Sales Performance Dashboard
                </p>
                <h2 className="text-xl font-display font-bold text-brand-navy">
                  Meetings & Analytical Command Core
                </h2>
                <p className="text-xs text-brand-slate mt-1 font-sans">
                  Comprehensive performance metrics for continuous compliance pipeline conversions, automated follow-ups, and prospect qualifying speeds.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-mono font-bold shrink-0">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Q3 Fiscal Quota Tracking</span>
              </div>
            </div>

            {/* KPI ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Card 1 */}
              <div className="bg-white border border-brand-border p-4 rounded-xl shadow-xs space-y-2 text-left hover:border-indigo-300 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                    Meetings Booked
                  </span>
                  <div className="p-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-display font-black text-brand-navy">28</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    This Month <span className="text-emerald-600 font-bold font-mono">+34% MoM</span>
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-brand-border p-4 rounded-xl shadow-xs space-y-2 text-left hover:border-indigo-300 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                    Reply Rate
                  </span>
                  <div className="p-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-display font-black text-brand-navy">26.4%</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Industry Avg: <span className="font-bold font-mono">8.5%</span> (Manual)
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-brand-border p-4 rounded-xl shadow-xs space-y-2 text-left hover:border-indigo-300 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                    Avg Touches
                  </span>
                  <div className="p-1 rounded-lg bg-amber-50 border border-amber-100 text-amber-600">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-display font-black text-brand-navy">2.8</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Touches to book meeting
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-brand-border p-4 rounded-xl shadow-xs space-y-2 text-left hover:border-indigo-300 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                    Conv. Rate
                  </span>
                  <div className="p-1 rounded-lg bg-purple-50 border border-purple-100 text-purple-600">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-display font-black text-brand-navy">18.2%</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Enquiry → Meeting booked
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="bg-white border border-brand-border p-4 rounded-xl shadow-xs space-y-2 text-left hover:border-indigo-300 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider">
                    Avg Response Time
                  </span>
                  <div className="p-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                    <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-display font-black text-brand-navy">1.5m</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Real-time AI Outreach
                  </p>
                </div>
              </div>

            </div>

            {/* TWO LARGE GRIDS FOR CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Chart 1: Meetings booked per week (last 8 weeks) */}
              <div className="lg:col-span-7 bg-white p-6 border border-brand-border rounded-xl shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-brand-slate tracking-wider block">
                        Weekly Pipeline Outcomes
                      </span>
                      <h3 className="text-sm font-bold text-brand-navy">
                        Meetings Booked Per Week (Last 8 Weeks)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-semibold uppercase">
                      Green Accent Arc
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-slate mt-2">
                    Hover over any bar to view the specific geographic and industrial sectors of the booked CEMS meetings.
                  </p>
                </div>

                {/* Bars Container */}
                <div className="relative pt-6 px-2">
                  <div className="flex items-end justify-between h-48 border-b border-slate-100 pb-2 relative z-10">
                    {meetingsWeeklyData.map((item, idx) => {
                      const isHovered = hoveredWeek === idx;
                      const barHeight = (item.count / 12) * 100;

                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredWeek(idx)}
                          onMouseLeave={() => setHoveredWeek(null)}
                          className="flex flex-col items-center flex-1 group cursor-pointer h-full justify-end relative px-1 md:px-2"
                        >
                          {/* Pulsing glow behind the highest weeks */}
                          {item.count >= 10 && (
                            <div className="absolute bottom-2 w-full max-w-[28px] bg-emerald-100/30 rounded-t-md filter blur-xs -z-10" style={{ height: `${barHeight}%` }} />
                          )}

                          {/* The Bar */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${barHeight}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                            className={`w-full max-w-[28px] rounded-t-md transition-all duration-150 relative ${
                              isHovered 
                                ? "bg-emerald-600 shadow-md scale-105" 
                                : item.count >= 10 
                                ? "bg-emerald-500" 
                                : "bg-emerald-500/85"
                            }`}
                          >
                            {/* Inner structural light shine */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-md" />
                            
                            {/* Count Badge on Bar */}
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono text-brand-navy">
                              {item.count}
                            </span>
                          </motion.div>

                          {/* Week Label */}
                          <span className={`text-[10px] font-mono mt-2 font-bold transition-colors ${
                            isHovered ? "text-emerald-700" : "text-brand-slate"
                          }`}>
                            {item.week}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Horizontal Guide Lines */}
                  <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none -z-0">
                    <div className="border-b border-dashed border-slate-100 w-full" />
                    <div className="border-b border-dashed border-slate-100 w-full" />
                    <div className="border-b border-dashed border-slate-100 w-full" />
                    <div className="border-b border-dashed border-slate-100 w-full" />
                  </div>
                </div>

                {/* Live Hover Tooltip Panel */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-left h-16 flex items-center justify-between gap-3 overflow-hidden">
                  {hoveredWeek !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {meetingsWeeklyData[hoveredWeek].week} • {meetingsWeeklyData[hoveredWeek].dateRange}
                        </span>
                        <h4 className="text-xs font-semibold text-brand-navy">
                          {meetingsWeeklyData[hoveredWeek].details}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-emerald-600 font-mono">
                          {meetingsWeeklyData[hoveredWeek].count} Bookings
                        </p>
                        <p className="text-[9px] text-slate-400 font-mono">100% SPCB filing match</p>
                      </div>
                    </motion.div>
                  ) : (
                    <span className="text-xs text-slate-400 italic font-sans flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                      Hover over individual week bars to inspect live target breakdown.
                    </span>
                  )}
                </div>

              </div>

              {/* Chart 2: Enquiries by channel */}
              <div className="lg:col-span-5 bg-white p-6 border border-brand-border rounded-xl shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-brand-slate tracking-wider block">
                    Inbound Routing telemetry
                  </span>
                  <h3 className="text-sm font-bold text-brand-navy">
                    Enquiries by Channel Distribution
                  </h3>
                  <p className="text-[11px] text-brand-slate mt-2">
                    Click on any channel profile to review historical conversion quotas and responsive campaign weight rankings.
                  </p>
                </div>

                {/* Progress bars list */}
                <div className="space-y-4">
                  {channelData.map((item) => {
                    const isSelected = selectedChannel === item.id;
                    const IconComp = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedChannel(isSelected ? null : item.id)}
                        className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer text-left relative overflow-hidden ${
                          isSelected 
                            ? "bg-slate-50 border-slate-350 shadow-sm" 
                            : "bg-white border-transparent hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5 font-medium relative z-10">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${isSelected ? "bg-slate-200" : "bg-slate-50"}`}>
                              <IconComp className={`w-3.5 h-3.5 ${item.textColor}`} />
                            </div>
                            <span className="font-bold text-brand-navy">{item.channel}</span>
                          </div>
                          <div className="font-mono text-right flex items-center gap-2">
                            <span className="text-slate-500">{item.count} leads</span>
                            <span className={`font-bold ${item.textColor}`}>{item.percentage}%</span>
                          </div>
                        </div>

                        {/* Backing Meter */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative z-10 border border-slate-200">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`${item.color} h-full rounded-full`}
                          />
                        </div>

                        {/* Sub-text visible on active channel selection */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="text-[10px] text-slate-500 pt-2 mt-2 border-t border-slate-200 font-mono leading-relaxed"
                            >
                              Performance details: Automated pipeline responded to {item.count} {item.channel} leads in &lt;5 mins, locking in the spec sheets without human friction.
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[10px] text-center text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 font-sans italic">
                  * 72% of IndiaMART and Website leads contain incomplete clearance parameters.
                </div>

              </div>

            </div>

            {/* LOWER GRID: RANKING & CONTRACT PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Chart 3: "Most-missing spec" ranking */}
              <div className="lg:col-span-6 bg-white p-6 border border-brand-border rounded-xl shadow-xs space-y-5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-brand-slate tracking-wider block">
                    AI Spec Collector Productivity Value
                  </span>
                  <h3 className="text-sm font-bold text-brand-navy">
                    Most-Missing Specifications in Inbound Leads
                  </h3>
                  <p className="text-[11px] text-brand-slate mt-1.5">
                    Prospects rarely include these details in their first contact. The AI Spec Collector gathers these automatically, bypassing tedious manual telephone chasing.
                  </p>
                </div>

                {/* Ranking Items */}
                <div className="space-y-3">
                  {missingSpecs.map((item, idx) => {
                    const isExpanded = activeMissingSpec === item.id;
                    const SpecIcon = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveMissingSpec(isExpanded ? null : item.id)}
                        className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer text-left relative overflow-hidden ${
                          isExpanded 
                            ? "bg-slate-50 border-indigo-400 shadow-sm" 
                            : "bg-white border-brand-border hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              #0{idx + 1}
                            </span>
                            <div className={`p-1.5 rounded-lg ${item.bgColor} ${item.color}`}>
                              <SpecIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-brand-navy">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                                Chasing cost: <span className="font-semibold text-slate-700">{item.timeChasing}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                              {item.percentage}% Missing
                            </span>
                            <span className="text-[9px] block text-emerald-600 font-mono font-bold mt-1">
                              {item.timeChasing ? "Saved" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Collapsible Action Description */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="text-[11px] text-slate-600 pt-3 mt-3 border-t border-slate-200 leading-relaxed font-sans font-medium"
                            >
                              <p className="text-slate-800 font-semibold mb-1">How AI Collector saves this:</p>
                              {item.resolution}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-emerald-50/50 border border-emerald-150 p-3.5 rounded-xl text-xs text-emerald-900 leading-normal font-sans">
                  <div className="flex gap-2 items-start">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Efficiency multiplier:</strong> Continuous AI specification gathering saves approximately <strong>14.5 hours of sales team friction</strong> for every single enterprise CEMS deal.
                    </span>
                  </div>
                </div>

              </div>

              {/* Panel: "Expo leads follow-up discipline" */}
              <div className="lg:col-span-6 bg-white p-6 border border-brand-border rounded-xl shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-brand-slate tracking-wider block">
                    Case Study in Action
                  </span>
                  <h3 className="text-sm font-bold text-brand-navy">
                    Automation Expo 2026 Follow-up Discipline
                  </h3>
                  <p className="text-[11px] text-brand-slate mt-1.5">
                    A concrete comparative analysis showing how the integrated automated sequence prevents prospect lead leakage compared to historical manual trade show operations.
                  </p>
                </div>

                {/* Stats layout */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Metric 1 */}
                  <div className="bg-indigo-50/30 p-3.5 rounded-xl border border-indigo-100 space-y-1 text-left">
                    <span className="text-[10px] font-mono text-indigo-700 font-bold block uppercase tracking-wider">
                      Scanned Leads
                    </span>
                    <p className="text-2xl font-display font-black text-indigo-900">78</p>
                    <p className="text-[10px] text-slate-500">QR Code badge scans</p>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100 space-y-1 text-left">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold block uppercase tracking-wider">
                      In-sequence &lt;24h
                    </span>
                    <p className="text-2xl font-display font-black text-emerald-900">71</p>
                    <p className="text-[10px] text-slate-500">91% active sequence drip</p>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-amber-50/30 p-3.5 rounded-xl border border-amber-100 space-y-1 text-left">
                    <span className="text-[10px] font-mono text-amber-700 font-bold block uppercase tracking-wider">
                      Replied Stakeholders
                    </span>
                    <p className="text-2xl font-display font-black text-amber-900">22</p>
                    <p className="text-[10px] text-slate-500">31% active dialogue match</p>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-purple-50/30 p-3.5 rounded-xl border border-purple-100 space-y-1 text-left">
                    <span className="text-[10px] font-mono text-purple-700 font-bold block uppercase tracking-wider">
                      Meetings Booked
                    </span>
                    <p className="text-2xl font-display font-black text-purple-900">9</p>
                    <p className="text-[10px] text-slate-500">Scheduled in sales calendar</p>
                  </div>

                </div>

                {/* Contrast line */}
                <div 
                  id="expo-contrast-panel"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3.5"
                >
                  <div className="p-2 rounded-lg bg-slate-200 text-slate-600 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-left space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                      The Leakage Comparison
                    </h4>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                      <span className="text-rose-700 font-bold line-through">Before: expo cards sat in a drawer.</span> By the time sales reps manually initiated follow-up emails weeks later, clearance deadlines had already closed.
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono text-center">
                  * 24-hour SLA follow-up increased meeting conversion rate by 330%.
                </div>

              </div>

            </div>

          </div>
        );
      })()}

    </div>
  );
}
