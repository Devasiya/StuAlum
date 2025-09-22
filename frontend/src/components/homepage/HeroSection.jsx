import React from 'react';

const HeroSection = () => (
  <section
    style={{
      background: '#2e2142',           // Deep purple
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 24,
    }}
  >
    <div
      style={{
        maxWidth: 1100,
        width: '90%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        background: '#2e2142',
        borderRadius: 0,
        padding: '3.5rem 2.5rem',
        margin: '4rem auto',
        boxShadow: '0 0 0 0', // Remove outer box shadow if any
      }}
    >
      <div style={{ color: '#fff', flex: 1 }}>
        <h1
          style={{
            fontFamily: '"Baloo 2", "Comic Sans MS", cursive, sans-serif',
            fontWeight: 700,
            fontSize: '3.5rem',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: 2,
          }}
        >
          Connect.<br />Learn.<br />Grow.
        </h1>
        <p
          style={{
            margin: '2.1rem 0 1.6rem 0',
            fontSize: '1.25rem',
            fontFamily: 'cursive, monospace',
            fontWeight: 500,
            color: '#fff',
            letterSpacing: 0.5,
          }}
        >
          AI-powered Alumni-Student Networking Platform
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{
              background: '#492873',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              padding: '0.7rem 1.7rem',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0px 1px 6px rgba(50, 48, 63, 0.05)',
            }}
          >
            Find a Mentor
          </button>
          <button
            style={{
              background: 'transparent',
              color: '#ccc',
              border: '1.5px solid #1c1331',
              borderRadius: 6,
              fontWeight: 600,
              padding: '0.7rem 1.3rem',
              fontSize: '1rem',
              marginLeft: 8,
              cursor: 'pointer',
            }}
          >
            Explore Alumni
          </button>
        </div>
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <video
          src="/Hero_Sec.mp4"
          autoPlay
          loop
          muted
          style={{
            borderRadius: 12,
            width: '500px',        // Increased width
            maxWidth: '100%',
            background: '#222',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
