// script.js (FINAL FIX: Ensures IDs and URL are correct)

// The confirmed, live Render API URL
const API_BASE_URL = 'https://krishi-thunai-1.onrender.com'; 

async function sendImageForPrediction(file) {
    const formData = new FormData();
    // The key 'file' must match the 'file: UploadFile = File(...)' parameter name in your FastAPI backend
    formData.append("file", file); 
    
    const apiURL = API_BASE_URL + '/predict'; 
    const resultsDiv = document.getElementById('results');
    
    // 1. Show Loading Message
    resultsDiv.innerHTML = '<p class="loading">⏳ Sending image to ML server... (First request may take 30-60 seconds due to server wake-up)</p>';

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        // Check for non-network errors (e.g., 404, 500)
        if (!response.ok) {
            throw new Error(`[${response.status}] API Error: ${result.detail || 'Unknown server error'}`);
        }
        
        // --- Display Prediction Results ---
        resultsDiv.innerHTML = `
            <div class="result-section">
                <h3>✅ Prediction Results</h3>
                <p><strong>Predicted Disease/State:</strong> <span class="primary-class">${result.class}</span></p>
                <p><strong>Confidence:</strong> <span class="primary-confidence">${ (result.confidence * 100).toFixed(2) }%</span></p>
                <p><strong>Estimated Severity Score (1-13):</strong> <span class="severity-score">${result.severity_score}</span></p>
                
                <hr>
                <p class="note">Backend connection successful! Now we can start building the detailed recommendation logic here in the Frontend using these values.</p>
            </div>
        `;
        resultsDiv.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Fetch Error:", error);
        resultsDiv.innerHTML = `<p class="error">❌ Failed to get prediction. Error: ${error.message}. Please check the console and ensure the Render API is awake.</p>`;
    }
}

// Event listener to trigger the process when a file is selected
// *** THIS LINE WAS CAUSING THE ERROR ***
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const resultsDiv = document.getElementById('results');

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
        // Clear if no file is selected (shouldn't happen on 'change' event)
        previewContainer.style.display = 'none';
        resultsDiv.innerHTML = '<p class="initial-message">Please upload an image to begin the diagnosis.</p>';
    }
});
