document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach(input => input.addEventListener("input", updateCV));
});

function updateCV() {
    document.getElementById("cv-name").textContent = document.getElementById("name").value || "Your Name";
    document.getElementById("cv-email").textContent = document.getElementById("email").value || "you@example.com";
    document.getElementById("cv-phone").textContent = document.getElementById("phone").value || "+254700000000";

    const linkedinURL = document.getElementById("linkedin").value;
    const cvLinkedin = document.getElementById("cv-linkedin-url");
    if (linkedinURL) {
        cvLinkedin.href = linkedinURL;
        cvLinkedin.textContent = "LinkedIn Profile";
    } else {
        cvLinkedin.textContent = "";
    }

    document.getElementById("cv-summary").textContent = document.getElementById("summary").value || "Your professional summary will appear here...";
    document.getElementById("cv-skills").innerHTML = formatList(document.getElementById("skills").value);
    document.getElementById("cv-certifications").innerHTML = formatList(document.getElementById("certifications").value);

    // Referees section
    document.getElementById("cv-referees").innerHTML = `<p>Referees available upon request.</p>`;
}

// Function to add work experience dynamically
function addExperience() {
    const role = document.getElementById("exp-role").value.trim();
    const company = document.getElementById("exp-company").value.trim();
    const year = document.getElementById("exp-year").value.trim();
    const desc = document.getElementById("exp-desc").value.trim();

    if (!role || !company || !year) {
        alert("Please enter Role, Company, and Year.");
        return;
    }

    const experienceList = document.getElementById("cv-experience");
    const experienceItem = document.createElement("div");
    experienceItem.classList.add("experience-item");

    experienceItem.innerHTML = `
        <h4>${role} | ${company} | ${year}</h4>
        <p>${desc || "No description provided."}</p>
        <button class="delete-btn" onclick="removeEntry(this)">❌ Remove</button>
    `;

    experienceList.appendChild(experienceItem);
    clearExperienceInputs();
}

// Function to add education dynamically
function addEducation() {
    const degree = document.getElementById("edu-degree").value.trim();
    const institution = document.getElementById("edu-institution").value.trim();
    const year = document.getElementById("edu-year").value.trim();
    const desc = document.getElementById("edu-desc").value.trim();

    if (!degree || !institution || !year) {
        alert("Please enter Degree, Institution, and Year.");
        return;
    }

    const educationList = document.getElementById("cv-education");
    const educationItem = document.createElement("div");
    educationItem.classList.add("education-item");

    educationItem.innerHTML = `
        <h4>${degree} | ${institution} | ${year}</h4>
        <p>${desc || "No description provided."}</p>
        <button class="delete-btn" onclick="removeEntry(this)">❌ Remove</button>
    `;

    educationList.appendChild(educationItem);
    clearEducationInputs();
}
function addCertification() {
    // Get input values
    let title = document.getElementById("cert-title").value;
    let institution = document.getElementById("cert-institution").value;
    let year = document.getElementById("cert-year").value;
    let description = document.getElementById("cert-desc").value;

    // Validate input
    if (!title || !institution || !year) {
        alert("Please fill in all required fields!");
        return;
    }

    // Create certification entry
    let certDiv = document.createElement("div");
    certDiv.classList.add("cert-entry");
    certDiv.innerHTML = `
        <p><strong>${title}</strong> - ${institution} (${year})</p>
        <p>${description}</p>
        <button class="delete-btn" onclick="removeCertification(this)">Remove</button>
        <hr>
    `;

    // Append to CV preview
    document.getElementById("cv-certifications").appendChild(certDiv);

    // Clear input fields after adding
    document.getElementById("cert-title").value = "";
    document.getElementById("cert-institution").value = "";
    document.getElementById("cert-year").value = "";
    document.getElementById("cert-desc").value = "";
}

// Remove certification
function removeCertification(button) {
    button.parentElement.remove();
}


// Function to remove an entry (Experience or Education)
function removeEntry(button) {
    button.parentElement.remove();
}

// Clears input fields after adding an experience
function clearExperienceInputs() {
    document.getElementById("exp-role").value = "";
    document.getElementById("exp-company").value = "";
    document.getElementById("exp-year").value = "";
    document.getElementById("exp-desc").value = "";
}

// Clears input fields after adding education
function clearEducationInputs() {
    document.getElementById("edu-degree").value = "";
    document.getElementById("edu-institution").value = "";
    document.getElementById("edu-year").value = "";
    document.getElementById("edu-desc").value = "";
}

// Formats text as a bullet-point list
function formatList(inputText) {
    if (!inputText.trim()) return "<p>No details provided.</p>";
    return `<ul>` + inputText.split(",").map(item => `<li>${item.trim()}</li>`).join("") + `</ul>`;
}

// Function to download CV as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    html2canvas(document.getElementById("cv-preview")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 10, 190, 0);
        doc.save("Resume_Xpert_CV.pdf");
    });
}
function generateResume() {
    const userData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        education: document.getElementById("edu-degree").value + " - " + document.getElementById("edu-institution").value,
        experience: document.getElementById("exp-role").value + " at " + document.getElementById("exp-company").value,
    };

    fetch("https://script.google.com/macros/s/AKfycbxnA-nEvTmG6hxdyUD7XNI3S7OsYxyiixXqM0TdktLLiUlrfoiyrOd8D7XalKMHex3jGQ/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(response => response.text())
    .then(data => {
        alert("Resume Generated! Open: " + data);
        window.open(data, "_blank"); // Open the generated resume in a new tab
    })
    .catch(error => console.error("Error:", error));
}
// ✅ Replace with your Google Client ID
const CLIENT_ID = 294728932760-3ghqvj4frk7dr2bccsqgjucl8vd8on4s.apps.googleusercontent.com

// Scopes for Google Docs API & Google Drive API
const SCOPES = "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file";

function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1"],
        scope: SCOPES
    }).then(() => {
        // Check if user is signed in
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            updateSigninStatus(true);
        }
    });
}

function signIn() {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        updateSigninStatus(true);
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById("auth-status").textContent = "✅ Signed In!";
    } else {
        document.getElementById("auth-status").textContent = "❌ Not Signed In";
    }
}

function signOut() {
    gapi.auth2.getAuthInstance().signOut().then(() => {
        document.getElementById("auth-status").textContent = "❌ Signed Out";
    });
}
async function generateGoogleDocsResume() {
    const accessToken = gapi.auth.getToken().access_token; // Get OAuth token
    const apiUrl = "https://docs.googleapis.com/v1/documents";

    const resumeContent = {
        title: "Resume_Xpert_CV",
        body: {
            content: [
                { paragraph: { elements: [{ textRun: { content: "Resume\n\n", textStyle: { bold: true, fontSize: { magnitude: 24, unit: "PT" } } } }] } },
                { paragraph: { elements: [{ textRun: { content: "Name: " + document.getElementById("name").value + "\n" } }] } },
                { paragraph: { elements: [{ textRun: { content: "Email: " + document.getElementById("email").value + "\n" } }] } },
                { paragraph: { elements: [{ textRun: { content: "Phone: " + document.getElementById("phone").value + "\n" } }] } },
                { paragraph: { elements: [{ textRun: { content: "Education: " + document.getElementById("edu-degree").value + " - " + document.getElementById("edu-institution").value + "\n" } }] } },
                { paragraph: { elements: [{ textRun: { content: "Experience: " + document.getElementById("exp-role").value + " at " + document.getElementById("exp-company").value + "\n" } }] } }
            ]
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(resumeContent)
        });

        const data = await response.json();
        alert("Resume Created! Open: https://docs.google.com/document/d/" + data.documentId);
        window.open("https://docs.google.com/document/d/" + data.documentId, "_blank");
    } catch (error) {
        console.error("Error creating resume:", error);
    }
}
