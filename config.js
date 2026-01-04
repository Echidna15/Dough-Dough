// Configuration file for folder paths
const config = {
    // Main images folder path
    imagesFolder: 'C:\\Emmy projects',
    
    // Alternative: relative path (if images are in a subfolder)
    // imagesFolder: './images',
};

// Export for use in Node.js/server environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

// Make available globally for browser environments
if (typeof window !== 'undefined') {
    window.config = config;
}

