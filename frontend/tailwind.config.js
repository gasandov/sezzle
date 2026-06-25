/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        calc: {
          bg: "#1a1a2e",
          surface: "#16213e",
          key: "#0f3460",
          "key-op": "#e94560",
          "key-eq": "#f5a623",
          "key-fn": "#4a90d9",
          display: "#0a0a1a",
        },
      },
      boxShadow: {
        key: "0 4px 6px -1px rgba(0,0,0,0.4)",
        "key-pressed": "0 1px 2px 0 rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
