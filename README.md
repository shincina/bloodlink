

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
🔗 [[Live Demo Link](#) ](https://github.com/shincina/bloodlink.git) 
📹 [Demo Video Link](#)https://youtu.be/KpsGaCgKg5o

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
git clone https://github.com/shincina/bloodlink.git
cd bloodlink
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
![Home Page]
<img width="1910" height="902" alt="image" src="https://github.com/user-attachments/assets/d0e825f0-2d7d-4172-b395-920f01e4d554" />

![Login Page](docs/screenshots/homepage.png)
*Login page which redirects donors,hospitals,blood banks to their respective dashboard*
<img width="1897" height="913" alt="image" src="https://github.com/user-attachments/assets/10c0c5cc-35b3-4994-b3a6-1101fa696dd4" />


![Donor Registration and Dashboard](docs/screenshots/donor.png)
*Donor dashboard with emergency banner,donation tracking and reward system*
<img width="1913" height="888" alt="image" src="https://github.com/user-attachments/assets/c6c62324-4627-4d88-8171-92489fff1dab" />

<img width="1913" height="918" alt="image" src="https://github.com/user-attachments/assets/f1a83760-03a6-45e7-8cdf-56f80b43f3cf" />
<img width="1912" height="906" alt="image" src="https://github.com/user-attachments/assets/687c4688-024d-4068-90df-e5ab1a54bbc8" />

![Hopsital Registration and Dashboard](docs/screenshots/donor.png)
*Donor dashboard with emergency banner and donation tracking*
<img width="1912" height="908" alt="image" src="https://github.com/user-attachments/assets/a9eb7a28-946d-4196-8229-a8f49dbdad12" />
<img width="1900" height="903" alt="image" src="https://github.com/user-attachments/assets/c4c3860b-49e7-4af9-b52a-684ce1acf5b8" />



![Blood bank Dashboard](docs/screenshots/hospital.png)
*blood bank dashboard managing various blood stock level*
<img width="1907" height="912" alt="image" src="https://github.com/user-attachments/assets/fd0baafc-fef7-434e-a2a3-acf7ab7416cc" />


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
[[Add demo video link here]](https://youtu.be/KpsGaCgKg5o)

*The video demonstrates emergency alert triggering, donor matching, eligibility screening, and reward point redemption.*

---

## AI Tools Used (For Transparency Bonus)

**Tool Used:**Gemini AI, ChatGPT  

**Purpose:**
- Backend route structure generation  
- Debugging authentication flows  
- API design suggestions  
- README structuring  

**Percentage of AI-generated code:** ~75%

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
