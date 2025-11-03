// script.js - Final code for the Frontend on GitHub Pages

// 🚨 THIS IS YOUR LIVE RENDER API URL 🚨
// This URL connects your frontend to the deployed Python/PyTorch backend.
const API_BASE_URL = 'https://krishi-thunai.onrender.com'; 

// Function to handle image upload and API call
async function sendImageForPrediction(file) {
    const formData = new FormData();
    // 'file' must match the parameter name used in your app.py FastAPI endpoint
    formData.append("file", file); 
    
    const apiURL = API_BASE_URL + '/predict'; // Full endpoint URL
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p class="loading">⏳ Sending image to ML server...</p>'; // Loading state

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            body: formData,
            // Do NOT set Content-Type; the browser handles it for FormData
        });

        // Parse the JSON response body
        const result = await response.json();

        if (!response.ok) {
            // Handle HTTP errors (e.g., 500 server error)
            throw new Error(`[${response.status}] API Error: ${result.detail || 'Unknown server error'}`);
        }
        
        // --- Display Successful Results ---
        resultsDiv.innerHTML = `
            <h3>✅ Prediction Complete</h3>
            <p><strong>Predicted Class:</strong> <span>${result.class}</span></p>
            <p><strong>Confidence:</strong> <span>${ (result.confidence * 100).toFixed(2) }%</span></p>
            <p><strong>Severity Score (1-13):</strong> <span>${result.severity_score}</span></p>
        `;
        resultsDiv.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Fetch Error:", error);
        resultsDiv.innerHTML = `<p class="error">❌ Failed to get prediction. Check API status. Error: ${error.message}</p>`;
    }
}

// Event listener to trigger the process when a file is selected
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');

    if (file) {
        // 1. Show the image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
        
        // 2. Start the prediction process
        sendImageForPrediction(file);
    } else {
        // Clear if no file is selected
        previewContainer.style.display = 'none';
        document.getElementById('results').innerHTML = '';
    }
});
