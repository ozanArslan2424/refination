import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import colors from "tailwindcss/colors.js";

export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			colors: {
				background: colors.neutral[950],
				foreground: colors.neutral[50],
				border: colors.neutral[400],
				ring: colors.indigo[300],

				primary: colors.neutral[50],
				"primary-foreground": colors.neutral[950],

				secondary: colors.neutral[700],
				"secondary-foreground": colors.neutral[50],

				info: colors.sky[600],
				"info-foreground": colors.neutral[50],

				success: colors.emerald[600],
				"success-foreground": colors.emerald[50],

				warning: colors.amber[600],
				"warning-foreground": colors.amber[50],

				error: colors.rose[600],
				"error-foreground": colors.rose[50],

				muted: colors.neutral[400],
				"muted-foreground": colors.neutral[600],
			},
			borderRadius: {
				lg: "0.5rem",
				md: "calc(0.5rem - 2px)",
				sm: "calc(0.5rem - 4px)",
			},
		},
	},
	plugins: [animatePlugin],
} satisfies Config;
