#!/bin/bash

# Fixelo Production Deployment Script
# This script prepares the system for production deployment

set -e  # Exit on any error

echo "🚀 Starting Fixelo Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., fixelo.com): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
    print_error "Domain name is required"
    exit 1
fi

print_status "Setting up production environment for domain: $DOMAIN_NAME"

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y nginx certbot python3-certbot-nginx ufw fail2ban

# Configure firewall
print_status "Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 9080  # Portainer access

# Setup fail2ban for additional security
print_status "Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# Backup original nginx config
print_status "Backing up current nginx configuration..."
cp /etc/nginx/sites-available/fixelo /etc/nginx/sites-available/fixelo.backup.$(date +%Y%m%d_%H%M%S)

# Update nginx configuration with domain
print_status "Updating nginx configuration with domain: $DOMAIN_NAME"
sed "s/your-domain.com/$DOMAIN_NAME/g" /var/www/fixelo/nginx-production.conf > /etc/nginx/sites-available/fixelo-production

# Test nginx configuration
print_status "Testing nginx configuration..."
nginx -t

# Enable new configuration
print_status "Enabling production configuration..."
ln -sf /etc/nginx/sites-available/fixelo-production /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/fixelo

# Restart nginx
print_status "Restarting nginx..."
systemctl restart nginx

# Get SSL certificate
print_status "Obtaining SSL certificate for $DOMAIN_NAME..."
print_warning "Make sure your domain DNS is pointing to this server before continuing!"
read -p "Is your domain DNS configured? (y/N): " DNS_CONFIGURED

if [[ $DNS_CONFIGURED =~ ^[Yy]$ ]]; then
    certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME
    
    if [ $? -eq 0 ]; then
        print_status "SSL certificate obtained successfully!"
    else
        print_warning "SSL certificate could not be obtained. You can run this manually later:"
        echo "certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
    fi
else
    print_warning "Skipping SSL setup. Run this command after configuring DNS:"
    echo "certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
fi

# Setup auto-renewal for SSL
print_status "Setting up SSL auto-renewal..."
crontab -l > /tmp/current_cron
echo "0 12 * * * /usr/bin/certbot renew --quiet" >> /tmp/current_cron
crontab /tmp/current_cron
rm /tmp/current_cron

# Configure Docker Compose for production
print_status "Setting up Docker Compose for production..."
cp /var/www/fixelo/.env.production.example /var/www/fixelo/.env.production

# Update .env.production with domain
sed -i "s/your-domain.com/$DOMAIN_NAME/g" /var/www/fixelo/.env.production
sed -i "s/DOMAIN_NAME=.*/DOMAIN_NAME=$DOMAIN_NAME/g" /var/www/fixelo/.env.production

# Set permissions
print_status "Setting proper permissions..."
chown -R www-data:www-data /var/www/fixelo
chmod -R 755 /var/www/fixelo

# Create Docker Compose systemd service
print_status "Creating Docker Compose systemd service..."
cat > /etc/systemd/system/fixelo-stack.service << EOF
[Unit]
Description=Fixelo Docker Stack
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/var/www/fixelo
ExecStart=/usr/bin/docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.prod.yml --env-file .env.production down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable the Docker stack service
systemctl daemon-reload
systemctl enable fixelo-stack

print_status "✅ Production deployment setup completed!"
print_warning "Next steps:"
echo "1. Configure your domain DNS to point to this server"
echo "2. Update /var/www/fixelo/.env.production with your secure credentials"
echo "3. Run: 'systemctl start fixelo-stack' to start all containers"
echo "4. If SSL was skipped, run: 'certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME -d api.$DOMAIN_NAME -d admin.$DOMAIN_NAME'"
echo ""
print_status "Your services will be available at:"
echo "- Main site: https://$DOMAIN_NAME"
echo "- API endpoint: https://api.$DOMAIN_NAME"
echo "- Admin panel: https://admin.$DOMAIN_NAME"
echo "- Docker management: https://$DOMAIN_NAME:9080"
echo ""
print_status "Monitor services with:"
echo "- All containers: docker ps"
echo "- Container logs: docker-compose -f docker-compose.prod.yml logs -f [service-name]"
echo "- Nginx logs: tail -f /var/log/nginx/access.log"
echo "- Stack service: systemctl status fixelo-stack"
echo ""
print_status "Management commands:"
echo "- Start stack: systemctl start fixelo-stack"
echo "- Stop stack: systemctl stop fixelo-stack"
echo "- Restart stack: systemctl restart fixelo-stack"
echo "- Update and restart: cd /var/www/fixelo && git pull && docker-compose -f docker-compose.prod.yml build && systemctl restart fixelo-stack"
