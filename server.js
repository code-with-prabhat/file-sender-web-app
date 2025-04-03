const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ip = require('ip');
const crypto = require('crypto');
const os = require('os');

const app = express();
const port = 3000;

// In-memory storage for direct links
const directLinks = new Map();

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Set up multer with improved error handling
const upload = multer({ 
  storage
}).single('file');

// Set up multer for direct links (memory storage)
const directLinkUpload = multer({ storage: multer.memoryStorage() }).single('file');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve direct linked files
app.get('/direct/:linkId', (req, res) => {
  const linkId = req.params.linkId;
  
  if (!directLinks.has(linkId)) {
    return res.status(404).send('File not found or link expired');
  }
  
  const fileData = directLinks.get(linkId);
  
  // Set appropriate headers
  res.setHeader('Content-Type', fileData.mimetype || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalname}"`);
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  
  // Send the file data
  res.send(fileData.buffer);
});

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for handling file uploads with better error handling
app.post('/upload', (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'File too large. Maximum size is 100MB.' 
          });
        }
        return res.status(400).json({ error: `Multer error: ${err.message}` });
      } else {
        // An unknown error occurred
        return res.status(500).json({ error: `Server error: ${err.message}` });
      }
    }
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file selected' });
    }
    
    try {
      const fileUrl = `http://${ip.address()}:${port}/uploads/${req.file.filename}`;
      res.json({ 
        message: 'File uploaded successfully',
        filename: req.file.filename,
        fileUrl
      });
    } catch (error) {
      console.error('Error generating URL:', error);
      res.status(500).json({ error: 'Error generating download URL' });
    }
  });
});

// Route for creating direct links (storing file in memory only)
app.post('/direct-link', (req, res) => {
  directLinkUpload(req, res, function(err) {
    if (err) {
      console.error('Direct link error:', err);
      return res.status(500).json({ error: `Server error: ${err.message}` });
    }
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file selected' });
    }
    
    try {
      // Generate a unique ID for the file
      const linkId = crypto.randomBytes(16).toString('hex');
      
      // Store the file in memory
      directLinks.set(linkId, {
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        timestamp: Date.now()
      });
      
      console.log(`Direct link created for "${req.file.originalname}" (${(req.file.buffer.length / (1024 * 1024)).toFixed(2)} MB) - ID: ${linkId}`);
      
      // Generate URL for direct access
      const fileUrl = `http://${ip.address()}:${port}/direct/${linkId}`;
      
      // Return the direct link
      res.json({
        message: 'Direct link generated successfully',
        filename: req.file.originalname,
        fileUrl,
        expiresIn: '1 hour'
      });
      
      // Clean up old direct links after 1 hour
      setTimeout(() => {
        if (directLinks.has(linkId)) {
          directLinks.delete(linkId);
          console.log(`Removed expired direct link: ${linkId}`);
        }
      }, 60 * 60 * 1000); // 1 hour
      
    } catch (error) {
      console.error('Error generating direct link:', error);
      res.status(500).json({ error: 'Error generating direct link' });
    }
  });
});

// Get list of uploaded files
app.get('/files', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  
  try {
    if (!fs.existsSync(uploadDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(uploadDir).map(file => {
      return {
        name: file,
        url: `http://${ip.address()}:${port}/uploads/${file}`
      };
    });
    
    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Error listing files' });
  }
});

// Delete a specific file
app.delete('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

// Delete all files
app.delete('/files', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  
  try {
    if (!fs.existsSync(uploadDir)) {
      return res.json({ message: 'No files to delete' });
    }
    
    const files = fs.readdirSync(uploadDir);
    
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      fs.unlinkSync(filePath);
    });
    
    res.json({ message: 'All files deleted successfully' });
  } catch (error) {
    console.error('Error deleting all files:', error);
    res.status(500).json({ error: 'Error deleting all files' });
  }
});

// Get IP information for the app
app.get('/app-info', (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  const interfaces = [];
  
  // Get all network interfaces
  Object.keys(networkInterfaces).forEach(interfaceName => {
    const addresses = networkInterfaces[interfaceName];
    
    addresses.forEach(address => {
      // Only include IPv4 addresses and exclude internal interfaces
      if (address.family === 'IPv4' && !address.internal) {
        interfaces.push({
          name: interfaceName,
          address: address.address
        });
      }
    });
  });
  
  res.json({
    serverUrl: `http://${ip.address()}:${port}`,
    interfaces,
    desktopMode: process.env.NW_APP === 'true'
  });
});

// Start the server
const PORT = 3000;
const HOST = '0.0.0.0'; // Bind to all interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});