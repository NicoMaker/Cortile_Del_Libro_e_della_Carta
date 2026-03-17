/**
 * Frontend Components - React
 * Reusable components for displaying content from backend API
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

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then(r => r.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Errore caricamento eventi:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">⏳ Caricamento eventi...</div>;

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
          <img src={event.image_url} alt={event.title} />
        </div>
      )}
      <div className="event-content">
        <span className="event-badge">{event.category}</span>
        <h3>{event.title}</h3>
        <p className="event-date">📅 {formatDate(event.date)} {event.time && `@ ${event.time}`}</p>
        <p className="event-location">📍 {event.location}</p>
        <p className="event-description">{event.description.substring(0, 100)}...</p>
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

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then(r => r.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Errore caricamento news:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">⏳ Caricamento notizie...</div>;

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
        <img src={article.featured_image} alt={article.title} className="news-thumbnail" />
      )}
      <div className="news-meta">
        <p className="news-date">{formatDate(article.published_at)}</p>
        <h3>{article.title}</h3>
        <p className="news-excerpt">{article.excerpt}</p>
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

  useEffect(() => {
    let url = `${API_URL}/gallery`;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (eventId) params.append('event_id', eventId);
    
    if (params.toString()) url += '?' + params.toString();

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Errore caricamento gallery:', err);
        setLoading(false);
      });
  }, [category, eventId]);

  if (loading) return <div className="loading">⏳ Caricamento galleria...</div>;

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
            <img src={img.image_url} alt={img.title} className="gallery-image" />
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
      } else {
        setMessage('❌ Errore invio messaggio. Riprova.');
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
      {message && <p className={`form-message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</p>}
    </section>
  );
}

// ============================================
// DONATION COMPONENT
// ============================================

export function DonationWidget() {
  const [amount, setAmount] = useState(20);
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: 'Anonymous',
          donor_email: 'donor@cortile.local',
          amount: amount,
          payment_method: selectedMethod
        })
      });

      if (res.ok) {
        alert('✓ Donazione registrata! Grazie!');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('❌ Errore donazione');
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
                className={`amount-btn ${amount === val ? 'active' : ''}`}
                onClick={() => setAmount(val)}
              >
                €{val}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
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
        </div>

        <button 
          className="donate-btn"
          onClick={handleDonate}
          disabled={loading}
        >
          {loading ? '⏳ Elaborazione...' : `Dona €${amount}`}
        </button>

        <p className="donation-info">
          Le tue donazioni supportano le attività culturali del Cortile del Libro e della Carta.
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

  useEffect(() => {
    fetch(`${API_URL}/sponsors`)
      .then(r => r.json())
      .then(data => {
        setSponsors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Errore caricamento sponsor:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">⏳ Caricamento sponsor...</div>;

  const goldSponsors = sponsors.filter(s => s.sponsor_level === 'Gold');
  const silverSponsors = sponsors.filter(s => s.sponsor_level === 'Silver');

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
    </section>
  );
}

function SponsorCard({ sponsor }) {
  return (
    <div className="sponsor-card">
      {sponsor.logo_url && (
        <img src={sponsor.logo_url} alt={sponsor.company_name} />
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

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}