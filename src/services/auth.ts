import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  // Prompt account selection so users can choose an active browser Google account or another account
  provider.setCustomParameters({
    prompt: "select_account",
  });
  return signInWithPopup(auth, provider);
};

export const signInWithGoogleCredential = (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const subscribeToAuth = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};