# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Set system architecture and versions
ENV SYSTEM=ubuntu-x86_64
ENV SUI_VERSION=mainnet-v1.38.3

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    tar \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /root/.config/walrus /root/.sui/sui_config /app

# Set working directory
WORKDIR /app

# Download and install Sui
RUN wget https://github.com/MystenLabs/sui/releases/download/${SUI_VERSION}/sui-${SUI_VERSION}-ubuntu-x86_64.tgz \
    && tar -xvf sui-${SUI_VERSION}-ubuntu-x86_64.tgz \
    && mv sui /usr/local/bin/ \
    && rm sui-${SUI_VERSION}-ubuntu-x86_64.tgz

# Download and install Walrus client
RUN curl https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-$SYSTEM -o /usr/local/bin/walrus \
    && chmod +x /usr/local/bin/walrus

# Download latest Walrus configuration
RUN curl https://docs.blob.store/client_config.yaml -o /root/.config/walrus/client_config.yaml

# Create Sui client configuration for testnet
RUN echo '{ \
    "keystore": { \
        "File": "/root/.sui/sui_config/sui.keystore" \
    }, \
    "envs": { \
        "testnet": { \
            "url": "https://fullnode.testnet.sui.io:443", \
            "ws_url": "wss://rpc.testnet.sui.io:443" \
        } \
    }, \
    "active_env": "testnet" \
}' > /root/.sui/sui_config/client.yaml

# Copy entrypoint script
COPY <<EOF /entrypoint.sh
#!/bin/bash
set -e

# Verify Sui installation
if ! command -v sui &> /dev/null; then
    echo "Error: Sui is not installed properly"
    exit 1
fi


# Get WAL tokens if needed

# Execute the command passed to docker run
exec "\$@"
EOF

RUN chmod +x /entrypoint.sh

# Set environment variables for proper operation
ENV RUST_LOG=info

# Expose common ports (adjust as needed)
EXPOSE 9000
EXPOSE 31415
EXPOSE 31416
# Verify installations
RUN sui --version && walrus -V

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Default command (can be overridden)
CMD ["/bin/bash"]
