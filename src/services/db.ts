import { collection } from 'firebase/firestore';
import { db } from '../firebase';

// Collection References
export const usersCollection = collection(db, 'users');
export const familyGroupsCollection = collection(db, 'family_groups');
export const locationsCollection = collection(db, 'locations');
export const crowdZonesCollection = collection(db, 'crowd_zones');
export const parkingCollection = collection(db, 'parking');
export const emergencyCentersCollection = collection(db, 'emergency_centers');
export const lostFoundReportsCollection = collection(db, 'lost_found_reports');
export const alertsCollection = collection(db, 'alerts');
export const broadcastsCollection = collection(db, 'broadcasts');

// Types mappings for the Data Layer
export interface AppUser {
  uid: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  createdAt: number;
}

export interface FamilyGroupData {
  id?: string;
  code: string;
  name?: string;
  adminId: string;
  members: string[]; // array of user UIDs
  createdAt: number;
}

export interface UserLocation {
  userId: string;
  lat: number;
  lng: number;
  timestamp: number;
  isSOS?: boolean;
}

export interface CrowdZone {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  density: 'low' | 'moderate' | 'high' | 'critical';
  updatedAt: number;
}

export interface ParkingLot {
  id?: string;
  name: string;
  type: 'vip' | 'general' | 'overflow';
  lat: number;
  lng: number;
  totalSpots: number;
  occupiedSpots: number;
  status: 'Open' | 'Full' | 'Closed';
}

export interface EmergencyCenter {
  id?: string;
  name: string;
  type: 'medical' | 'police' | 'fire';
  lat: number;
  lng: number;
  contactNumber: string;
}

export interface Alert {
  id?: string;
  groupId: string;
  userId: string;
  userName: string;
  location?: string;
  timestamp: number;
  status: 'active' | 'resolved';
}

export interface LostAndFoundReport {
  id?: string;
  reporterId: string;
  type: 'missing' | 'found';
  category: 'person' | 'item';
  name: string;
  ageApprox?: number;
  description?: string;
  lastKnownLocation: string;
  photoUrl?: string; // Firebase Storage URL
  status: 'active' | 'resolved';
  createdAt: number;
}

export interface Broadcast {
  id?: string;
  message: string;
  sender: string;
  timestamp: number;
  isActive: boolean;
}
