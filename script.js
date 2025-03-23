document.addEventListener("DOMContentLoaded", function () {
    // Use event delegation for input events
    document.getElementById('cv-form').addEventListener('input', function (event) {
        if (event.target.matches('input, textarea')) {
            updateCV();
        }
    });

    // Initialize the form view
    updateCV();
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
    const experienceItem = createExperienceItem(role, company, year, desc);

    experienceList.appendChild(experienceItem);
    clearInputs("exp-role", "exp-company", "exp-year", "exp-desc");
}

// Function to create an experience item
function createExperienceItem(role, company, year, desc) {
    const experienceItem = document.createElement("div");
    experienceItem.classList.add("experience-item");

    experienceItem.innerHTML = `
        <h4>${role} | ${company} | ${year}</h4>
        <p>${desc || "No description provided."}</p>
        <button class="delete-btn" onclick="removeEntry(this)">❌ Remove</button>
    `;
    return experienceItem;
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
    const educationItem = createEducationItem(degree, institution, year, desc);

    educationList.appendChild(educationItem);
    clearInputs("edu-degree", "edu-institution", "edu-year", "edu-desc");
}

// Function to create an education item
function createEducationItem(degree, institution, year, desc) {
    const educationItem = document.createElement("div");
    educationItem.classList.add("education-item");

    educationItem.innerHTML = `
        <h4>${degree} | ${institution} | ${year}</h4>
        <p>${desc || "No description provided."}</p>
        <button class="delete-btn" onclick="removeEntry(this)">❌ Remove</button>
    `;
    return educationItem;
}

// Function to add certifications dynamically
function addCertification() {
    const title = document.getElementById("cert-title").value.trim();
    const institution = document.getElementById("cert-institution").value.trim();
    const year = document.getElementById("cert-year").value.trim();
    const desc = document.getElementById("cert-desc").value.trim();

    if (!title || !institution || !year) {
        alert("Please fill in all required fields!");
        return;
    }

    const certList = document.getElementById("cv-certifications");
    const certItem = createCertificationItem(title, institution, year, desc);

    certList.appendChild(certItem);
    clearInputs("cert-title", "cert-institution", "cert-year", "cert-desc");
}

// Function to create a certification item
function createCertificationItem(title, institution, year, desc) {
    const certItem = document.createElement("div");
    certItem.classList.add("cert-entry");

    certItem.innerHTML = `
        <p><strong>${title}</strong> - ${institution} (${year})</p>
        <p>${desc}</p>
        <button class="delete-btn" onclick="removeEntry(this)">❌ Remove</button>
    `;
    return certItem;
}

// Function to remove an entry (Experience, Education, Certification)
function removeEntry(button) {
    button.parentElement.remove();
}

// Clears input fields after adding an entry
function clearInputs(...inputIds) {
    inputIds.forEach(id => {
        document.getElementById(id).value = "";
    });
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
    
    // Use a professional font (e.g., Roboto or Arial)
    doc.setFont("helvetica");
    doc.setFontSize(12);

    // Add Name, Email, Phone, and LinkedIn
    doc.text(20, 20, `Name: ${document.getElementById("name").value || "Your Name"}`);
    doc.text(20, 30, `Email: ${document.getElementById("email").value || "you@example.com"}`);
    doc.text(20, 40, `Phone: ${document.getElementById("phone").value || "+254700000000"}`);
    
    const linkedinURL = document.getElementById("linkedin").value;
    if (linkedinURL) {
        doc.text(20, 50, `LinkedIn: ${linkedinURL}`);
    }

    // Add Summary
    doc.text(20, 60, `Summary:`);
    doc.text(20, 70, document.getElementById("summary").value || "Your professional summary will appear here...");

    // Add Skills
    doc.text(20, 80, `Skills:`);
    const skillsText = document.getElementById("skills").value;
    doc.text(20, 90, formatList(skillsText));

    // Add Experience
    doc.text(20, 100, `Experience:`);
    const experienceItems = document.getElementById("cv-experience").children;
    let yOffset = 110;
    for (let i = 0; i < experienceItems.length; i++) {
        const item = experienceItems[i];
        doc.text(20, yOffset, item.querySelector('h4').textContent);
        yOffset += 10;
        doc.text(20, yOffset, item.querySelector('p').textContent);
        yOffset += 20;
    }

    // Add Education
    doc.text(20, yOffset, `Education:`);
    const educationItems = document.getElementById("cv-education").children;
    yOffset += 10;
    for (let i = 0; i < educationItems.length; i++) {
        const item = educationItems[i];
        doc.text(20, yOffset, item.querySelector('h4').textContent);
        yOffset += 10;
        doc.text(20, yOffset, item.querySelector('p').textContent);
        yOffset += 20;
    }

    // Add Certifications
    doc.text(20, yOffset, `Certifications:`);
    const certItems = document.getElementById("cv-certifications").children;
    yOffset += 10;
    for (let i = 0; i < certItems.length; i++) {
        const item = certItems[i];
        doc.text(20, yOffset, item.querySelector('p').textContent);
        yOffset += 10;
    }

    // Save the PDF
    doc.save("Resume
