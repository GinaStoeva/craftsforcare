// 1. Setup the Map centered on Libertyville
const map = L.map('map').setView([42.2831, -87.9531], 12); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 2. Data Structure for Locations
const locations = {
    "Brookdale Hawthorn Lakes": { coords: [42.2425, -87.9485], donations: 0 },
    "Advocate Condell Medical Center": { coords: [42.2815, -87.9695], donations: 0 }
};

// 3. The "Pipe" - Fetching data from your Google Sheet
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRNn5pup5_exKPdHy5xcO4RaIgh0wwdLp0vDUMAD12TkaqTumA1iz88khjCUZ6d-AqOhCTt0WNXlvn4/pub?gid=984832610&single=true&output=csv';

async function getData() {
    const response = await fetch(csvUrl);
    const data = await response.text();
    
    // Split CSV into rows, skipping the header row
    const rows = data.split('\n').slice(1); 
    
    let grandTotal = 0;

    // Reset counts before recalculating
    for (let key in locations) { locations[key].donations = 0; }

    rows.forEach(row => {
        // This splits each row by comma. 
        // Note: If your form answers have commas in them, this might need a 'Regex' fix later.
        const columns = row.split(','); 
        
        const locationName = columns[1]?.trim(); // Assumes Location is 2nd column
        const amount = parseInt(columns[2]);    // Assumes Amount is 3rd column

        if (locations[locationName] && !isNaN(amount)) {
            locations[locationName].donations += amount;
            grandTotal += amount;
        }
    });

    // Update the HTML counter
    document.getElementById('counter').innerText = grandTotal;

    // Update the Map Markers
    updateMap();
}

function updateMap() {
    // Clear existing markers (optional, but good for clean updates)
    for (let name in locations) {
        const spot = locations[name];
        const marker = L.marker(spot.coords).addTo(map);
        marker.bindPopup(`<b>${name}</b><br>Crafts Received: ${spot.donations}`);
    }
}

// Run the function when the page loads
getData();