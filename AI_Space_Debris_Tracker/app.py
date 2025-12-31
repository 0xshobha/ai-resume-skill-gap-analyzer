from flask import Flask, render_template, jsonify
import json
import math
import os

app = Flask(__name__)

# --- MATH & AI LOGIC ---
# Standard Earth Radius in km
EARTH_RADIUS_KM = 6371

def to_cartesian(lat, lon, alt):
    """
    Convert Lat/Lon/Alt to 3D Cartesian (x, y, z) coordinates.
    This helps in calculating true 3D distance between objects.
    """
    # Convert degrees to radians
    lat_rad = math.radians(lat)
    lon_rad = math.radians(lon)
    
    # Distance from Earth center
    r = EARTH_RADIUS_KM + alt
    
    x = r * math.cos(lat_rad) * math.cos(lon_rad)
    y = r * math.cos(lat_rad) * math.sin(lon_rad)
    z = r * math.sin(lat_rad)
    
    return x, y, z

def calculate_distance(obj1, obj2):
    """
    Calculate Euclidean distance between two space objects in km.
    """
    x1, y1, z1 = to_cartesian(obj1['lat'], obj1['lon'], obj1['alt'])
    x2, y2, z2 = to_cartesian(obj2['lat'], obj2['lon'], obj2['alt'])
    
    dist = math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2)
    return dist

def assess_risk(distance):
    """
    Simple 'AI' Logic rule-based classifier.
    In a real system, this would use Machine Learning on orbital trajectories.
    """
    if distance < 50:
        return "HIGH"
    elif distance < 200:
        return "MEDIUM"
    else:
        return "LOW"

# --- ROUTES ---

@app.route('/')
def home():
    """
    Serve the main dashboard page.
    """
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    """
    API Endpoint: Returns Satellites & Debris with Calculated Risks.
    """
    try:
        data_path = os.path.join('data', 'mock_data.json')
        with open(data_path, 'r') as f:
            objects = json.load(f)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Separate lists for processing
    satellites = [o for o in objects if o['type'] == 'satellite']
    debris_list = [o for o in objects if o['type'] == 'debris']
    
    alerts = []
    
    # "Al" Logic: Check every satellite against every debris piece/other satellite
    # For this educational prototype, we look for Debris near Satellites
    
    for sat in satellites:
        sat['risks'] = [] # Store local risks for frontend tooltip
        
        for debris in debris_list:
            dist = calculate_distance(sat, debris)
            risk_level = assess_risk(dist)
            
            # If there's a notable risk, verify and log it
            if risk_level in ["HIGH", "MEDIUM"]:
                alert = {
                    "satellite": sat['name'],
                    "debris": debris['name'],
                    "distance_km": round(dist, 2),
                    "risk_level": risk_level
                }
                alerts.append(alert)
                sat['risks'].append(alert)

    # Return structure for frontend
    response = {
        "timestamp": "Simulated Live Feed",
        "objects": objects, # All raw objects for plotting
        "alerts": alerts,   # Processed risk alerts
        "stats": {
            "total_objects": len(objects),
            "satellites_count": len(satellites),
            "debris_count": len(debris_list),
            "high_risk_count": len([a for a in alerts if a['risk_level'] == "HIGH"])
        }
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
