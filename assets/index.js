// Theme Toggle
const themeBtn = document.getElementById("themeToggle");
const themeIcon = themeBtn.querySelector('i');

// Check for saved theme
const savedTheme = localStorage.getItem('qrgen-theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeIcon.className = 'bi bi-sun';
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    
    if (document.body.classList.contains('dark')) {
        themeIcon.className = 'bi bi-sun';
        localStorage.setItem('qrgen-theme', 'dark');
    } else {
        themeIcon.className = 'bi bi-moon';
        localStorage.setItem('qrgen-theme', 'light');
    }
});

// Floating Stars
function createStars() {
    const starsContainer = document.querySelector(".stars-container");
    const starCount = window.innerWidth < 768 ? 20 : 40;
    
    for(let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "vh";
        star.style.animationDuration = (2 + Math.random() * 4) + "s";
        star.style.animationDelay = Math.random() * 5 + "s";
        star.style.width = star.style.height = (window.innerWidth < 768 ? 4 : 6) + Math.random() * 8 + "px";
        starsContainer.appendChild(star);
    }
}

// QR Code Generation
function generateQR() {
    const text = document.getElementById("qrText").value.trim();
    const qrResult = document.getElementById("qrResult");
    const qrImage = document.getElementById("qrImage");
    const downloadBtn = document.getElementById("downloadBtn");
    
    if (!text) {
        showAlert("Please enter text or URL", "warning");
        return;
    }
    
    // Show loading
    qrResult.style.display = "block";
    qrImage.src = "";
    qrImage.alt = "Generating QR code...";
    
    // Generate QR code
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;
    
    qrImage.onload = () => {
        downloadBtn.href = qrURL;
        qrResult.classList.add('fade-in');
        
        // Setup sharing links
        setupShareLinks(text, qrURL);
        
        // Show success message
        showAlert("QR Code generated successfully!", "success");
        
        // Smooth scroll to result on mobile
        if (window.innerWidth < 768) {
            qrResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };
    
    qrImage.onerror = () => {
        showAlert("Failed to generate QR code. Please try again.", "danger");
        qrResult.style.display = "none";
    };
    
    qrImage.src = qrURL;
}

// Setup Share Links
function setupShareLinks(text, qrURL) {
    const whatsapp = document.getElementById("whatsapp");
    const instagram = document.getElementById("instagram");
    const twitter = document.getElementById("twitter");
    const facebook = document.getElementById("facebook");
    const snapchat = document.getElementById("snapchat");
    const copyBtn = document.getElementById("copyBtn");
    
    // WhatsApp
    whatsapp.href = `https://wa.me/?text=${encodeURIComponent("Check out this QR code: " + text)}`;
    
    // Twitter
    twitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out this QR code! " + text)}&url=${encodeURIComponent(qrURL)}`;
    
    // Facebook
    facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(text)}`;
    
    // Instagram (no direct sharing)
    instagram.onclick = (e) => {
        e.preventDefault();
        showAlert("To share on Instagram:\n1. Download the QR code\n2. Post it in your Instagram story or feed", "info");
    };
    
    // Snapchat (no direct sharing)
    snapchat.onclick = (e) => {
        e.preventDefault();
        showAlert("To share on Snapchat:\n1. Download the QR code\n2. Add it to your Snapchat story", "info");
    };
    
    // Copy Link
    copyBtn.onclick = (e) => {
        e.preventDefault();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => showAlert("Link copied to clipboard!", "success"))
                .catch(() => copyFallback(text));
        } else {
            copyFallback(text);
        }
    };
}

// Copy Fallback for older browsers
function copyFallback(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showAlert("Link copied to clipboard!", "success");
    } catch (err) {
        showAlert("Failed to copy link", "warning");
    }
    
    document.body.removeChild(textArea);
}

// Show Alert/Toast
function showAlert(message, type = 'info') {
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-cartoon position-fixed p-3 rounded shadow`;
    toast.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 250px;
        background-color: ${document.body.classList.contains('dark') ? '#1e293b' : '#fff3e0'};
        color: ${document.body.classList.contains('dark') ? '#e5e7eb' : '#222'};
        border: 2px solid ${type === 'success' ? '#22c55e' : type === 'warning' ? '#f59e0b' : '#f97316'};
    `;
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${getIconForType(type)} fs-4 me-2"></i>
            <div>${message}</div>
            <button class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 4000);
}

function getIconForType(type) {
    switch(type) {
        case 'success': return 'bi-check-circle-fill text-success';
        case 'warning': return 'bi-exclamation-triangle-fill text-warning';
        case 'danger': return 'bi-x-circle-fill text-danger';
        default: return 'bi-info-circle-fill text-primary';
    }
}

// Auto-resize textarea
const textarea = document.getElementById('qrText');
textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if(this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if(target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if(window.innerWidth < 992) {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const navbarToggler = document.querySelector('.navbar-toggler');
            if(navbarCollapse.classList.contains('show') && 
               !e.target.closest('.navbar') && 
               !e.target.closest('.navbar-collapse')) {
                navbarToggler.click();
            }
        }
    });
    
    // Auto-focus textarea on page load
    textarea.focus();
});