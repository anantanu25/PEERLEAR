import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { BookingModal } from './components/layout/BookingModal';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/ui/ToastContainer';
import { AdminVerificationPage } from './pages/AdminVerificationPage';
import { AuthPage } from './pages/AuthPage';
import { FindTutorsPage } from './pages/FindTutorsPage';
import { LandingPage } from './pages/LandingPage';
import { LearnerDashboardPage } from './pages/LearnerDashboardPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SessionPage } from './pages/SessionPage';
import { SettingsPage } from './pages/SettingsPage';
import { TutorDashboardPage } from './pages/TutorDashboardPage';
import { TutorProfilePage } from './pages/TutorProfilePage';

function AppRouter() {
  const { route } = useApp();

  const renderPage = () => {
    switch (route) {
      case 'landing':
        return <LandingPage />;
      case 'find-tutors':
        return <FindTutorsPage />;
      case 'tutor-profile':
        return <TutorProfilePage />;
      case 'auth':
        return <AuthPage />;
      case 'learner-dashboard':
        return <LearnerDashboardPage />;
      case 'tutor-dashboard':
        return <TutorDashboardPage />;
      case 'messages':
        return <MessagesPage />;
      case 'session':
        return <SessionPage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return <AdminVerificationPage />;
      case '404':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#141413] dark:bg-[#0F1117] dark:text-[#F3F4F6] transition-colors duration-150">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BookingModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
