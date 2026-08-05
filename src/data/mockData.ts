import { FollowUpItem, ReplyItem, ApprovalTrigger, EnquiryItem } from '../types';

export const initialFollowUps: FollowUpItem[] = [
  {
    id: "FU-4029",
    company: "Marwar Cement Ltd.",
    productInterest: "OCEMS retrofit — 2 stacks (SO2, NOx, CO, PM)",
    sequenceStep: "Email 2 of 5 (Spec Sheet Follow-up)",
    owner: "Ramesh Patel",
    status: 'pending',
    location: "Beawar, Rajasthan",
    industry: "Cement"
  },
  {
    id: "FU-4030",
    company: "Ankleshwar Organics Pvt. Ltd.",
    productInterest: "VOC Analyzer & Gas Detection System (PID-based)",
    sequenceStep: "Email 1 of 3 (Introductory proposal)",
    owner: "Neha Sharma",
    status: 'pending',
    location: "Ankleshwar, Gujarat",
    industry: "Pharma"
  },
  {
    id: "FU-4031",
    company: "Ganga Distilleries & Breweries",
    productInterest: "OCEMS for effluent flow & COD/BOD/TSS monitoring",
    sequenceStep: "WhatsApp Sequence — Step 4",
    owner: "Sanjay Mishra",
    status: 'pending',
    location: "Rampur, Uttar Pradesh",
    industry: "Distillery"
  },
  {
    id: "FU-4032",
    company: "Kalinga Alloy & Steel Corp.",
    productInterest: "CAAQMS Station (PM10, PM2.5, SO2, NOx, CO, O3)",
    sequenceStep: "Email 3 of 5 (Site readiness checklist)",
    owner: "Vikram Sen",
    status: 'pending',
    location: "Angul, Odisha",
    industry: "Steel"
  },
  {
    id: "FU-4033",
    company: "Sahyadri Waste-to-Energy Ltd.",
    productInterest: "Multi-Gas FTIR Analyzer System (HCl, HF, CO, SO2)",
    sequenceStep: "Email 2 of 4 (Case study distribution)",
    owner: "Neha Sharma",
    status: 'pending',
    location: "Solapur, Maharashtra",
    industry: "Waste-to-Energy"
  }
];

export const initialReplies: ReplyItem[] = [
  {
    id: "RP-801",
    company: "Aravali Portland Cement",
    channel: "WhatsApp",
    snippet: "We need the CEMS certified by TUV or MCERTS. Can you send the certificate copies by tomorrow 4 PM?",
    alertSentTo: "Ramesh Patel",
    timeAgo: "14m ago",
    urgency: "high"
  },
  {
    id: "RP-802",
    company: "Shree Balaji Chemical Industries",
    channel: "Email",
    snippet: "Our CTO (Consent to Operate) is expiring in 45 days. Please update the quotation with immediate delivery timelines.",
    alertSentTo: "Neha Sharma",
    timeAgo: "1h 05m ago",
    urgency: "high"
  },
  {
    id: "RP-803",
    company: "Narmada Lifesciences Ltd.",
    channel: "Email",
    snippet: "The stack height is 32 meters. Do you supply the laser-based opacity monitor with automatic purge system?",
    alertSentTo: "Sanjay Mishra",
    timeAgo: "2h 45m ago",
    urgency: "medium"
  }
];

export const initialApprovals: ApprovalTrigger[] = [
  {
    id: "AP-901",
    plantName: "Mewar Super Cement expansion",
    state: "Rajasthan",
    industry: "Cement",
    approvalType: "Environmental Clearance",
    dateTriggered: "2026-07-28",
    status: "new"
  },
  {
    id: "AP-902",
    plantName: "Ankleshwar Bulk Drugs Phase II",
    state: "Gujarat",
    industry: "Pharma",
    approvalType: "Consent to Establish",
    dateTriggered: "2026-07-29",
    status: "new"
  },
  {
    id: "AP-903",
    plantName: "Avadh Bio-fuels & Distillery",
    state: "Uttar Pradesh",
    industry: "Distillery",
    approvalType: "Consent to Operate",
    dateTriggered: "2026-07-29",
    status: "new"
  },
  {
    id: "AP-904",
    plantName: "Utkal Integrated Steel Plant",
    state: "Odisha",
    industry: "Steel",
    approvalType: "Environmental Clearance",
    dateTriggered: "2026-07-30",
    status: "new"
  }
];

export const initialEnquiries: EnquiryItem[] = [
  {
    id: "ENQ-201",
    company: "Shree Digvijay Cement Ltd.",
    contactPerson: "Mr. Rajendra Prasad",
    designation: "EHS Director",
    location: "Sikka, Gujarat",
    product: "OCEMS Retrofit (2 Kilns)",
    status: "New",
    channel: "Email",
    productInterestTag: "OCEMS",
    leadScore: 88,
    specCompletenessCount: 5,
    totalSpecsCount: 7,
    timeAgo: "10m ago",
    dateReceived: "2026-07-30",
    email: "r.prasad@digvijaycement.co.in",
    phone: "+91 94270 54123",
    details: "Requires continuous emission monitoring system (OCEMS) for 2 new rotary kilns to meet the latest CPCB particulate and gaseous standards. Standard stack height is 55m and flue gas temperature is around 210°C.",
    providedSpecsList: ["Stack height: 55m", "Temperature: 210°C", "Kilns: 2 units", "Gases: PM, SO2, NOx", "CPCB connectivity"],
    missingSpecsList: ["Flue gas velocity", "Moisture content"],
    suggestedOwner: "Ramesh Patel",
    timeline: [
      { time: "10m ago", event: "Enquiry received via direct corporate email", type: "system" },
      { time: "9m ago", event: "AI parser extracted 5 stack parameters", type: "ai" }
    ]
  },
  {
    id: "ENQ-202",
    company: "Lupin Pharmaceuticals",
    contactPerson: "Dr. Sandeep Jha",
    designation: "EHS Lead Officer",
    location: "Ankleshwar GIDC, Gujarat",
    product: "CAAQMS Station Package",
    status: "AI Collecting Specs",
    channel: "Website Form",
    productInterestTag: "CAAQMS",
    leadScore: 78,
    specCompletenessCount: 4,
    totalSpecsCount: 7,
    timeAgo: "42m ago",
    dateReceived: "2026-07-30",
    email: "sandeep.jha@lupin.com",
    phone: "+91 98251 11445",
    details: "Requesting budgetary quote for a complete Continuous Ambient Air Quality Monitoring System (CAAQMS) container station inside GIDC chemical cluster. Must monitor PM10, PM2.5, SO2, CO, Ozone, and NOx with digital display board.",
    providedSpecsList: ["Parameters: PM10/PM2.5/SO2/CO/O3/NOx", "Display board required", "Cabinet/Container system", "Ankleshwar location"],
    missingSpecsList: ["Shelter size specifications", "Power grid stability", "Data transmission protocol"],
    suggestedOwner: "Neha Sharma",
    timeline: [
      { time: "42m ago", event: "Web form submission registered", type: "system" },
      { time: "40m ago", event: "Automated response sent with CAAQMS catalogue", type: "ai" }
    ]
  },
  {
    id: "ENQ-203",
    company: "Awadh Sugar & Distilleries Ltd.",
    contactPerson: "Mr. Vivek Saxena",
    designation: "General Manager - Utility",
    location: "Seohara, Uttar Pradesh",
    product: "CEMS for 45 TPH Boiler",
    status: "Brief Ready",
    channel: "WhatsApp",
    productInterestTag: "CEMS",
    leadScore: 92,
    specCompletenessCount: 7,
    totalSpecsCount: 7,
    timeAgo: "1h ago",
    dateReceived: "2026-07-30",
    email: "v.saxena@awadhsugar.com",
    phone: "+91 88531 20980",
    details: "Urgent requirements. Need SO2/NOx/PM monitoring instrumentation for a new 45 TPH multi-fuel boiler stack. Circular stack, diameter 2.2 meters at sampling point. Height 40m. Flue gas contains heavy moisture.",
    providedSpecsList: ["Stack diameter: 2.2m", "Stack height: 40m", "Flue gas: wet", "Boiler capacity: 45 TPH", "Gases: PM, SO2, NOx", "Circular stack geometry", "Moisture resistant probes"],
    missingSpecsList: [],
    suggestedOwner: "Sanjay Mishra",
    timeline: [
      { time: "1h ago", event: "WhatsApp enquiry initiated by GM Utility", type: "user" },
      { time: "55m ago", event: "AI Spec Collector auto-filled all 7 physical metrics", type: "ai" },
      { time: "50m ago", event: "System compiled Brief: READY FOR QUOTE", type: "system" }
    ]
  },
  {
    id: "ENQ-204",
    company: "Hindustan Petrochemicals (HPCL)",
    contactPerson: "Mr. Amit Shahani",
    designation: "Senior Instrument Engineer",
    location: "Mumbai, Maharashtra",
    product: "Gas Detection Grid",
    status: "Human Review",
    channel: "Expo Scan",
    productInterestTag: "Gas Detection",
    leadScore: 65,
    specCompletenessCount: 2,
    totalSpecsCount: 7,
    timeAgo: "2h ago",
    dateReceived: "2026-07-30",
    email: "ashahani@hpcl.co.in",
    phone: "+91 91672 90812",
    details: "Scanned at Automation Expo 2026 Mumbai (Booth D12). Business card captured. Verbal request: Needs replacement of toxic and combustible gas sensors around crude storage refinery tanks.",
    providedSpecsList: ["Crude oil storage environment", "Combustible/Toxic gas focus"],
    missingSpecsList: ["Specific gases (H2S/LEL/CO)", "Total sensor nodes", "Hazardous area zoning class", "Output protocols (4-20mA/HART)", "Controller channel count", "Make preference", "Mounting type"],
    suggestedOwner: "Vikram Sen",
    timeline: [
      { time: "2h ago", event: "Badge scanned at Automation Expo 2026, Mumbai", type: "system" },
      { time: "1h 45m ago", event: "Business card OCR parsed successfully", type: "ai" }
    ]
  },
  {
    id: "ENQ-205",
    company: "Vanguard Controls & Automation",
    contactPerson: "Mr. Hardik Patel",
    designation: "Proprietor",
    location: "Surat, Gujarat",
    product: "Dew Point Transmitter dealer pricing",
    status: "Routed",
    channel: "IndiaMART",
    productInterestTag: "Dew Point Meter",
    leadScore: 18,
    specCompletenessCount: 1,
    totalSpecsCount: 7,
    timeAgo: "3h ago",
    dateReceived: "2026-07-30",
    email: "vanguardcontrols@gmail.com",
    phone: "+91 99791 23098",
    details: "Reseller - qualify. Looking for dealer pricing for 10 units of portable Dew Point Meters. Please quote maximum possible reseller discount. End-user details not disclosed.",
    providedSpecsList: ["Quantity: 10 units"],
    missingSpecsList: ["End-user industry", "Application parameters", "Gas pressure limits", "Expected moisture range", "Power source", "ATEX Certification", "Accuracy tolerance"],
    suggestedOwner: "Neha Sharma",
    timeline: [
      { time: "3h ago", event: "Inquiry imported from IndiaMART", type: "system" },
      { time: "2h 50m ago", event: "AI flagged as low-score RESELLER. Assigned lowest priority.", type: "ai" }
    ]
  },
  {
    id: "ENQ-206",
    company: "Kalinga Ispat & Power",
    contactPerson: "Mr. Debashish Mahapatra",
    designation: "EHS Manager",
    location: "Jharsuguda, Odisha",
    product: "Sinter Plant Gaseous CEMS",
    status: "New",
    channel: "Phone",
    productInterestTag: "CEMS",
    leadScore: 85,
    specCompletenessCount: 4,
    totalSpecsCount: 7,
    timeAgo: "4h ago",
    dateReceived: "2026-07-30",
    email: "d.mahapatra@kalingaispat.com",
    phone: "+91 70081 90245",
    details: "Inbound call. Wants to install an online gaseous emission analyzer system for a newly commissioned sinter plant. Gases to monitor: SO2, CO, CO2, NOx, and Oxygen. Stack height is 45m. Connection to OSPCB server is mandatory.",
    providedSpecsList: ["Stack height: 45m", "Gases: SO2, CO, CO2, NOx, O2", "OSPCB connection", "Sinter plant application"],
    missingSpecsList: ["Flue temperature", "Dust concentration", "Stack inner diameter"],
    suggestedOwner: "Vikram Sen",
    timeline: [
      { time: "4h ago", event: "Inbound call logged by Frontdesk", type: "user" },
      { time: "3h 50m ago", event: "Call notes parsed & converted to enquiry record", type: "system" }
    ]
  },
  {
    id: "ENQ-207",
    company: "Narmada Chlorine Derivatives Ltd.",
    contactPerson: "Mr. Prakash Trivedi",
    designation: "EHS Vice President",
    location: "Bharuch, Gujarat",
    product: "Multi-point Cl2 Gas Detectors",
    status: "AI Collecting Specs",
    channel: "Email",
    productInterestTag: "Gas Detection",
    leadScore: 80,
    specCompletenessCount: 3,
    totalSpecsCount: 7,
    timeAgo: "5h ago",
    dateReceived: "2026-07-30",
    email: "p.trivedi@narmadachlorine.com",
    phone: "+91 98240 67123",
    details: "Our current chlorine alarm panel is malfunctioning. We need to install a certified 16-channel gas detection grid with electrochemical sensors for Chlorine leaks in the bottling plant.",
    providedSpecsList: ["Gases: Cl2", "Channels: 16", "Sensor type: Electrochemical"],
    missingSpecsList: ["Zoning approval classification", "Cable length requirements", "Beacon/Hooter specifications", "Power backups"],
    suggestedOwner: "Ramesh Patel",
    timeline: [
      { time: "5h ago", event: "Urgent email enquiry logged", type: "system" }
    ]
  },
  {
    id: "ENQ-208",
    company: "Solapur Waste Solutions",
    contactPerson: "Mrs. Pallavi Deshmukh",
    designation: "EHS Head",
    location: "Solapur, Maharashtra",
    product: "FTIR Multi-Gas Analyzer (HCl, HF)",
    status: "Brief Ready",
    channel: "Website Form",
    productInterestTag: "Gas Analyzer",
    leadScore: 95,
    specCompletenessCount: 6,
    totalSpecsCount: 7,
    timeAgo: "1d ago",
    dateReceived: "2026-07-29",
    email: "p.deshmukh@solapurwaste.in",
    phone: "+91 93221 44556",
    details: "Waste-to-energy incinerator. CPCB norms mandate continuous monitoring of corrosive gases like Hydrogen Chloride (HCl) and Hydrogen Fluoride (HF), along with standard SO2, NOx, CO, and PM. Wet scrubbed gas, temp 75°C. Stainless steel stack, diameter 1.5m.",
    providedSpecsList: ["Stack diameter: 1.5m", "Incinerator application", "Temp: 75°C (Wet gas)", "Parameters: HCl, HF, SO2, NOx, CO, PM", "Stack material: Stainless steel", "CPCB compliance"],
    missingSpecsList: ["Gas velocity profile"],
    suggestedOwner: "Neha Sharma",
    timeline: [
      { time: "1d ago", event: "Web enquiry received with PDF document upload", type: "system" },
      { time: "23h ago", event: "AI extracted detailed chemical stack specifications", type: "ai" }
    ]
  },
  {
    id: "ENQ-209",
    company: "Chambal Fertilizers & Chemicals",
    contactPerson: "Mr. S. K. Dwivedi",
    designation: "EHS Manager",
    location: "Kota, Rajasthan",
    product: "Ambient Ammonia Gas Detection Grid",
    status: "Human Review",
    channel: "Phone",
    productInterestTag: "Gas Detection",
    leadScore: 74,
    specCompletenessCount: 4,
    totalSpecsCount: 7,
    timeAgo: "1d ago",
    dateReceived: "2026-07-29",
    email: "skdwivedi@chambalfert.com",
    phone: "+91 94140 12345",
    details: "Looking to deploy 8 explosion-proof Ammonia (NH3) gas sensors around our synthesis storage unit. Must have RS485 Modbus output to interface with our central PLC system. Safe area monitor panel with relays.",
    providedSpecsList: ["Gases: NH3", "Quantity: 8 units", "Explosion-proof housing", "Output: RS485 Modbus"],
    missingSpecsList: ["Zoning standard (Ex d IIC T6)", "Enclosure IP rating", "Display required on sensor head"],
    suggestedOwner: "Ramesh Patel",
    timeline: [
      { time: "1d ago", event: "Phone call inquiry logged in central CRM", type: "system" }
    ]
  },
  {
    id: "ENQ-210",
    company: "Zydus Lifesciences Ltd.",
    contactPerson: "Mr. Hemant Patel",
    designation: "EHS Officer",
    location: "Vadodara, Gujarat",
    product: "VOC Gas Analyzer System",
    status: "Routed",
    channel: "WhatsApp",
    productInterestTag: "Gas Analyzer",
    leadScore: 82,
    specCompletenessCount: 6,
    totalSpecsCount: 7,
    timeAgo: "2d ago",
    dateReceived: "2026-07-28",
    email: "hemant.patel@zyduslife.com",
    phone: "+91 99242 88122",
    details: "Need continuous VOC analyzer utilizing Flame Ionization Detector (FID) for solvent storage vents. Operating environment is highly hazardous Zone 1. Power input is 230V AC. Flow rate 1.2 LPM.",
    providedSpecsList: ["Sensor: FID detector", "Environment: Zone 1 hazardous", "Voltage: 230V AC", "Flow rate: 1.2 LPM", "Application: Solvent vent", "Location: Vadodara"],
    missingSpecsList: ["Expected VOC concentration range"],
    suggestedOwner: "Neha Sharma",
    timeline: [
      { time: "2d ago", event: "WhatsApp query received", type: "user" },
      { time: "2d ago", event: "Assigned directly to local Vadodara lead: Neha Sharma", type: "system" }
    ]
  },
  {
    id: "ENQ-211",
    company: "Century Pulp & Paper",
    contactPerson: "Mr. Alok Singhal",
    designation: "VP Technical Services",
    location: "Lalkuan, Uttarakhand",
    product: "CEMS for recovery boiler stack",
    status: "New",
    channel: "IndiaMART",
    productInterestTag: "CEMS",
    leadScore: 71,
    specCompletenessCount: 3,
    totalSpecsCount: 7,
    timeAgo: "2d ago",
    dateReceived: "2026-07-28",
    email: "asinghal@century-paper.co.in",
    phone: "+91 97190 44550",
    details: "Inquiry via IndiaMART. Requires Continuous Emission Monitoring System (CEMS) for chemical recovery boiler. Key gas parameters: Hydrogen Sulphide (H2S), Carbon Monoxide (CO), SO2, and Particulate Matter. Connection to CPCB/UKPCB servers.",
    providedSpecsList: ["Gases: H2S, CO, SO2, PM", "Recovery boiler stack", "Server upload: CPCB/UKPCB"],
    missingSpecsList: ["Stack diameter", "Stack temperature", "Dust concentration", "Access platform height"],
    suggestedOwner: "Sanjay Mishra",
    timeline: [
      { time: "2d ago", event: "IndiaMART lead auto-synced", type: "system" }
    ]
  },
  {
    id: "ENQ-212",
    company: "Techno-Commercial Agency",
    contactPerson: "Mr. Subhash Shah",
    designation: "Managing Partner",
    location: "Kolkata, West Bengal",
    product: "Reseller pricing for analyzers",
    status: "Routed",
    channel: "IndiaMART",
    productInterestTag: "Dew Point Meter",
    leadScore: 12,
    specCompletenessCount: 0,
    totalSpecsCount: 7,
    timeAgo: "3d ago",
    dateReceived: "2026-07-27",
    email: "technocommercial@rediffmail.com",
    phone: "+91 93310 99881",
    details: "Reseller — qualify. Looking for very low OEM rates for portable moisture analyzers and dew point sensors to pitch to private chemical traders in East India. We do not provide end-client project files.",
    providedSpecsList: [],
    missingSpecsList: ["All technical specifications missing"],
    suggestedOwner: "Vikram Sen",
    timeline: [
      { time: "3d ago", event: "IndiaMART reseller entry registered", type: "system" },
      { time: "3d ago", event: "Categorized as low qualification rank (no end-user metadata)", type: "ai" }
    ]
  }
];
