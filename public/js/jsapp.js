document.getElementById('donorForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const donorData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        sex: document.getElementById('sex').value,
        contact: document.getElementById('contact').value,
        health: document.getElementById('health').value
    };

    try {
        const response = await fetch('/api/donors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donorData)
        });

        const result = await response.json();
        if(result.success) {
            alert("Data Successfully Stored in MongoDB Database! Status: Available. ID: " + result.donorId);
            window.location.href = "availability.html";
        } else {
            alert("Error saving data to database server module.");
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Server unreachable. Please verify if Node server is active.");
    }
});