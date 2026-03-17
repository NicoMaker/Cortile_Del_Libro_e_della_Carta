import { useState } from 'react'
import './App.css'
import { EventsList, NewsList, Gallery, ContactForm, DonationWidget, SponsorsList } from './components/FrontendComponents'
import AdminPanel from './components/AdminPanel'

function App() {
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <div className="app">
      {!showAdmin ? (
        <>
          {/* NAVBAR */}
          <nav className="navbar">
            <div className="navbar-container">
              <h1 className="logo">🎯 Cortile del Libro e della Carta</h1>
              <button 
                className="admin-toggle"
                onClick={() => setShowAdmin(true)}
              >
                🔧 Admin
              </button>
            </div>
          </nav>

          {/* MAIN CONTENT */}
          <main className="main-content">
            {/* HERO SECTION */}
            <section className="hero">
              <div className="hero-content">
                <h2>Benvenuti al Cortile 2026</h2>
                <p>Un'esperienza culturale unica dedicata al libro, alla carta e alle storie che raccontano</p>
              </div>
            </section>

            {/* EVENTS */}
            <section className="section">
              <EventsList />
            </section>

            {/* GALLERY */}
            <section className="section">
              <Gallery />
            </section>

            {/* NEWS */}
            <section className="section">
              <NewsList />
            </section>

            {/* DONATION */}
            <section className="section">
              <DonationWidget />
            </section>

            {/* SPONSORS */}
            <section className="section">
              <SponsorsList />
            </section>

            {/* CONTACT */}
            <section className="section">
              <ContactForm />
            </section>
          </main>

          {/* FOOTER */}
          <footer className="footer">
            <p>&copy; 2026 Cortile del Libro e della Carta. Tutti i diritti riservati.</p>
            <p>📍 Bologna | 📧 info@cortile.local</p>
          </footer>
        </>
      ) : (
        <div className="admin-wrapper">
          <button 
            className="back-btn"
            onClick={() => setShowAdmin(false)}
          >
            ← Torna al Sito
          </button>
          <AdminPanel />
        </div>
      )}
    </div>
  )
}

export default App