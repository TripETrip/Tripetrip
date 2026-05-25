# TripETrip Database Package

This package contains versioned PostgreSQL schema and seed files for the enterprise Travel OS.

The schema is intentionally relational, tenant-aware, and audit-friendly. Payment and audit event tables are append-oriented so financial and security history can be reconstructed reliably.
