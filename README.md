# File Sender Web App

A simple web application for sharing files with other devices on your local network. This tool makes it easy to quickly transfer files between devices without uploading them to any external service.

## 📋 Features

- Upload files from your device
- Generate shareable links for uploaded files
- QR code generation for easy sharing
- List of all uploaded files with download links
- Delete files individually or clear all files
- Direct link generation (files held in memory)

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/file-sender.git
   cd file-sender
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. Open the URL shown in the console (usually http://your-ip-address:3000)

3. Upload files or generate direct links

4. Share the provided URLs with devices on your network

5. When finished, press Ctrl+C in the terminal to stop the server

## 🔍 How It Works

- The application creates a local web server on your machine
- Files are stored in an 'uploads' folder in the application directory
- Links include your local IP address automatically
- Anyone on the same network can access the links to download files
- Direct links store files in memory and expire after 1 hour

## ⚠️ Important Notes

- All devices must be on the same network to access the shared files
- For security reasons, do not use on public networks
- The server must remain running while sharing files

## 📁 Project Structure

```
file-sender/
├── node_modules/       # Dependencies
├── public/             # Frontend files
│   └── index.html      # Main web interface
├── uploads/            # Where uploaded files are stored
├── icon.png            # App icon
├── package.json        # Project configuration
├── package-lock.json   # Dependency lock file
├── README.md           # Documentation
└── server.js           # Main application code
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 