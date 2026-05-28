import type { FeatureDefinition } from './featureCatalog';

const surfaceAccent = {
  traveler: '#2563eb',
  provider: '#059669',
  admin: '#dc2626',
} as const;

export function FeaturePage({ feature }: { feature: FeatureDefinition }) {
  const accent = surfaceAccent[feature.surface];

  return (
    <section className="feature-page">
      <div className="feature-hero">
        <p className="eyebrow" style={{ color: accent }}>
          {feature.eyebrow}
        </p>
        <h1>{feature.title}</h1>
        <p className="feature-summary">{feature.summary}</p>
        <div className="metric-row">
          <div className="metric-tile">
            <span>Signal</span>
            <strong>{feature.primaryMetric}</strong>
          </div>
          <div className="metric-tile">
            <span>Surface</span>
            <strong>{feature.surface}</strong>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        <section className="panel">
          <h2>Workflow</h2>
          <ol className="workflow">
            {feature.workflow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <section className="panel">
          <h2>Modules</h2>
          <div className="module-list">
            {feature.modules.map((module) => (
              <span key={module}>{module}</span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
