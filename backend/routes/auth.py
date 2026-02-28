from flask import Blueprint, request, jsonify
from extensions import db
from models import User
import bcrypt
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        existing = User.query.filter_by(phone=data['phone']).first()
        if existing:
            return jsonify({'error': 'Phone number already registered'}), 400
        hashed = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt())
        user = User(
            name=data.get('name',''),
            phone=data.get('phone',''),
            email=data.get('email',''),
            password=hashed.decode(),
            role=data.get('role','donor'),
            blood_group=data.get('blood_group',''),
            age=int(data.get('age', 0)),
            campus=data.get('campus',''),
            has_hiv=data.get('has_hiv', False),
            has_aids=data.get('has_aids', False)
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = User.query.filter(
            (User.phone == data['identifier']) | (User.name == data['identifier'])
        ).first()
        if not user or not bcrypt.checkpw(data['password'].encode(), user.password.encode()):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Must be plain string - NOT a dict
        token = create_access_token(identity=str(user.id))

        return jsonify({
            'token': token,
            'role': user.role,
            'name': user.name,
            'blood_group': user.blood_group or ''
        })
    except Exception as e:
        print('LOGIN ERROR:', str(e))
        return jsonify({'error': str(e)}), 500