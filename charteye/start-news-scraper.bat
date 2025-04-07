@echo off
ECHO Starting ChartEye News Scraper setup...

REM Check if Python is installed
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO Python is required but not installed. Please install it and try again.
    EXIT /B 1
)

ECHO Creating Python virtual environment...
python -m venv news-scraper-venv

ECHO Activating virtual environment...
CALL news-scraper-venv\Scripts\activate.bat

ECHO Installing required packages...
pip install requests beautifulsoup4 schedule

ECHO Creating news-data directory...
IF NOT EXIST news-data mkdir news-data

ECHO Starting news scraper...
python NewsScrape.py

PAUSE 