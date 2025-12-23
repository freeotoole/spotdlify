# spotdlify — Docker setup

## Local setup (frontend only)

1. Start the stack:

```bash
docker compose up --build
```

2. Open the UI: http://localhost:8080

Downloads save to `./downloads` and spotdl config saves to `./config`.

## Unraid install

1. Edit `docker-compose.unraid.yml` with your share paths:

```yaml
services:
  spotdl:
    volumes:
      - /mnt/user/YourShare/spotdl:/music
      - /mnt/user/appdata/spotdlify/config:/root/.config/spotdl
```

2. Start the stack:

```bash
docker compose -f docker-compose.yml -f docker-compose.unraid.yml up -d
```

3. Open the UI: http://<unraid-ip>:13666

Notes:

- `PUID=99` and `PGID=100` match Unraid's default `nobody:users`.
- The Unraid override mounts `/var/run/docker.sock` so the backend can run `docker exec`.
