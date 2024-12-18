import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3DA35D', // Emerald Green
          light: '#6DCB73', // Leaf Green
          dark: '#333333', // Dark Charcoal
          gray: '#E5E5E5', // Soft Gray
          white: '#FFFFFF' // White
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)']
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        blink: {
          '0%': { opacity: '0.2' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0.2' }
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-3px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(3px, 0, 0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        }
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        'float-delay-1': 'float 3s ease-in-out infinite 0.2s',
        'float-delay-2': 'float 3s ease-in-out infinite 0.4s',
        'float-delay-3': 'float 3s ease-in-out infinite 0.6s',
        'float-delay-4': 'float 3s ease-in-out infinite 0.8s',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        slideUp: 'slideUp 0.5s ease-out',
        slideRight: 'slideRight 0.5s ease-out',
        slideDown: 'slideDown 0.5s ease-out',
        glow: 'glow 2s ease-in-out infinite',
        gradient: 'gradient 6s linear infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'auth-pattern': "url('/auth-pattern.svg')",
        'grid-pattern': "url('/grid.svg')"
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding'
      },
      scale: {
        '98': '.98',
        '101': '1.01',
        '102': '1.02'
      },
      blur: {
        xs: '2px'
      },
      borderWidth: {
        '3': '3px'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    }),
    // Glass morphism utilities with Modern Emerald theme
    plugin(({ addUtilities }) => {
      addUtilities({
        '.glass': {
          '@apply bg-primary-white/[.05] backdrop-blur-[2px] backdrop-saturate-[1.8]': {}
        },
        '.glass-light': {
          '@apply bg-primary-white/[.5] backdrop-blur-[2px] backdrop-saturate-[1.8]': {}
        },
        '.glass-dark': {
          '@apply bg-primary-dark/[.5] backdrop-blur-[2px] backdrop-saturate-[1.8]': {}
        },
        '.border-glass': {
          '@apply border border-primary-white/[.05]': {}
        }
      });
    }),
    // Text balance utilities
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance'
        },
        '.text-pretty': {
          'text-wrap': 'pretty'
        }
      });
    }),
    // Mask utilities with Modern Emerald theme gradients
    plugin(({ addUtilities }) => {
      addUtilities({
        '.mask-fade-out': {
          mask: 'linear-gradient(black, transparent)'
        },
        '.mask-fade-in': {
          mask: 'linear-gradient(transparent, black)'
        },
        '.mask-radial': {
          mask: 'radial-gradient(circle at center, black, transparent)'
        }
      });
    }),
    // Grid auto-fit utilities
    plugin(({ addUtilities }) => {
      addUtilities({
        '.grid-auto-fit': {
          'grid-template-columns': 'repeat(auto-fit, minmax(0, 1fr))'
        },
        '.grid-auto-fit-sm': {
          'grid-template-columns': 'repeat(auto-fit, minmax(16rem, 1fr))'
        },
        '.grid-auto-fit-md': {
          'grid-template-columns': 'repeat(auto-fit, minmax(24rem, 1fr))'
        }
      });
    })
  ]
};

export default config;
