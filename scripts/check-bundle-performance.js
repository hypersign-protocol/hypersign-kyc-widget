const fs = require('fs')
const path = require('path')

console.log('📊 Bundle Performance Analysis\n')

// Check dist folder for bundle files
const distPath = path.join(process.cwd(), 'dist')
const jsPath = path.join(distPath, 'js')

if (fs.existsSync(jsPath)) {
  const files = fs.readdirSync(jsPath)

  console.log('📦 JavaScript Bundles:')
  files.forEach((file) => {
    if (file.endsWith('.js')) {
      const filePath = path.join(jsPath, file)
      const stats = fs.statSync(filePath)
      const sizeKB = Math.round(stats.size / 1024)
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)

      console.log(`  - ${file}: ${sizeKB}KB (${sizeMB}MB)`)
    }
  })
}

// Check CSS files
const cssPath = path.join(distPath, 'css')
if (fs.existsSync(cssPath)) {
  const cssFiles = fs.readdirSync(cssPath)

  console.log('\n🎨 CSS Bundles:')
  cssFiles.forEach((file) => {
    if (file.endsWith('.css')) {
      const filePath = path.join(cssPath, file)
      const stats = fs.statSync(filePath)
      const sizeKB = Math.round(stats.size / 1024)

      console.log(`  - ${file}: ${sizeKB}KB`)
    }
  })
}

console.log('\n📈 Performance Metrics to Check:')
console.log('1. First Contentful Paint (FCP)')
console.log('2. Largest Contentful Paint (LCP)')
console.log('3. Time to Interactive (TTI)')
console.log('4. Total Blocking Time (TBT)')
console.log('5. Cumulative Layout Shift (CLS)')

console.log('\n🔍 Browser Testing Steps:')
console.log('1. Open http://localhost:3000')
console.log('2. Press F12 for Developer Tools')
console.log('3. Go to Performance tab')
console.log('4. Record and interact with the app')
console.log('5. Check Network tab for bundle loading')

console.log('\n📊 Expected Optimizations:')
console.log('- MainPage: 96% size reduction')
console.log('- Separate chunks for better caching')
console.log('- Gzip compression enabled')
console.log('- Console statements removed in production')
