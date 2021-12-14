import React, { useEffect, useState } from "react";
import { auth } from "../../pages/api/firebase/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { getAuth } from "firebase/auth";



type User = FirebaseUser | null;
export type ContextState = { user: User };

//2.
export const AuthContext = React.createContext<ContextState | undefined>(undefined);

//3.
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
