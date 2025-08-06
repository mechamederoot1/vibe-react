from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_stories():
    return {"message": "Stories endpoint - coming soon"}
