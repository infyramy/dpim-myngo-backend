import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Handle preflight requests for CORS
router.options('*', (req, res) => {
  const allowedOrigins = ['https://dpim.myngo.my', 'https://api.myngo.my', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  console.log('OPTIONS request origin:', origin);
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Serve business images with proper CORS headers
router.get('/businesses/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/businesses', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Set CORS headers explicitly
  const allowedOrigins = ['https://dpim.myngo.my', 'https://api.myngo.my', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  // Debug logging
  console.log('Business image request origin:', origin);
  console.log('Is origin allowed?', origin && allowedOrigins.includes(origin));
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // If no origin or not allowed, set to the first allowed origin for debugging
    res.header('Access-Control-Allow-Origin', 'https://dpim.myngo.my');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Set proper content type based on file extension
  const ext = path.extname(filename).toLowerCase();
  const contentTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  const contentType = contentTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
  
  // Send the file
  return res.sendFile(filePath);
});

// Serve product images with proper CORS headers
router.get('/products/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/products', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Set CORS headers explicitly
  const allowedOrigins = ['https://dpim.myngo.my', 'https://api.myngo.my', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  // Debug logging
  console.log('Product image request origin:', origin);
  console.log('Is origin allowed?', origin && allowedOrigins.includes(origin));
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // If no origin or not allowed, set to the first allowed origin for debugging
    res.header('Access-Control-Allow-Origin', 'https://dpim.myngo.my');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Set proper content type based on file extension
  const ext = path.extname(filename).toLowerCase();
  const contentTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  const contentType = contentTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
  
  // Send the file
  return res.sendFile(filePath);
});

export default router; 