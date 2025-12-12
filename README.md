# spotdlify — local development with Docker

This repo runs a small stack:

- spotdl: the spotdl container (Python-based Spotify downloader)
- backend: Express server that wraps `spotdl` (calls into the spotdl container)
- frontend: React app built and served via nginx; nginx also proxies `/api` to backend

This guide shows how to build and run the stack on a single machine (for example in Unraid).

Important note: The backend currently uses `docker exec` to run the `spotdl` container. If you run the backend in a container and you want it to control other containers it needs:

- The docker CLI installed in the backend container (not done by default)
- Access to the host's docker socket (mount `/var/run/docker.sock` into the backend container) or some other control mechanism

To get started quickly (no docker socket): the UI can still run and the backend will respond; the actual `docker exec` to spotdl won't work inside the backend without the docker socket.

## Quick start

1. Build and start services

```bash
docker compose up --build
```

2. Open the frontend at http://localhost (port 80)

3. To run downloads, either run a request to the backend /api/download from the frontend UI or run a curl command.

## Running backend with Docker CLI access (optional)

If you want the backend to run `docker exec` in containers on the host, run the backend service with the host docker socket and an image that includes docker CLI. For example (compose snippet):

```yaml
backend:
  build: ./backend
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  environment:
    - SPOTDL_CONTAINER=spotdl-dev
```

This will let the backend call `docker exec spotdl-dev ...`.

## Deployment on Unraid

Unraid can deploy a compose stack; import this compose file or convert to individual containers via their UI and ensure any volumes and networking settings match your Unraid configuration.
