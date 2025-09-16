import React from 'react';

const impactData = [
  { value: '12,500', label: 'Registered Alumni' },
  { value: '4,800', label: 'Active Mentorships' },
  { value: '320', label: 'Events Hosted' },
  { value: '18,700', label: 'Forum Discussions' },
];

const ImpactNumbers = () => (
  <section
    style={{
      background: '#000',
      padding: '2rem 0 2.5rem 0',
      width: '100%',
      textAlign: 'center',
      marginTop: '3rem',
      borderRadius: 24,
    }}
  >
    <h2
      style={{
        color: '#fff',
        marginBottom: '1.8rem',
        fontFamily: 'cursive, "Comic Sans MS", "Baloo 2", sans-serif',
        fontWeight: 'bold',
        fontSize: '1.8rem',
        letterSpacing: 1,
      }}
    >
      Our Impact in Numbers
    </h2>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}
    >
      {impactData.map((item) => (
        <div
          key={item.label}
          style={{
            background: '#8141B3',
            color: '#fff',
            borderRadius: 14,
            minWidth: 160,
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 3px 15px rgba(60,0,80,0.04)',
          }}
        >
          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '0.3rem',
              letterSpacing: 0.8,
            }}
          >
            {item.value}
          </div>
          <div
            style={{
              fontSize: '0.95rem',
              fontWeight: 400,
              marginTop: 4,
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ImpactNumbers;
