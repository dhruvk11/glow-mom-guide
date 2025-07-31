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
				sans: ['Inter', 'system-ui', 'sans-serif'],
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
				},
				// Wellness tracker colors
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				// Sleep tracker theme
				sleep: {
					primary: 'hsl(var(--sleep-primary))',
					secondary: 'hsl(var(--sleep-secondary))',
					accent: 'hsl(var(--sleep-accent))',
					moon: 'hsl(var(--sleep-moon))',
					dark: 'hsl(var(--sleep-dark))',
					light: 'hsl(var(--sleep-light))',
					muted: 'hsl(var(--sleep-muted))'
				},
				// Mood tracker theme
				mood: {
					happy: 'hsl(var(--mood-happy))',
					content: 'hsl(var(--mood-content))',
					neutral: 'hsl(var(--mood-neutral))',
					sad: 'hsl(var(--mood-sad))',
					angry: 'hsl(var(--mood-angry))',
					card: 'hsl(var(--mood-card))'
				},
				// Task tracker theme
				task: {
					primary: 'hsl(var(--task-primary))',
					secondary: 'hsl(var(--task-secondary))',
					background: 'hsl(var(--task-background))',
					card: 'hsl(var(--task-card))'
				}
			},
			backgroundImage: {
				'gradient-sleep': 'var(--gradient-sleep)',
				'gradient-mood': 'var(--gradient-mood)',
				'gradient-task': 'var(--gradient-task)',
				'gradient-wellness': 'var(--gradient-wellness)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'medium': 'var(--shadow-medium)',
				'wellness': 'var(--shadow-wellness)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'gentle': 'var(--transition-gentle)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
