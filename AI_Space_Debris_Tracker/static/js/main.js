// Main JS - Space Debris Tracker

document.addEventListener('DOMContentLoaded', () => {
    initGlobe();
    fetchData();

    // Refresh data every 5 seconds to simulate live tracking
    setInterval(fetchData, 5000);
});

function initGlobe() {
    // Basic Layout for Plotly
    const layout = {
        margin: { t: 0, b: 0, l: 0, r: 0 },
        paper_bgcolor: 'rgba(0,0,0,0)', // Transparent
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        autosize: true,
        geo: {
            scope: 'world',
            projection: {
                type: 'orthographic' // 3D Globe view
            },
            showland: true,
            landcolor: '#1c2541',
            showocean: true,
            oceancolor: '#0b132b',
            showlakes: false,
            coastlinecolor: '#409cff',
            countrycolor: '#2b3a67',

            // Initial Camera
            center: { lat: 0, lon: 0 },
            projection_rotation: { lon: 0, lat: 0, roll: 0 },
            bgcolor: 'rgba(0,0,0,0)'
        }
    };

    const config = { responsive: true, displayModeBar: false };
    const data = []; // Empty initially

    Plotly.newPlot('globe-viz', data, layout, config);
}

function fetchData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            updateDashboard(data);
            updateGlobe(data.objects);
            document.getElementById('loading').style.display = 'none';
        })
        .catch(err => console.error('Error loading data:', err));
}

function updateDashboard(data) {
    // Update Stats
    document.getElementById('total-count').innerText = data.stats.total_objects;
    document.getElementById('sat-count').innerText = data.stats.satellites_count;
    document.getElementById('deb-count').innerText = data.stats.debris_count;

    // Update Risk Feeds
    const feed = document.getElementById('alert-feed');
    feed.innerHTML = ''; // Clear old alerts

    if (data.alerts.length === 0) {
        feed.innerHTML = '<p style="color:#2ed573">✅ No collisions detected.</p>';
    } else {
        data.alerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = `alert-card ${alert.risk_level}`;
            div.innerHTML = `
                <strong>${alert.risk_level} RISK</strong><br>
                ${alert.satellite} ↔ ${alert.debris}<br>
                Dist: ${alert.distance_km} km
            `;
            feed.appendChild(div);
        });
    }
}

function updateGlobe(objects) {
    // Separate Satellites and Debris for styling using functional programming
    const sats = objects.filter(o => o.type === 'satellite');
    const deb = objects.filter(o => o.type === 'debris');

    // Trace 1: Satellites (Green Dots)
    const traceSat = {
        type: 'scattergeo',
        mode: 'markers',
        lat: sats.map(o => o.lat),
        lon: sats.map(o => o.lon),
        text: sats.map(o => `${o.name} (Alt: ${o.alt}km)`), // Hover text
        marker: {
            size: 8,
            color: '#2ed573', // Green
            line: { color: 'white', width: 1 },
            symbol: 'circle'
        },
        name: 'Satellites'
    };

    // Trace 2: Debris (Red Dots)
    const traceDeb = {
        type: 'scattergeo',
        mode: 'markers',
        lat: deb.map(o => o.lat),
        lon: deb.map(o => o.lon),
        text: deb.map(o => `${o.name} (Alt: ${o.alt}km)`),
        marker: {
            size: 6,
            color: '#ff4757', // Red
            opacity: 0.8,
            symbol: 'x'
        },
        name: 'Debris'
    };

    // Update the plot with animation frames if possible, but react/restyle is simpler here
    Plotly.react('globe-viz', [traceSat, traceDeb], document.getElementById('globe-viz').layout);
}
