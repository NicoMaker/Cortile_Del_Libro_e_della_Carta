/**
 * Cortile Backend - Express.js Server
 * FULL CRUD API endpoints with Create, Read, Update, Delete
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
// UTILITY FUNCTIONS
// ============================================

// Generic run promise wrapper
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// ============================================
// EVENTS ENDPOINTS - FULL CRUD
// ============================================

// GET all events (published only, sorted by date)
app.get('/api/events', (req, res) => {
  const sql = `
    SELECT id, title, description, date, time, location, image_url, category, status
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

// POST create new event
app.post('/api/events', (req, res) => {
  const { title, description, date, time, location, category, image_url, status } = req.body;
  
  if (!title || !description || !date || !location) {
    return res.status(400).json({ error: 'Campi obbligatori: title, description, date, location' });
  }
  
  const sql = `
    INSERT INTO events (title, description, date, time, location, category, image_url, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;
  
  db.run(sql, [title, description, date, time, location, category, image_url, status || 'draft'], function(err) {
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
  
  if (!title || !description || !date || !location) {
    return res.status(400).json({ error: 'Campi obbligatori: title, description, date, location' });
  }

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
// NEWS ENDPOINTS - FULL CRUD
// ============================================

// GET all news (published only)
app.get('/api/news', (req, res) => {
  const sql = `
    SELECT id, title, slug, excerpt, featured_image, published_at, status
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

// GET single news article by slug or ID
app.get('/api/news/:slug', (req, res) => {
  const { slug } = req.params;
  
  // Try to find by slug first
  let sql = `
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

// POST create new news article
app.post('/api/news', (req, res) => {
  const { title, slug, content, excerpt, featured_image, status } = req.body;
  
  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'Campi obbligatori: title, slug, content' });
  }
  
  const sql = `
    INSERT INTO news (title, slug, content, excerpt, featured_image, status, author_id, published_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
  `;
  
  db.run(sql, [title, slug, content, excerpt, featured_image, status || 'published'], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, slug: slug, message: 'Article created' });
  });
});

// PUT update news article
app.put('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const { title, slug, content, excerpt, featured_image, status } = req.body;
  
  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'Campi obbligatori: title, slug, content' });
  }

  const sql = `
    UPDATE news
    SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [title, slug, content, excerpt, featured_image, status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article updated' });
  });
});

// DELETE news article
app.delete('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM news WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted' });
  });
});

// ============================================
// GALLERY ENDPOINTS - FULL CRUD
// ============================================

// GET all gallery images
app.get('/api/gallery', (req, res) => {
  const { category, event_id } = req.query;
  
  let sql = 'SELECT id, title, description, image_url, category, event_id FROM gallery WHERE 1=1';
  const params = [];
  
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (event_id) {
    sql += ' AND event_id = ?';
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
  
  db.run(sql, [title, description, image_url, category, event_id || null], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Image added' });
  });
});

// PUT update gallery image
app.put('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, category, event_id } = req.body;
  
  if (!title || !image_url) {
    return res.status(400).json({ error: 'Campi obbligatori: title, image_url' });
  }

  const sql = `
    UPDATE gallery
    SET title = ?, description = ?, image_url = ?, category = ?, event_id = ?
    WHERE id = ?
  `;
  
  db.run(sql, [title, description, image_url, category, event_id || null, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image updated' });
  });
});

// DELETE gallery image
app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM gallery WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted' });
  });
});

// ============================================
// CONTACTS ENDPOINTS - CRUD
// ============================================

// GET all contacts
app.get('/api/contacts', (req, res) => {
  const sql = 'SELECT * FROM contacts ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET single contact
app.get('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM contacts WHERE id = ?';
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(row);
  });
});

// POST contact form submission
app.post('/api/contacts', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Campi obbligatori: name, email, subject, message' });
  }
  
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
    
    console.log(`📧 Nuovo messaggio da ${name}: ${subject}`);
    
    res.status(201).json({ id: this.lastID, message: 'Messaggio ricevuto' });
  });
});

// PUT update contact status
app.put('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Campo obbligatorio: status' });
  }

  const sql = `
    UPDATE contacts
    SET status = ?, replied_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact updated' });
  });
});

// DELETE contact
app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM contacts WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  });
});

// ============================================
// DONATIONS ENDPOINTS - CRUD
// ============================================

// GET all donations (admin)
app.get('/api/donations', (req, res) => {
  const sql = 'SELECT * FROM donations ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

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

// PUT update donation status
app.put('/api/donations/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Campo obbligatorio: status' });
  }

  const sql = `
    UPDATE donations
    SET status = ?, completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
    WHERE id = ?
  `;
  
  db.run(sql, [status, status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ message: 'Donation updated' });
  });
});

// DELETE donation
app.delete('/api/donations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM donations WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ message: 'Donation deleted' });
  });
});

// GET donation stats
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
// SPONSORS ENDPOINTS - FULL CRUD
// ============================================

// GET all sponsors
app.get('/api/sponsors', (req, res) => {
  const sql = 'SELECT * FROM sponsors ORDER BY sponsor_level DESC, company_name ASC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST new sponsor
app.post('/api/sponsors', (req, res) => {
  const { company_name, logo_url, website, sponsor_level, contact_email, phone } = req.body;
  
  if (!company_name) {
    return res.status(400).json({ error: 'Nome azienda obbligatorio' });
  }

  const sql = `
    INSERT INTO sponsors (company_name, logo_url, website, sponsor_level, contact_email, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [company_name, logo_url, website, sponsor_level, contact_email, phone], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Sponsor added' });
  });
});

// PUT update sponsor
app.put('/api/sponsors/:id', (req, res) => {
  const { id } = req.params;
  const { company_name, logo_url, website, sponsor_level, contact_email, phone } = req.body;
  
  if (!company_name) {
    return res.status(400).json({ error: 'Nome azienda obbligatorio' });
  }

  const sql = `
    UPDATE sponsors
    SET company_name = ?, logo_url = ?, website = ?, sponsor_level = ?, contact_email = ?, phone = ?
    WHERE id = ?
  `;
  
  db.run(sql, [company_name, logo_url, website, sponsor_level, contact_email, phone, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    res.json({ message: 'Sponsor updated' });
  });
});

// DELETE sponsor
app.delete('/api/sponsors/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM sponsors WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    res.json({ message: 'Sponsor deleted' });
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