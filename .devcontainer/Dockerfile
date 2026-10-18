FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm
RUN apt-get update \
    && apt-get install -y --no-install-recommends shfmt \
    && rm -rf /var/lib/apt/lists/*
RUN su node -c 'curl -fsSL https://bun.com/install | bash'
ENV PATH="/home/node/.bun/bin:${PATH}"