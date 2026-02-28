# 🩸 BloodLink Kerala

> **A real-time blood donation platform connecting student donors across Kerala campuses with hospitals and blood banks.**

---

## 🚀 Live Demo

> 🔗 [Live Demo Link](#) — *Deploy to Render/Vercel and update this link*

📹 [Demo Video](#) — *Add your demo video link here*

---

## 📌 Project Description

BloodLink Kerala is a full-stack web application built for the Kerala campus hackathon. It bridges the critical gap between blood donors on college campuses, hospitals managing patient emergencies, and blood banks tracking inventory — all in real time.

When a hospital submits a **critical blood request**, an emergency red banner appears instantly on all matching donor dashboards. Donors earn **reward points** for every donation, unlocking badges and redeeming real prizes from snacks to laptops.

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | HTML5, CSS3, Vanilla JavaScript     |
| Backend     | Python 3, Flask                     |
| Database    | SQLite (via SQLAlchemy ORM)         |
| Auth        | JWT (flask-jwt-extended) + bcrypt   |
| Maps        | Leaflet.js + OpenStreetMap          |
| CORS        | flask-cors                          |
| Deployment  | Render (backend) / GitHub Pages (frontend) |

---

## ✨ Features

1. **🚨 Real-Time Emergency Alerts** — Critical blood requests trigger a red banner on ALL donor dashboards instantly
2. **🗺️ Live Donation Map** — Kerala map with color-coded markers (red=critical, orange=urgent, yellow=needed)
3. **🎁 Gamified Rewards System** — Earn 10 pts/donation, unlock 4-tier rewards from Lays to International Trips
4. **🏅 Donor Badge Progression** — 5 badges: First Drop Hero → Life Saver → Blood Champion → Gold → Platinum
5. **🏥 Hospital Dashboard** — Submit patient requests with priority levels, find matching donors instantly
6. **🏦 Blood Bank Inventory** — Live stock tracking with auto-alerts when any blood group falls critically low
7. **🧪 Eligibility Screening** — Pre-donation checklist (alcohol, fever, medication, last donation gap, etc.)
8. **✅ Donor Verification** — Verified donors get a trust badge visible to hospitals and blood banks
9. **🩸 Blood Group Info** — Animated compatibility cards showing who can donate to whom
10. **👥 Multi-Role System** — Separate dashboards for Donors, Hospitals, and Blood Banks

---

## 📁 Project Structure

```
bloodlink/
├── backend/                  # Flask API server
│   ├── app.py                # App factory + blueprint registration
│   ├── extensions.py         # Shared db + jwt instances
│   ├── models.py             # SQLAlchemy models
│   ├── requirements.txt      # Python dependencies
│   └── routes/
│       ├── auth.py           # Register + Login
│       ├── donor.py          # Donor endpoints
│       ├── hospital.py       # Hospital endpoints
│       ├── bloodbank.py      # Blood bank endpoints
│       └── rewards.py        # Points + badges
├── frontend/                 # Static HTML/CSS/JS
│   ├── index.html            # Landing page
│   ├── login.html            # Multi-role login
│   ├── donor-register.html
│   ├── hospital-register.html
│   ├── bloodbank-register.html
│   ├── donor-dashboard.html
│   ├── hospital-dashboard.html
│   ├── bloodbank-dashboard.html
│   ├── eligibility-test.html
│   ├── css/style.css
│   └── js/
│       ├── auth.js
│       ├── donor.js
│       └── main.js
└── docs/
    ├── api.md
    └── screenshots/
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- pip
- VS Code with Live Server extension

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/bloodlink-kerala.git
cd bloodlink-kerala
```

### 2. Set Up Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Run the Backend
```bash
python app.py
# Flask runs at http://127.0.0.1:5000
```

### 4. Run the Frontend
```bash
# Open frontend/index.html with VS Code Live Server
# OR:
cd frontend
python -m http.server 5500
# Frontend runs at http://127.0.0.1:5500
```

---

## 🔌 API Documentation

Base URL: `http://127.0.0.1:5000/api`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user (donor/hospital/bloodbank) |
| POST | `/auth/login` | Login, returns JWT token |

### Donor
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/donor/eligibility` | ✅ | Check donation eligibility |
| POST | `/donor/donate` | ✅ | Record donation (+10 pts) |
| GET | `/donor/history` | ✅ | Get donation history |
| GET | `/donor/notifications` | ✅ | Get blood request notifications |
| GET | `/donor/leaderboard` | ❌ | Top 10 donors by points |

### Hospital
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/hospital/request` | ✅ | Submit blood request |
| GET | `/hospital/requests` | ✅ | Get hospital's requests |
| GET | `/hospital/match/:id` | ✅ | Find matching donors |
| GET | `/hospital/public-requests` | ❌ | All open requests |

### Blood Bank
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bloodbank/stock` | ✅ | Get current stock levels |
| POST | `/bloodbank/stock/update` | ✅ | Update blood stock |
| POST | `/bloodbank/confirm-donation/:id` | ✅ | Confirm donation |

### Rewards
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/rewards/my-rewards` | ✅ | Get points, badges, catalogue |

---

## 🗺️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Port 5500)                  │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Donor   │  │  Hospital   │  │   Blood Bank     │   │
│  │Dashboard │  │  Dashboard  │  │   Dashboard      │   │
│  └────┬─────┘  └──────┬──────┘  └────────┬─────────┘   │
└───────┼───────────────┼──────────────────┼─────────────┘
        │    JWT Auth   │   REST API calls  │
        ▼               ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                  FLASK BACKEND (Port 5000)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  /auth   │  │ /donor   │  │/hospital │  │/blood  │  │
│  │  routes  │  │  routes  │  │  routes  │  │ bank   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  │
└───────┼─────────────┼─────────────┼─────────────┼───────┘
        └─────────────┴─────────────┴─────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│              SQLite Database (SQLAlchemy ORM)            │
│  Users │ BloodRequests │ Donations │ BloodStock │ Notifs  │
└─────────────────────────────────────────────────────────┘
```

---

## 📸 Screenshots

> 📸 Add actual screenshots to `docs/screenshots/` folder and update paths below

| Landing Page | Donor Dashboard | Hospital Dashboard |
|---|---|---|
| ![Home](docs/screenshots/homepage.png) | ![Donor](docs/screenshots/donor.png) | ![Hospital](docs/screenshots/hospital.png) |

| Blood Bank | Rewards | Blood Group Info |
|---|---|---|
| ![BloodBank](docs/screenshots/bloodbank.png) | ![Rewards](docs/screenshots/rewards.png) | ![BloodInfo](docs/screenshots/bloodinfo.png) |

---

## 👥 Team Members

| Name | Role |
|------|------|
| [Your Name] | Full Stack Developer |
| [Team Member 2] | UI/UX Designer |
| [Team Member 3] | Backend Developer |

---

## 🤖 AI Tools Used

- **Claude (Anthropic)** — Used for code generation, debugging, and feature implementation assistance during development

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for Kerala — BloodLink Kerala Hackathon 2026*
