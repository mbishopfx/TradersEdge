#!/bin/bash
# Script to verify permissions on critical files before deployment

echo "Verifying permissions on critical files..."

# Make all shell scripts executable
chmod +x *.sh
echo "Made all shell scripts executable"

# Check start.sh specifically
if [ -f start.sh ]; then
  chmod +x start.sh
  echo "Verified that start.sh is executable"
  ls -la start.sh
else
  echo "ERROR: start.sh not found!"
fi

# Verify news-data directory exists and has correct permissions
mkdir -p news-data
chmod 755 news-data
echo "Verified news-data directory: $(ls -la | grep news-data)"

# Create a test file in news-data directory
echo "Creating test file in news-data directory..."
TEST_FILE="news-data/test_$(date +%s).json"
echo '{"test": "This is a test file"}' > $TEST_FILE
echo "Test file created: $TEST_FILE"

echo "Permission verification complete!"
exit 0 