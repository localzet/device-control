# Docker Deployment

## Quick Start

```bash
cd docker
docker-compose up -d
```

## Configuration

Edit `docker-compose.yml` to customize:
- Ports mapping
- Volume paths
- Environment variables

## Access

- Web interface: http://localhost:22533
- Socket.IO: localhost:22222

## Data Persistence

Data is stored in:
- `../data/` - Server data
- `../clientData/` - Client device data
- `../assets/webpublic/client_downloads/` - Downloads

## Production Deployment

1. Set environment variables in `.env` file
2. Use reverse proxy (nginx/traefik) for HTTPS
3. Configure firewall rules
4. Set up SSL certificates

## Troubleshooting

### View logs
```bash
docker-compose logs -f
```

### Restart service
```bash
docker-compose restart
```

### Stop service
```bash
docker-compose down
```

