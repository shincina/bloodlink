<p align="center">
  <img src="./img.png" alt="BloodLink Kerala Banner" width="100%">
</p>

# 🩸 BloodLink Kerala 🎯

---

## Basic Details

### Team Name:
Byte Glitch

### Team Members
- Aditi M - Mar Athanasius College of Engineering  
- Shincina Shinto - Mar Athanasius College of Engineering  

---

### Hosted Project Link
🔗 [Live Demo Link](#)  
📹 [Demo Video Link](#)

---

### Project Description
BloodLink Kerala is a real-time full-stack blood donation platform connecting student donors across Kerala campuses with hospitals and blood banks. It enables emergency alerts, live donor matching, blood bank stock monitoring, and a gamified reward system to encourage long-term donor participation.

---

### The Problem Statement
Kerala still faces blood shortages due to lack of centralized coordination between campuses and hospitals, delayed emergency communication, no structured donor verification system, absence of eligibility pre-screening, and poor long-term donor retention. Critical requests often fail to reach nearby eligible donors in time.

---

### The Solution
BloodLink Kerala provides a centralized digital ecosystem that enables real-time emergency alerts, donor matching based on blood group and location, blood bank stock monitoring, eligibility screening before donation, donor verification badges, and a gamified Red Coin reward system to promote sustained and responsible blood donation.

---

## Technical Details

### Technologies/Components Used

**For Software:**

- Languages used: HTML5, CSS3, JavaScript, Python  
- Frameworks used: Flask  
- Libraries used: SQLAlchemy ORM, flask-jwt-extended, bcrypt, flask-cors, Leaflet.js  
- Tools used: VS Code, Git, GitHub, Render  

**For Hardware:**
- Not Applicable (Software-Based Web Application)

---

## Features

- 🚨 Real-Time Emergency Alerts with red priority banners  
- 🗺️ Live Kerala Map with urgency-based color coding  
- 🎁 Gamified Reward System (10 points per donation)  
- 🏅 Donor Badge Progression (5 Levels)  
- 🏥 Hospital Dashboard for instant donor matching  
- 🏦 Blood Bank Inventory Tracking with auto low-stock alerts  
- 🧪 Pre-Donation Eligibility Screening  
- ✅ Verified Donor Badge System  
- 🩸 Blood Group Compatibility Information  
- 👥 Multi-Role System (Donor, Hospital, Blood Bank)  

---

## Implementation

### For Software:

#### Installation

```bash
git clone https://github.com/YOUR_USERNAME/bloodlink-kerala.git
cd bloodlink-kerala
```

#### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend runs at:
```
http://127.0.0.1:5000
```

#### Frontend Run

```bash
cd frontend
python -m http.server 5500
```

Frontend runs at:
```
http://127.0.0.1:5500
```

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

![Landing Page](docs/screenshots/homepage.png)
*Landing page showing login, registration and emergency alerts*

![Donor Dashboard](docs/screenshots/donor.png)
*Donor dashboard with emergency banner and donation tracking*

![Hospital Dashboard](docs/screenshots/hospital.png)
*Hospital dashboard for submitting and managing blood requests*

---

#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)

*Frontend (HTML/CSS/JS) communicates with Flask backend via REST API. JWT handles authentication. Backend interacts with SQLite database via SQLAlchemy ORM.*

---

**Application Workflow:**

![Workflow](docs/workflow.png)

*Hospital submits request → Backend stores request → Matching donors receive notification → Donor completes eligibility → Blood bank confirms donation → Points credited.*

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `http://127.0.0.1:5000/api`

---

**POST /auth/register**
- **Description:** Register donor/hospital/blood bank
- **Request Body:**
```json
{
  "name": "John",
  "email": "john@email.com",
  "password": "password123",
  "role": "donor"
}
```
- **Response:**
```json
{
  "status": "success",
  "message": "User registered successfully"
}
```

---

**POST /auth/login**
- **Description:** Login and receive JWT token
- **Response:**
```json
{
  "access_token": "JWT_TOKEN"
}
```

---

**POST /hospital/request**
- **Description:** Submit blood request
- **Parameters:**
  - blood_group (string)
  - priority (string)
- **Response:**
```json
{
  "status": "success",
  "message": "Request submitted"
}
```

---

**POST /donor/donate**
- **Description:** Record donation and credit points
- **Response:**
```json
{
  "status": "success",
  "points_added": 10
}
```

---

## Project Demo

### Video
[Add demo video link here]

*The video demonstrates emergency alert triggering, donor matching, eligibility screening, and reward point redemption.*

---

## AI Tools Used (For Transparency Bonus)

**Tool Used:** Claude (Anthropic), ChatGPT  

**Purpose:**
- Backend route structure generation  
- Debugging authentication flows  
- API design suggestions  
- README structuring  

**Percentage of AI-generated code:** ~15%

**Human Contributions:**
- Complete system architecture design  
- Business logic implementation  
- Database modeling  
- UI structure and dashboard design  
- Integration and testing  

---

## Team Contributions

- **Aditi M:** Frontend development, UI/UX design, dashboard implementation  
- **Shincina Shinto:** Backend development, database integration, authentication system, API design  

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ at TinkerHub
