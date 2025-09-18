import { useEffect } from "react";
import Dashboard from "./components/Dashboard";
import LockScreen from "./components/LockScreen";
import { useSession } from "./hooks/useSession";

export default function App() {
  const { isSessionActive, isLoading, startSession, endSession } = useSession();

  // Auto-end session after 1 hour (for testing, you can reduce this)
  useEffect(() => {
    if (isSessionActive) {
      const timer = setTimeout(() => {
        endSession();
      }, 60 * 60 * 1000); // 1 hour

      return () => clearTimeout(timer);
    }
  }, [isSessionActive, endSession]);

  const handleUnlock = () => {
    startSession();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSessionActive) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return <Dashboard />;
}
