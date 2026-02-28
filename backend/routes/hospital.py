from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import BloodRequest, User, DonorNotification
from datetime import datetime

hospital_bp = Blueprint('hospital', __name__)


@hospital_bp.route('/request', methods=['POST'])
@jwt_required()
def create_request():
    data = request.json
    hospital_id = get_jwt_identity()['id']
    req = BloodRequest(
        patient_name=data['patient_name'],
        age=data['age'],
        gender=data['gender'],
        blood_group=data['blood_group'],
        hospital=data['hospital'],
        hospital_id=hospital_id,
        priority=data['priority'],
        units_needed=data.get('units_needed', 1),
        location=data.get('location', ''),
        latitude=data.get('latitude', 10.0),
        longitude=data.get('longitude', 76.0)
    )
    db.session.add(req)
    db.session.commit()
    matching = User.query.filter_by(role='donor', blood_group=data['blood_group']).all()
    for donor in matching:
        notif = DonorNotification(
            donor_id=donor.id,
            message=f"🚨 {data['priority'].upper()}: {data['blood_group']} blood needed at {data['hospital']} for {data['patient_name']}"
        )
        db.session.add(notif)
    db.session.commit()
    return jsonify({'message': 'Request created', 'id': req.id})


@hospital_bp.route('/match/<int:request_id>', methods=['GET'])
@jwt_required()
def match_donors(request_id):
    req = BloodRequest.query.get(request_id)
    donors = User.query.filter_by(role='donor', blood_group=req.blood_group).all()
    result = [{
        'name': d.name,
        'phone': d.phone,
        'blood_group': d.blood_group,
        'last_donated': str(d.last_donated) if d.last_donated else 'Never',
        'campus': d.campus,
        'is_verified': d.is_verified
    } for d in donors]
    return jsonify(result)


@hospital_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_requests():
    try:
        identity = get_jwt_identity()
        hospital_id = identity['id'] if isinstance(identity, dict) else identity
        reqs = BloodRequest.query.filter_by(hospital_id=hospital_id).all()
        return jsonify([{
            'id': r.id,
            'patient_name': r.patient_name,
            'blood_group': r.blood_group,
            'priority': r.priority,
            'status': r.status,
            'units_needed': r.units_needed,
            'created_at': str(r.created_at)
        } for r in reqs])
    except Exception as e:
        return jsonify([])  # return empty list instead of error


@hospital_bp.route('/public-requests', methods=['GET'])
def public_requests():
    reqs = BloodRequest.query.filter_by(status='open').order_by(BloodRequest.created_at.desc()).all()
    return jsonify([{
        'id': r.id,
        'patient_name': r.patient_name,
        'blood_group': r.blood_group,
        'hospital': r.hospital,
        'priority': r.priority,
        'units_needed': r.units_needed,
        'created_at': str(r.created_at)
    } for r in reqs])