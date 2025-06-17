from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import users
from app.api.endpoints import auth
from app.api.endpoints import tasks
from app.api.endpoints import pets
from app.api.endpoints import vaccinations
from app.api.endpoints import activities
from app.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FastAPI Project",
    description="FastAPI project with PostgreSQL",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://pet-care-testing-functioning.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(pets.router, prefix="/pets", tags=["pets"])
app.include_router(vaccinations.router, prefix="/vaccinations", tags=["vaccinations"])
app.include_router(activities.router, prefix="/activities", tags=["activities"])

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI with PostgreSQL!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 