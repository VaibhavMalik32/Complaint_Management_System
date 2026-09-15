from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from models import Complaint, User
from schema import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintStatusUpdate
)
from dependencies import get_current_user

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)

# @router.get("/")
# def get_all_complaints(
#     db: Session = Depends(get_db),
#     admin: User = Depends(admin_required)
# ):
#     complaints = db.query(Complaint).all()
#     return complaints

@router.post("/create",response_model=ComplaintResponse)
def create_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = Complaint(
        user_id=current_user.user_id,
        title=complaint_data.title,
        description=complaint_data.description,
        category=complaint_data.category,
        status="In Review"
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return complaint

@router.get("/my",response_model=list[ComplaintResponse])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    complaints = db.query(Complaint).filter(
        Complaint.user_id == current_user.user_id
    ).all()

    return complaints

@router.delete("/{complaint_id}")
def delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    complaint = db.query(Complaint).filter(
        Complaint.complaint_id == complaint_id,
        Complaint.user_id == current_user.user_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    db.delete(complaint)
    db.commit()

    return {
        "message": "Complaint deleted successfully"
    }