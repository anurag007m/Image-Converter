# Universal File Converter

A modern, professional file converter application built with React and TypeScript. Transform your files with ease and precision using our intuitive drag-and-drop interface with support for batch processing up to 50 files.

## ✨ Features

- **Multi-File Support**: Upload and convert up to 50 files simultaneously
- **Drag & Drop Interface**: Intuitive file selection with visual feedback
- **Batch Processing**: Efficient handling of multiple files with progress tracking
- **Professional UI**: Modern glassmorphism design with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Progress**: Individual file progress tracking and overall batch progress
- **Error Handling**: Comprehensive error management with user-friendly messages
- **File Preview**: Visual preview of converted files before download
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Modern CSS with CSS Variables and Glassmorphism effects
- **Build Tool**: Vite for fast development and optimized builds
- **Deployment**: Netlify with optimized configurations
- **Code Quality**: ESLint with TypeScript support

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 18 or higher)
- npm (version 8 or higher)
- A modern web browser

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/imageconverter.git
cd imageconverter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
imageconverter/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── assets/           # Application assets
│   │   └── react.svg     # React logo
│   ├── App.tsx           # Main application component
│   ├── App.css           # Application styles
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── netlify.toml          # Netlify configuration
├── _redirects            # Netlify redirects for SPA
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## 🔧 File Conversion Process

The application uses modern web APIs to handle file conversion:

1. **File Upload**: Files are selected via drag-and-drop or file picker
2. **Validation**: Each file is validated for size and format compatibility
3. **Processing**: Files are processed using FileReader API and Blob constructors
4. **Conversion**: Binary data is converted to the target format using canvas rendering
5. **Preview**: Converted files are displayed with preview thumbnails
6. **Download**: Individual or batch download options available

### Key Components

#### File State Management
```typescript
interface FileState {
  file: File | null           // Original BIN file
  preview: string | null      // Preview URL for converted image
  isProcessing: boolean       // Loading state
  error: string | null        // Error messages
  convertedUrl: string | null // Download URL for converted JPG
  fileName: string            // Original filename
}
```

#### Conversion Logic
The core conversion function handles:
- Binary file reading with ArrayBuffer
- MIME type conversion to image/jpeg
- Image validation and error handling
- Memory management with URL cleanup

## 🎨 UI Architecture

The application features a modern, professional design with:

- **Glassmorphism Effects**: Translucent surfaces with backdrop blur
- **Gradient Backgrounds**: Dynamic color gradients for visual appeal
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Grid**: Flexible layouts that adapt to screen sizes
- **Accessibility First**: WCAG compliant with proper ARIA labels

### Design System
- **Colors**: CSS custom properties for consistent theming
- **Typography**: Modern font stack with proper hierarchy
- **Spacing**: Consistent spacing scale using rem units
- **Animations**: Smooth transitions with respect for user preferences

## 🚀 Deployment

### Netlify Deployment

This project is optimized for Netlify deployment with:

1. **Automatic Builds**: Configured in `netlify.toml`
2. **SPA Routing**: Proper redirects for React Router
3. **Security Headers**: CSP, XSS protection, and more
4. **Performance**: Asset optimization and caching strategies

#### Deploy to Netlify

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**: 
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy**: Netlify will automatically build and deploy

#### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Netlify (requires Netlify CLI)
npx netlify deploy --prod --dir=dist
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
VITE_APP_NAME="BIN to JPG Converter"
VITE_APP_VERSION="1.0.0"
```

### Build Optimization

The project includes several optimizations:

- **Code Splitting**: Automatic vendor chunk separation
- **Asset Optimization**: Images and fonts organized by type
- **Bundle Analysis**: Use `npm run build:analyze` to analyze bundle size
- **Modern Targets**: ES2020 for smaller bundle sizes

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

### Code Quality

- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Comprehensive linting rules for React and TypeScript
- **Prettier**: Code formatting (can be added)
- **Husky**: Git hooks for quality checks (can be added)

## 🐛 Troubleshooting

### Common Issues

1. **BIN File Won't Convert**
   - Ensure the BIN file contains valid image data
   - Check file size (very large files may cause memory issues)
   - Try renaming the file with .jpg extension to test if it's a valid image

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Vite cache: `npm run clean`
   - Check Node.js version: `node --version` (should be 18+)

3. **Deployment Issues**
   - Verify `netlify.toml` configuration
   - Check build logs in Netlify dashboard
   - Ensure all dependencies are in `dependencies` not `devDependencies`

## 📞 Support & Contact

- **Email**: [anurag007m@gmail.com](mailto:anurag007m@gmail.com)
- **Portfolio**: [https://portfolio.anurag007m.dev](https://portfolio.anurag007m.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the lightning-fast build tool
- TypeScript team for type safety
- Netlify for seamless deployment

---

© 2024 All rights reserved to Anurag007m
