import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { crowdZonesCollection, parkingCollection, broadcastsCollection } from '../services/db';

interface DataContextType {
  crowdLevel: string;
  parkingLots: any[];
  latestBroadcast: any | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [crowdLevel, setCrowdLevel] = useState<string>('Moderate');
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [latestBroadcast, setLatestBroadcast] = useState<any | null>(null);

  useEffect(() => {
    // 1. Listen to latest broadcast
    const qBroadcast = query(broadcastsCollection, orderBy('timestamp', 'desc'), limit(1));
    const unsubBroadcast = onSnapshot(qBroadcast, (snap) => {
      if (!snap.empty) {
        setLatestBroadcast(snap.docs[0].data());
      } else {
        setLatestBroadcast(null);
      }
    });

    // 2. Listen to crowd zones
    const unsubCrowd = onSnapshot(crowdZonesCollection, (snap) => {
      if (!snap.empty) {
        const zone = snap.docs.find(d => d.data().name.includes('Sector 4')) || snap.docs[0];
        if (zone) {
          const density = zone.data().density;
          setCrowdLevel(density.charAt(0).toUpperCase() + density.slice(1));
        }
      }
    });

    // 3. Listen to parking lots
    const unsubParking = onSnapshot(parkingCollection, (snap) => {
      setParkingLots(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubBroadcast();
      unsubCrowd();
      unsubParking();
    };
  }, []);

  return (
    <DataContext.Provider value={{ crowdLevel, parkingLots, latestBroadcast }}>
      {children}
    </DataContext.Provider>
  );
}

export function useRealtimeData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useRealtimeData must be used within a DataProvider');
  }
  return context;
}
