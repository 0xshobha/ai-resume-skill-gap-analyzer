# 🛰️ AI Space Debris Tracker
### *Protecting Earth's Orbit with Intelligence*

> **Hackathon Project - Class 10**  
> **Theme:** Space Safety / AI for Good  
> **Status:** Prototype 🟢

---

## 📖 Introduction
Space is getting crowded! thousands of satellites orbit Earth, but so do millions of pieces of "Space Junk" (debris)—old rocket parts, dead satellites, and paint flecks. If they collide, they create even *more* debris (The Kessler Syndrome), potentially trapping us on Earth.

**Orbit Guard AI** is a web-based educational tool that visualizes this problem and demonstrates how Artificial Intelligence can help predict and prevent collisions.

---

## 🚀 Features
- **3D Interactive Globe:** Rotate and zoom around Earth to see the clutter.
- **Real-Time Visualization:** 
    - 🟢 **Green Dots:** Active Satellites (e.g., ISS, Hubble, Starlink)
    - 🔴 **Red Dots:** Dangerous Space Debris
- **AI Collision Prediction:**  
    - Calculates distances between objects in real-time.
    - Alerts users if a satellite is in **HIGH RISK** of collision.
- **Educational Dashboard:** Learn why space safety matters.

---

## 🧠 How It Works (The "AI" Logic)
This project simulates a simplified version of a Space Traffic Management system:

1. **Data Ingestion:** We take (simulated) data of satellites and debris including their Latitude, Longitude, and Altitude.
2. **3D Math:** The system converts these spherical coordinates into 3D space (x, y, z) to calculate the *true distance* between objects in kilometers.
3. **Risk Algorithm:** 
    - If Distance < 50 km ➡️ **HIGH RISK** 🚨
    - If Distance < 200 km ➡️ **MEDIUM RISK** ⚠️
    - Else ➡️ **LOW RISK** ✅

*Note: Real systems use complex orbital physics (Keplerian elements) and Machine Learning models trained on years of trajectory data.*

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Glassmorphism), JavaScript
- **Visualization:** Plotly.js (3D Orthographic Projection)
- **Backend:** Python (Flask)
- **Data:** Simulated JSON dataset

---

## 📸 Screenshots
*(Add your screenshots here after running the project)*
- *The Dashboard showing the 3D Globe.*
- *The "High Risk" alert panel.*

---

## 💻 How to Run Locally

### Prerequisites
- Python installed on your computer.

### Steps
1. **Clone/Download** this folder.
2. Open a terminal/command prompt in the project folder.
3. Install Flask (if not already installed):
   ```bash
   pip install flask
   ```
4. Run the application:
   ```bash
   python app.py
   ```
5. Open your browser and go to:
   ```
   http://127.0.0.1:5000
   ```

---

## 🔮 Future Scope
If this were a real startup, we would:
1. Connect to the **Space-Track.org API** for real-time live data.
2. Use **Machine Learning (Regression)** to predict where debris will be in 24 hours.
3. Add a feature to suggest **maneuvers** for satellites to dodge debris.

---

## ⚖️ Disclaimer
This is an **Educational Prototype** created for a hackathon. The data is simulated, and the physics are simplified for demonstration purposes. It is not a real-time safety tool.

---

### *Made with 💻 and 🌌 by a Future Engineer*
