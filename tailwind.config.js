/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                muted: {
                    DEFAULT: "hsl(240 3.7% 15.9%)",
                    foreground: "hsl(240 5% 64.9%)",
                },
                accent: {
                    DEFAULT: "hsl(240 3.7% 15.9%)",
                    foreground: "hsl(0 0% 98%)",
                },
                ring: "hsl(240 4.9% 83.9%)",
                input: "hsl(240 3.7% 15.9%)",
            },
            minHeight: {
                '120': '30rem',
            },
        },
    },
    plugins: [],
};
