const grid = document.getElementById('eyeDisplayGrid');
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const welcomeSection = document.getElementById('welcomeSection');
const logoutBtn = document.getElementById('logoutBtn');

// Auth checking function
function isDoctorLoggedIn() {
    return localStorage.getItem('doctorToken') !== null;
}

// Handle Login Form Submit
loginForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    try {
        const response = await fetch('/api/doctor/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('doctorToken', data.token);
            alert("Doctor Login Successful!");
            updateAuthUI();
            fetchDonorsFromMongoDB(); // Refresh to display unlocked contact info details
        } else {
            alert("Invalid Credentials! Use doctor / admin123");
        }
    } catch(err) {
        alert("Login route communication error.");
    }
});

function handleLogout() {
    localStorage.removeItem('doctorToken');
    alert("Logged Out from Secure System Session.");
    updateAuthUI();
    fetchDonorsFromMongoDB(); // Hide contact info again
}

function updateAuthUI() {
    if (isDoctorLoggedIn()) {
        loginSection?.classList.add('d-none');
        welcomeSection?.classList.remove('d-none');
        logoutBtn?.classList.remove('d-none');
    } else {
        loginSection?.classList.remove('d-none');
        welcomeSection?.classList.add('d-none');
        logoutBtn?.classList.add('d-none');
    }
}

async function fetchDonorsFromMongoDB() {
    try {
        const response = await fetch('/api/donors');
        const donors = await response.json();
        grid.innerHTML = "";
        const loggedIn = isDoctorLoggedIn();

        if (donors.length === 0) {
            grid.innerHTML = "<h4 class='text-center text-muted w-100'>No records found inside MongoDB Collection.</h4>";
            return;
        }

        donors.forEach(donor => {
            // Protect data mask if not logged in as medical staff
            const contactDisplay = loggedIn 
                ? `<span class="text-success fw-bold">${donor.contact}</span>`
                : `<span class="text-danger small italic">🔒 Login to Unlock Contact</span>`;

            grid.innerHTML += `
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm border-0 bg-white">
                        <img src="${donor.image}" class="card-img-top p-4" style="height: 120px; object-fit: contain;">
                        <div class="card-body text-center">
                            <h5 class="card-title text-primary fw-bold">${donor.donorId}</h5>
                            <p class="mb-1"><strong>Donor Name:</strong> ${donor.name}</p>
                            <p class="mb-1"><strong>Details:</strong> ${donor.age} Yrs / ${donor.sex}</p>
                            <p class="mb-2 text-muted small"><strong>Health:</strong> ${donor.health || 'Normal'}</p>
                            <div class="p-2 mb-2 bg-light rounded text-center border">
                                <small class="text-muted d-block">CONTACT CHANNELS:</small>
                                ${contactDisplay}
                            </div>
                            <span class="badge bg-success py-2 px-3 w-100">${donor.status}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Fetch failure:", error);
        grid.innerHTML = "<h4>Error connecting to MongoDB server dataset logs.</h4>";
    }
}

// Trigger setup configuration execution
updateAuthUI();
fetchDonorsFromMongoDB();