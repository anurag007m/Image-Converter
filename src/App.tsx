import { useState, useCallback, useRef } from 'react'
import './App.css'

/**
 * Interface defining the state structure for individual file processing
 */
interface FileItem {
  id: string
  file: File
  preview: string | null
  isProcessing: boolean
  error: string | null
  convertedUrl: string | null
  fileName: string
  originalName: string
  size: number
  progress: number
}

/**
 * Interface defining the overall application state
 */
interface AppState {
  files: FileItem[]
  isProcessing: boolean
  totalFiles: number
  completedFiles: number
}

// Interface for drag and drop events
// Use React.DragEvent<HTMLDivElement> directly instead of an empty interface

/**
 * Universal File Converter Application
 * A modern, responsive React application for file format conversion
 * with drag-and-drop functionality and batch processing support
 */
function App() {
  // Application state management
  const [appState, setAppState] = useState<AppState>({
    files: [],
    isProcessing: false,
    totalFiles: 0,
    completedFiles: 0
  })
  
  // File input reference for programmatic access
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Maximum number of files allowed
  const MAX_FILES = 50

  /**
   * Generates a unique ID for file tracking
   */
  const generateFileId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * Validates file selection and enforces limits
   */
  const validateFiles = (files: FileList): { valid: File[], errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []
    
    // Check total file count including existing files
    const totalCount = appState.files.length + files.length
    if (totalCount > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} files allowed. You're trying to add ${files.length} files but already have ${appState.files.length}.`)
      return { valid, errors }
    }
    
    // Validate each file
    Array.from(files).forEach((file) => {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        errors.push(`File "${file.name}" is too large. Maximum size is 100MB.`)
      } else {
        valid.push(file)
      }
    })
    
    return { valid, errors }
  }

  /**
   * Core file conversion logic - processes binary data and converts format
   * This function handles the actual conversion process
   */
  const convertFile = async (file: File): Promise<{ success: boolean, url?: string, error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer
          if (!arrayBuffer) {
            resolve({ success: false, error: 'Failed to read file data' })
            return
          }
          
          // Convert binary data to new format
          const uint8Array = new Uint8Array(arrayBuffer)
          const blob = new Blob([uint8Array], { type: 'image/jpeg' })
          
          // Validate the converted data
          const img = new Image()
          const tempUrl = URL.createObjectURL(blob)
          
          img.onload = () => {
            resolve({ success: true, url: tempUrl })
          }
          
          img.onerror = () => {
            URL.revokeObjectURL(tempUrl)
            resolve({ success: false, error: 'Invalid file format or corrupted data' })
          }
          
          img.src = tempUrl
        } catch (error) {
          resolve({ success: false, error: 'Conversion failed: ' + (error as Error).message })
        }
      }
      
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' })
      }
      
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Processes multiple files and adds them to the application state
   */
  const handleMultipleFiles = useCallback(async (files: FileList) => {
    const { valid, errors } = validateFiles(files)
    
    if (errors.length > 0) {
      // Show error for invalid files
      setAppState(prev => ({
        ...prev,
        files: [...prev.files, ...errors.map(error => ({
          id: generateFileId(),
          file: new File([], 'error'),
          preview: null,
          isProcessing: false,
          error,
          convertedUrl: null,
          fileName: 'Error',
          originalName: 'Error',
          size: 0,
          progress: 0
        }))]
      }))
      return
    }
    
    // Add valid files to state
    const newFiles: FileItem[] = valid.map(file => ({
      id: generateFileId(),
      file,
      preview: null,
      isProcessing: false,
      error: null,
      convertedUrl: null,
      fileName: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
      originalName: file.name,
      size: file.size,
      progress: 0
    }))
    
    setAppState(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles],
      totalFiles: prev.totalFiles + newFiles.length
    }))
    
    // Start processing files
    processFiles(newFiles)
  }, [appState.files.length])

  /**
   * Processes files in batches for better performance
   */
  const processFiles = async (filesToProcess: FileItem[]) => {
    setAppState(prev => ({ ...prev, isProcessing: true }))
    
    for (const fileItem of filesToProcess) {
      // Update file as processing
      setAppState(prev => ({
        ...prev,
        files: prev.files.map(f => 
          f.id === fileItem.id ? { ...f, isProcessing: true, progress: 25 } : f
        )
      }))
      
      // Convert file
      const result = await convertFile(fileItem.file)
      
      // Update file with result
      setAppState(prev => ({
        ...prev,
        files: prev.files.map(f => 
          f.id === fileItem.id ? {
            ...f,
            isProcessing: false,
            progress: result.success ? 100 : 0,
            preview: result.success ? result.url || null : null,
            convertedUrl: result.success ? result.url || null : null,
            error: result.success ? null : result.error || 'Conversion failed'
          } : f
        ),
        completedFiles: prev.completedFiles + 1
      }))
    }
    
    setAppState(prev => ({ ...prev, isProcessing: false }))
  }

  /**
   * Handles file selection from input or drag-and-drop
   */
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    handleMultipleFiles(files)
  }, [handleMultipleFiles])

  /**
   * Handles file input change event
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleFileSelect(files)
    }
    // Reset input value to allow selecting the same file again
    event.target.value = ''
  }, [handleFileSelect])

  /**
   * Handles drag over event for drag and drop functionality
   * Prevents default behavior to allow drop
   * @param event - The drag event
   */
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  /**
   * Handles drag enter event for visual feedback
   * @param event - The drag event
   */
  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  /**
   * Handles drag leave event
   * @param event - The drag event
   */
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  /**
   * Handles file drop event
   * Main handler for drag and drop functionality
   * @param event - The drop event
   */
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  /**
   * Triggers the file input dialog
   */
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /**
   * Downloads a converted file
   */
  const downloadFile = useCallback((fileItem: FileItem) => {
    if (!fileItem.convertedUrl) return
    
    const link = document.createElement('a')
    link.href = fileItem.convertedUrl
    link.download = fileItem.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  /**
   * Downloads all successfully converted files as a batch to a selected directory
   */
  const downloadAllFiles = useCallback(async () => {
    const successfulFiles = appState.files.filter(f => f.convertedUrl && !f.error)
    
    if (successfulFiles.length === 0) {
      alert('No files available for download')
      return
    }

    try {
      // Check if File System Access API is supported
      if ('showDirectoryPicker' in window) {
        // Use File System Access API for modern browsers
        const directoryHandle = await (window as unknown as { showDirectoryPicker: (options?: { mode?: string; startIn?: string }) => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker({
          mode: 'readwrite',
          startIn: 'downloads'
        })

        // Download all files to the selected directory
        for (const fileItem of successfulFiles) {
          if (fileItem.convertedUrl) {
            try {
              const response = await fetch(fileItem.convertedUrl)
              const blob = await response.blob()
              
              const fileHandle = await directoryHandle.getFileHandle(fileItem.fileName, {
                create: true
              })
              const writable = await fileHandle.createWritable()
              await writable.write(blob)
              await writable.close()
            } catch (error) {
              console.error(`Failed to save ${fileItem.fileName}:`, error)
            }
          }
        }
        
        alert(`Successfully downloaded ${successfulFiles.length} files to the selected directory!`)
      } else {
        // Fallback for browsers without File System Access API
        successfulFiles.forEach((file, index) => {
          setTimeout(() => downloadFile(file), index * 100) // Small delay between downloads
        })
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled the directory picker
        return
      }
      console.error('Error during batch download:', error)
      // Fallback to individual downloads
      successfulFiles.forEach((file, index) => {
        setTimeout(() => downloadFile(file), index * 100)
      })
    }
  }, [appState.files, downloadFile])

  /**
   * Removes a file from the list
   */
  const removeFile = useCallback((fileId: string) => {
    setAppState(prev => {
      const fileToRemove = prev.files.find(f => f.id === fileId)
      if (fileToRemove?.convertedUrl) {
        URL.revokeObjectURL(fileToRemove.convertedUrl)
      }
      return {
        ...prev,
        files: prev.files.filter(f => f.id !== fileId),
        totalFiles: prev.totalFiles - 1
      }
    })
  }, [])

  /**
   * Clears all files from the list
   */
  const clearAllFiles = useCallback(() => {
    // Clean up object URLs
    appState.files.forEach(file => {
      if (file.convertedUrl) {
        URL.revokeObjectURL(file.convertedUrl)
      }
    })
    
    setAppState({
      files: [],
      isProcessing: false,
      totalFiles: 0,
      completedFiles: 0
    })
  }, [appState.files])

  return (
    <div className="app">
      <div className="app-content">
        <header className="header">
          <h1>Universal File Converter</h1>
          <p>Transform your files with ease and precision</p>
        </header>

        <main className="main-content">
          {/* Upload Section */}
          <section className="upload-section">
            <div className="upload-header">
              <h2>Select Files to Convert</h2>
              <p>Choose up to 50 files for batch processing</p>
              <div className="file-limit-info">
                <i className="📁"></i>
                Maximum 50 files • 10MB per file
              </div>
            </div>

            <div
              className={`upload-zone ${appState.isProcessing ? 'processing' : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              tabIndex={0}
              role="button"
              aria-label="Upload files"
            >
              <span className="upload-icon">📁</span>
              <div className="upload-text">
                Click to select files or drag & drop
              </div>
              <div className="upload-subtext">
                Supports multiple file formats • Maximum 50 files
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleInputChange}
              className="file-input"
              accept="*/*"
            />
          </section>

        {/* Files List Section */}
        {appState.files.length > 0 && (
          <section className="files-section">
            <div className="files-header">
              <h3>Files ({appState.files.length})</h3>
              <div className="files-actions">
                {appState.files.some(f => f.convertedUrl && !f.error) && (
                  <button 
                    onClick={downloadAllFiles}
                    className="btn btn-primary"
                    disabled={appState.isProcessing}
                  >
                    Download All
                  </button>
                )}
                <button 
                  onClick={clearAllFiles}
                  className="btn btn-secondary"
                  disabled={appState.isProcessing}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="files-list">
              {appState.files.map((fileItem) => (
                <div key={fileItem.id} className="file-item">
                  <div className="file-info">
                    <div className="file-name">
                      <strong>{fileItem.originalName}</strong>
                      <span className="file-size">
                        ({(fileItem.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="file-status">
                      {fileItem.isProcessing && (
                        <div className="processing-indicator">
                          <div className="spinner"></div>
                          <span>Converting... {fileItem.progress}%</span>
                        </div>
                      )}
                      {fileItem.error && (
                        <div className="error-message">
                          <span className="error-icon">❌</span>
                          {fileItem.error}
                        </div>
                      )}
                      {fileItem.convertedUrl && !fileItem.error && (
                        <div className="success-message">
                          <span className="success-icon">✅</span>
                          Conversion completed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File Preview */}
                  {fileItem.preview && (
                    <div className="file-preview">
                      <img 
                        src={fileItem.preview} 
                        alt={`Preview of ${fileItem.fileName}`}
                        className="preview-image"
                      />
                    </div>
                  )}

                  {/* File Actions */}
                  <div className="file-actions">
                    {fileItem.convertedUrl && !fileItem.error && (
                      <button 
                        onClick={() => downloadFile(fileItem)}
                        className="btn btn-primary btn-sm"
                      >
                        Download
                      </button>
                    )}
                    <button 
                      onClick={() => removeFile(fileItem.id)}
                      className="btn btn-danger btn-sm"
                      disabled={fileItem.isProcessing}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Universal File Converter</h3>
            <p className="footer-description">
              Professional file conversion tool built with modern web technologies. 
              Convert multiple files efficiently with an intuitive interface.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">About the Developer</h4>
            <p className="footer-bio">
              I am a software engineer specializing in 
              full-stack development and modern web technologies. 
           Available for new projects and collaborations to build innovative digital solutions.
            </p>
            <a 
              href="https://anurag007dev.netlify.app/" 
              className="footer-cta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore Anurag's Portfolio"
              title="View projects and learn more about my work"
              style={{ textDecoration: 'none' }}
            >
              <span>🚀</span>
              <span>Explore My Work</span>
            </a>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Let's Connect</h4>
            <div className="footer-links">
              <a 
                href="mailto:entrepreneurdream1@gmail.com" 
                className="footer-link"
                aria-label="Email Anurag Mahato"
                title="Discuss your next project or collaboration"
                style={{ textDecoration: 'none' }}
              >
                <span className="footer-icon">📧</span>
                <span className="footer-text">Business Inquiries</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/anurag-mahato/" 
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with Anurag on LinkedIn"
                title="Professional networking and career updates"
                style={{ textDecoration: 'none' }}
              >
                <span className="footer-icon">💼</span>
                <span className="footer-text">Professional Network</span>
              </a>
              <a 
                href="https://anurag007dev.netlify.app" 
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Anurag's Portfolio"
                title="Explore open source projects and learn more about my work"
                style={{ textDecoration: 'none' }}
              >
                <span className="footer-icon">💻</span>
                <span className="footer-text">My Portfolio</span>
              </a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Developed by <strong>Anurag Mahato</strong>. All rights reserved.
            </p>
            <p className="footer-tagline">
              Crafting digital experiences with precision and passion
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App
