import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Radio, 
  Check, 
  X, 
  Send as SendIcon, 
  Plus, 
  Building2, 
  BadgeAlert, 
  User, 
  Briefcase,
  Layers,
  MapPin,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { FollowUpItem, ReplyItem, ApprovalTrigger, EnquiryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardViewProps {
  followUps: FollowUpItem[];
  setFollowUps: React.Dispatch<React.SetStateAction<FollowUpItem[]>>;
  replies: ReplyItem[];
  setReplies: React.Dispatch<React.SetStateAction<ReplyItem[]>>;
  approvals: ApprovalTrigger[];
  setApprovals: React.Dispatch<React.SetStateAction<ApprovalTrigger[]>>;
  enquiries: EnquiryItem[];
  setEnquiries: React.Dispatch<React.SetStateAction<EnquiryItem[]>>;
  searchQuery: string;
}

// Micro-component for counting up KPI values dynamically
function AnimatedKpiValue({ targetValue, suffix = "" }: { targetValue: number; suffix?: string }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const increment = targetValue / (duration / 16); // 60fps estimate

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCurrentValue(targetValue);
        clearInterval(timer);
      } else {
        setCurrentValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <span className="font-display text-3xl font-bold tracking-tight text-brand-navy">
      {currentValue}
      {suffix}
    </span>
  );
}

export default function DashboardView({
  followUps,
  setFollowUps,
  replies,
  setReplies,
  approvals,
  setApprovals,
  enquiries,
  setEnquiries,
  searchQuery
}: DashboardViewProps) {
  // Simulator State / Toast logs
  const [logs, setLogs] = useState<{ id: string; msg: string; type: 'success' | 'info' | 'warning' }[]>([]);
  
  // Dialog/modal states for interaction
  const [selectedReply, setSelectedReply] = useState<ReplyItem | null>(null);
  const [replyMessageText, setReplyMessageText] = useState('');
  const [activeApprovalToConvert, setActiveApprovalToConvert] = useState<ApprovalTrigger | null>(null);
  const [newLeadDetails, setNewLeadDetails] = useState({ contactPerson: '', phone: '', email: '', comments: '' });

  const addLog = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setLogs(prev => [{ id, msg, type }, ...prev].slice(0, 5));
    // Clear log after 4s
    setTimeout(() => {
      setLogs(prev => prev.filter(log => log.id !== id));
    }, 4000);
  };

  // Interactions: Follow-up actions
  const handleFollowUpAction = (id: string, action: 'send' | 'snooze') => {
    const item = followUps.find(f => f.id === id);
    if (!item) return;

    if (action === 'send') {
      setFollowUps(prev => prev.map(item => item.id === id ? { ...item, status: 'sent' } : item));
      addLog(`Dispatched Sequence: "${item.sequenceStep}" successfully sent to ${item.company}`, 'success');
    } else {
      setFollowUps(prev => prev.map(item => item.id === id ? { ...item, status: 'snoozed' } : item));
      addLog(`Snoozed follow-up for ${item.company} by 24 hours.`, 'info');
    }
  };

  // Interactions: Reply attention
  const handleOpenReplyDialog = (reply: ReplyItem) => {
    setSelectedReply(reply);
    setReplyMessageText(`Resending requested mcerts/calibration certificates for ${reply.company}. Attached are...`);
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReply) return;
    
    // Remove the reply from attention list on success
    setReplies(prev => prev.filter(r => r.id !== selectedReply.id));
    addLog(`Sent WhatsApp/Email reply to ${selectedReply.company} (Assigned salesperson alerted).`, 'success');
    setSelectedReply(null);
  };

  // Interactions: Plant Approvals Lead Generation
  const handleOpenConvertDialog = (approval: ApprovalTrigger) => {
    setActiveApprovalToConvert(approval);
    setNewLeadDetails({
      contactPerson: 'Mr. Pradeep Rawat',
      phone: '+91 98980 12345',
      email: `compliance@${approval.plantName.toLowerCase().replace(/\s+/g, '')}.com`,
      comments: `Lead auto-captured via state monitoring radar (${approval.approvalType} granted). Need to Pitch OCEMS/CEMS analyzers.`
    });
  };

  const handleConvertLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApprovalToConvert) return;

    // Remove or flag as converted
    setApprovals(prev => prev.map(app => app.id === activeApprovalToConvert.id ? { ...app, status: 'converted' } : app));
    
    // Add new record to Enquiry Inbox
    const newEnq: EnquiryItem = {
      id: `ENQ-AUTO-${Math.floor(100 + Math.random() * 900)}`,
      company: activeApprovalToConvert.plantName,
      contactPerson: newLeadDetails.contactPerson,
      designation: 'EHS & Regulatory Manager',
      location: `${activeApprovalToConvert.state}, India`,
      product: activeApprovalToConvert.industry === 'Cement' ? 'CEMS (SO2, NOx, Dust Analyzer)' : 'OCEMS (Effluent Quality Monitoring)',
      status: 'New',
      dateReceived: new Date().toISOString().split('T')[0],
      details: `${activeApprovalToConvert.approvalType} granted. Initial Notes: ${newLeadDetails.comments}`
    };

    setEnquiries(prev => [newEnq, ...prev]);
    addLog(`Successfully registered "${activeApprovalToConvert.plantName}" as active Enquiry in command center!`, 'success');
    setActiveApprovalToConvert(null);
  };

  // Filter components with query
  const query = searchQuery.toLowerCase();
  
  const filteredFollowUps = followUps.filter(f => 
    f.company.toLowerCase().includes(query) ||
    f.productInterest.toLowerCase().includes(query) ||
    f.owner.toLowerCase().includes(query) ||
    f.location.toLowerCase().includes(query)
  );

  const filteredReplies = replies.filter(r => 
    r.company.toLowerCase().includes(query) ||
    r.snippet.toLowerCase().includes(query) ||
    r.alertSentTo.toLowerCase().includes(query)
  );

  const filteredApprovals = approvals.filter(a => 
    a.plantName.toLowerCase().includes(query) ||
    a.state.toLowerCase().includes(query) ||
    a.industry.toLowerCase().includes(query) ||
    a.approvalType.toLowerCase().includes(query)
  );

  // Compute stats
  const pendingFollowCount = followUps.filter(f => f.status === 'pending').length;
  const convertedApprovalsCount = approvals.filter(a => a.status === 'converted').length;

  return (
    <div id="dashboard-view" className="space-y-8 pb-12">
      
      {/* Toast Alert logs (System Activity Logs) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`p-4 rounded-lg shadow-lg border text-xs font-mono flex items-center justify-between gap-4 ${
                log.type === 'success' 
                  ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200' 
                  : log.type === 'warning'
                    ? 'bg-red-950/95 border-red-500 text-red-200'
                    : 'bg-slate-900/95 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                <span>{log.msg}</span>
              </div>
              <button onClick={() => setLogs(prev => prev.filter(l => l.id !== log.id))} className="text-white hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* KPI row (5 cards) with design specs */}
      <div 
        id="kpi-container"
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        {/* KPI 1: New Enquiries Today */}
        <div className="bg-brand-card rounded-[12px] border border-brand-border p-5 hover:border-brand-green/40 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider mb-2">
            New Enquiries Today
          </p>
          <div className="flex items-baseline justify-between">
            <AnimatedKpiValue targetValue={12} />
            <span className="text-[10px] font-mono text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded font-semibold">
              +18% VS YEST
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-slate font-sans">
            <Layers className="w-3.5 h-3.5 text-brand-green" />
            <span>Vadodara Hub Priority</span>
          </div>
        </div>

        {/* KPI 2: Specs Incomplete */}
        <div className="bg-brand-card rounded-[12px] border border-brand-border p-5 hover:border-brand-amber/40 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider mb-2">
            Specs Incomplete
          </p>
          <div className="flex items-baseline justify-between">
            <AnimatedKpiValue targetValue={7} />
            <span className="text-[10px] font-mono text-brand-amber bg-brand-amber/10 px-1.5 py-0.5 rounded font-semibold">
              CRITICAL TASK
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-slate font-sans">
            <AlertTriangle className="w-3.5 h-3.5 text-brand-amber" />
            <span>Draft stack dimensions missing</span>
          </div>
        </div>

        {/* KPI 3: Plant-Approval Triggers */}
        <div className="bg-brand-card rounded-[12px] border border-brand-border p-5 hover:border-brand-green/40 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider mb-2">
            Plant-Approval Triggers
          </p>
          <div className="flex items-baseline justify-between">
            <AnimatedKpiValue targetValue={9} />
            <span className="text-[10px] font-mono text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded font-semibold">
              NEW RADAR
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-slate font-sans">
            <Radio className="w-3.5 h-3.5 text-brand-green animate-pulse" />
            <span>Consent database synced</span>
          </div>
        </div>

        {/* KPI 4: Meetings Booked */}
        <div className="bg-brand-card rounded-[12px] border border-brand-border p-5 hover:border-brand-green/40 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider mb-2">
            Meetings This Month
          </p>
          <div className="flex items-baseline justify-between">
            <AnimatedKpiValue targetValue={6} />
            <span className="text-[10px] font-mono text-brand-slate bg-brand-bg px-1.5 py-0.5 rounded font-semibold border border-brand-border">
              GOAL: 10
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-slate font-sans">
            <Clock className="w-3.5 h-3.5 text-brand-green" />
            <span>2 scheduled in UP belt</span>
          </div>
        </div>

        {/* KPI 5: Avg First Response */}
        <div className="bg-brand-card rounded-[12px] border border-brand-border p-5 hover:border-brand-green/40 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-wider mb-2">
            Avg First Response
          </p>
          <div className="flex items-baseline justify-between">
            <AnimatedKpiValue targetValue={38} suffix=" min" />
            <span className="text-[10px] font-mono text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded font-semibold">
              EXCELLENT
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-slate font-sans">
            <Check className="w-3.5 h-3.5 text-brand-green" />
            <span>CPCB compliance standard</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Follow-ups (Left) & Replies + Approvals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel "Follow-ups due today" - spans 7/12 cols */}
        <div 
          id="panel-followups"
          className="lg:col-span-7 bg-brand-card rounded-[12px] border border-brand-border shadow-[0_1px_4px_rgba(0,0,0,0.01)] flex flex-col"
        >
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-slate-50/50 rounded-t-[12px]">
            <div>
              <h2 className="font-display font-bold text-sm tracking-tight text-brand-navy uppercase">
                Follow-ups Due Today
              </h2>
              <p className="text-xs text-brand-slate mt-0.5 font-sans">
                Active automated nurture sequences requiring supervisor approval or instant execution
              </p>
            </div>
            <span className="text-xs font-mono font-semibold bg-brand-navy text-white px-2 py-0.5 rounded-md">
              {pendingFollowCount} Pending
            </span>
          </div>

          <div className="divide-y divide-brand-border overflow-hidden">
            {filteredFollowUps.length === 0 ? (
              <div className="p-12 text-center text-brand-slate font-sans text-xs">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No follow-ups match your criteria or all are completed.
              </div>
            ) : (
              filteredFollowUps.map((item) => (
                <div
                  key={item.id}
                  id={`followup-${item.id}`}
                  className="p-5 flex items-start justify-between gap-4 hover:bg-brand-bg/50 transition-all duration-200 group relative"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-brand-slate">
                        [{item.id}]
                      </span>
                      <h3 className="text-sm font-semibold text-brand-navy font-sans group-hover:text-brand-green transition-colors">
                        {item.company}
                      </h3>
                      <span className="text-[10px] font-mono bg-brand-bg px-2 py-0.5 rounded border border-brand-border text-brand-slate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-green" />
                        {item.location}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-700 font-sans">
                      {item.productInterest}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-brand-slate">
                      <span className="flex items-center gap-1 font-mono text-brand-amber">
                        <Layers className="w-3.5 h-3.5" />
                        {item.sequenceStep}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Owner: <strong className="text-slate-600">{item.owner}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions column - beautifully transitions on hover, persistent on touch devices */}
                  <div className="flex items-center gap-2 self-center shrink-0 min-w-[120px] justify-end">
                    {item.status === 'pending' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`btn-send-${item.id}`}
                          onClick={() => handleFollowUpAction(item.id, 'send')}
                          className="bg-brand-green hover:bg-emerald-700 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all duration-150 active:scale-95 shadow-sm font-sans cursor-pointer"
                        >
                          <SendIcon className="w-3 h-3" />
                          <span>Send</span>
                        </button>
                        <button
                          id={`btn-snooze-${item.id}`}
                          onClick={() => handleFollowUpAction(item.id, 'snooze')}
                          className="bg-brand-bg hover:bg-brand-border text-brand-slate hover:text-brand-navy text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-brand-border transition-all duration-150 active:scale-95 font-sans cursor-pointer"
                        >
                          Snooze
                        </button>
                      </div>
                    ) : item.status === 'sent' ? (
                      <span className="text-[11px] font-mono text-brand-green bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Sent
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-brand-slate bg-brand-bg px-2.5 py-1 rounded-md border border-brand-border flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Snoozed
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side Column (Replies + Triggers) - spans 5/12 cols */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Panel "Replies needing attention" (Red alert layout accent) */}
          <div 
            id="panel-replies"
            className="bg-brand-card rounded-[12px] border border-brand-red/30 shadow-[0_1px_4px_rgba(220,38,38,0.02)] flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-brand-red/20 bg-red-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                <h2 className="font-display font-bold text-sm tracking-tight text-brand-navy uppercase flex items-center gap-2">
                  Replies Needing Attention
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-red bg-red-100/50 px-2 py-0.5 rounded border border-brand-red/20 uppercase tracking-widest">
                Action Required
              </span>
            </div>

            <div className="divide-y divide-brand-border">
              {filteredReplies.length === 0 ? (
                <div className="p-8 text-center text-brand-slate font-sans text-xs">
                  <Check className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  All customer replies resolved. Perfect score!
                </div>
              ) : (
                filteredReplies.map((reply) => (
                  <div
                    key={reply.id}
                    id={`reply-${reply.id}`}
                    onClick={() => handleOpenReplyDialog(reply)}
                    className="p-5 hover:bg-red-50/10 cursor-pointer transition-all duration-200 group relative border-l-4 border-l-brand-red"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-brand-navy font-sans group-hover:text-brand-red transition-colors">
                        {reply.company}
                      </span>
                      <span className="text-[10px] font-mono text-brand-slate">
                        {reply.timeAgo}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 italic font-sans mb-3 line-clamp-2 bg-slate-50 p-2.5 rounded border border-brand-border/60">
                      "{reply.snippet}"
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        reply.channel === 'WhatsApp' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {reply.channel}
                      </span>

                      <span className="text-[10px] font-mono text-brand-navy bg-brand-amber/10 px-2 py-0.5 rounded border border-brand-amber/30 flex items-center gap-1 font-semibold">
                        <AlertTriangle className="w-3 h-3 text-brand-amber" />
                        Alert Sent: {reply.alertSentTo}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel "New approval triggers" (Green radar/leads accent) */}
          <div 
            id="panel-approvals"
            className="bg-brand-card rounded-[12px] border border-brand-border shadow-[0_1px_4px_rgba(0,0,0,0.01)] flex flex-col"
          >
            <div className="p-5 border-b border-brand-border flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="font-display font-bold text-sm tracking-tight text-brand-navy uppercase">
                  New Approval Triggers
                </h2>
                <p className="text-[11px] text-brand-slate mt-0.5">
                  State consent feeds auto-mapped for system installations
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded border border-brand-green/20">
                RADAR ACTIVE
              </span>
            </div>

            <div className="divide-y divide-brand-border">
              {filteredApprovals.length === 0 ? (
                <div className="p-8 text-center text-brand-slate font-sans text-xs">
                  No active consent radar logs in this category.
                </div>
              ) : (
                filteredApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    id={`approval-${approval.id}`}
                    className="p-5 hover:bg-brand-bg/40 transition-all duration-200 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {approval.industry}
                        </span>
                        <span className="text-[10px] font-mono text-brand-slate">
                          {approval.state}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-brand-navy font-sans">
                        {approval.plantName}
                      </h4>
                      <div className="text-[10px] text-brand-green font-mono flex items-center gap-1 font-semibold">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        {approval.approvalType} Granted
                      </div>
                    </div>

                    <div className="shrink-0">
                      {approval.status === 'new' ? (
                        <button
                          id={`btn-convert-${approval.id}`}
                          onClick={() => handleOpenConvertDialog(approval)}
                          className="bg-brand-navy hover:bg-brand-green hover:text-brand-navy text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-brand-navy hover:border-brand-green transition-all duration-150 font-sans cursor-pointer"
                        >
                          Create Lead
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-brand-green bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" /> Leads Created
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* QUICK REPLY DIALOG MODAL SIMULATOR */}
      {selectedReply && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl border border-brand-border max-w-lg w-full overflow-hidden"
          >
            <div className="p-5 border-b border-brand-border bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-green" />
                <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                  Reply Simulator — {selectedReply.company}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedReply(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendResponse} className="p-6 space-y-4">
              <div className="bg-brand-bg p-4 rounded-lg border border-brand-border space-y-2">
                <div className="flex items-center justify-between text-[11px] text-brand-slate font-mono">
                  <span>INCOMING MESSAGES VIA {selectedReply.channel.toUpperCase()}</span>
                  <span>{selectedReply.timeAgo}</span>
                </div>
                <p className="text-xs text-brand-navy italic">
                  "{selectedReply.snippet}"
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                  Select Quick Draft Templates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyMessageText(`Yes, we have TUV certificates for Prima CEMS. Please find the attached MCERTS certificate pack.`)}
                    className="p-2 text-left text-[11px] bg-brand-bg rounded border border-brand-border hover:border-brand-green hover:bg-brand-green/5 text-slate-700 transition-colors"
                  >
                    Attach Certificates Pack
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyMessageText(`Received CTO details. We can expedite the fabrication of the 2 stack probes in 10 working days.`)}
                    className="p-2 text-left text-[11px] bg-brand-bg rounded border border-brand-border hover:border-brand-green hover:bg-brand-green/5 text-slate-700 transition-colors"
                  >
                    Expedited Delivery Timelines
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                  Response Text Area
                </label>
                <textarea
                  value={replyMessageText}
                  onChange={(e) => setReplyMessageText(e.target.value)}
                  rows={4}
                  className="w-full text-xs p-3 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none bg-brand-bg text-brand-navy font-mono"
                  placeholder="Draft your professional reply here..."
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-brand-border text-[11px] font-mono text-brand-slate">
                <span>Alerting owner: <strong>{selectedReply.alertSentTo}</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReply(null)}
                    className="px-4 py-2 border border-brand-border rounded-lg text-slate-600 hover:bg-brand-bg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-green text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <SendIcon className="w-3.5 h-3.5" /> Dispatch Reply
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* CREATE LEAD DIALOG MODAL */}
      {activeApprovalToConvert && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl border border-brand-border max-w-lg w-full overflow-hidden"
          >
            <div className="p-5 border-b border-brand-border bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-green" />
                <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                  Convert Radar Signal to Enquiry
                </h3>
              </div>
              <button 
                onClick={() => setActiveApprovalToConvert(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConvertLead} className="p-6 space-y-4 font-sans">
              <div className="bg-brand-bg p-4 rounded-lg border border-brand-border space-y-1">
                <div className="text-[10px] font-mono text-brand-slate uppercase tracking-wider">
                  Trigger source (State Consent Feed)
                </div>
                <div className="text-xs font-bold text-brand-navy">
                  {activeApprovalToConvert.plantName} — {activeApprovalToConvert.state} ({activeApprovalToConvert.industry})
                </div>
                <div className="text-[11px] text-brand-green font-mono font-medium">
                  {activeApprovalToConvert.approvalType} granted. Compliance requirements active.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={newLeadDetails.contactPerson}
                    onChange={(e) => setNewLeadDetails(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={newLeadDetails.phone}
                    onChange={(e) => setNewLeadDetails(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newLeadDetails.email}
                  onChange={(e) => setNewLeadDetails(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                  Internal Strategy Comments
                </label>
                <textarea
                  value={newLeadDetails.comments}
                  onChange={(e) => setNewLeadDetails(prev => ({ ...prev, comments: e.target.value }))}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none font-mono text-[11px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setActiveApprovalToConvert(null)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-slate-600 hover:bg-brand-bg text-xs"
                >
                  Dismiss Signal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-green hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Register & Map to Owner
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
