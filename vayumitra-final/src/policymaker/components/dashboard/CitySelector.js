
import React from 'react';
import { MapPin } from 'lucide-react';

const CitySelector = ({ selectedCity, onCityChange }) => {
    const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

    return (
        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-slate-500">Monitoring Region:</span>
            <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="text-lg font-bold text-slate-800 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
            >
                {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>
        </div>
    );
};

export default CitySelector;
