import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const ThemeContext = createContext();

// 2. Custom Hook for easy access
export const useTheme = () => useContext(ThemeContext);

// 3. Provider Component
export const ThemeProvider = ({ children }) => {
  // Initialize state from localStorage or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log("Switching to:", newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Sync with HTML class and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    console.log("Current theme in Context:", theme);
    
    if (theme === 'dark') {
      root.classList.add('dark');
      console.log("Added 'dark' class to <html>");
    } else {
      root.classList.remove('dark');
      console.log("Removed 'dark' class from <html>");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
