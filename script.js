document.addEventListener("DOMContentLoaded", function () {
    function updateCV() {
        document.getElementById("cv-name").textContent = getValue("name", "Your Name");
        document.getElementById("cv-email").textContent = getValue("email", "you@example.com");
        document.getElementById("cv-phone").textContent = getValue("phone", "+254700000000");
        
        let linkedinUrl = document.getElementById("linkedin").value;
        let cvLinkedIn = document.getElementById("cv-linkedin-url");
        if (linkedinUrl) {
            cvLinkedIn.href = linkedinUrl;
            cvLinkedIn.textContent = "LinkedIn Profile";
            cvLinkedIn.style.display = "inline";
        } else {
            cvLinkedIn.style.display = "none";
        }
        
        document.getElementById("cv-summary").textContent = getValue("summary", "Your professional summary will appear here...");
        document.getElementById("cv-experience").textContent = getValue("experience", "Your experience will be shown here...");
        document.getElementById("cv-education").textContent = getValue("education", "Your education details will be displayed here...");
        document.getElementById("cv-skills").textContent = getValue("skills", "Your skills will appear here...");
        document.getElementById("cv-certifications").textContent = getValue("certifications", "Your certifications will appear here...");
    }

    function getValue(id, defaultValue) {
        let value = document.getElementById(id).value.trim();
        return value !== "" ? value : defaultValue;
    }

    function validateInputs() {
        let inputs = document.querySelectorAll("input, textarea");
        let isValid = true;
        inputs.forEach(input => {
            if (input.value.trim() === "" && input.hasAttribute("required")) {
                input.style.border = "2px solid red";
                isValid = false;
            } else {
                input.style.border = "2px solid #bbb";
            }
        });
        return isValid;
    }

    function downloadPDF() {
        const { jsPDF } = window.jspdf;

        html2canvas(document.getElementById("cv-preview")).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
            let position = 10;

            pdf.addImage(imgData, "PNG", 10, position, imgWidth - 20, imgHeight);

            // Detect if running in a browser or online environment
            if (window.location.protocol === "file:") {
                // Running locally
                const blob = pdf.output("blob");
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement("a");
                a.href = url;
                a.download = "Resume.pdf";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            } else {
                // Running online
                pdf.save("Resume.pdf");
            }
        });
    }

    document.querySelectorAll("input, textarea").forEach(input => {
        input.addEventListener("input", updateCV);
    });

    document.querySelector("button").addEventListener("click", downloadPDF);
});
