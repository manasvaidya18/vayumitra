import React, { createContext, useState, useContext, useEffect } from 'react';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [city, setCity] = useState(localStorage.getItem('vayumitra_city') || 'Delhi');

    useEffect(() => {
        localStorage.setItem('vayumitra_city', city);
    }, [city]);

    return (
        <CityContext.Provider value={{ city, setCity }}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = () => useContext(CityContext);
