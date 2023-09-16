// MyContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context
const MyContext = createContext();

// Create a provider component
export function MyProvider({ children }) {
  const [alertActive, setAlertActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alerttype, setAlertType] = useState('error');
  const showAlert = ({ type, message }) => {
    setAlertActive(true);
    setAlertType(type);
    setAlertMessage(message);

    // Automatically hide the alert after 2 seconds
    setTimeout(() => {
      setAlertActive(false);
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  return (
    <MyContext.Provider
      value={{
        alertActive,
        setAlertActive,
        alertMessage,
        setAlertMessage,
        alerttype,
        setAlertType,
        showAlert,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

// Custom hook to access the context
export function useMyContext() {
  return useContext(MyContext);
}
