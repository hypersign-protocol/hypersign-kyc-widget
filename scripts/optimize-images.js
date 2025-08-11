const fs = require('fs')
const path = require('path')

// List of large files that need optimization
const largeFiles = [
  'src/assets/fr-instruction.gif', // 771KB
  'src/assets/ocr-instruction.gif', // 268KB
  'src/assets/selfi.png', // 84KB
  'src/assets/proof.png', // 21KB
  'src/assets/passport.png', // 26KB
]

console.log('Large files that need optimization:')
largeFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    const sizeInKB = Math.round(stats.size / 1024)
    console.log(`- ${file}: ${sizeInKB}KB`)
  }
})

console.log('\nOptimization recommendations:')
console.log('1. Convert GIFs to WebM/MP4 videos for better compression')
console.log('2. Use WebP format for PNG images')
console.log('3. Implement lazy loading for non-critical images')
console.log('4. Consider using CDN for large assets')
console.log('5. Compress images using tools like ImageOptim or TinyPNG')
