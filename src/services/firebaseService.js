// ─────────────────────────────────────────────
//  NEEV Firebase Service
//  Firestore CRUD helpers for all collections
// ─────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, db, auth;

function getFirebaseInstances() {
  if (!app) {
    if (!firebaseConfig.apiKey) {
      throw new Error('Firebase is not configured. Use Demo Mode to explore NEEV.');
    }
    app  = initializeApp(firebaseConfig);
    db   = getFirestore(app);
    auth = getAuth(app);
  }
  return { db, auth };
}

// ─── Auth ───────────────────────────────────

export function registerWithEmail(email, password) {
  const { auth } = getFirebaseInstances();
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithEmail(email, password) {
  const { auth } = getFirebaseInstances();
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  const { auth } = getFirebaseInstances();
  return signOut(auth);
}

export function onAuthChange(callback) {
  const { auth } = getFirebaseInstances();
  return onAuthStateChanged(auth, callback);
}

// ─── NGOs ────────────────────────────────────

export async function createNgo(uid, data) {
  const { db } = getFirebaseInstances();
  await updateDoc(doc(db, 'ngos', uid), { ...data, id: uid });
}

export async function getNgo(uid) {
  const { db } = getFirebaseInstances();
  const snap = await getDoc(doc(db, 'ngos', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveNgo(uid, data) {
  const { db } = getFirebaseInstances();
  const ref = doc(db, 'ngos', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, data);
  } else {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(ref, { ...data, id: uid });
  }
}

// ─── Volunteers ──────────────────────────────

export async function saveVolunteer(uid, data) {
  const { db } = getFirebaseInstances();
  const { setDoc } = await import('firebase/firestore');
  await setDoc(doc(db, 'volunteers', uid), { ...data, id: uid }, { merge: true });
}

export async function getVolunteer(uid) {
  const { db } = getFirebaseInstances();
  const snap = await getDoc(doc(db, 'volunteers', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllVolunteers() {
  const { db } = getFirebaseInstances();
  const snap = await getDocs(collection(db, 'volunteers'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Needs ───────────────────────────────────

export async function createNeed(data) {
  const { db } = getFirebaseInstances();
  const ref = await addDoc(collection(db, 'needs'), {
    ...data,
    volunteersAssigned: [],
    status: 'open',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllNeeds() {
  const { db } = getFirebaseInstances();
  const snap = await getDocs(
    query(collection(db, 'needs'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getNeedsByNgo(ngoId) {
  const { db } = getFirebaseInstances();
  const snap = await getDocs(
    query(collection(db, 'needs'), where('ngoId', '==', ngoId), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateNeed(needId, data) {
  const { db } = getFirebaseInstances();
  await updateDoc(doc(db, 'needs', needId), data);
}

// ─── Assignments ─────────────────────────────

export async function createAssignment(data) {
  const { db } = getFirebaseInstances();
  const ref = await addDoc(collection(db, 'assignments'), {
    ...data,
    assignedAt: serverTimestamp(),
    completedAt: null,
    status: 'accepted',
  });
  return ref.id;
}

export async function getAssignmentsByVolunteer(volunteerId) {
  const { db } = getFirebaseInstances();
  const snap = await getDocs(
    query(collection(db, 'assignments'), where('volunteerId', '==', volunteerId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function completeAssignment(assignmentId) {
  const { db } = getFirebaseInstances();
  await updateDoc(doc(db, 'assignments', assignmentId), {
    status: 'completed',
    completedAt: serverTimestamp(),
  });
}
