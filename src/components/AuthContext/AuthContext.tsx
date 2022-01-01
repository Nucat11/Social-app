import React, { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase/firebase";
import { User as FirebaseUser } from "firebase/auth";



type User = FirebaseUser | null;
export type ContextState = { user: User };

//2.
export const AuthContext = React.createContext<ContextState | undefined>(undefined);

//3.
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    auth.onAuthStateChanged(setUser);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{!loading && children}</AuthContext.Provider>
  );
};
