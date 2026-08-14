import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.32em" }],
        caption: ["0.8125rem", { lineHeight: "1.7" }],
        display: ["clamp(2.75rem, 6vw + 0.5rem, 5.25rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        h1: ["clamp(2.25rem, 4.5vw + 0.5rem, 3.75rem)", { lineHeight: "1.02" }],
        h2: ["clamp(1.875rem, 3vw + 0.5rem, 3rem)", { lineHeight: "1.08" }],
        h3: ["clamp(1.375rem, 1.5vw + 0.75rem, 1.75rem)", { lineHeight: "1.2" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
        eyebrow: "0.32em",
      },
      transitionTimingFunction: {
        elegant: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        1100: "1100ms",
        1400: "1400ms",
        1600: "1600ms",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ivory: "hsl(var(--ivory))",
        stone: "hsl(var(--stone))",
        sand: "hsl(var(--sand))",
        taupe: "hsl(var(--taupe))",
        bronze: "hsl(var(--bronze))",
        espresso: "hsl(var(--espresso))",
        charcoal: "hsl(var(--charcoal))",
        hairline: "hsl(var(--hairline))",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 1px)",
        sm: "calc(var(--radius) - 2px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "image-in": { "0%": { opacity: "0", transform: "scale(1.04)" }, "100%": { opacity: "1", transform: "scale(1)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 1s cubic-bezier(0.22,1,0.36,1) both",
        "image-in": "image-in 1.4s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
