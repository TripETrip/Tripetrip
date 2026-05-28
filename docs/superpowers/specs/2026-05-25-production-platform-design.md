# TripETrip Enterprise Travel OS Production Design

## Executive Decision

TripETrip will be converted **in place** into a clean enterprise monorepo. The current prototype will not be duplicated beside a new app. Valuable UI, tests, copy, and domain ideas will be migrated into the new architecture; obsolete Firebase, Vite-only, and prototype backend code will be removed after replacements are in place.

The production target is a billion-dollar-grade Travel Marketplace + Travel Operating System with:

- Next.js frontend apps.
- NestJS backend API gateway and domain services.
- PostgreSQL as the canonical relational database.
- Redis for cache, locks, session metadata, rate limits, booking cart TTLs, idempotency keys, and short-lived operational queues.
- Kafka for durable business events.
- Elasticsearch for search, discovery, and analytics indexing.
- AI orchestration for itinerary, pricing, trust, recommendations, and operations.
- Razorpay, Stripe, UPI, wallet, escrow, settlement, refund, and fraud-safe payment architecture.
- WhatsApp, email, SMS, and push notification architecture.
- Docker/Kubernetes/CI/CD/monitoring/logging foundations.
- Strict TypeScript, centralized contracts, RBAC, audit logs, and production-grade tests.

## Non-Negotiable Principles

- No duplicate application stacks.
- No hardcoded secrets.
- No direct frontend access to privileged backend operations.
- No sensitive payment, KYC, admin, or settlement action without audit logging.
- No feature without validation, loading/error/empty states, authorization, analytics hooks, and tests.
- Shared types and API contracts are centralized.
- Domain modules own their data, validation, permissions, events, and tests.
- Frontend is mobile-first, accessible, responsive, PWA-ready, and theme-aware.
- The architecture is modular now and service-extractable later.

## Monorepo Structure

```text
tripetrip/
  apps/
    web/
      src/
        app/
        modules/
          traveler/
          provider/
          admin/
          auth/
          marketplace/
          booking/
          community/
          trust-safety/
        components/
        lib/
        styles/
      public/
      next.config.ts
    api/
      src/
        main.ts
        app.module.ts
        common/
        config/
        modules/
          auth/
          users/
          vendors/
          listings/
          search/
          bookings/
          payments/
          inventory/
          pricing/
          crm/
          operations/
          ai-trip-planner/
          community/
          trust-safety/
          adventure-os/
          transport/
          whatsapp-commerce/
          notifications/
          admin/
          audit/
        integrations/
          postgres/
          redis/
          kafka/
          elasticsearch/
          razorpay/
          stripe/
          cloudinary/
          openai/
          vector-db/
          maps/
          email/
          sms/
          whatsapp/
          push/
          sentry/
      test/
    worker/
      src/
        consumers/
        jobs/
        projections/
        ai/
        notifications/
        payments/
  packages/
    types/
    constants/
    validators/
    api-contracts/
    ui/
    config/
    database/
    observability/
    analytics/
    security/
  infra/
    docker/
    k8s/
    ci/
    monitoring/
  tests/
    e2e/
    api/
    load/
    security/
  docs/
```

## Frontend Architecture

The frontend is a single Next.js app with three protected product surfaces rather than three duplicated frontends.

### Traveler Surface

Routes:

- `/`
- `/discover`
- `/search`
- `/map`
- `/listing/[id]`
- `/provider/[slug]`
- `/trip-planner`
- `/trips`
- `/bookings/[id]`
- `/wallet`
- `/wishlist`
- `/community`
- `/memories`
- `/safety`

Capabilities:

- Destination discovery.
- Smart search and map search.
- AI trip planner.
- Group trip collaboration.
- Booking cart.
- Secure checkout.
- Saved trips and wishlist.
- Itinerary management.
- Reviews, memories, stories, and community.
- Emergency contacts, SOS, safe travel tools.

### Provider Surface

Routes:

- `/provider/dashboard`
- `/provider/onboarding`
- `/provider/kyc`
- `/provider/listings`
- `/provider/inventory`
- `/provider/bookings`
- `/provider/calendar`
- `/provider/pricing`
- `/provider/staff`
- `/provider/operations`
- `/provider/fleet`
- `/provider/adventure`
- `/provider/crm`
- `/provider/marketing`
- `/provider/payouts`
- `/provider/analytics`
- `/provider/settings`
- `/provider/storefront`

Capabilities:

- Vendor onboarding and KYC.
- Multi-business management.
- Listings and media management.
- Availability and channel management.
- Calendar and pricing rules.
- Staff, housekeeping, maintenance, rosters.
- Adventure slot, guide, equipment, waiver, and risk management.
- Transport fleet, driver, GPS, route, fuel, and payout management.
- CRM, WhatsApp commerce, campaigns, leads, and follow-ups.
- Payouts, escrow, refunds, financial reporting.
- Provider trust score and analytics.

### Admin Surface

Routes:

- `/admin`
- `/admin/users`
- `/admin/vendors`
- `/admin/kyc`
- `/admin/listings`
- `/admin/bookings`
- `/admin/payments`
- `/admin/refunds`
- `/admin/fraud`
- `/admin/trust-safety`
- `/admin/community`
- `/admin/cms`
- `/admin/subscriptions`
- `/admin/support`
- `/admin/audit-logs`
- `/admin/ai`
- `/admin/analytics`

Capabilities:

- User and vendor management.
- Vendor approval and KYC review.
- Listing moderation.
- Booking oversight.
- Refund and dispute approval.
- Fraud monitoring.
- CMS and destination management.
- Commission/subscription management.
- AI moderation and AI logs.
- Support workflows.
- Audit and security review.

## Backend Architecture

The NestJS API is the system gateway. Each module exposes controllers, services, DTOs, validators, authorization policies, events, and tests.

### Common Backend Layers

- `common/auth`: JWT parsing, session context, RBAC guards.
- `common/security`: rate limiting, request validation, encryption helpers, IP/device risk.
- `common/errors`: standardized error responses.
- `common/logging`: structured logs with request IDs.
- `common/audit`: critical action audit helper.
- `common/events`: Kafka producer abstraction.
- `common/cache`: Redis cache and lock helpers.
- `common/pagination`: consistent list responses.
- `common/openapi`: Swagger tags and examples.

### Core Modules

#### 1. Authentication and Access Control

Features:

- Email login.
- Mobile OTP login.
- Social login.
- JWT auth.
- RBAC.
- Session and device management.
- MFA.
- Suspicious login detection.
- Vendor KYC gate.
- Admin access control.
- Auth audit logs.

Key backend concepts:

- `auth_sessions`
- `auth_devices`
- `mfa_factors`
- `login_events`
- `suspicious_login_events`

#### 2. User Management

Features:

- User profiles.
- Traveler profile.
- Vendor profile.
- Organization accounts.
- Saved trips.
- Wishlist.
- Booking history.
- Preferences.
- Wallet.
- Notification preferences.
- Emergency contacts.
- Identity verification.

#### 3. Vendor Management

Features:

- Vendor onboarding.
- KYC verification.
- Subscription plans.
- Approval workflow.
- Multi-business support.
- Staff management.
- Vendor roles.
- Trust scores.
- Vendor analytics.

#### 4. Listing Management

Features:

- Accommodation, activity, transport, event, and experience listings.
- AI listing generation.
- Pricing rules.
- Amenities.
- Availability.
- SEO metadata.
- Multilingual content.
- Image/video uploads.
- AR preview metadata.

#### 5. Search and Discovery

Features:

- Keyword search.
- Semantic search.
- Voice search API contract.
- Geo search.
- Map search.
- Nearby discovery.
- Trending destinations.
- Hyperlocal recommendations.
- Personalized feeds.
- Safety filters.
- AI ranking.

Architecture:

- PostgreSQL owns canonical listing data.
- Kafka publishes indexing events.
- Worker projects listing/provider/destination documents into Elasticsearch.
- Vector database stores embeddings for semantic recommendations.

#### 6. Booking Engine

Features:

- Real-time booking.
- Redis inventory locks.
- Multi-vendor booking cart.
- Dynamic availability.
- Group booking.
- Split payments.
- Partial payments.
- Coupons.
- Refunds.
- Cancellation engine.
- Lifecycle tracking.
- Emergency rebooking.
- Upsells.

Booking state machine:

```text
draft
  -> inventory_locked
  -> pending_payment
  -> escrowed
  -> confirmed
  -> checked_in
  -> settlement_pending
  -> settled
  -> completed

draft -> abandoned
inventory_locked -> expired
pending_payment -> failed
escrowed -> cancellation_requested
cancellation_requested -> refund_pending
refund_pending -> refunded
```

#### 7. Payment and Fintech

Features:

- Razorpay.
- Stripe.
- UPI.
- Wallet.
- Escrow.
- Vendor settlement.
- Payouts.
- Revenue sharing.
- Refunds.
- GST invoices.
- Fraud detection.
- Financial reporting.

Rules:

- Payment events are append-only.
- Ledger entries are immutable.
- Webhooks are signature-verified.
- Settlement requires booking/check-in validation.
- Admin overrides are audited.

#### 8. Inventory and Channel Management

Features:

- Calendar sync.
- OTA/channel manager adapter contracts.
- Real-time availability.
- Inventory allocation.
- Overbooking prevention.
- Seasonal inventory.
- Bulk updates.
- Multi-property management.

#### 9. AI Dynamic Pricing

Features:

- Demand pricing.
- Occupancy pricing.
- Festival pricing.
- Competitor pricing adapter contract.
- Revenue optimization.
- Smart discounts.
- Seasonal pricing.

#### 10. CRM and Marketing Automation

Features:

- Segmentation.
- Loyalty and rewards.
- Campaigns.
- Email and WhatsApp automation.
- Retargeting events.
- Referrals.
- Influencer campaigns.
- Lead scoring.
- Follow-ups.

#### 11. Staff and Operations

Features:

- Staff roles.
- Attendance.
- Payroll data model.
- Housekeeping.
- Task assignment.
- Shift scheduling.
- Internal communication.
- Maintenance.
- Incident reports.
- Performance analytics.

#### 12. AI Trip Planner

Features:

- AI itinerary builder.
- Drag/drop itinerary data model.
- Group collaboration.
- Commute planning.
- Budget planner.
- Travel assistant.
- Route optimization.
- Weather-aware planning adapter.
- Crowd prediction adapter.
- Emergency rerouting.

#### 13. Community and Social

Features:

- Social feed.
- Travel reels metadata.
- Travel stories.
- Public itineraries.
- Creator storefronts.
- Community groups.
- Co-traveler matching.
- Reviews.
- Gamification and badges.

#### 14. Trust and Safety

Features:

- Verified reviews.
- Fraud scoring.
- Women-safe badges.
- SOS.
- Live location sharing contract.
- Dispute management.
- Document vault.
- AI moderation.
- Safety scoring.
- Community reports.

#### 15. Adventure and Experience OS

Features:

- Slot management.
- Guide assignment.
- Equipment.
- Trek management.
- Waivers.
- Insurance metadata.
- Risk management.
- Emergency alerts.

#### 16. Transport Management

Features:

- Fleet.
- Drivers.
- GPS tracking adapter contract.
- Ride allocation.
- Route optimization.
- Fuel.
- Driver payouts.
- Airport transfers.
- Intercity bookings.

#### 17. WhatsApp Commerce

Features:

- WhatsApp booking flow.
- Conversational AI.
- Reminders.
- Notifications.
- Support.
- Voice booking contract.
- Broadcast campaigns.

#### 18. Admin Panel

Features:

- User management.
- Vendor moderation.
- Fraud monitoring.
- Analytics.
- CMS.
- Commissions.
- Subscriptions.
- Refund approvals.
- AI moderation.
- KYC.
- Support.

## Database Architecture

PostgreSQL is the canonical database. The schema is modular, relational, and tenant-aware.

### Multi-Tenant Model

Core tenancy:

- `organizations` represent vendor companies, travel agencies, creator businesses, or rural tourism clusters.
- `organization_members` attach users to organizations.
- `organization_roles` define scoped permissions.
- Every provider-side resource references `organization_id`.
- Travelers may belong to trip groups but do not require an organization.

### Core Tables

Identity and access:

- `users`
- `user_profiles`
- `traveler_profiles`
- `organizations`
- `organization_members`
- `organization_roles`
- `permissions`
- `role_permissions`
- `auth_sessions`
- `auth_devices`
- `mfa_factors`
- `login_events`

Vendor and compliance:

- `vendor_profiles`
- `vendor_kyc_documents`
- `vendor_verifications`
- `vendor_subscriptions`
- `vendor_trust_scores`
- `staff_members`
- `staff_roles`
- `staff_rosters`

Listings:

- `listings`
- `listing_translations`
- `listing_media`
- `listing_amenities`
- `listing_seo`
- `listing_availability`
- `listing_pricing_rules`
- `listing_ar_assets`

Search/discovery:

- `destinations`
- `destination_translations`
- `search_events`
- `recommendation_events`
- `traveler_preferences`
- `personalized_feed_items`

Booking:

- `booking_carts`
- `booking_cart_items`
- `inventory_locks`
- `bookings`
- `booking_items`
- `booking_events`
- `booking_travelers`
- `booking_cancellations`
- `refund_requests`
- `coupons`
- `coupon_redemptions`

Payments:

- `wallets`
- `wallet_transactions`
- `payment_intents`
- `payment_events`
- `escrow_accounts`
- `ledger_entries`
- `payout_accounts`
- `payout_transfers`
- `invoices`
- `tax_records`
- `fraud_signals`

Operations:

- `tasks`
- `maintenance_tickets`
- `housekeeping_jobs`
- `attendance_records`
- `incident_reports`
- `internal_messages`

Adventure:

- `adventure_slots`
- `guide_profiles`
- `guide_assignments`
- `equipment_items`
- `equipment_allocations`
- `safety_waivers`
- `risk_assessments`

Transport:

- `vehicles`
- `drivers`
- `driver_documents`
- `vehicle_locations`
- `ride_allocations`
- `routes`
- `fuel_logs`
- `driver_payouts`

AI:

- `ai_requests`
- `ai_itineraries`
- `ai_itinerary_items`
- `ai_pricing_recommendations`
- `ai_recommendation_events`
- `ai_moderation_events`
- `vector_embedding_refs`

CRM/community:

- `crm_contacts`
- `crm_segments`
- `campaigns`
- `campaign_events`
- `loyalty_accounts`
- `referrals`
- `community_posts`
- `community_media`
- `community_groups`
- `reviews`
- `creator_storefronts`

Safety/notifications/audit:

- `sos_events`
- `location_shares`
- `disputes`
- `document_vault_items`
- `safety_reports`
- `notifications`
- `notification_deliveries`
- `audit_logs`

## API Contracts

API contracts live in `packages/api-contracts` and are shared by NestJS controllers and the Next.js client. Runtime validation uses shared Zod schemas or generated DTO validators. OpenAPI is generated from backend decorators and contract metadata.

Representative route groups:

```text
/auth
/users
/vendors
/listings
/search
/bookings
/payments
/inventory
/pricing
/crm
/operations
/ai-trip-planner
/community
/trust-safety
/adventure-os
/transport
/whatsapp-commerce
/notifications
/admin
/audit
```

## RBAC Matrix

Roles:

- `traveler`
- `provider_owner`
- `provider_admin`
- `provider_manager`
- `provider_staff`
- `guide`
- `driver`
- `creator`
- `support_agent`
- `finance_admin`
- `trust_safety_admin`
- `platform_admin`
- `super_admin`

Permission groups:

- `profile.read/write`
- `listing.read/write/publish/moderate`
- `inventory.read/write`
- `booking.read/create/update/cancel/override`
- `payment.read/create/refund/settle`
- `payout.read/approve`
- `staff.read/write`
- `fleet.read/write/assign`
- `crm.read/write/campaign`
- `community.read/write/moderate`
- `trust.read/write/override`
- `admin.read/write`
- `audit.read`

Permission checks are enforced in backend guards. Frontend route guards hide unavailable features but are never the final authority.

## Event-Driven Architecture

Kafka topics:

- `auth.events`
- `vendor.events`
- `listing.events`
- `search.indexing`
- `booking.events`
- `payment.events`
- `inventory.events`
- `pricing.events`
- `crm.events`
- `operations.events`
- `ai.events`
- `community.events`
- `trust_safety.events`
- `transport.events`
- `notification.events`
- `audit.events`

Workers:

- Search indexing worker.
- Notification delivery worker.
- Payment reconciliation worker.
- Settlement worker.
- AI itinerary worker.
- AI pricing worker.
- Fraud scoring worker.
- Analytics projection worker.

## Caching Strategy

Redis is used for:

- Session metadata.
- Rate limiting.
- Inventory locks.
- Booking cart TTL.
- Search filter cache.
- Destination trend cache.
- Provider dashboard aggregate cache.
- AI response cache for safe repeatable prompts.
- Idempotency keys for payment/webhook processing.

Cache invalidation is event-driven where possible. Financial and audit data is never served only from cache.

## Search Architecture

Elasticsearch stores denormalized documents for:

- Listings.
- Providers.
- Destinations.
- Experiences.
- Community posts.
- Public itineraries.

Indexing flow:

```text
Postgres write -> Kafka event -> worker projection -> Elasticsearch index
```

Semantic search flow:

```text
Traveler intent -> embedding -> vector search -> candidate listings -> business ranking -> personalized response
```

## AI Orchestration Architecture

AI services run behind the backend only.

AI capabilities:

- Travel copilot.
- AI itinerary builder.
- AI listing generation.
- AI dynamic pricing.
- Demand prediction.
- Fraud scoring.
- Review moderation.
- Travel journaling.
- Memory generation.
- Disruption alerts.
- Sustainability scoring.

AI safety:

- Prompt templates are versioned.
- Inputs/outputs are audit logged.
- PII is minimized.
- High-impact actions require human/admin confirmation.
- CI uses deterministic mock model responses.

## Notification Architecture

Channels:

- In-app.
- Push.
- WhatsApp.
- SMS.
- Email.

Flow:

```text
Domain event -> notification rule -> notification row -> delivery worker -> provider adapter -> delivery log
```

Every delivery attempt stores provider response, retry count, and final status.

## Security Architecture

Security controls:

- JWT auth.
- RBAC and organization-scoped permissions.
- MFA support.
- Device/session management.
- API rate limiting.
- Request validation.
- SQL parameterization through ORM/query layer.
- Encryption for sensitive document metadata.
- Secrets only through env/secret manager.
- Audit logs for critical actions.
- Fraud signals and suspicious login detection.
- Webhook signature verification.
- Admin action review trail.
- Content moderation for community and reviews.

## DevOps and Deployment Architecture

Local development:

- Docker Compose for Postgres, Redis, Kafka, Elasticsearch.
- Next.js web app.
- NestJS API.
- Worker process.

Production:

- Kubernetes for API, web, worker, and scheduled jobs.
- Managed PostgreSQL.
- Managed Redis.
- Managed Kafka or cloud event streaming.
- Managed Elasticsearch/OpenSearch.
- Object/media through Cloudinary or cloud object storage.

CI/CD:

- Install.
- Type check.
- Lint.
- Unit tests.
- Integration tests.
- API tests.
- E2E tests.
- Security checks.
- Build Docker images.
- Push images.
- Deploy through environment-specific manifests.

Monitoring:

- Structured JSON logs.
- Request IDs.
- Sentry frontend/backend.
- Metrics for API latency, queue lag, payment failures, webhook failures, booking conversion, AI cost, and search latency.
- Alerts for payment/webhook/settlement failures.

## Testing Strategy

Required tests:

- Unit tests for services, validators, pricing rules, RBAC policies.
- Integration tests for database modules and API modules.
- API tests for all route groups.
- E2E tests for traveler, provider, admin, booking, payment, AI, community, and trust workflows.
- Load tests for search, listing detail, booking, and checkout.
- Security tests for RBAC, IDOR, rate limiting, webhook validation, role escalation, and payload abuse.
- Performance tests for bundle size, web vitals, API latency, and search response time.

## Migration Rules

The migration is in-place and clean:

1. Create monorepo structure.
2. Move reusable UI into `packages/ui`.
3. Move shared constants/types into packages.
4. Replace Vite app with Next.js app under `apps/web`.
5. Replace Express server with NestJS under `apps/api`.
6. Add worker under `apps/worker`.
7. Move database schema into `packages/database`.
8. Preserve Playwright tests by migrating them to the new routes.
9. Remove Firebase files only after no runtime imports remain.
10. Remove obsolete Vite/Express files only after Next/Nest builds pass.

No duplicate app remains at the end of the migration.

## Acceptance Criteria

The repository is production-ready when:

- `apps/web` is the only frontend app.
- `apps/api` is the only backend API.
- `apps/worker` owns async processing.
- Shared types/contracts/constants are centralized in packages.
- Firebase runtime usage is removed.
- Vite/Express prototype files are removed after migration.
- PostgreSQL schema covers all core modules.
- RBAC and audit logging exist for critical actions.
- Kafka event contracts exist for core workflows.
- Redis locks/cache exist for booking and rate limiting.
- Elasticsearch indexing contracts exist.
- AI orchestration endpoints and worker flows exist.
- Payment architecture supports Razorpay, Stripe, UPI, wallet, escrow, refunds, payouts, and audit.
- Traveler, provider, and admin surfaces are implemented in Next.js.
- CI can run lint, typecheck, unit, integration, API, E2E, security, and build checks.
- No secrets are hardcoded.
- No duplicated legacy app stack remains.
