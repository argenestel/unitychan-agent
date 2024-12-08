#!/bin/bash
set -e

echo "Setting up Walrus environment..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if sui and walrus are installed
if ! command_exists sui; then
    echo "Error: sui is not installed"
    exit 1
fi

if ! command_exists walrus; then
    echo "Error: walrus is not installed"
    exit 1
fi

# Set up Sui testnet environment if not already configured
echo "Configuring Sui testnet..."
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443 || true
sui client switch --env testnet

# Check if we have enough SUI for operations
echo "Checking SUI balance..."
BALANCE=$(sui client gas | grep suiBalance | awk '{print $4}')
if [[ $(echo "$BALANCE < 1" | bc -l) -eq 1 ]]; then
    echo "SUI balance is less than 1. Getting SUI from faucet..."
    sui client faucet
fi

# Get WAL tokens if needed
echo "Checking WAL balance..."
WAL_BALANCE=$(sui client balance | grep WAL | awk '{print $3}')
if [[ -z "$WAL_BALANCE" ]] || [[ $(echo "$WAL_BALANCE < 0.5" | bc -l) -eq 1 ]]; then
    echo "Getting WAL tokens..."
    walrus get-wal
fi

# Start the Walrus daemon
echo "Starting Walrus daemon..."
echo "The daemon will run on 127.0.0.1:31415"
echo "Press Ctrl+C to stop the daemon"
walrus daemon -b "127.0.0.1:31415"
