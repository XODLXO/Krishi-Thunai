// script.js (Simplified Final Display with new URL and troubleshooting log)

// 🚨 UPDATED RENDER API URL 🚨
const API_BASE_URL = 'https://krishi-thunai-1.onrender.com'; 

async function sendImageForPrediction(file) {
    const formData = new FormData();
    formData.append("file", file); 
    
    const apiURL = API_BASE_URL + '/predict'; 
    const resultsDiv = document.getElementById('results');
    
    // --- Troubleshooting Log ---
    console.log("Starting prediction request for file:", file.name);
    // --- End Troubleshooting Log ---
    
    resultsDiv.innerHTML = '<p class="loading">⏳ Sending image to ML server... (This may take up to 50 seconds on the first try)</p>';

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            throw new Error(`[${response.status}] API Error: ${result.detail || 'Unknown server error'}`);
        }
        
        // --- Display Only Core Data ---
        resultsDiv.innerHTML = `
            <div class="result-section">
                <h3>✅ Prediction Results</h3>
                <p><strong>Predicted Disease/State:</strong> <span class="primary-class">${result.class}</span></p>
                <p><strong>Confidence:</strong> <span class="primary-confidence">${ (result.confidence * 100).toFixed(2) }%</span></p>
                <p><strong>Estimated Severity Score (1-13):</strong> <span class="severity-score">${result.severity_score}</span></p>
                
                <hr>
                <p class="note">The API is working! Next features will be built here in the frontend.</p>
            </div>
        `;
        resultsDiv.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Fetch Error:", error);
        resultsDiv.innerHTML = `<p class="error">❌ Failed to get prediction. Error: ${error.message}. Check the browser's Network tab.</p>`;
    }
}

// Event listener to trigger the process when a file is selected
document.getElementById('imageUpload').addEventListener('change', function(event) {
    // --- Troubleshooting: Log when the event fires ---
    console.log("Image upload event fired.");
    // --- End Troubleshooting ---
    
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');

    // This checks if a file was actually selected
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
