ARG PYTHON_VERSION=3.12.8
FROM python:${PYTHON_VERSION}-slim

# Install curl (uv installer needs it) and ffmpeg (required by spotdl)
RUN apt-get update && \
    apt-get install -y curl ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*



# Install uv (the official installer)
RUN curl -fsSL https://astral.sh/uv/install.sh | sh

# Make sure .local/bin is in PATH
ENV PATH="/root/.local/bin:${PATH}"

# Pin spotDL for reproducibility
ARG SPOTDL_VERSION=4.2.4

RUN uv tool install --python ${PYTHON_VERSION} "spotdl@latest" \
    && spotdl --version

# Create a download directory
RUN mkdir /music

# Default command — keep container alive
CMD ["sleep", "infinity"]
