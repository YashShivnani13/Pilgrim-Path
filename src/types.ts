export type ViewState = 'home' | 'map' | 'family' | 'emergency' | 'lost-found' | 'parking' | 'about';

export interface MapPin {
  id: string;
  type: 'medical' | 'hydration' | 'police' | 'toilet' | 'landmark' | 'station' | 'parking' | 'food' | 'gate';
  title: string;
  lat: number;
  lng: number;
}

export interface SecurityStatus {
  id: string;
  name: string;
  role: string;
  zone: string;
  status: 'active' | 'busy' | 'offline';
  lastPing: string;
}

export interface IncidentLog {
  id: string;
  time: string;
  type: 'medical' | 'lost_person' | 'crowd_surge' | 'general';
  message: string;
  encrypted: boolean; // visual flag for the requested encrypted logs feature
}
