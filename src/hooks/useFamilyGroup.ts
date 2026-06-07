import { useState, useEffect } from 'react';
import { alertsCollection, familyGroupsCollection, Alert, FamilyGroupData } from '../services/db';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';

export interface GroupMember {
  id: string;
  name: string;
  role: 'admin' | 'member';
  location: string | null;
  isSOS: boolean;
  lastUpdated: number;
}

export interface FamilyGroup {
  code: string;
  members: GroupMember[];
}

export function useFamilyGroup() {
  const [group, setGroup] = useState<FamilyGroup | null>(() => {
    const saved = localStorage.getItem('familyGroup');
    return saved ? JSON.parse(saved) : null;
  });

  const getMyUserId = () => {
    let id = localStorage.getItem('my_user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('my_user_id', id);
    }
    return id;
  };

  const myId = getMyUserId();

  useEffect(() => {
    if (!group?.code) return;
    const unsubGroup = onSnapshot(doc(familyGroupsCollection, group.code), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as FamilyGroupData;
        const newGroup: FamilyGroup = {
          code: data.code,
          // Stacking members object in DB would be better, but we serialize it inside 'members' as JSON strings or similar, wait actually let's define members as an array of GroupMember objects in FamilyGroupData to make it easier for this scope.
          members: data.members as unknown as GroupMember[]
        };
        setGroup(newGroup);
        localStorage.setItem('familyGroup', JSON.stringify(newGroup));
      } else {
        setGroup(null);
        localStorage.removeItem('familyGroup');
      }
    });

    return () => unsubGroup();
  }, [group?.code]);

  useEffect(() => {
    if (!group) return;

    const q = query(
      alertsCollection,
      where('groupId', '==', group.code),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const alertData = change.doc.data() as Alert;
          // Avoid notifying the person who sent the alert again (unless testing)
          if (alertData.userId !== myId && alertData.timestamp > Date.now() - 60000) {
            window.alert(`🚨 EMERGENCY SOS 🚨\n${alertData.userName} triggered an SOS alert in your family group!`);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [group?.code, myId]);

  const createGroup = async (name: string) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newGroup: FamilyGroup = {
      code,
      members: [{ id: myId, name: name || 'Me', role: 'admin' as const, location: 'Sangam Area', isSOS: false, lastUpdated: Date.now() }]
    };
    
    // Store locally for immediate UI, then sync to DB
    setGroup(newGroup);
    localStorage.setItem('familyGroup', JSON.stringify(newGroup));
    
    await setDoc(doc(familyGroupsCollection, code), {
      code,
      adminId: myId,
      members: newGroup.members,
      createdAt: Date.now()
    });

    return code;
  };

  const joinGroup = async (code: string, name: string) => {
    const groupCode = code.toUpperCase();
    const docRef = doc(familyGroupsCollection, groupCode);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      const members = data.members as GroupMember[];
      const existingMember = members.find(m => m.id === myId);
      
      let newMembers = [...members];
      if (!existingMember) {
        newMembers.push({ id: myId, name: name || 'Me', role: 'member' as const, location: 'Unknown', isSOS: false, lastUpdated: Date.now() });
        await updateDoc(docRef, { members: newMembers });
      }
      
      const newGroup = { code: groupCode, members: newMembers };
      setGroup(newGroup);
      localStorage.setItem('familyGroup', JSON.stringify(newGroup));
    } else {
      alert("Group not found");
    }
  };

  const leaveGroup = async () => {
    if (group) {
        const docRef = doc(familyGroupsCollection, group.code);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as any;
            const newMembers = (data.members as GroupMember[]).filter(m => m.id !== myId);
            await updateDoc(docRef, { members: newMembers });
        }
    }
    setGroup(null);
    localStorage.removeItem('familyGroup');
  };

  const disbandGroup = leaveGroup; // Same logic for now

  const updateLocation = async (location: string) => {
    if (!group) return;
    const newMembers = group.members.map(m => m.id === myId ? { ...m, location, lastUpdated: Date.now() } : m);
    setGroup({ ...group, members: newMembers });
    
    const docRef = doc(familyGroupsCollection, group.code);
    await updateDoc(docRef, { members: newMembers });
  };

  const setSOS = async (isSOS: boolean) => {
    if (!group) return;
    const newMembers = group.members.map(m => m.id === myId ? { ...m, isSOS, lastUpdated: Date.now() } : m);
    setGroup({ ...group, members: newMembers });
    
    const docRef = doc(familyGroupsCollection, group.code);
    await updateDoc(docRef, { members: newMembers });
  };

  return { group, createGroup, joinGroup, leaveGroup, disbandGroup, updateLocation, setSOS };
}
