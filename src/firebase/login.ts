import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";

// Přihlášení uživatele
export const login = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Přihlášení úspěšné");
  } catch (error: any) {
    console.error("Chyba při přihlášení:", error.message);
    throw error;
  }
};
export const register = async (
  email: string,
  password: string,
  username: string
): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Registrován uživatel:", user.uid);

    await setDoc(doc(db, "users", user.uid), {
      email,
      username,
      createdAt: new Date(),
    });
  } catch (error: any) {
    console.error("Chyba při registraci:", error.code, error.message);
    throw error;
  }
};

// Odhlášení
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("Odhlášení úspěšné");
    window.location.href = "/";
  } catch (error: any) {
    console.error("Chyba při odhlašování:", error.message);
    throw error;
  }
};
