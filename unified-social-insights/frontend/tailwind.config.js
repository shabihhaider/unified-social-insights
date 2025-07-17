/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Typography Configuration
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      
      colors: {
        brand: {
          // Core palette
          void: '#0A0A0A',        // Deep void - modern dark
          carbon: '#171717',      // Carbon black - surfaces
          zinc: '#3F3F46',        // Zinc - borders, inactive elements
          electric: '#3B82F6',    // Electric blue - primary actions
          neon: '#06B6D4',        // Neon cyan - accents, highlights
          frost: '#F4F4F5',       // Frost - light backgrounds
          pure: '#FAFAFA',        // Pure white - cards, modals
          
          // Extended palette
          violet: '#8B5CF6',      // AI/Premium features
          lime: '#84CC16',        // Success/Growth indicators
          amber: '#F59E0B',       // Warnings/Beta features
          pink: '#EC4899',        // Special promotions
        },
        
        // Semantic system
        primary: {
          50: '#EFF6FF',   100: '#DBEAFE',   200: '#BFDBFE',   300: '#93C5FD',
          400: '#60A5FA',  500: '#3B82F6',   600: '#2563EB',   700: '#1D4ED8',
          800: '#1E40AF',  900: '#1E3A8A',   DEFAULT: '#3B82F6',
        },
        
        secondary: {
          50: '#ECFEFF',   100: '#CFFAFE',   200: '#A5F3FC',   300: '#67E8F9',
          400: '#22D3EE',  500: '#06B6D4',   600: '#0891B2',   700: '#0E7490',
          800: '#155E75',  900: '#164E63',   DEFAULT: '#06B6D4',
        },
        
        accent: {
          50: '#F5F3FF',   100: '#EDE9FE',   200: '#DDD6FE',   300: '#C4B5FD',
          400: '#A78BFA',  500: '#8B5CF6',   600: '#7C3AED',   700: '#6D28D9',
          800: '#5B21B6',  900: '#4C1D95',   DEFAULT: '#8B5CF6',
        },
        
        // Status colors
        success: { 50: '#F7FEE7', 100: '#ECFCCB', 500: '#84CC16', 600: '#65A30D', 700: '#4D7C0F' },
        warning: { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 600: '#D97706', 700: '#B45309' },
        error: { 50: '#FDF2F8', 100: '#FCE7F3', 500: '#EC4899', 600: '#DB2777', 700: '#BE185D' },
        
        // Glass effects
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          black: 'rgba(10, 10, 10, 0.1)',
          electric: 'rgba(59, 130, 246, 0.1)',
        },
      },
      
      // Enhanced gradients
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #171717 50%, #3F3F46 100%)',
        'brand-electric': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
        'brand-premium': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'brand-radial': 'radial-gradient(circle at center, #3B82F6 0%, #0A0A0A 100%)',
        'neon-glow': 'radial-gradient(circle at center, #06B6D4 0%, transparent 70%)',
      },
      
      // Custom shadows
      boxShadow: {
        'brand-sm': '0 1px 2px 0 rgba(59, 130, 246, 0.05)',
        'brand': '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
        'brand-lg': '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
        'brand-xl': '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
        'neon-glow': '0 0 20px rgba(6, 182, 212, 0.3)',
        'electric-glow': '0 0 20px rgba(59, 130, 246, 0.4)',
        'violet-glow': '0 0 20px rgba(139, 92, 246, 0.4)',
      },
      
      // Modern animations
      animation: {
        'gradient': 'gradient 6s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      
      // Typography-specific utilities
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      
      // Essential spacing & layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      backdropBlur: {
        'xs': '2px',
      },
      
      // Text shadows for brand effect
      textShadow: {
        'brand': '0 2px 4px rgba(59, 130, 246, 0.3)',
        'neon': '0 0 10px rgba(6, 182, 212, 0.8)',
        'electric': '0 0 15px rgba(59, 130, 246, 0.6)',
        'violet': '0 0 12px rgba(139, 92, 246, 0.7)',
      },
    },
  },
  plugins: [
    // Add text shadow plugin
    function({ addUtilities }) {
      const textShadows = {
        '.text-shadow-brand': { textShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' },
        '.text-shadow-neon': { textShadow: '0 0 10px rgba(6, 182, 212, 0.8)' },
        '.text-shadow-electric': { textShadow: '0 0 15px rgba(59, 130, 246, 0.6)' },
        '.text-shadow-violet': { textShadow: '0 0 12px rgba(139, 92, 246, 0.7)' },
      }
      addUtilities(textShadows)
    }
  ],
}