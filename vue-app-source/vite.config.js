import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
  ,build:{
		outDir:'../vue-app/build'
	}
	,server: {
      proxy: {
        '/vue-app/api': {
          target: 'http://localhost:3000/',
          changeOrigin: true
        }
				,'/style.css':{
          target: 'http://localhost:3000/',
          changeOrigin: true
				}

      }
    }
})
