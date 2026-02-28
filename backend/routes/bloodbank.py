from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import BloodStock, User, Donation, DonorNotification

bloodbank_bp = Blueprint('bloodbank', __name__)

@bloodbank_bp.route('/stock', methods=['GET'])
@jwt_required()
def get_stock():
    bb_id = get_jwt_identity()['id']
    stocks = BloodStock.query.filter_by(blood_bank_id=bb_id).all()
    return jsonify([{'blood_group':s.blood_group,'units':s.units,'threshold':s.threshold} for s in stocks])

@bloodbank_bp.route('/stock/update', methods=['POST'])
@jwt_required()
def update_stock():
    bb_id = get_jwt_identity()['id']
    data = request.json
    stock = BloodStock.query.filter_by(blood_bank_id=bb_id, blood_group=data['blood_group']).first()
    if not stock:
        stock = BloodStock(blood_bank_id=bb_id, blood_group=data['blood_group'])
        db.session.add(stock)
    stock.units = data['units']
    db.session.commit()
    # Trigger alert if low
    if stock.units < stock.threshold:
        donors = User.query.filter_by(role='donor', blood_group=data['blood_group']).all()
        for d in donors:
            notif = DonorNotification(donor_id=d.id, message=f"🔴 Blood bank critically low on {data['blood_group']}. Your donation is urgently needed!")
            db.session.add(notif)
        db.session.commit()
    return jsonify({'message': 'Stock updated'})

@bloodbank_bp.route('/confirm-donation/<int:donation_id>', methods=['POST'])
@jwt_required()
def confirm_donation(donation_id):
    donation = Donation.query.get(donation_id)
    donation.confirmed = True
    # Update stock
    bb_id = get_jwt_identity()['id']
    donor = User.query.get(donation.donor_id)
    stock = BloodStock.query.filter_by(blood_bank_id=bb_id, blood_group=donor.blood_group).first()
    if stock:
        stock.units += 1
    donor.points += 10
    db.session.commit()
    return jsonify({'message': 'Donation confirmed, stock updated'})