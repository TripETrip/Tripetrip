import { AppShell } from '../../modules/shared/AppShell';

export default function AdminPage() {
  return (
    <AppShell>
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 20px' }}>
        <p style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 800, color: '#dc2626', letterSpacing: '0.16em' }}>
          Platform Admin
        </p>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '-0.05em', margin: '12px 0' }}>
          Govern trust, safety, vendors, payments, support, and AI operations.
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 32 }}>
          {['KYC review', 'Fraud monitoring', 'Refund approvals', 'AI moderation', 'Audit logs', 'Support control'].map((item) => (
            <div key={item} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, fontWeight: 800 }}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
