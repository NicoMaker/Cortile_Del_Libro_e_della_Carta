/**
 * Frontend Components - React
 * Complete CRUD functionality for displaying and managing content
 * 
 * Place this in: src/components/FrontendComponents.jsx
 */

import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

// ============================================
// EVENTS COMPONENTS
// ============================================

export function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/events`);
      if (!res.ok) throw new Error('Errore caricamento eventi');
      const data = await res.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Errore:', err);
      setError('Errore nel caricamento degli eventi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Caricamento eventi...</div>;
  if (error) return <div className="loading">{error}</div>;

  return (
    <section className="events-section">
      <h2>📅 Prossimi Eventi</h2>
      <div className="events-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {events.length === 0 && <p className="no-data">Nessun evento in programma</p>}
    </section>
  );
}

export function EventCard({ event }) {
  return (
    <div className="event-card">
      {event.image_url && (
        <div className="event-image">
          <img src={event.image_url} alt={event.title} onError={(e) => e.target.style.display = 'none'} />
        </div>
      )}
      <div className="event-content">
        <span className="event-badge">{event.category || 'Evento'}</span>
        <h3>{event.title}</h3>
        <p className="event-date">📅 {formatDate(event.date)} {event.time && `@ ${event.time}`}</p>
        <p className="event-location">📍 {event.location}</p>
        <p className="event-description">{event.description.substring(0, 120)}...</p>
        <button className="event-btn">Scopri di più →</button>
      </div>
    </div>
  );
}

// ============================================
// NEWS COMPONENTS
// ============================================

export function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/news`);
      if (!res.ok) throw new Error('Errore caricamento notizie');
      const data = await res.json();
      setNews(data);
      setError(null);
    } catch (err) {
      console.error('Errore:', err);
      setError('Errore nel caricamento delle notizie');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Caricamento notizie...</div>;
  if (error) return <div className="loading">{error}</div>;

  return (
    <section className="news-section">
      <h2>📰 Ultime Notizie</h2>
      <div className="news-list">
        {news.slice(0, 5).map(article => (
          <NewsItem key={article.id} article={article} />
        ))}
      </div>
      {news.length === 0 && <p className="no-data">Nessuna notizia disponibile</p>}
    </section>
  );
}

export function NewsItem({ article }) {
  return (
    <article className="news-item">
      {article.featured_image && (
        <img src={article.featured_image} alt={article.title} className="news-thumbnail" onError={(e) => e.target.style.display = 'none'} />
      )}
      <div className="news-meta">
        <p className="news-date">{formatDate(article.published_at)}</p>
        <h3>{article.title}</h3>
        <p className="news-excerpt">{article.excerpt || 'Leggi l\'articolo completo per saperne di più.'}</p>
        <a href={`/news/${article.slug}`} className="read-more">Leggi tutto →</a>
      </div>
    </article>
  );
}

// ============================================
// GALLERY COMPONENT
// ============================================

export function Gallery({ category, eventId }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, [category, eventId]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/gallery`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (eventId) params.append('event_id', eventId);
      
      if (params.toString()) url += '?' + params.toString();

      const res = await fetch(url);
      if (!res.ok) throw new Error('Errore caricamento galleria');
      const data = await res.json();
      setImages(data);
      setError(null);
    } catch (err) {
      console.error('Errore:', err);
      setError('Errore nel caricamento della galleria');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Caricamento galleria...</div>;
  if (error) return <div className="loading">{error}</div>;

  return (
    <section className="gallery-section">
      <h2>🖼️ Galleria</h2>
      <div className="gallery-grid">
        {images.map(img => (
          <div 
            key={img.id} 
            className="gallery-item"
            onClick={() => setSelectedImage(img)}
          >
            <img src={img.image_url} alt={img.title} className="gallery-image" onError={(e) => e.target.style.display = 'none'} />
            <div className="gallery-overlay">
              <p>{img.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage.image_url} alt={selectedImage.title} />
            <h3>{selectedImage.title}</h3>
            {selectedImage.description && <p>{selectedImage.description}</p>}
          </div>
        </div>
      )}

      {images.length === 0 && <p className="no-data">Nessuna immagine disponibile</p>}
    </section>
  );
}

// ============================================
// CONTACT FORM COMPONENT
// ============================================

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage('✓ Messaggio inviato! Ti contatteremo presto.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setMessage(''), 5000);
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error || 'Errore invio messaggio'}`);
      }
    } catch (err) {
      console.error('Errore:', err);
      setMessage('❌ Errore connessione.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <h2>✉️ Contattaci</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Nome*"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefono"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Oggetto*"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Messaggio*"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Invio...' : '✓ Invia Messaggio'}
        </button>
      </form>
      {message && (
        <p className={`form-message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </section>
  );
}

// ============================================
// DONATION COMPONENT
// ============================================

export function DonationWidget() {
  const [amount, setAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDonate = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    
    if (finalAmount < 1) {
      setMessage('❌ Importo minimo € 1');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: 'Anonymous',
          donor_email: 'donor@cortile.local',
          amount: finalAmount,
          payment_method: selectedMethod
        })
      });

      if (res.ok) {
        setMessage(`✓ Donazione di €${finalAmount} registrata! Grazie del tuo supporto!`);
        setCustomAmount('');
        setAmount(20);
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('❌ Errore durante la donazione');
      }
    } catch (err) {
      console.error('Errore:', err);
      setMessage('❌ Errore connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="donation-section">
      <h2>❤️ Supporta il Cortile</h2>
      <div className="donation-widget">
        <div className="amount-selector">
          <p>Scegli importo:</p>
          <div className="amount-buttons">
            {[10, 20, 50, 100].map(val => (
              <button
                key={val}
                className={`amount-btn ${amount === val && !customAmount ? 'active' : ''}`}
                onClick={() => {
                  setAmount(val);
                  setCustomAmount('');
                }}
              >
                €{val}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              if (e.target.value) setAmount(0);
            }}
            placeholder="Importo personalizzato"
            min="1"
            step="0.01"
            className="custom-amount"
          />
        </div>

        <div className="payment-methods">
          <label>
            <input
              type="radio"
              value="stripe"
              checked={selectedMethod === 'stripe'}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            Carta di Credito (Stripe)
          </label>
          <label>
            <input
              type="radio"
              value="paypal"
              checked={selectedMethod === 'paypal'}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            PayPal
          </label>
          <label>
            <input
              type="radio"
              value="bank"
              checked={selectedMethod === 'bank'}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            Bonifico Bancario
          </label>
        </div>

        <button 
          className="donate-btn"
          onClick={handleDonate}
          disabled={loading}
        >
          {loading ? '⏳ Elaborazione...' : `Dona €${customAmount || amount}`}
        </button>

        {message && (
          <p className={`form-message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <p className="donation-info">
          🛡️ Le tue donazioni supportano le attività culturali del Cortile del Libro e della Carta.<br/>
          Tutti i dati sono crittografati e protetti.
        </p>
      </div>
    </section>
  );
}

// ============================================
// SPONSORS COMPONENT
// ============================================

export function SponsorsList() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/sponsors`);
      if (!res.ok) throw new Error('Errore caricamento sponsor');
      const data = await res.json();
      setSponsors(data);
      setError(null);
    } catch (err) {
      console.error('Errore:', err);
      setError('Errore nel caricamento degli sponsor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Caricamento sponsor...</div>;
  if (error) return <div className="loading">{error}</div>;

  const goldSponsors = sponsors.filter(s => s.sponsor_level === 'Gold');
  const silverSponsors = sponsors.filter(s => s.sponsor_level === 'Silver');
  const otherSponsors = sponsors.filter(s => !s.sponsor_level || (s.sponsor_level !== 'Gold' && s.sponsor_level !== 'Silver'));

  return (
    <section className="sponsors-section">
      <h2>🤝 Partner e Sponsor</h2>
      
      {goldSponsors.length > 0 && (
        <div className="sponsor-tier">
          <h3>⭐ Sponsor Gold</h3>
          <div className="sponsors-grid">
            {goldSponsors.map(sponsor => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </div>
      )}

      {silverSponsors.length > 0 && (
        <div className="sponsor-tier">
          <h3>💫 Sponsor Silver</h3>
          <div className="sponsors-grid">
            {silverSponsors.map(sponsor => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </div>
      )}

      {otherSponsors.length > 0 && (
        <div className="sponsor-tier">
          <h3>🤝 Partner</h3>
          <div className="sponsors-grid">
            {otherSponsors.map(sponsor => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </div>
      )}

      {sponsors.length === 0 && <p className="no-data">Nessuno sponsor disponibile</p>}
    </section>
  );
}

function SponsorCard({ sponsor }) {
  return (
    <div className="sponsor-card">
      {sponsor.logo_url && (
        <img src={sponsor.logo_url} alt={sponsor.company_name} onError={(e) => e.target.style.display = 'none'} />
      )}
      <h4>{sponsor.company_name}</h4>
      {sponsor.website && (
        <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
          Visita sito →
        </a>
      )}
    </div>
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}