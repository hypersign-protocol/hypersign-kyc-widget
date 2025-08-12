/**
 * Image optimization utilities
 */

// Check if browser supports WebP
export function supportsWebP() {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bAISLQAHmQAA'
  })
}

// Get optimized image source
export async function getOptimizedImageSrc(originalSrc, options = {}) {
  const { width, height, quality = 80, format = 'auto' } = options

  // If WebP is supported and format is auto, use WebP
  if (format === 'auto' || format === 'webp') {
    const webPSupported = await supportsWebP()
    if (webPSupported) {
      return convertToWebP(originalSrc, { width, height, quality })
    }
  }

  return originalSrc
}

// Convert image to WebP format
export function convertToWebP(src, options = {}) {
  // eslint-disable-next-line no-unused-vars
  const { width, height, quality = 80 } = options

  // For now, return the original source
  // In a real implementation, you would use a service like Cloudinary or similar
  // to convert images to WebP on-the-fly
  return src
}

// Lazy load image with intersection observer
export function lazyLoadImage(element, callback) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback()
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )
    observer.observe(element)
    return observer
  } else {
    // Fallback for older browsers
    callback()
    return null
  }
}

// Preload critical images
export function preloadCriticalImages(imageUrls) {
  imageUrls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}

// Get responsive image sources
export function getResponsiveImageSources(src, sizes = []) {
  const baseName = src.substring(0, src.lastIndexOf('.'))
  const extension = src.substring(src.lastIndexOf('.'))

  return sizes.map((size) => ({
    src: `${baseName}-${size}${extension}`,
    width: size,
  }))
}

// Optimize image loading for mobile
export function optimizeForMobile() {
  const isMobile = window.innerWidth <= 768

  if (isMobile) {
    // Reduce image quality on mobile
    return {
      quality: 70,
      format: 'webp',
      lazyLoad: true,
    }
  }

  return {
    quality: 80,
    format: 'auto',
    lazyLoad: false,
  }
}
