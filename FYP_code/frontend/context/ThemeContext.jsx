import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const colorPalettes = {
    teal: {
        50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf',
        500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e'
    },
    gold: {
        50: '#fffaf0', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
        500: '#d4af37', 600: '#b88a1a', 700: '#8f6a14', 800: '#6e5211', 900: '#4d390a', 950: '#2e2208'
    },
    charcoal: {
        50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa',
        500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b'
    },
    slate: {
        50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
        500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617'
    }
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    const [accentColor, setAccentColor] = useState(() => {
        const savedAccent = localStorage.getItem('accentColor');
        return (savedAccent && colorPalettes[savedAccent]) ? savedAccent : 'teal';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        const palette = colorPalettes[accentColor] || colorPalettes.teal;

        // Update CSS variables for primary color
        Object.keys(palette).forEach(key => {
            root.style.setProperty(`--primary-${key}`, palette[key]);
        });

        localStorage.setItem('accentColor', accentColor);
    }, [accentColor]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor, colorPalettes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
