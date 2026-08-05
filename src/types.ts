export interface FollowUpItem {
  id: string;
  company: string;
  productInterest: string;
  sequenceStep: string;
  owner: string;
  status: 'pending' | 'sent' | 'snoozed';
  location: string;
  industry: string;
}

export interface ReplyItem {
  id: string;
  company: string;
  channel: 'Email' | 'WhatsApp';
  snippet: string;
  alertSentTo: string;
  timeAgo: string;
  urgency: 'high' | 'medium';
}

export interface ApprovalTrigger {
  id: string;
  plantName: string;
  state: string;
  industry: string;
  approvalType: 'Environmental Clearance' | 'Consent to Establish' | 'Consent to Operate';
  dateTriggered: string;
  status: 'new' | 'converted' | 'ignored';
}

export interface TimelineEvent {
  time: string;
  event: string;
  type: 'system' | 'user' | 'ai';
}

export interface EnquiryItem {
  id: string;
  company: string;
  contactPerson: string;
  designation: string;
  location: string;
  product: string;
  status: 'New' | 'AI Collecting Specs' | 'Brief Ready' | 'Human Review' | 'Routed' | 'Spec Collector Pending' | 'Approved' | 'Quoted';
  dateReceived: string;
  details: string;

  // Rich Enquiry Inbox fields
  channel?: 'Email' | 'IndiaMART' | 'Website Form' | 'WhatsApp' | 'Expo Scan' | 'Phone';
  productInterestTag?: 'OCEMS' | 'CEMS' | 'CAAQMS' | 'Gas Detection' | 'Gas Analyzer' | 'Dew Point Meter';
  leadScore?: number; // 0 - 100
  specCompletenessCount?: number;
  totalSpecsCount?: number;
  timeAgo?: string;
  email?: string;
  phone?: string;
  providedSpecsList?: string[];
  missingSpecsList?: string[];
  suggestedOwner?: string;
  timeline?: TimelineEvent[];
}

export type SidebarView =
  | 'Dashboard'
  | 'Enquiry Inbox'
  | 'AI Spec Collector'
  | 'Lead Finder'
  | 'Outreach & Nurture'
  | 'Meetings & Analytics';
