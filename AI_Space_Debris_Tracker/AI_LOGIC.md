# 🧠 The AI Logic: Simplified

### Goal
We want to warn a satellite if a piece of space junk is about to hit it.

### The Challenge
Satellites move in circles (orbits).
Data comes to us as: **Latitude, Longitude, and Altitude**.
Imagine trying to measure the distance between two flies buzzing around a basketball using only their "GPS" coordinates. It's tricky!

### The Solution: 3D Math (Euclidean Distance)
To measure the straight-line distance, we first convert the "Globe" coordinates (Spherical) into "Box" coordinates (Cartesian X, Y, Z).

**The Formula:**
1. $X = (R + alt) \times \cos(lat) \times \cos(lon)$
2. $Y = (R + alt) \times \cos(lat) \times \sin(lon)$
3. $Z = (R + alt) \times \sin(lat)$

Once we have X, Y, and Z for both objects, we use the 3D Distance Formula:
$$ Distance = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2} $$

### The "AI" Decision Tree
This represents a basic "Rule-Based AI".
It makes decisions based on data thresholds:

- **Input:** Distance in km.
- **Logic:**
    - Is it closer than 50km? -> **CRITICAL DANGER**
    - Is it closer than 200km? -> **WARNING**
    - Is it far away? -> **SAFE**
- **Output:** Alert Level.

In a professional system, we would replace this simple logic with a **Neural Network** that predicts where the debris *will be* in the future, not just where it is *now*.
