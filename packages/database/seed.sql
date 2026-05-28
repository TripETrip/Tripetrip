INSERT INTO users (email, full_name)
VALUES ('founder@tripetrip.com', 'TripETrip Founder')
ON CONFLICT (email) DO NOTHING;

INSERT INTO organizations (name, slug, organization_type)
VALUES ('Demo Himalayan Collective', 'demo-himalayan-collective', 'rural_tourism')
ON CONFLICT (slug) DO NOTHING;
