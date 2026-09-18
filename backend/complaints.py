from fastapi import ( #for api routes, dependencies and errors
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)
import os
import uuid 
from sqlalchemy.orm import Session #for db sessions
from sqlalchemy import or_
from db import get_db
from models import Complaint, ComplaintUpdate, User,ComplaintImage
from schema import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintStatusUpdate,
    ComplaintUpdateResponse,
    ComplaintAssign
)
from dependencies import get_current_user

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)

@router.post("/create", response_model=ComplaintResponse)
async def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    images: list[UploadFile] = File(...),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(images) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 images are required"
        )
    upload_dir = "uploads/complaints"
    os.makedirs(upload_dir, exist_ok=True)
    complaint = Complaint(
        user_id=current_user.user_id,
        title=title,
        description=description,
        category=category,
        status="In Review"
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ]
    for image in images:
        if image.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        extension = os.path.splitext(image.filename)[1]
        unique_name = f"{uuid.uuid4()}{extension}"
        file_path = os.path.join(
            upload_dir,
            unique_name
        )
        with open(file_path, "wb") as buffer:
            buffer.write(await image.read())
        complaint_image = ComplaintImage(
            complaint_id=complaint.complaint_id,
            image_path=f"/uploads/complaints/{unique_name}"
        )
        db.add(complaint_image)
    db.commit()
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
    complaints = (
        db.query(Complaint)
        .join(User, Complaint.user_id == User.user_id)
        .filter(
            or_(
                User.city == current_user.city,
                User.state == current_user.state,
                User.address == current_user.address
            )
        )
        .all()
    )
    return complaints

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

@router.get("/assigned", response_model=list[ComplaintResponse])
def get_assigned_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "employee":
        raise HTTPException(
            status_code=403,
            detail="Employee access is required"
        )

    complaints = (
        db.query(Complaint)
        .filter(
            Complaint.employee_id == current_user.user_id
        )
        .all()
    )

    return complaints

@router.put("/{complaint_id}/assign", response_model=ComplaintResponse)
def assign_complaint(
    complaint_id: int,
    assign_data: ComplaintAssign,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )

    complaint = (
        db.query(Complaint)
        .filter(
            Complaint.complaint_id == complaint_id
        )
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    employee = (
        db.query(User)
        .filter(
            User.user_id == assign_data.employee_id,
            User.role == "employee"
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    employee_location_match = (
        employee.city == current_user.city
        or employee.state == current_user.state
        or employee.address == current_user.address
    )

    if not employee_location_match:
        raise HTTPException(
            status_code=403,
            detail="Employee does not belong to your location"
        )

    complaint_user = (
        db.query(User)
        .filter(
            User.user_id == complaint.user_id
        )
        .first()
    )

    if not complaint_user:
        raise HTTPException(
            status_code=404,
            detail="Complaint user not found"
        )

    complaint_location_match = (
        complaint_user.city == current_user.city
        or complaint_user.state == current_user.state
        or complaint_user.address == current_user.address
    )

    if not complaint_location_match:
        raise HTTPException(
            status_code=403,
            detail="This complaint does not belong to your location"
        )
    complaint.employee_id = employee.user_id
    complaint.status = "In Progress"
    db.commit()
    db.refresh(complaint)
    return complaint

@router.get("/employees")
def get_matching_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )

    employees = (
        db.query(User)
        .filter(
            User.role == "employee",
            or_(
                User.city == current_user.city,
                User.state == current_user.state,
                User.address == current_user.address
            )
        )
        .all()
    )

    return employees

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = (
        db.query(Complaint)
        .filter(
            Complaint.complaint_id == complaint_id,
            Complaint.user_id == current_user.user_id
        )
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint

@router.get("/super-admin/all", response_model=list[ComplaintResponse])
def get_all_complaints_super_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    complaints = (
        db.query(Complaint)
        .order_by(Complaint.created_at.desc())
        .all()
    )

    return complaints

@router.get("/super-admin/stats")
def get_super_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    total_users = (
        db.query(User)
        .filter(User.role == "user")
        .count()
    )

    total_employees = (
        db.query(User)
        .filter(User.role == "employee")
        .count()
    )

    total_admins = (
        db.query(User)
        .filter(User.role == "admin")
        .count()
    )

    total_complaints = db.query(Complaint).count()

    in_review = (
        db.query(Complaint)
        .filter(Complaint.status == "In Review")
        .count()
    )

    in_progress = (
        db.query(Complaint)
        .filter(Complaint.status == "In Progress")
        .count()
    )

    resolved = (
        db.query(Complaint)
        .filter(Complaint.status == "Resolved")
        .count()
    )

    rejected = (
        db.query(Complaint)
        .filter(Complaint.status == "Rejected")
        .count()
    )

    return {
        "total_users": total_users,
        "total_employees": total_employees,
        "total_admins": total_admins,
        "total_complaints": total_complaints,
        "in_review": in_review,
        "in_progress": in_progress,
        "resolved": resolved,
        "rejected": rejected
    }