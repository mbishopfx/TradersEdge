#!/bin/bash

# Configuration - Update these paths for your SiteGround environment
APP_PATH="$HOME/www/public_html/charteye"
VENV_PATH="$APP_PATH/venv"
LOG_FILE="$APP_PATH/scraper_log.txt"
ERROR_LOG="$APP_PATH/scraper_error.log"
PYTHON_SCRIPT="$APP_PATH/NewsScrape.py"

# Add timestamp to log
echo "=========================================" >> "$LOG_FILE"
echo "News scraper started at $(date)" >> "$LOG_FILE"

# Check if application directory exists
if [ ! -d "$APP_PATH" ]; then
    echo "ERROR: Application directory $APP_PATH not found" >> "$ERROR_LOG"
    exit 1
fi

# Check if Python script exists
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "ERROR: Python script $PYTHON_SCRIPT not found" >> "$ERROR_LOG"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "$VENV_PATH" ]; then
    echo "Virtual environment not found. Creating one..." >> "$LOG_FILE"
    cd "$APP_PATH"
    python3 -m venv "$VENV_PATH"
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment" >> "$ERROR_LOG"
        exit 1
    fi
    
    echo "Installing required packages..." >> "$LOG_FILE"
    source "$VENV_PATH/bin/activate"
    pip install requests beautifulsoup4 schedule >> "$LOG_FILE" 2>> "$ERROR_LOG"
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install required packages" >> "$ERROR_LOG"
        exit 1
    fi
else
    # Activate virtual environment
    source "$VENV_PATH/bin/activate"
fi

# Create news-data directory if it doesn't exist
NEWS_DATA_DIR="$APP_PATH/news-data"
if [ ! -d "$NEWS_DATA_DIR" ]; then
    echo "Creating news-data directory..." >> "$LOG_FILE"
    mkdir -p "$NEWS_DATA_DIR"
    chmod 755 "$NEWS_DATA_DIR"
fi

# Run the scraper
cd "$APP_PATH"
echo "Running news scraper..." >> "$LOG_FILE"

# Export environment variables
export NEWS_DATA_DIR="$NEWS_DATA_DIR"
export PYTHONIOENCODING=utf-8

# Execute the Python script and redirect output to logs
python3 "$PYTHON_SCRIPT" >> "$LOG_FILE" 2>> "$ERROR_LOG"

if [ $? -eq 0 ]; then
    echo "News scraper completed successfully at $(date)" >> "$LOG_FILE"
else
    echo "ERROR: News scraper failed at $(date)" >> "$ERROR_LOG"
fi

# Deactivate virtual environment
deactivate

echo "=========================================" >> "$LOG_FILE"
exit 0 