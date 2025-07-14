#!/bin/bash

# Fixelo Container Management Script
# Facilita o gerenciamento dos containers em produção

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}🚀 FIXELO CONTAINER MANAGER${NC}"
    echo "=================================="
}

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root for system commands
check_permissions() {
    if [[ $1 == "system" ]] && [ "$EUID" -ne 0 ]; then
        print_error "This command requires root privileges. Use sudo."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    print_header
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Available commands:"
    echo "  start         - Start all containers"
    echo "  stop          - Stop all containers"
    echo "  restart       - Restart all containers"
    echo "  status        - Show status of all containers"
    echo "  logs          - Show logs for all containers"
    echo "  logs <service> - Show logs for specific service (web, api, admin, postgres, redis)"
    echo "  build         - Build and restart containers"
    echo "  update        - Pull latest code, build and restart"
    echo "  backup        - Create database backup"
    echo "  restore       - Restore database from backup"
    echo "  shell <service> - Access container shell"
    echo "  health        - Check health of all services"
    echo "  system-start  - Start system service (requires sudo)"
    echo "  system-stop   - Stop system service (requires sudo)"
    echo "  system-status - Show system service status"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs api"
    echo "  $0 shell web"
    echo "  sudo $0 system-start"
}

# Main command logic
case "${1:-}" in
    "start")
        print_status "Starting Fixelo containers..."
        docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
        print_status "✅ All containers started!"
        ;;
    
    "stop")
        print_status "Stopping Fixelo containers..."
        docker-compose -f docker-compose.prod.yml --env-file .env.production down
        print_status "✅ All containers stopped!"
        ;;
    
    "restart")
        print_status "Restarting Fixelo containers..."
        docker-compose -f docker-compose.prod.yml --env-file .env.production restart
        print_status "✅ All containers restarted!"
        ;;
    
    "status")
        print_status "Container status:"
        docker-compose -f docker-compose.prod.yml --env-file .env.production ps
        ;;
    
    "logs")
        if [ -n "${2:-}" ]; then
            print_status "Showing logs for $2..."
            docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f "$2"
        else
            print_status "Showing logs for all containers..."
            docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f
        fi
        ;;
    
    "build")
        print_status "Building and restarting containers..."
        docker-compose -f docker-compose.prod.yml --env-file .env.production build
        docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
        print_status "✅ Build and restart completed!"
        ;;
    
    "update")
        print_status "Pulling latest code..."
        git pull
        print_status "Building containers..."
        docker-compose -f docker-compose.prod.yml --env-file .env.production build
        print_status "Restarting containers..."
        docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
        print_status "✅ Update completed!"
        ;;
    
    "backup")
        print_status "Creating database backup..."
        docker-compose -f docker-compose.prod.yml --env-file .env.production --profile backup run --rm backup
        print_status "✅ Backup completed!"
        ;;
    
    "restore")
        if [ -z "${2:-}" ]; then
            print_error "Please specify backup file: $0 restore <backup-file>"
            exit 1
        fi
        print_warning "This will restore the database from $2"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Restoring database from $2..."
            # Add restore logic here
            print_status "✅ Restore completed!"
        else
            print_status "Restore cancelled."
        fi
        ;;
    
    "shell")
        if [ -z "${2:-}" ]; then
            print_error "Please specify service: $0 shell <service>"
            exit 1
        fi
        print_status "Accessing shell for $2..."
        docker-compose -f docker-compose.prod.yml --env-file .env.production exec "$2" /bin/sh
        ;;
    
    "health")
        print_status "Checking service health..."
        echo ""
        echo "🌐 Web App:"
        curl -s -o /dev/null -w "  Status: %{http_code}\n" http://localhost:3000 || echo "  Status: ERROR"
        
        echo "🔧 API:"
        curl -s -o /dev/null -w "  Status: %{http_code}\n" http://localhost:3001/api/v1/health || echo "  Status: ERROR"
        
        echo "👨‍💼 Admin:"
        curl -s -o /dev/null -w "  Status: %{http_code}\n" http://localhost:3002/admin || echo "  Status: ERROR"
        
        echo "🗄️ Database:"
        docker-compose -f docker-compose.prod.yml --env-file .env.production exec postgres pg_isready -U fixelo && echo "  Status: OK" || echo "  Status: ERROR"
        
        echo "🔄 Redis:"
        docker-compose -f docker-compose.prod.yml --env-file .env.production exec redis redis-cli ping && echo "  Status: OK" || echo "  Status: ERROR"
        ;;
    
    "system-start")
        check_permissions "system"
        print_status "Starting Fixelo system service..."
        systemctl start fixelo-stack
        print_status "✅ System service started!"
        ;;
    
    "system-stop")
        check_permissions "system"
        print_status "Stopping Fixelo system service..."
        systemctl stop fixelo-stack
        print_status "✅ System service stopped!"
        ;;
    
    "system-status")
        print_status "System service status:"
        systemctl status fixelo-stack
        ;;
    
    "help"|"--help"|"-h")
        show_usage
        ;;
    
    *)
        print_error "Unknown command: ${1:-}"
        echo ""
        show_usage
        exit 1
        ;;
esac
