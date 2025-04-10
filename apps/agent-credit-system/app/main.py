import sys
sys.path.append("../..")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.core.config import CORS_ORIGINS, CORS_CREDENTIALS, CORS_METHODS, CORS_HEADERS, API_PREFIX
from app.api.api import api_router

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application
    """
    app = FastAPI(title="Nexi Dashboard API")

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=CORS_CREDENTIALS,
        allow_methods=CORS_METHODS,
        allow_headers=CORS_HEADERS,
    )

    # Include API router
    app.include_router(api_router, prefix=API_PREFIX)

    # Add catch-all route for frontend
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_react_app(full_path: str):
        """Serve the React app for any other routes to support client-side routing"""
        # Check if the path is for a static file
        if full_path.startswith("static/") or full_path.startswith("react-static/"):
            return FileResponse(f"frontend/build/{full_path}")

        # For API routes that weren't matched by the API router
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")

        # Otherwise, serve the index.html for client-side routing
        return FileResponse('frontend/build/index.html')

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100)
