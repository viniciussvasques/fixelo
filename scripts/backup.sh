#!/bin/bash

# Fixelo Database Backup Script
# This script creates automated backups of the PostgreSQL database

set -e

# Configuration
DB_HOST="postgres"
DB_NAME="fixelo"
DB_USER="fixelo"
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="fixelo_backup_${DATE}.sql"
KEEP_DAYS=7

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[BACKUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

print_status "Starting database backup..."

# Create database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/$BACKUP_FILE

if [ $? -eq 0 ]; then
    print_status "Database backup completed: $BACKUP_FILE"
    
    # Compress the backup
    gzip $BACKUP_DIR/$BACKUP_FILE
    print_status "Backup compressed: ${BACKUP_FILE}.gz"
    
    # Remove old backups
    find $BACKUP_DIR -name "fixelo_backup_*.sql.gz" -type f -mtime +$KEEP_DAYS -delete
    print_status "Old backups cleaned up (keeping last $KEEP_DAYS days)"
    
    # List current backups
    print_status "Current backups:"
    ls -lh $BACKUP_DIR/fixelo_backup_*.sql.gz
else
    print_warning "Backup failed!"
    exit 1
fi
