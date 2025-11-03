// script.js (Simplified Final Display)

const API_BASE_URL = 'https://krishi-thunai.onrender.com'; 

async function sendImageForPrediction(file) {
    const formData = new FormData();
    formData.append("file", file); 
    
    const apiURL = API_BASE_URL + '/predict'; 
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p class="loading">⏳ Sending image to ML server...</p>';

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
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
                <p class="note">All advanced features (Recommendations, Top Classes) will be implemented here in the Frontend using JavaScript based on these three values.</p>
            </div>
        `;
        resultsDiv.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Fetch Error:", error);
        resultsDiv.innerHTML = `<p class="error">❌ Failed to get prediction. Check API status. Error: ${error.message}</p>`;
    }
}

// ... (Event listener remains the same) ...
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');

    if (file) {
        // ... (previewing code) ...
        sendImageForPrediction(file);
    } else {
        // ... (clear code) ...
    }
});
