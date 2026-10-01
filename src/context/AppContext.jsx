import React, { createContext, useContext, useState, useEffect } from 'react';
import { processSyncQueue } from '../services/syncService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOnline = browserOnline && !simulatedOffline;

  useEffect(() => {
    if (isOnline) {
      triggerSync();
    }
  }, [isOnline]);

  const triggerSync = async () => {
    setSyncing(true);
    setSyncMessage("Syncing...");
    try {
      const result = await processSyncQueue();
      if (result.syncedCount > 0) {
        setSyncMessage(`All changes synced (${result.syncedCount} items)`);
        setTimeout(() => setSyncMessage(null), 3000);
      } else {
        setSyncMessage(null);
      }
    } catch (e) {
      console.error(e);
      setSyncMessage("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <AppContext.Provider value={{ 
      isOnline, 
      simulatedOffline, 
      setSimulatedOffline,
      syncing,
      syncMessage,
      triggerSync
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
