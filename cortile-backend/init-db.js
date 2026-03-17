/**
 * Database Initialization Script
 * Run this once to setup SQLite3 database with schema and sample data
 * 
 * Usage: node init-db.js
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'cortile.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Errore connessione database:', err.message);
    process.exit(1);
  }
  console.log('✓ Connessione SQLite3 riuscita');
});

// Read and execute schema
const schemaSQL = fs.readFileSync(path.join(__dirname, 'db-init.sql'), 'utf8');

db.exec(schemaSQL, (err) => {
  if (err) {
    console.error('❌ Errore creazione schema:', err.message);
    process.exit(1);
  }
  console.log('✓ Schema database creato');
  
  // Insert sample data
  seedDatabase();
});

function seedDatabase() {
  const adminPassword = bcrypt.hashSync('admin123', 10);
  
  const statements = [
    // Insert admin user
    `INSERT OR IGNORE INTO users (username, email, password_hash, role)
     VALUES ('admin', 'admin@cortile.local', '${adminPassword}', 'admin')`,
    
    // Insert sample events
    `INSERT OR IGNORE INTO events (title, description, date, time, location, category, status, created_by)
     VALUES (
       'Presentazione del Cortile 2026',
       'Inaugurazione ufficiale del Cortile del Libro e della Carta. Una giornata dedicata alla cultura, alla lettura e alla ricerca.',
       '2026-04-15',
       '10:00',
       'Bologna, Cortile del Palazzo',
       'Inaugurazione',
       'published',
       1
     )`,
    
    `INSERT OR IGNORE INTO events (title, description, date, time, location, category, status, created_by)
     VALUES (
       'Laboratorio di Scrittura Creativa',
       'Workshop interattivo condotto da autori affermati. Impara tecniche di scrittura e condividi i tuoi scritti.',
       '2026-05-20',
       '15:00',
       'Bologna, Sala Conferenze',
       'Workshop',
       'published',
       1
     )`,
    
    `INSERT OR IGNORE INTO events (title, description, date, time, location, category, status, created_by)
     VALUES (
       'Mostra Fotografica: Momenti dal Cortile',
       'Esposizione di foto dei momenti più significativi dell\'edizione 2025 del Cortile.',
       '2026-06-10',
       '18:00',
       'Bologna, Cortile del Palazzo',
       'Esposizione',
       'published',
       1
     )`,
    
    // Insert sample news
    `INSERT OR IGNORE INTO news (title, slug, content, excerpt, status, author_id)
     VALUES (
       'Il Cortile si prepara al 2026',
       'cortile-2026-preparazioni',
       'Sono iniziate le preparazioni per l\'edizione 2026 del Cortile del Libro e della Carta. Quest\'anno avremo più eventi, più partner e una grafica completamente rinnovata.',
       'Sono iniziate le preparazioni per l\'edizione 2026...',
       'published',
       1
     )`,
    
    `INSERT OR IGNORE INTO news (title, slug, content, excerpt, status, author_id)
     VALUES (
       'Nuovi partner annunciati',
       'nuovi-partner-2026',
       'Siamo felici di annunciare la partnership con 5 nuove realtà culturali bolognesi. Insieme porteremo il Cortile a un livello superiore.',
       'Siamo felici di annunciare la partnership con 5 nuove realtà...',
       'published',
       1
     )`,
    
    // Insert sample sponsors
    `INSERT OR IGNORE INTO sponsors (company_name, sponsor_level, contact_email)
     VALUES ('Libreria Feltrinelli', 'Gold', 'contact@feltrinelli.com')`,
    
    `INSERT OR IGNORE INTO sponsors (company_name, sponsor_level, contact_email)
     VALUES ('Università di Bologna', 'Silver', 'partnerships@unibo.it')`,
    
    // Insert sample gallery
    `INSERT OR IGNORE INTO gallery (title, description, category, order_index)
     VALUES ('Momento inaugurale', 'Foto della cerimonia di apertura', 'Inaugurazione', 1)`,
    
    `INSERT OR IGNORE INTO gallery (title, description, category, order_index)
     VALUES ('Il pubblico in cortile', 'Visitatori durante i workshop', 'Momenti', 2)`,
  ];
  
  let completed = 0;
  statements.forEach((sql) => {
    db.run(sql, (err) => {
      if (err) {
        console.error('❌ Errore insert:', err.message);
      } else {
        console.log('✓ Dato inserito');
      }
      
      completed++;
      if (completed === statements.length) {
        console.log('\n✅ Database inizializzato con successo!');
        console.log('\n📁 Database file: ' + DB_PATH);
        console.log('👤 Admin username: admin');
        console.log('🔑 Admin password: admin123');
        console.log('\n🚀 Ora puoi avviare il server Node.js');
        db.close();
        process.exit(0);
      }
    });
  });
}