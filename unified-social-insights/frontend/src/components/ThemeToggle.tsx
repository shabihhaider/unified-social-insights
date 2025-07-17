import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-gradient-to-br from-brand-frost/20 to-brand-pure/10 dark:from-brand-carbon/40 dark:to-brand-void/60 backdrop-blur-sm border border-brand-frost/30 dark:border-brand-zinc/20 hover:border-brand-electric/50 dark:hover:border-brand-frost/40 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void shadow-brand hover:shadow-brand-lg group"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun 
            size={18}
            className="text-amber-400 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110 drop-shadow-sm animate-glow"
          />
        ) : (
          <Moon 
            size={18}
            className="text-brand-electric transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-sm"
          />
        )}
      </div>
      
      {/* Enhanced glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-electric/20 to-brand-neon/20 dark:from-brand-frost/10 dark:to-brand-electric/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"></div>
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-xl border border-brand-electric/0 group-hover:border-brand-electric/30 dark:group-hover:border-brand-frost/30 transition-all duration-300"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-electric/10 to-transparent animate-shimmer"></div>
      </div>
    </button>
  );
};