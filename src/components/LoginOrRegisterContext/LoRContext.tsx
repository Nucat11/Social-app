import React, { createContext, useState } from "react"

export const LoRContext = createContext<any | undefined>(undefined)

export const LoRProvider: React.FC = ({ children }) => {
  const [active, setActive] = useState(true);
  return (
    <LoRContext.Provider value={{active,setActive}}>
      {children}
    </LoRContext.Provider>
  );
};