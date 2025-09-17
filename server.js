// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); // Add axios for fetching from Random User API

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Store for fetched user data
let storedUsers = [];

// Function to fetch data from Random User API and store it
async function fetchAndStoreUsers() {
    try {
        console.log('Fetching users from Random User API...');
        const response = await axios.get('https://randomuser.me/api/?results=100');
        storedUsers = response.data.results;
        console.log(`Successfully stored ${storedUsers.length} users from Random User API`);
    } catch (error) {
        console.error('Error fetching from Random User API:', error.message);
        // Fallback to generated data if API call fails
        storedUsers = generateRandomUsers(100);
    }
}

// Function to generate random users (fallback)
function generateRandomUsers(count) {
    const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
    const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA"];
    
    const results = [];
    for (let i = 0; i < count; i++) {
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const state = states[Math.floor(Math.random() * states.length)];
        
        const user = {
            gender: gender,
            name: {
                title: gender === 'male' ? 'Mr' : 'Ms',
                first: firstName,
                last: lastName
            },
            location: {
                street: {
                    number: Math.floor(Math.random() * 1000) + 1,
                    name: ["Main St", "Oak Ave", "Maple Rd", "Cedar Ln", "Elm St"][Math.floor(Math.random() * 5)]
                },
                city: city,
                state: state,
                country: "United States",
                postcode: Math.floor(Math.random() * 90000) + 10000
            },
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            dob: {
                date: new Date(Date.now() - Math.floor(Math.random() * 50 + 18) * 365 * 24 * 60 * 60 * 1000).toISOString(),
                age: Math.floor(Math.random() * 50) + 18
            },
            phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            cell: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            picture: {
                large: `https://randomuser.me/api/portraits/${gender === 'male' ? 'men' : 'women'}/${(i % 100) + 1}.jpg`,
                medium: `https://randomuser.me/api/portraits/med/${gender === 'male' ? 'men' : 'women'}/${(i % 100) + 1}.jpg`,
                thumbnail: `https://randomuser.me/api/portraits/thumb/${gender === 'male' ? 'men' : 'women'}/${(i % 100) + 1}.jpg`
            }
        };
        
        results.push(user);
    }
    return results;
}

// Serve the HTML file at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint that mimics Random User API
app.get('/api', (req, res) => {
    const results = parseInt(req.query.results) || 1;
    
    // Get requested number of users from stored data
    const users = storedUsers.slice(0, Math.min(results, storedUsers.length));
    
    // Return response in the same format as Random User API
    res.json({
        results: users,
        info: {
            seed: "assignment-02",
            results: users.length,
            page: 1,
            version: "1.4"
        }
    });
});

// Initialize the server
async function startServer() {
    // Fetch data from Random User API first
    await fetchAndStoreUsers();
    
    // Start the server
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`API endpoint available at http://localhost:${port}/api`);
        console.log(`Access your application at http://localhost:${port}`);
        console.log(`Using ${storedUsers.length} stored users from Random User API`);
    });
}

// Start the server
startServer().catch(console.error);