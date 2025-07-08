#!/bin/bash
set -e

# Create additional databases if needed
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
-- Create test database
CREATE DATABASE fixelo_test;
GRANT ALL PRIVILEGES ON DATABASE fixelo_test TO $POSTGRES_USER;

-- Create extensions
\c fixelo;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

\c fixelo_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
EOSQL 