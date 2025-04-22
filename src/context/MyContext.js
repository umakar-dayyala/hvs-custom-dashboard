import { createContext, useState } from "react";

// Create the context
export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children, basename: initialBase }) => {
  const [value, setValue] = useState([]);
  const [basename] = useState(initialBase || ""); // store basename once

  return (
    <MyContext.Provider value={{ value, setValue, basename }}>
      {children}
    </MyContext.Provider>
  );
};
