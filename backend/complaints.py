from fastapi import APIRouter, Depends, HTTPException #for api routes, dependencies and errors
from sqlalchemy.orm import Session #for db sessions

from db import get_db
from models import Complaint, ComplaintUpdate, User
from schema import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintStatusUpdate,
    ComplaintUpdateResponse
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

    complaints = db.query(Complaint).filter(Complaint.user_id == current_user.user_id).all()

    return complaints

@router.get("/all",response_model=list[ComplaintResponse])
def get_all_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )
 
    complaints = db.query(Complaint).all()

    return complaints

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter(Complaint.complaint_id == complaint_id,Complaint.user_id == current_user.user_id).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint

@router.delete("/{complaint_id}")
def delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    complaint = db.query(Complaint).filter(Complaint.complaint_id == complaint_id,Complaint.user_id == current_user.user_id).first()

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

@router.get("/{complaint_id}/history",response_model=list[ComplaintUpdateResponse])
def get_complaint_history(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter(Complaint.complaint_id == complaint_id,Complaint.user_id == current_user.user_id).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    updates = db.query(ComplaintUpdate).filter(ComplaintUpdate.complaint_id == complaint_id).order_by(ComplaintUpdate.updated_at.asc()).all()

    return updates

@router.put("/{complaint_id}/status",response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: int,
    status_data: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )
    
    complaint = db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    old_status = complaint.status

    complaint.status = status_data.status

    update = ComplaintUpdate(complaint_id=complaint.complaint_id,updated_by=current_user.user_id,old_status=old_status,new_status=status_data.status)

    db.add(update)
    db.commit()
    db.refresh(complaint)

    return complaint
