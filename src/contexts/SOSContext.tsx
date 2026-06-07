import React, { createContext, useContext, useState } from 'react';
import { addDoc } from 'firebase/firestore';
import { alertsCollection } from '../services/db';

interface SOSContextType {
  sosActive: boolean;
  triggerSOS: (groupId?: string, userName?: string, location?: string) => Promise<void>;
  clearSOS: () => void;
}

const SOSContext = createContext<SOSContextType | undefined>(undefined);

export function SOSProvider({ children }: { children: React.ReactNode }) {
  const [sosActive, setSosActive] = useState(false);

  const triggerSOS = async (groupId?: string, userName: string = 'Anonymous', location?: string) => {
    setSosActive(true);

    try {
      const myId = localStorage.getItem('my_user_id') || 'me';
      await addDoc(alertsCollection, {
        groupId: groupId || 'global',
        userId: myId,
        userName: userName,
        location: location || 'Unknown',
        timestamp: Date.now(),
        status: 'active',
      });
    } catch (error) {
      console.error('Failed to trigger alert:', error);
    }

    setTimeout(() => {
      setSosActive(false);
    }, 15000); // 15 seconds for demo
  };

  const clearSOS = () => {
    setSosActive(false);
  };

  return (
    <SOSContext.Provider value={{ sosActive, triggerSOS, clearSOS }}>
      {children}
    </SOSContext.Provider>
  );
}

export function useSOS() {
  const context = useContext(SOSContext);
  if (context === undefined) {
    throw new Error('useSOS must be used within a SOSProvider');
  }
  return context;
}
