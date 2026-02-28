from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Donation, BloodRequest, DonorNotification
from datetime import datetime, timedelta

donor_bp = Blueprint('donor', __name__)

@donor_bp.route('/eligibility', methods=['POST'])
@jwt_required()
def check_eligibility():
    data = request.json
    errors = []
    if data.get('alcohol_48hrs'): errors.append('No alcohol within 48 hours')
    if data.get('fever'): errors.append('Must not have fever')
    if data.get('medication'): errors.append('Must not be on certain medications')
    if data.get('pregnant'): errors.append('Cannot donate while pregnant')
    user_id = get_jwt_identity()['id']
    user = User.query.get(user_id)
    if user.last_donated and (datetime.utcnow() - user.last_donated).days < 90:
        errors.append('Must wait 90 days between donations')
    if errors:
        return jsonify({'eligible': False, 'reasons': errors})
    return jsonify({'eligible': True})

@donor_bp.route('/donate', methods=['POST'])
@jwt_required()
def donate():
    user_id = get_jwt_identity()['id']
    data = request.json
    donation = Donation(donor_id=user_id, request_id=data.get('request_id'))
    user = User.query.get(user_id)
    user.last_donated = datetime.utcnow()
    user.points += 10
    db.session.add(donation)
    db.session.commit()
    return jsonify({'message': 'Donation recorded', 'points': user.points})

@donor_bp.route('/history', methods=['GET'])
@jwt_required()
def donation_history():
    user_id = get_jwt_identity()['id']
    donations = Donation.query.filter_by(donor_id=user_id).all()
    result = [{'id': d.id, 'donated_at': str(d.donated_at), 'confirmed': d.confirmed} for d in donations]
    return jsonify(result)

@donor_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()['id']
    notifs = DonorNotification.query.filter_by(donor_id=user_id).order_by(DonorNotification.created_at.desc()).all()
    return jsonify([{'id':n.id,'message':n.message,'read':n.is_read,'time':str(n.created_at)} for n in notifs])

@donor_bp.route('/leaderboard', methods=['GET'])
def leaderboard():
    donors = User.query.filter_by(role='donor').order_by(User.points.desc()).limit(10).all()
    return jsonify([{'name':d.name,'points':d.points,'blood_group':d.blood_group} for d in donors])