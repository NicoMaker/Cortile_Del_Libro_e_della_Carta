/**
 * Admin Panel Component - React
 * FULL CRUD: Manage Events, News, Gallery, Contacts & Donations
 * 
 * Features:
 * - Create, Read, Update, Delete (CRUD) for Events & News
 * - Gallery management with image URL handling
 * - Contact messages management
 * - Donation statistics
 */

import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminPanel() {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Event Form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    image_url: '',
    status: 'draft'
  });
  
  // News Form
  const [newsForm, setNewsForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft'
  });

  // Gallery Form
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    event_id: ''
  });
  
  const API_URL = 'http://localhost:5000/api';
  
  // Load data based on active tab
  useEffect(() => {
    if (tab === 'events') fetchEvents();
    if (tab === 'news') fetchNews();
    if (tab === 'gallery') fetchGallery();
    if (tab === 'contacts') fetchContacts();
    if (tab === 'donations') fetchDonations();
  }, [tab]);
  
  // ============================================
  // EVENTS CRUD
  // ============================================
  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Errore fetch events:', err);
    }
    setLoading(false);
  };
  
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.location) {
      alert('❌ Compila tutti i campi obbligatori');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/events/${editingId}` : `${API_URL}/events`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm)
      });
      
      if (res.ok) {
        alert(editingId ? '✓ Evento aggiornato!' : '✓ Evento creato!');
        resetEventForm();
        fetchEvents();
      } else {
        alert('❌ Errore operazione evento');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('❌ Errore connessione');
    }
  };

  const editEvent = (event) => {
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time || '',
      location: event.location,
      category: event.category || '',
      image_url: event.image_url || '',
      status: event.status || 'draft'
    });
    setEditingId(event.id);
    window.scrollTo(0, 0);
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      image_url: '',
      status: 'draft'
    });
    setEditingId(null);
  };
  
  const deleteEvent = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo evento?')) return;
    try {
      await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
      fetchEvents();
      alert('✓ Evento eliminato');
    } catch (err) {
      console.error('Errore delete:', err);
      alert('❌ Errore eliminazione');
    }
  };
  
  // ============================================
  // NEWS CRUD
  // ============================================
  
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/news`);
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error('Errore fetch news:', err);
    }
    setLoading(false);
  };
  
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsForm.title || !newsForm.slug || !newsForm.content) {
      alert('❌ Compila titolo, slug e contenuto');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/news/${editingId}` : `${API_URL}/news`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsForm)
      });
      
      if (res.ok) {
        alert(editingId ? '✓ Articolo aggiornato!' : '✓ Articolo pubblicato!');
        resetNewsForm();
        fetchNews();
      } else {
        alert('❌ Errore operazione articolo');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('❌ Errore connessione');
    }
  };

  const editNews = (article) => {
    setNewsForm({
      title: article.title,
      slug: article.slug,
      content: article.content || '',
      excerpt: article.excerpt || '',
      featured_image: article.featured_image || '',
      status: article.status || 'draft'
    });
    setEditingId(article.id);
    window.scrollTo(0, 0);
  };

  const resetNewsForm = () => {
    setNewsForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      status: 'draft'
    });
    setEditingId(null);
  };

  const deleteNews = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;
    try {
      await fetch(`${API_URL}/news/${id}`, { method: 'DELETE' });
      fetchNews();
      alert('✓ Articolo eliminato');
    } catch (err) {
      console.error('Errore delete:', err);
      alert('❌ Errore eliminazione');
    }
  };

  // ============================================
  // GALLERY CRUD
  // ============================================

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/gallery`);
      const data = await res.json();
      setGallery(data);
    } catch (err) {
      console.error('Errore fetch gallery:', err);
    }
    setLoading(false);
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    
    if (!galleryForm.title || !galleryForm.image_url) {
      alert('❌ Titolo e URL immagine sono obbligatori');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm)
      });
      
      if (res.ok) {
        alert('✓ Immagine aggiunta alla galleria!');
        setGalleryForm({
          title: '',
          description: '',
          image_url: '',
          category: '',
          event_id: ''
        });
        fetchGallery();
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('❌ Errore aggiunta immagine');
    }
  };

  const deleteGallery = async (id) => {
    if (!confirm('Sei sicuro?')) return;
    try {
      await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
      fetchGallery();
      alert('✓ Immagine eliminata');
    } catch (err) {
      console.error('Errore:', err);
    }
  };

  // ============================================
  // CONTACTS
  // ============================================

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contacts`);
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error('Errore fetch contacts:', err);
    }
    setLoading(false);
  };

  const deleteContact = async (id) => {
    if (!confirm('Elimina questo messaggio?')) return;
    try {
      await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
      alert('✓ Messaggio eliminato');
    } catch (err) {
      console.error('Errore:', err);
    }
  };

  // ============================================
  // DONATIONS
  // ============================================

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/donations/stats`);
      const data = await res.json();
      setDonations([data]);
    } catch (err) {
      console.error('Errore fetch donations:', err);
    }
    setLoading(false);
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>🎯 Admin Panel - Cortile del Libro e della Carta</h1>
        <p>Gestisci tutti i contenuti della piattaforma</p>
      </header>
      
      <nav className="admin-tabs">
        <button 
          className={`tab-btn ${tab === 'events' ? 'active' : ''}`}
          onClick={() => setTab('events')}
        >
          📅 Eventi ({events.length})
        </button>
        <button 
          className={`tab-btn ${tab === 'news' ? 'active' : ''}`}
          onClick={() => setTab('news')}
        >
          📰 Notizie ({news.length})
        </button>
        <button 
          className={`tab-btn ${tab === 'gallery' ? 'active' : ''}`}
          onClick={() => setTab('gallery')}
        >
          🖼️ Galleria ({gallery.length})
        </button>
        <button 
          className={`tab-btn ${tab === 'contacts' ? 'active' : ''}`}
          onClick={() => setTab('contacts')}
        >
          ✉️ Messaggi ({contacts.length})
        </button>
        <button 
          className={`tab-btn ${tab === 'donations' ? 'active' : ''}`}
          onClick={() => setTab('donations')}
        >
          💰 Donazioni
        </button>
      </nav>
      
      <div className="admin-content">
        
        {/* ========== EVENTS TAB ========== */}
        {tab === 'events' && (
          <section className="admin-section">
            <h2>{editingId ? '✏️ Modifica Evento' : '📅 Crea Nuovo Evento'}</h2>
            
            <form onSubmit={handleEventSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Titolo evento *"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                required
              />
              
              <textarea
                placeholder="Descrizione *"
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                rows="4"
                required
              />
              
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                required
              />
              
              <input
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
              />
              
              <input
                type="text"
                placeholder="Luogo *"
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                required
              />
              
              <select
                value={eventForm.category}
                onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
              >
                <option value="">-- Categoria --</option>
                <option value="Inaugurazione">Inaugurazione</option>
                <option value="Workshop">Workshop</option>
                <option value="Conferenza">Conferenza</option>
                <option value="Esposizione">Esposizione</option>
                <option value="Altro">Altro</option>
              </select>

              <select
                value={eventForm.status}
                onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
              >
                <option value="draft">Bozza</option>
                <option value="published">Pubblicato</option>
              </select>
              
              <input
                type="url"
                placeholder="URL immagine"
                value={eventForm.image_url}
                onChange={(e) => setEventForm({...eventForm, image_url: e.target.value})}
              />
              
              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  {editingId ? '✓ Aggiorna Evento' : '✓ Crea Evento'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={resetEventForm}
                  >
                    ✕ Annulla
                  </button>
                )}
              </div>
            </form>
            
            <h3>📋 Elenco Eventi</h3>
            <div className="items-list">
              {loading ? <p>Caricamento...</p> : events.length === 0 ? <p>Nessun evento</p> : events.map(event => (
                <div key={event.id} className="list-item">
                  <div className="item-info">
                    <h4>{event.title}</h4>
                    <p>📅 {event.date} | 📍 {event.location}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => editEvent(event)} className="btn-edit">✏️ Modifica</button>
                    <button onClick={() => deleteEvent(event.id)} className="btn-delete">🗑️ Elimina</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* ========== NEWS TAB ========== */}
        {tab === 'news' && (
          <section className="admin-section">
            <h2>{editingId ? '✏️ Modifica Articolo' : '📰 Pubblica Nuova Notizia'}</h2>
            
            <form onSubmit={handleNewsSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Titolo articolo *"
                value={newsForm.title}
                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                required
              />
              
              <input
                type="text"
                placeholder="Slug (es: il-cortile-2026) *"
                value={newsForm.slug}
                onChange={(e) => setNewsForm({...newsForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                required
              />
              
              <textarea
                placeholder="Estratto / Anteprima"
                value={newsForm.excerpt}
                onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
                rows="2"
              />
              
              <textarea
                placeholder="Contenuto completo *"
                value={newsForm.content}
                onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                rows="8"
                required
              />

              <select
                value={newsForm.status}
                onChange={(e) => setNewsForm({...newsForm, status: e.target.value})}
              >
                <option value="draft">Bozza</option>
                <option value="published">Pubblicato</option>
              </select>
              
              <input
                type="url"
                placeholder="URL immagine"
                value={newsForm.featured_image}
                onChange={(e) => setNewsForm({...newsForm, featured_image: e.target.value})}
              />
              
              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  {editingId ? '✓ Aggiorna Articolo' : '✓ Pubblica'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={resetNewsForm}
                  >
                    ✕ Annulla
                  </button>
                )}
              </div>
            </form>
            
            <h3>📋 Articoli Pubblicati</h3>
            <div className="items-list">
              {loading ? <p>Caricamento...</p> : news.length === 0 ? <p>Nessun articolo</p> : news.map(article => (
                <div key={article.id} className="list-item">
                  <div className="item-info">
                    <h4>{article.title}</h4>
                    <p className="slug">/{article.slug}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => editNews(article)} className="btn-edit">✏️ Modifica</button>
                    <button onClick={() => deleteNews(article.id)} className="btn-delete">🗑️ Elimina</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========== GALLERY TAB ========== */}
        {tab === 'gallery' && (
          <section className="admin-section">
            <h2>🖼️ Gestisci Galleria</h2>
            
            <form onSubmit={handleGallerySubmit} className="admin-form">
              <input
                type="text"
                placeholder="Titolo immagine *"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                required
              />
              
              <textarea
                placeholder="Descrizione"
                value={galleryForm.description}
                onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                rows="3"
              />
              
              <input
                type="url"
                placeholder="URL immagine *"
                value={galleryForm.image_url}
                onChange={(e) => setGalleryForm({...galleryForm, image_url: e.target.value})}
                required
              />
              
              <select
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})}
              >
                <option value="">-- Categoria --</option>
                <option value="Inaugurazione">Inaugurazione</option>
                <option value="Workshop">Workshop</option>
                <option value="Momenti">Momenti</option>
                <option value="Altro">Altro</option>
              </select>

              <select
                value={galleryForm.event_id}
                onChange={(e) => setGalleryForm({...galleryForm, event_id: e.target.value})}
              >
                <option value="">-- Evento (opzionale) --</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
              
              <button type="submit" className="btn-submit">✓ Aggiungi a Galleria</button>
            </form>
            
            <h3>📋 Immagini in Galleria</h3>
            <div className="gallery-list">
              {loading ? <p>Caricamento...</p> : gallery.length === 0 ? <p>Nessuna immagine</p> : gallery.map(img => (
                <div key={img.id} className="gallery-item-admin">
                  <img src={img.image_url} alt={img.title} className="gallery-thumb" />
                  <div className="gallery-info">
                    <h4>{img.title}</h4>
                    <p>{img.description}</p>
                    <p className="category">📁 {img.category}</p>
                  </div>
                  <button onClick={() => deleteGallery(img.id)} className="btn-delete">🗑️</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========== CONTACTS TAB ========== */}
        {tab === 'contacts' && (
          <section className="admin-section">
            <h2>✉️ Messaggi da Contatti</h2>
            
            <div className="contacts-list">
              {loading ? <p>Caricamento...</p> : contacts.length === 0 ? <p>Nessun messaggio</p> : contacts.map(contact => (
                <div key={contact.id} className="contact-item">
                  <div className="contact-header">
                    <h4>{contact.subject}</h4>
                    <span className={`status-badge status-${contact.status}`}>{contact.status}</span>
                  </div>
                  <p><strong>Da:</strong> {contact.name} ({contact.email})</p>
                  {contact.phone && <p><strong>Tel:</strong> {contact.phone}</p>}
                  <p className="message">{contact.message}</p>
                  <p className="date">📅 {new Date(contact.created_at).toLocaleDateString('it-IT')}</p>
                  <button onClick={() => deleteContact(contact.id)} className="btn-delete">🗑️ Elimina</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========== DONATIONS TAB ========== */}
        {tab === 'donations' && (
          <section className="admin-section">
            <h2>💰 Statistiche Donazioni</h2>
            {loading ? <p>Caricamento...</p> : donations.length > 0 && (
              <div className="donations-stats">
                <div className="stat-card">
                  <h3>Donazioni Totali</h3>
                  <p className="stat-value">{donations[0].total_donations || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Importo Raccolto</h3>
                  <p className="stat-value">€ {donations[0].total_amount ? donations[0].total_amount.toFixed(2) : '0.00'}</p>
                </div>
                <div className="stat-card">
                  <h3>Media per Donazione</h3>
                  <p className="stat-value">€ {donations[0].average_donation ? donations[0].average_donation.toFixed(2) : '0.00'}</p>
                </div>
              </div>
            )}
          </section>
        )}
        
      </div>
    </div>
  );
}

export default AdminPanel;