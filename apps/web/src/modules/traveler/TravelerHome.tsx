export function TravelerHome() {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '72px 20px' }}>
      <p style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 800, color: '#4f46e5', letterSpacing: '0.16em' }}>
        Travel Marketplace + Travel OS
      </p>
      <h1 style={{ fontSize: 'clamp(42px, 8vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.06em', margin: '16px 0' }}>
        Book trusted travel services and run the journey from one place.
      </h1>
      <p style={{ maxWidth: 680, color: '#475569', fontSize: 18, lineHeight: 1.7 }}>
        Discover stays, transport, guides, treks, rural experiences, and AI-built itineraries backed by secure payments and verified local providers.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 40 }}>
        {['AI trip planner', 'Verified local supply', 'Escrow payments', 'Group travel workspace'].map((item) => (
          <div key={item} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, fontWeight: 800 }}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
