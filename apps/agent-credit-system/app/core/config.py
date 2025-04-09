import os
from datetime import timedelta

# JWT Configuration
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your-secret-key-for-jwt-please-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# API settings
API_PREFIX = "/api"

# CORS settings
CORS_ORIGINS = ["*"]  # Allows all origins in development
CORS_CREDENTIALS = True
CORS_METHODS = ["*"]  # Allows all methods
CORS_HEADERS = ["*"]  # Allows all headers