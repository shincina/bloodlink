from flask import Flask
from flask_cors import CORS
from extensions import db, jwt

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['JWT_SECRET_KEY'] = 'bloodlink-kerala-secret-key-2024-secure'

    db.init_app(app)
    jwt.init_app(app)

    # CORS must be initialized AFTER app is created, BEFORE blueprints
    CORS(app)
    from routes.auth import auth_bp
    from routes.donor import donor_bp
    from routes.hospital import hospital_bp
    from routes.bloodbank import bloodbank_bp
    from routes.rewards import rewards_bp

    app.register_blueprint(auth_bp,      url_prefix='/api/auth')
    app.register_blueprint(donor_bp,     url_prefix='/api/donor')
    app.register_blueprint(hospital_bp,  url_prefix='/api/hospital')
    app.register_blueprint(bloodbank_bp, url_prefix='/api/bloodbank')
    app.register_blueprint(rewards_bp,   url_prefix='/api/rewards')

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)