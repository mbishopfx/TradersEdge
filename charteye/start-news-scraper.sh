#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install it and try again."
    exit 1
fi

# Create a virtual environment
echo "Creating Python virtual environment..."
python3 -m venv news-scraper-venv

# Activate the virtual environment
echo "Activating virtual environment..."
source news-scraper-venv/bin/activate

# Install required packages
echo "Installing required packages..."
pip install requests beautifulsoup4 schedule

# Create news-data directory if it doesn't exist
mkdir -p news-data

# Run the news scraper
echo "Starting news scraper..."
python3 NewsScrape.py 