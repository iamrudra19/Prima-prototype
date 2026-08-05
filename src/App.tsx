import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import PlaceholderView from './components/PlaceholderView';
import { SidebarView, FollowUpItem, ReplyItem, ApprovalTrigger, EnquiryItem } from './types';
import { 
  initialFollowUps, 
  initialReplies, 
  initialApprovals, 
  initialEnquiries 
} from './data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<SidebarView>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Real active state containers
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(initialFollowUps);
  const [replies, setReplies] = useState<ReplyItem[]>(initialReplies);
  const [approvals, setApprovals] = useState<ApprovalTrigger[]>(initialApprovals);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);

  const userEmail = "rudra.v1818@gmail.com";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-brand-bg text-brand-navy font-sans">
      
      {/* Dark Sidebar */}
      <Sidebar 
        currentView={currentView} 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onViewChange={(view) => {
          setCurrentView(view);
          setSearchQuery(''); // clear search context when navigating views
        }} 
      />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header bar */}
        <Header 
          currentView={currentView} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          userEmail={userEmail}
          onMenuToggle={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Dynamic content stage scroll container */}
        <main 
          id="main-stage"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-full"
            >
              {currentView === 'Dashboard' ? (
                <DashboardView 
                  followUps={followUps}
                  setFollowUps={setFollowUps}
                  replies={replies}
                  setReplies={setReplies}
                  approvals={approvals}
                  setApprovals={setApprovals}
                  enquiries={enquiries}
                  setEnquiries={setEnquiries}
                  searchQuery={searchQuery}
                />
              ) : (
                <PlaceholderView 
                  viewName={currentView}
                  enquiries={enquiries}
                  setEnquiries={setEnquiries}
                  approvals={approvals}
                  setApprovals={setApprovals}
                  searchQuery={searchQuery}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
