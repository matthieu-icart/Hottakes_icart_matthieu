// Import Multer
const multer = require('multer');

// Mime_Types Configuration
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// File Destination & File Name Multer Configuration
const storage = multer.diskStorage({
    // File Destination
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // File Name
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Export Multer
module.exports = multer({ storage: storage }).single('image');