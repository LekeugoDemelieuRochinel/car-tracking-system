// src/context/AlertContext.js
import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    return (
        <AlertContext.Provider value={{ alerts, setAlerts }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlerts = () => {
    return useContext(AlertContext);
};