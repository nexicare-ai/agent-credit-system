import sys
sys.path.append("../..")

from app.main import app
from libs.core.database.migrations import run_migrations
if __name__ == "__main__":
    import uvicorn
    run_migrations()
    uvicorn.run(app, host="0.0.0.0", port=8100)
