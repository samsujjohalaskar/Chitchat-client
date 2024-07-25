/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        theme: "rgb(67 156 91 / 87%)",
        loading: "rgba(4, 4, 4, 0.5)",
      },
    },
  },
  plugins: [],
};
