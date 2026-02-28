from extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    phone = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(100))
    password = db.Column(db.String(200))
    role = db.Column(db.String(20))  # donor | hospital | bloodbank
    blood_group = db.Column(db.String(5))
    age = db.Column(db.Integer)
    campus = db.Column(db.String(100))
    has_hiv = db.Column(db.Boolean, default=False)
    has_aids = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    points = db.Column(db.Integer, default=0)
    last_donated = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class BloodRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    blood_group = db.Column(db.String(5))
    hospital = db.Column(db.String(100))
    hospital_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    priority = db.Column(db.String(20))  # critical | urgent | needed
    units_needed = db.Column(db.Integer)
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    status = db.Column(db.String(20), default='open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    request_id = db.Column(db.Integer, db.ForeignKey('blood_request.id'), nullable=True)
    blood_bank_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    donated_at = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed = db.Column(db.Boolean, default=False)
    points_awarded = db.Column(db.Integer, default=10)

class BloodStock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blood_bank_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    blood_group = db.Column(db.String(5))
    units = db.Column(db.Integer, default=0)
    threshold = db.Column(db.Integer, default=5)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class DonorNotification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    message = db.Column(db.String(500))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)