/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      backgroundImage:{
        'site' : 'url(./assets/autumn.jpg)',
        'sea' : 'url(./assets/london.jpg)',
        'gif' : 'url(./assets/gif.gif)',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}