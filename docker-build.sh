#!/bin/bash

echo "Building and starting File Sender Web App..."
docker-compose up -d --build

echo ""
echo "Container started! Access the application at:"
echo "http://localhost:3000"

# Try to get the local IP address for network sharing
if command -v ip &> /dev/null; then
    IP=$(ip addr show | grep -E "inet .* global" | awk '{print $2}' | cut -d/ -f1 | head -n1)
    if [ ! -z "$IP" ]; then
        echo "Or share with devices on your network: http://$IP:3000"
    fi
elif command -v ifconfig &> /dev/null; then
    IP=$(ifconfig | grep -E "inet .* broadcast" | awk '{print $2}' | head -n1)
    if [ ! -z "$IP" ]; then
        echo "Or share with devices on your network: http://$IP:3000"
    fi
fi

echo ""
echo "To stop the container, run: docker-compose down" 