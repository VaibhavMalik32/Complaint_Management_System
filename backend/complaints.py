from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
import os
import uuid #to generate unique filenames
from sqlalchemy.orm import Session
from sqlalchemy import or_

from db import get_db
from models import Complaint, ComplaintUpdate, User, ComplaintImage, ComplaintAction
from schema import (
    ComplaintResponse,
    ComplaintStatusUpdate,
    ComplaintUpdateResponse,
    ComplaintAssign,
    StaffCreate,
    StaffTransfer
)
from dependencies import get_current_user
from security import get_password_hash

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)

CATEGORY_DEPARTMENT_MAP = { #allow the system to automatically determine the relevant department
    "Fraud & Suspicious Activity": "Crime",
    "Harassment & Misconduct": "Crime",
    "Public Safety": "Crime",
    "Technical": "IT",
    "Internet Issues": "IT",
    "Electrical": "Electricity",
    "Plumbing": "Water",
    "Road & Transportation": "Public Works",
    "Parking Issues": "Public Works",
    "Garbage Management": "Municipal",
    "Cleanliness & Sanitation": "Municipal",
    "Environmental Issues": "Environment",
    "Public Facilities": "Municipal",
    "Street Lighting": "Electricity",
    "Administrative": "Administration",
    "Staff/Employee Behaviour": "Administration",
    "Customer Service": "Administration",
    "Billing & Payment Issues": "Finance",
    "Unauthorized Charges": "Finance",
    "Product Issues": "Consumer Affairs",
    "Service Quality": "Consumer Affairs",
    "Delivery & Logistics": "Consumer Affairs",
    "Accessibility Issues": "Administration",
    "Policy & Procedure Issues": "Administration",
    "Documentation & Records": "Administration"
}

def get_department_from_category(category: str):
    return CATEGORY_DEPARTMENT_MAP.get(category)


def location_matches(
    complaint_location: str,
    staff: User
):
    if not complaint_location:
        return False

    complaint_location = complaint_location.strip().lower()

    staff_address = (staff.address or "").strip().lower()
    staff_city = (staff.city or "").strip().lower()
    staff_state = (staff.state or "").strip().lower()

    return (
        complaint_location == staff_address
        or complaint_location == staff_city
        or complaint_location == staff_state
        or staff_city in complaint_location
        or staff_state in complaint_location
        or staff_address in complaint_location
    )


@router.post("/create", response_model=ComplaintResponse)
async def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
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
        location=location,
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

        with open(file_path, "wb") as buffer: #opens the destination file
            buffer.write(await image.read()) #reads the uploaded image and writes it to disk

        complaint_image = ComplaintImage(
            complaint_id=complaint.complaint_id,
            image_path=f"/uploads/complaints/{unique_name}"
        )

        db.add(complaint_image)

    db.commit()
    db.refresh(complaint)

    return complaint


@router.get("/my", response_model=list[ComplaintResponse])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaints = (db.query(Complaint).filter(Complaint.user_id == current_user.user_id).order_by(Complaint.created_at.desc()).all())
    return complaints


@router.get("/admin/complaints", response_model=list[ComplaintResponse])
def get_admin_complaints(
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
        .filter(
            Complaint.category.in_(
                [
                    category
                    for category, department
                    in CATEGORY_DEPARTMENT_MAP.items()
                    if department == current_user.department
                ]
            )
        )
        .order_by(Complaint.created_at.desc())
        .all()
    )

    complaints = [
        complaint
        for complaint in complaints
        if location_matches(
            complaint.location,
            current_user
        )
    ]

    return complaints


@router.get("/all", response_model=list[ComplaintResponse])
def get_all_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )

    complaints = (db.query(Complaint).order_by(Complaint.created_at.desc()).all())

    complaints = [
        complaint
        for complaint in complaints
        if get_department_from_category(
            complaint.category
        ) == current_user.department
        and location_matches(
            complaint.location,
            current_user
        )
    ]

    return complaints


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

    complaints = (db.query(Complaint).filter(Complaint.employee_id == current_user.user_id).order_by(Complaint.created_at.desc()).all())

    return complaints


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
            User.department == current_user.department,
            or_(
                User.city == current_user.city,
                User.state == current_user.state,
                User.address == current_user.address
            )
        )
        .order_by(User.user_id.desc())
        .all()
    )

    return employees


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

    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first())

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    complaint_department = get_department_from_category(
        complaint.category
    )

    if complaint_department != current_user.department:
        raise HTTPException(
            status_code=403,
            detail="This complaint does not belong to your department"
        )

    if not location_matches(
        complaint.location,
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail="This complaint does not belong to your location"
        )

    employee = (db.query(User).filter(User.user_id == assign_data.employee_id,User.role == "employee").first())

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    if employee.department != current_user.department:
        raise HTTPException(
            status_code=403,
            detail="Employee does not belong to your department"
        )

    if not location_matches(
        complaint.location,
        employee
    ):
        raise HTTPException(
            status_code=403,
            detail="Employee does not belong to the complaint location"
        )

    complaint.employee_id = employee.user_id
    complaint.status = "In Progress"

    db.commit()
    db.refresh(complaint)

    return complaint


@router.put("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: int,
    status_data: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "employee"]:
        raise HTTPException(
            status_code=403,
            detail="Admin or employee access is required"
        )

    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first())

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    if current_user.role == "employee":
        if complaint.employee_id != current_user.user_id:
            raise HTTPException(
                status_code=403,
                detail="This complaint is not assigned to you"
            )

    if current_user.role == "admin":
        complaint_department = get_department_from_category(
            complaint.category
        )

        if complaint_department != current_user.department:
            raise HTTPException(
                status_code=403,
                detail="This complaint does not belong to your department"
            )

        if not location_matches(
            complaint.location,
            current_user
        ):
            raise HTTPException(
                status_code=403,
                detail="This complaint does not belong to your location"
            )

    old_status = complaint.status

    complaint.status = status_data.status

    update = ComplaintUpdate(
        complaint_id=complaint.complaint_id,
        updated_by=current_user.user_id,
        old_status=old_status,
        new_status=status_data.status
    )

    db.add(update)
    db.commit()
    db.refresh(complaint)

    return complaint


@router.delete("/{complaint_id}")
def delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id,Complaint.user_id == current_user.user_id).first())

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


@router.get("/{complaint_id}/history", response_model=list[ComplaintUpdateResponse])
def get_complaint_history(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id,Complaint.user_id == current_user.user_id).first())

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    updates = (db.query(ComplaintUpdate).filter(ComplaintUpdate.complaint_id == complaint_id).order_by(ComplaintUpdate.updated_at.asc()).all())

    return updates


@router.get("/admin/complaints/{complaint_id}", response_model=ComplaintResponse)
def get_admin_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )

    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first())

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    complaint_department = get_department_from_category(
        complaint.category
    )

    if complaint_department != current_user.department:
        raise HTTPException(
            status_code=403,
            detail="This complaint does not belong to your department"
        )

    if not location_matches(
        complaint.location,
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail="This complaint does not belong to your location"
        )

    return complaint


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id,Complaint.user_id == current_user.user_id).first())

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint


@router.post("/{complaint_id}/action")
async def add_complaint_action(
    complaint_id: int,
    action_taken: str = Form(...),
    proof_image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(
            status_code=403,
            detail="Employee access is required"
        )

    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first())

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    if complaint.employee_id != current_user.user_id:
        raise HTTPException(
            status_code=403,
            detail="This complaint is not assigned to you"
        )

    existing_action = (db.query(ComplaintAction).filter(ComplaintAction.complaint_id == complaint_id).first())

    if existing_action:
        raise HTTPException(
            status_code=400,
            detail="Action has already been added for this complaint"
        )

    proof_path = None

    if proof_image:
        allowed_types = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
        ]

        if proof_image.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG, PNG and WEBP images are allowed"
            )

        upload_dir = "uploads/actions"
        os.makedirs(upload_dir, exist_ok=True)

        extension = os.path.splitext(proof_image.filename)[1]
        filename = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(
            upload_dir,
            filename
        )

        with open(file_path, "wb") as buffer:
            buffer.write(
                await proof_image.read()
            )

        proof_path = f"/uploads/actions/{filename}"

    action = ComplaintAction(
        complaint_id=complaint_id,
        employee_id=current_user.user_id,
        action_taken=action_taken,
        proof_image=proof_path
    )

    complaint.status = "Resolved"

    db.add(action)
    db.commit()
    db.refresh(action)

    return {
        "message": "Complaint action added successfully",
        "action_id": action.action_id,
        "complaint_id": action.complaint_id,
        "action_taken": action.action_taken,
        "proof_image": action.proof_image
    }


@router.get("/{complaint_id}/action")
def get_complaint_action(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id,Complaint.user_id == current_user.user_id).first())

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    action = (db.query(ComplaintAction).filter(ComplaintAction.complaint_id == complaint_id).first())

    if not action:
        raise HTTPException(
            status_code=404,
            detail="No action has been recorded for this complaint"
        )

    return action


@router.get("/super-admin/complaints")
def get_super_admin_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    complaints = (db.query(Complaint).order_by(Complaint.created_at.desc()).all())

    return complaints


@router.get("/super-admin/complaints/{complaint_id}/action")
def get_super_admin_complaint_action(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    complaint = (db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first())

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    action = (db.query(ComplaintAction).filter(ComplaintAction.complaint_id == complaint_id).first())

    if not action:
        raise HTTPException(
            status_code=404,
            detail="No action has been recorded for this complaint"
        )

    return action


@router.get("/super-admin/users")
def get_super_admin_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    users = (db.query(User).filter(User.role == "user").order_by(User.user_id.desc()).all())

    return users


@router.get("/super-admin/employees")
def get_super_admin_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    employees = (db.query(User).filter(User.role == "employee").order_by(User.user_id.desc()).all())

    return employees


@router.get("/super-admin/admins")
def get_super_admin_admins(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    admins = (db.query(User).filter(User.role == "admin").order_by(User.user_id.desc()).all())

    return admins


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

    complaints = (db.query(Complaint).order_by(Complaint.created_at.desc()).all())

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

    total_users = (db.query(User).filter(User.role == "user").count())

    total_employees = (db.query(User).filter(User.role == "employee").count())

    total_admins = (db.query(User).filter(User.role == "admin").count())

    total_complaints = (db.query(Complaint).count())

    in_review = (db.query(Complaint).filter(Complaint.status == "In Review").count())

    in_progress = (db.query(Complaint).filter(Complaint.status == "In Progress").count())

    resolved = (db.query(Complaint).filter(Complaint.status == "Resolved").count())

    rejected = (db.query(Complaint).filter(Complaint.status == "Rejected").count())

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


@router.post("/super-admin/admins")
def create_admin(
    staff_data: StaffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    existing_user = (db.query(User).filter(or_(User.username == staff_data.username,User.email == staff_data.email)).first())

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists"
        )

    admin = User(
        username=staff_data.username,
        full_name=staff_data.full_name,
        email=staff_data.email,
        phone=staff_data.phone,
        address=staff_data.address,
        city=staff_data.city,
        state=staff_data.state,
        department=staff_data.department,
        post=staff_data.post,
        role="admin",
        is_email_verified=True,
        hashed_password=get_password_hash(
            staff_data.password
        )
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {
        "message": "Admin created successfully",
        "user_id": admin.user_id,
        "username": admin.username,
        "department": admin.department,
        "post": admin.post,
        "address": admin.address,
        "city": admin.city,
        "state": admin.state
    }


@router.put("/super-admin/admins/{admin_id}/transfer")
def transfer_admin(
    admin_id: int,
    staff_data: StaffTransfer,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    admin = (db.query(User).filter(User.user_id == admin_id,User.role == "admin").first())

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found"
        )

    admin.address = staff_data.address
    admin.city = staff_data.city
    admin.state = staff_data.state
    admin.department = staff_data.department
    admin.post = staff_data.post

    db.commit()
    db.refresh(admin)

    return {
        "message": "Admin transferred successfully",
        "user_id": admin.user_id,
        "department": admin.department,
        "post": admin.post,
        "address": admin.address,
        "city": admin.city,
        "state": admin.state
    }


@router.put("/super-admin/admins/{admin_id}/remove")
def remove_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403,
            detail="Super Admin access is required"
        )

    admin = (db.query(User).filter(User.user_id == admin_id,User.role == "admin").first())

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found"
        )

    admin.role = "user"
    admin.department = None
    admin.post = "user"

    db.commit()
    db.refresh(admin)

    return {
        "message": "Admin removed from post successfully"
    }


@router.post("/admin/employees")
def create_employee(
    staff_data: StaffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )

    existing_user = (db.query(User).filter(or_(User.username == staff_data.username,User.email == staff_data.email)).first())

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists"
        )

    if staff_data.department != current_user.department:
        raise HTTPException(
            status_code=403,
            detail="Employee must belong to your department"
        )

    employee = User(
        username=staff_data.username,
        full_name=staff_data.full_name,
        email=staff_data.email,
        phone=staff_data.phone,
        address=staff_data.address,
        city=staff_data.city,
        state=staff_data.state,
        department=staff_data.department,
        post=staff_data.post,
        role="employee",
        is_email_verified=True,
        hashed_password=get_password_hash(
            staff_data.password
        )
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return {
        "message": "Employee created successfully",
        "user_id": employee.user_id,
        "username": employee.username,
        "department": employee.department,
        "post": employee.post,
        "address": employee.address,
        "city": employee.city,
        "state": employee.state
    }


@router.put("/admin/employees/{employee_id}/transfer")
def transfer_employee(
    employee_id: int,
    staff_data: StaffTransfer,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )

    employee = (db.query(User).filter(User.user_id == employee_id,User.role == "employee").first())

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    if employee.department != current_user.department:
        raise HTTPException(
            status_code=403,
            detail="Employee does not belong to your department"
        )

    if staff_data.department != current_user.department:
        raise HTTPException(
            status_code=403,
            detail="Employee must remain in your department"
        )

    employee.address = staff_data.address
    employee.city = staff_data.city
    employee.state = staff_data.state
    employee.department = staff_data.department
    employee.post = staff_data.post

    db.commit()
    db.refresh(employee)

    return {
        "message": "Employee transferred successfully",
        "user_id": employee.user_id,
        "department": employee.department,
        "post": employee.post,
        "address": employee.address,
        "city": employee.city,
        "state": employee.state
    }


@router.put("/admin/employees/{employee_id}/remove")
def remove_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access is required"
        )

    employee = (db.query(User).filter(User.user_id == employee_id,User.role == "employee").first())

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    if employee.department != current_user.department:
        raise HTTPException(
            status_code=403,
            detail="Employee does not belong to your department"
        )

    employee.role = "user"
    employee.department = None
    employee.post = "user"

    db.commit()
    db.refresh(employee)

    return {
        "message": "Employee removed from post successfully"
    }