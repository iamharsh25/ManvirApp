import { useState, useEffect } from "react";

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const SESSION_KEY = "manveer_session";

interface SessionData {
  startTime: number;
  isActive: boolean;
}

export function useSession() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (sessionData) {
          const { startTime, isActive }: SessionData = JSON.parse(sessionData);
          const currentTime = Date.now();
          const timeElapsed = currentTime - startTime;

          if (isActive && timeElapsed < SESSION_DURATION) {
            // Session is still valid
            setIsSessionActive(true);
            // Set timeout for when session will expire
            const remainingTime = SESSION_DURATION - timeElapsed;
            setTimeout(() => {
              endSession();
            }, remainingTime);
          } else {
            // Session expired or invalid
            endSession();
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        endSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const startSession = () => {
    const sessionData: SessionData = {
      startTime: Date.now(),
      isActive: true,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setIsSessionActive(true);

    // Set timeout for session expiration
    setTimeout(() => {
      endSession();
    }, SESSION_DURATION);
  };

  const endSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsSessionActive(false);
  };

  const getRemainingTime = (): number => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const { startTime }: SessionData = JSON.parse(sessionData);
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;
        return Math.max(0, SESSION_DURATION - timeElapsed);
      }
    } catch (error) {
      console.error("Error getting remaining time:", error);
    }
    return 0;
  };

  return {
    isSessionActive,
    isLoading,
    startSession,
    endSession,
    getRemainingTime,
  };
}
