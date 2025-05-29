
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'ancizar': ['"Ancizar Serif"', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},			keyframes: {
				'pulse-subtle': {
					'0%, 100%': { opacity: '0.85', transform: 'scaleX(1)' },
					'50%': { opacity: '1', transform: 'scaleX(1.05)' }
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.3'
					},
					'25%': { 
						transform: 'translateY(-10px) translateX(2px)',
						opacity: '0.6'
					},
					'50%': { 
						transform: 'translateY(-20px) translateX(-1px)',
						opacity: '0.8'
					},
					'75%': { 
						transform: 'translateY(-15px) translateX(1px)',
						opacity: '0.4'
					}
				},
				'sway': {
					'0%, 100%': { 
						transform: 'rotate(0deg) translateX(0px)'
					},
					'25%': { 
						transform: 'rotate(2deg) translateX(1px)'
					},
					'50%': { 
						transform: 'rotate(0deg) translateX(-1px)'
					},
					'75%': { 
						transform: 'rotate(-2deg) translateX(1px)'
					}
				},
				'swim': {
					'0%': { 
						transform: 'translateX(-20px)',
						opacity: '0'
					},
					'10%, 90%': { 
						opacity: '0.3'
					},
					'50%': { 
						transform: 'translateX(20px)',
						opacity: '0.6'
					},
					'100%': { 
						transform: 'translateX(40px)',
						opacity: '0'
					}
				},				'swim-reverse': {
					'0%': { 
						transform: 'translateX(40px) scaleX(-1)',
						opacity: '0'
					},
					'10%, 90%': { 
						opacity: '0.3'
					},
					'50%': { 
						transform: 'translateX(-20px) scaleX(-1)',
						opacity: '0.6'
					},
					'100%': { 
						transform: 'translateX(-40px) scaleX(-1)',
						opacity: '0'
					}
				},
				'wave-gentle': {
					'0%, 100%': { 
						transform: 'translateX(0) translateY(0)'
					},
					'25%': { 
						transform: 'translateX(5px) translateY(-2px)'
					},
					'50%': { 
						transform: 'translateX(-3px) translateY(-1px)'
					},
					'75%': { 
						transform: 'translateX(2px) translateY(-3px)'
					}
				}
			},			animation: {
				'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float infinite ease-in-out',
				'sway': 'sway 4s infinite ease-in-out',
				'swim': 'swim 8s infinite linear',
				'swim-reverse': 'swim-reverse 10s infinite linear',
				'wave-gentle': 'wave-gentle 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
