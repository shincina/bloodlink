from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

rewards_bp = Blueprint('rewards', __name__)

BADGES = [
    {'threshold': 1, 'name': 'First Drop Hero', 'emoji': '🩸'},
    {'threshold': 5, 'name': 'Life Saver', 'emoji': '💉'},
    {'threshold': 10, 'name': 'Blood Champion', 'emoji': '🏅'},
    {'threshold': 25, 'name': 'Gold Donor', 'emoji': '🥇'},
    {'threshold': 50, 'name': 'Platinum Donor', 'emoji': '👑'},
]

CATALOGUE = {
    'beginner': [
        {'name': 'Lays Packet', 'points': 10}, {'name': 'Slice Juice', 'points': 10},
        {'name': 'Pen', 'points': 10}, {'name': 'Book', 'points': 20},
        {'name': 'Keychain', 'points': 40}, {'name': 'Water Bottle', 'points': 50},
        {'name': 'T-Shirt', 'points': 100},
    ],
    'intermediate': [
        {'name': 'Hoodie', 'points': 200}, {'name': 'Backpack', 'points': 300},
        {'name': 'Power Bank', 'points': 400}, {'name': 'Smart Watch (Basic)', 'points': 500},
    ],
    'advanced': [
        {'name': 'Bluetooth Headphones', 'points': 700}, {'name': 'Tablet', 'points': 900},
        {'name': 'Bicycle', 'points': 1000},
    ],
    'lifetime': [
        {'name': 'Laptop', 'points': 1500},
        {'name': 'International Trip Sponsorship (Partial)', 'points': 1800},
        {'name': 'Platinum Donor Award + Gold Medal', 'points': 2000},
    ]
}

@rewards_bp.route('/my-rewards', methods=['GET'])
@jwt_required()
def my_rewards():
    user_id = get_jwt_identity()['id']
    user = User.query.get(user_id)
    donations_count = user.points // 10
    earned_badges = [b for b in BADGES if donations_count >= b['threshold']]
    return jsonify({
        'points': user.points,
        'donations': donations_count,
        'badges': earned_badges,
        'catalogue': CATALOGUE
    })