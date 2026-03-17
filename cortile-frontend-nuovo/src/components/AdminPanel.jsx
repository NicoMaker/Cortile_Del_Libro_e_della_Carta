/**
 * Admin Panel Component - React
 * Manage Events, News, and Donations
 * 
 * Place this in: src/components/AdminPanel.jsx
 */

import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminPanel() {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    image_url: ''
  });
  
  const [newsForm, setNewsForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: ''
  });
  
  const API_URL = 'http://localhost:5000/api';
  
  useEffect(() => {
    if (tab === 'events') fetchEvents();
    if (tab === 'news') fetchNews();
    if (tab === 'donations') fetchDonations();
  }, [tab]);
  
  // ============================================
  // EVENTS
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
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm)
      });
      
      if (res.ok) {
        alert('✓ Evento creato!');
        setEventForm({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category: '',
          image_url: ''
        });
        fetchEvents();
      }
    } catch (err) {
      console.error('Errore creazione evento:', err);
      alert('❌ Errore creazione evento');
    }
  };
  
  const deleteEvent = async (id) => {
    if (!confirm('Sei sicuro?')) return;
    try {
      await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      console.error('Errore delete:', err);
    }
  };
  
  // ============================================
  // NEWS
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
    try {
      const res = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsForm)
      });
      
      if (res.ok) {
        alert('✓ Articolo pubblicato!');
        setNewsForm({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          featured_image: ''
        });
        fetchNews();
      }
    } catch (err) {
      console.error('Errore creazione news:', err);
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
          className={`tab-btn ${tab === 'donations' ? 'active' : ''}`}
          onClick={() => setTab('donations')}
        >
          💰 Donazioni
        </button>
      </nav>
      
      <div className="admin-content">
        
        {/* EVENTS TAB */}
        {tab === 'events' && (
          <section className="admin-section">
            <h2>Crea Nuovo Evento</h2>
            <form onSubmit={handleEventSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Titolo evento"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Descrizione"
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
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
                placeholder="Luogo"
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                required
              />
              <select
                value={eventForm.category}
                onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
              >
                <option value="">-- Seleziona categoria --</option>
                <option value="Inaugurazione">Inaugurazione</option>
                <option value="Workshop">Workshop</option>
                <option value="Conferenza">Conferenza</option>
                <option value="Esposizione">Esposizione</option>
              </select>
              <input
                type="url"
                placeholder="URL immagine"
                value={eventForm.image_url}
                onChange={(e) => setEventForm({...eventForm, image_url: e.target.value})}
              />
              <button type="submit" className="btn-submit">✓ Crea Evento</button>
            </form>
            
            <h3>Elenco Eventi</h3>
            <div className="events-list">
              {loading ? <p>Caricamento...</p> : events.length === 0 ? <p>Nessun evento</p> : events.map(event => (
                <div key={event.id} className="event-item">
                  <div>
                    <h4>{event.title}</h4>
                    <p>{event.date} - {event.location}</p>
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="btn-delete">🗑️</button>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* NEWS TAB */}
        {tab === 'news' && (
          <section className="admin-section">
            <h2>Pubblica Nuova Notizia</h2>
            <form onSubmit={handleNewsSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Titolo articolo"
                value={newsForm.title}
                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Slug (es: il-cortile-2026)"
                value={newsForm.slug}
                onChange={(e) => setNewsForm({...newsForm, slug: e.target.value})}
                required
              />
              <textarea
                placeholder="Estratto / Anteprima"
                value={newsForm.excerpt}
                onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
                rows="2"
              />
              <textarea
                placeholder="Contenuto completo (HTML supportato)"
                value={newsForm.content}
                onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                required
                rows="8"
              />
              <input
                type="url"
                placeholder="URL immagine"
                value={newsForm.featured_image}
                onChange={(e) => setNewsForm({...newsForm, featured_image: e.target.value})}
              />
              <button type="submit" className="btn-submit">✓ Pubblica</button>
            </form>
            
            <h3>Articoli Pubblicati</h3>
            <div className="news-list">
              {loading ? <p>Caricamento...</p> : news.length === 0 ? <p>Nessun articolo</p> : news.map(article => (
                <div key={article.id} className="news-item">
                  <h4>{article.title}</h4>
                  <p className="slug">/{article.slug}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* DONATIONS TAB */}
        {tab === 'donations' && (
          <section className="admin-section">
            <h2>Statistiche Donazioni</h2>
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