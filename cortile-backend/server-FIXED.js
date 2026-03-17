/**
 * Cortile Backend - Express.js Server
 * API endpoints for frontend consumption
 * 
 * Run: node server.js
 */

import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const DB_PATH = path.join(__dirname, 'cortile.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database error:', err);
    process.exit(1);
  }
  console.log('✓ Database connesso');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// ============================================
// EVENTS ENDPOINTS
// ============================================

// GET all events (published only, sorted by date)
app.get('/api/events', (req, res) => {
  const sql = `
    SELECT id, title, description, date, time, location, image_url, category
    FROM events
    WHERE status = 'published'
    ORDER BY date DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET single event by ID
app.get('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT * FROM events
    WHERE id = ? AND status = 'published'
  `;
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(row);
  });
});

// POST new event (admin only - TODO: add auth middleware)
app.post('/api/events', (req, res) => {
  const { title, description, date, time, location, category, image_url } = req.body;
  
  // Validation
  if (!title || !description || !date || !location) {
    return res.status(400).json({ error: 'Campi obbligatori: title, description, date, location' });
  }
  
  const sql = `
    INSERT INTO events (title, description, date, time, location, category, image_url, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', 1)
  `;
  
  db.run(sql, [title, description, date, time, location, category, image_url], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Event created' });
  });
});

// PUT update event
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, category, image_url, status } = req.body;
  
  const sql = `
    UPDATE events
    SET title = ?, description = ?, date = ?, time = ?, location = ?, category = ?, image_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [title, description, date, time, location, category, image_url, status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event updated' });
  });
});

// DELETE event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM events WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  });
});

// ============================================
// NEWS ENDPOINTS
// ============================================

// GET all news (published only)
app.get('/api/news', (req, res) => {
  const sql = `
    SELECT id, title, slug, excerpt, featured_image, published_at
    FROM news
    WHERE status = 'published'
    ORDER BY published_at DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET single news article
app.get('/api/news/:slug', (req, res) => {
  const { slug } = req.params;
  const sql = `
    SELECT * FROM news
    WHERE slug = ? AND status = 'published'
  `;
  
  db.get(sql, [slug], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(row);
  });
});

// POST new news article
app.post('/api/news', (req, res) => {
  const { title, slug, content, excerpt, featured_image } = req.body;
  
  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'Campi obbligatori: title, slug, content' });
  }
  
  const sql = `
    INSERT INTO news (title, slug, content, excerpt, featured_image, status, author_id, published_at)
    VALUES (?, ?, ?, ?, ?, 'published', 1, CURRENT_TIMESTAMP)
  `;
  
  db.run(sql, [title, slug, content, excerpt, featured_image], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, slug: slug, message: 'Article created' });
  });
});

// ============================================
// GALLERY ENDPOINTS
// ============================================

// GET all gallery images
app.get('/api/gallery', (req, res) => {
  const { category, event_id } = req.query;
  
  let sql = 'SELECT id, title, description, image_url, category, event_id FROM gallery';
  const params = [];
  
  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }
  if (event_id) {
    sql += category ? ' AND' : ' WHERE';
    sql += ' event_id = ?';
    params.push(event_id);
  }
  
  sql += ' ORDER BY order_index ASC';
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST new gallery image
app.post('/api/gallery', (req, res) => {
  const { title, description, image_url, category, event_id } = req.body;
  
  if (!title || !image_url) {
    return res.status(400).json({ error: 'Campi obbligatori: title, image_url' });
  }
  
  const sql = `
    INSERT INTO gallery (title, description, image_url, category, event_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [title, description, image_url, category, event_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// ============================================
// CONTACTS ENDPOINTS
// ============================================

// POST contact form submission
app.post('/api/contacts', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Campi obbligatori: name, email, subject, message' });
  }
  
  // Basic email validation
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Email non valida' });
  }
  
  const sql = `
    INSERT INTO contacts (name, email, phone, subject, message, status)
    VALUES (?, ?, ?, ?, ?, 'new')
  `;
  
  db.run(sql, [name, email, phone, subject, message], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // TODO: Invia email via SendGrid
    console.log(`📧 Nuovo messaggio da ${name}: ${subject}`);
    
    res.status(201).json({ id: this.lastID, message: 'Grazie! Il tuo messaggio è stato ricevuto.' });
  });
});

// GET all contacts (admin only - TODO: add auth)
app.get('/api/contacts', (req, res) => {
  const sql = 'SELECT * FROM contacts ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ============================================
// DONATIONS ENDPOINTS
// ============================================

// POST new donation
app.post('/api/donations', (req, res) => {
  const { donor_name, donor_email, amount, payment_method } = req.body;
  
  if (!donor_name || !donor_email || !amount) {
    return res.status(400).json({ error: 'Campi obbligatori: donor_name, donor_email, amount' });
  }
  
  const sql = `
    INSERT INTO donations (donor_name, donor_email, amount, payment_method, status)
    VALUES (?, ?, ?, ?, 'pending')
  `;
  
  db.run(sql, [donor_name, donor_email, amount, payment_method], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Donazione registrata' });
  });
});

// GET donation stats (admin only - TODO: add auth)
app.get('/api/donations/stats', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_donations,
      SUM(amount) as total_amount,
      AVG(amount) as average_donation
    FROM donations
    WHERE status = 'completed'
  `;
  
  db.get(sql, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// ============================================
// SPONSORS ENDPOINTS
// ============================================

// GET all sponsors
app.get('/api/sponsors', (req, res) => {
  const sql = 'SELECT id, company_name, logo_url, website, sponsor_level FROM sponsors ORDER BY sponsor_level';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cortile API is running' });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`\n🚀 Cortile Backend Server`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
});