// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//      host: true,      //👈 enables access from your phone or other devices
//     port: 5173       //👈 optional: makes port consistent (default is also 5173)
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.swiggy.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/mapi'),
        secure: false,
      }
    }
  }
})

// vite.config.js
// export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://www.swiggy.com',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '/mapi'),
  //       headers: {
  //         // Mimic a browser request
  //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  //         'Accept-Language': 'en-US,en;q=0.9',
  //         'Accept': 'application/json',
  //         'Referer': 'https://www.swiggy.com/',
  //       },
  //     },
  //   },
  // },
// });