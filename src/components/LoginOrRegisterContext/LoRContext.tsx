import React, { createContext, useState } from "react"

interface ContextLoginState {
  // set the type of state you want to handle with context e.g.
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoRContext = createContext({} as ContextLoginState)

export const LoRProvider: React.FC = ({ children }) => {
  const [active, setActive] = useState(true);
  return (
    <LoRContext.Provider value={{active,setActive}}>
      {children}
    </LoRContext.Provider>
  );
};