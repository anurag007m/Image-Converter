import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations for production
  build: {
    // Output directory (matches Netlify publish directory)
    outDir: 'dist',
    
    // Generate sourcemaps for debugging (disabled in production)
    sourcemap: false,
    
    // Minification settings
    minify: 'esbuild',
    
    // Target modern browsers for smaller bundle size
    target: 'es2020',
    
    // Chunk splitting strategy for better caching
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal loading
        manualChunks: {
          // Vendor chunk for React and related libraries
          vendor: ['react', 'react-dom'],
          
          // Separate chunk for utilities if the app grows
          // utils: ['./src/utils/index.ts']
        },
        
        // Asset file naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          let extType = info[info.length - 1]
          
          // Organize assets by type
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            extType = 'images'
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            extType = 'fonts'
          }
          
          return `assets/${extType}/[name]-[hash][extname]`
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    
    // Optimize bundle size
    chunkSizeWarningLimit: 1000,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Optimize CSS
    cssMinify: true
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    open: false, // Don't auto-open browser
    cors: true,
    
    // Hot Module Replacement settings
    hmr: {
      overlay: true
    }
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
    cors: true
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@types': resolve(__dirname, 'src/types')
    }
  },
  
  // CSS preprocessing
  css: {
    // Enable CSS modules if needed
    modules: {
      localsConvention: 'camelCase'
    },
    
    // PostCSS configuration
    postcss: {
      plugins: []
    },
    
    // CSS dev source maps
    devSourcemap: true
  },
  
  // Environment variables
  define: {
    // Global constants
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // Optimization settings
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server startup
    include: ['react', 'react-dom'],
    
    // Exclude problematic dependencies
    exclude: []
  },
  
  // Base URL for deployment (adjust if deploying to subdirectory)
  base: '/',
  
  // Public directory
  publicDir: 'public',
  
  // Asset handling
  assetsInclude: ['**/*.bin'], // Include BIN files as assets if needed
  
  // Worker configuration (for future enhancements)
  worker: {
    format: 'es'
  }
})
