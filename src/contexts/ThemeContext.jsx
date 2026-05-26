import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme_mode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme_mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
