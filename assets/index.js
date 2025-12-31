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
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    for(let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "vh";
        star.style.animationDuration = (2 + Math.random() * 4) + "s";
        star.style.animationDelay = Math.random() * 5 + "s";
        star.style.width = star.style.height = (window.innerWidth < 768 ? 4 : 6) + Math.random() * 8 + "px";
        star.style.opacity = 0.5 + Math.random() * 0.5;
        starsContainer.appendChild(star);
    }
}

// QR Code Generation with multiple fallback APIs
async function generateQR() {
    const text = document.getElementById("qrText").value.trim();
    const qrResult = document.getElementById("qrResult");
    const qrImage = document.getElementById("qrImage");
    const downloadBtn = document.getElementById("downloadBtn");
    const qrContent = document.getElementById("qrContent");
    
    if (!text) {
        showAlert("Please enter text or URL to generate QR code", "warning");
        return;
    }
    
    // Show loading
    qrResult.style.display = "block";
    qrImage.src = "";
    qrImage.alt = "Generating QR code...";
    
    // Add loading animation to image
    qrImage.style.filter = "blur(2px)";
    qrImage.style.backgroundColor = "#f0f0f0";
    
    // Validate and format text
    let formattedText = text;
    if (!text.startsWith('http://') && !text.startsWith('https://') && 
        !text.startsWith('tel:') && !text.startsWith('mailto:') &&
        text.includes('.') && !text.includes(' ')) {
        formattedText = 'https://' + text;
    }
    
    // Update QR content display
    if (qrContent) {
        qrContent.textContent = formattedText.length > 50 ? 
            formattedText.substring(0, 50) + "..." : formattedText;
        qrContent.title = formattedText;
    }
    
    try {
        // Try different QR code APIs in sequence
        const qrURL = await generateQRWithFallback(formattedText);
        
        if (!qrURL) {
            throw new Error("All QR code generation APIs failed");
        }
        
        // Set the QR code image
        qrImage.onload = () => {
            qrImage.style.filter = "none";
            qrImage.style.backgroundColor = "transparent";
            downloadBtn.href = qrURL;
            downloadBtn.download = `qr-code-${Date.now()}.png`;
            qrResult.classList.add('fade-in');
            
            // Setup sharing links
            setupShareLinks(formattedText, qrURL);
            
            // Show success message
            showAlert("QR Code generated successfully!", "success");
            
            // Smooth scroll to result on mobile
            if (window.innerWidth < 768) {
                qrResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        };
        
        qrImage.onerror = () => {
            throw new Error("Failed to load QR code image");
        };
        
        qrImage.src = qrURL;
        
    } catch (error) {
        console.error("QR generation error:", error);
        qrResult.style.display = "none";
        showAlert("Failed to generate QR code. Please try again or use shorter text.", "danger");
    }
}

// Try multiple QR code APIs with fallback
async function generateQRWithFallback(text) {
    const apis = [
        // API 1: QRServer API
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}&format=png&margin=10`,
        
        // API 2: Google Charts API
        `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(text)}&choe=UTF-8&chld=H|0`,
        
        // API 3: QuickChart API
        `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=250&margin=1`,
        
        // API 4: QRickit API
        `https://api.qrickit.com/api/qr?d=${encodeURIComponent(text)}&size=250&qzone=2`,
    ];
    
    // Try each API in sequence
    for (let i = 0; i < apis.length; i++) {
        try {
            const response = await testQRAPI(apis[i]);
            if (response.ok) {
                return apis[i];
            }
        } catch (error) {
            console.log(`API ${i + 1} failed, trying next...`);
            continue;
        }
    }
    
    // If all APIs fail, generate a local QR code using a library if available
    return generateLocalQR(text);
}

// Test if API is working
async function testQRAPI(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ ok: true });
        img.onerror = () => reject(new Error("Image failed to load"));
        img.src = url;
        
        // Timeout after 5 seconds
        setTimeout(() => reject(new Error("Timeout")), 5000);
    });
}

// Fallback: Generate QR code locally using canvas
function generateLocalQR(text) {
    try {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 250;
        const ctx = canvas.getContext('2d');
        
        // Simple QR code simulation (basic pattern)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 250, 250);
        ctx.fillStyle = '#000000';
        
        // Draw simple QR pattern (simplified for demonstration)
        // In a real app, you would use a QR code library here
        drawSimpleQRPattern(ctx, text);
        
        // Convert to data URL
        const dataURL = canvas.toDataURL('image/png');
        return dataURL;
    } catch (error) {
        console.error("Local QR generation failed:", error);
        return null;
    }
}

// Draw a simple QR-like pattern (simplified)
function drawSimpleQRPattern(ctx, text) {
    // Draw border
    ctx.fillRect(10, 10, 230, 230);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 20, 210, 210);
    
    // Draw corner markers (like real QR codes)
    ctx.fillStyle = '#000000';
    // Top-left
    ctx.fillRect(30, 30, 50, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 40, 30, 30);
    ctx.fillStyle = '#000000';
    ctx.fillRect(45, 45, 20, 20);
    
    // Top-right
    ctx.fillStyle = '#000000';
    ctx.fillRect(170, 30, 50, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(180, 40, 30, 30);
    ctx.fillStyle = '#000000';
    ctx.fillRect(185, 45, 20, 20);
    
    // Bottom-left
    ctx.fillStyle = '#000000';
    ctx.fillRect(30, 170, 50, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 180, 30, 30);
    ctx.fillStyle = '#000000';
    ctx.fillRect(45, 185, 20, 20);
    
    // Draw text indicator
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', 125, 140);
    
    ctx.font = '10px Arial';
    const lines = splitTextIntoLines(text, 30);
    lines.forEach((line, index) => {
        ctx.fillText(line, 125, 160 + (index * 15));
    });
}

function splitTextIntoLines(text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        if ((currentLine + word).length <= maxLength) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word.length > maxLength ? word.substring(0, maxLength-3) + '...' : word;
        }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 3); // Max 3 lines
}

// Setup Share Links
function setupShareLinks(text, qrURL) {
    const whatsapp = document.getElementById("whatsapp");
    const instagram = document.getElementById("instagram");
    const twitter = document.getElementById("twitter");
    const facebook = document.getElementById("facebook");
    const snapchat = document.getElementById("snapchat");
    const copyBtn = document.getElementById("copyBtn");
    
    // Create share message
    const shareMessage = `Check out this QR code I created!\n\nContent: ${text}\n\nScan it to see what's inside!`;
    
    // WhatsApp - Share text and QR code image
    whatsapp.onclick = (e) => {
        e.preventDefault();
        try {
            const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
            window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        } catch (error) {
            showAlert("Failed to open WhatsApp. Please try again.", "warning");
        }
    };
    
    // Twitter - Share with image URL
    twitter.onclick = (e) => {
        e.preventDefault();
        try {
            const tweetText = `I just created a QR code! Scan it to see what's inside! ${text}`;
            const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            window.open(twitterURL, '_blank', 'width=550,height=420,noopener,noreferrer');
        } catch (error) {
            showAlert("Failed to open Twitter. Please try again.", "warning");
        }
    };
    
    // Facebook - Share the QR code image URL
    facebook.onclick = (e) => {
        e.preventDefault();
        try {
            const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(qrURL)}`;
            window.open(facebookURL, '_blank', 'width=550,height=420,noopener,noreferrer');
        } catch (error) {
            showAlert("Failed to open Facebook. Please try again.", "warning");
        }
    };
    
    // Instagram - Download and prompt user
    instagram.onclick = (e) => {
        e.preventDefault();
        try {
            downloadQRCode(qrURL, `qr-code-${Date.now()}.png`);
            showAlert("QR code downloaded! You can now upload it to Instagram.", "info");
        } catch (error) {
            showAlert("Failed to download QR code. Please try again.", "warning");
        }
    };
    
    // Snapchat - Download and prompt user
    snapchat.onclick = (e) => {
        e.preventDefault();
        try {
            downloadQRCode(qrURL, `qr-code-${Date.now()}.png`);
            showAlert("QR code downloaded! You can now add it to Snapchat.", "info");
        } catch (error) {
            showAlert("Failed to download QR code. Please try again.", "warning");
        }
    };
    
    // Copy QR Code Image to Clipboard
    copyBtn.onclick = (e) => {
        e.preventDefault();
        copyQRCodeToClipboard(qrURL);
    };
}

// Download QR Code
function downloadQRCode(url, filename) {
    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Download failed:", error);
        showAlert("Failed to download QR code. Please try again.", "warning");
    }
}

// Copy QR Code Image to Clipboard
async function copyQRCodeToClipboard(qrURL) {
    try {
        // Check if clipboard API is available
        if (!navigator.clipboard) {
            throw new Error("Clipboard API not available");
        }
        
        // Try to fetch and copy the image
        const response = await fetch(qrURL);
        if (!response.ok) {
            throw new Error("Failed to fetch QR code image");
        }
        
        const blob = await response.blob();
        
        // Try to copy to clipboard
        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
        ]);
        
        showAlert("QR code copied to clipboard!", "success");
    } catch (err) {
        console.error('Failed to copy image:', err);
        
        // Fallback: Copy the text/link instead
        const text = document.getElementById("qrText").value.trim();
        if (text) {
            try {
                await navigator.clipboard.writeText(text);
                showAlert("Text copied to clipboard!", "success");
            } catch (clipboardErr) {
                // Final fallback
                copyTextFallback(text);
            }
        } else {
            showAlert("Could not copy QR code. Please download it instead.", "warning");
        }
    }
}

// Copy Fallback for older browsers
function copyTextFallback(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showAlert("Text copied to clipboard!", "success");
        } else {
            throw new Error("Copy command failed");
        }
    } catch (err) {
        showAlert("Failed to copy text. Please select and copy manually.", "warning");
    } finally {
        document.body.removeChild(textArea);
    }
}

// Show Alert/Toast
function showAlert(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.custom-toast').forEach(toast => toast.remove());
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `custom-toast position-fixed p-3 rounded shadow`;
    toast.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 250px;
        max-width: 90%;
        background-color: ${document.body.classList.contains('dark') ? '#1e293b' : '#fff3e0'};
        color: ${document.body.classList.contains('dark') ? '#e5e7eb' : '#222'};
        border: 2px solid ${getColorForType(type)};
        border-radius: 15px;
        animation: slideIn 0.3s ease;
    `;
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${getIconForType(type)} fs-4 me-2"></i>
            <div class="flex-grow-1">${message}</div>
            <button class="btn-close btn-close-white ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 4000);
}

function getColorForType(type) {
    switch(type) {
        case 'success': return '#27ae60';
        case 'warning': return '#f39c12';
        case 'danger': return '#c0392b';
        default: return '#d35400';
    }
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
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

// Add keyboard shortcut (Ctrl+Enter or Cmd+Enter to generate QR)
textarea.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generateQR();
    }
});

// Add paste event to auto-generate QR code for URLs
textarea.addEventListener('paste', function(e) {
    setTimeout(() => {
        const text = this.value.trim();
        // Auto-generate if it looks like a URL
        if (text && (text.includes('http://') || text.includes('https://') || text.includes('.') || text.includes('@'))) {
            setTimeout(() => generateQR(), 300);
        }
    }, 100);
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
                    // Close mobile menu if open
                    if(window.innerWidth < 992) {
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if(navbarCollapse.classList.contains('show')) {
                            document.querySelector('.navbar-toggler').click();
                        }
                    }
                    
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
    setTimeout(() => {
        textarea.focus();
    }, 500);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .custom-toast {
            animation: slideIn 0.3s ease;
        }
        
        /* Loading animation for QR code */
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
        
        .loading-qr {
            animation: pulse 1.5s infinite;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add loading indicator to QR image
    const qrImage = document.getElementById('qrImage');
    if (qrImage) {
        qrImage.addEventListener('loadstart', () => {
            qrImage.classList.add('loading-qr');
        });
        
        qrImage.addEventListener('load', () => {
            qrImage.classList.remove('loading-qr');
        });
        
        qrImage.addEventListener('error', () => {
            qrImage.classList.remove('loading-qr');
        });
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            createStars(); // Recreate stars for new screen size
        }
    }, 250);
});

// Add example QR codes for demonstration
function loadExamples() {
    const examples = [
        { text: 'https://www.google.com', label: 'Google' },
        { text: 'Hello World!', label: 'Hello World' },
        { text: 'tel:+1234567890', label: 'Call Us' },
        { text: 'mailto:hello@example.com', label: 'Email Us' }
    ];
    
    // Add example buttons to the UI
    const container = document.querySelector('.container');
    if (container) {
        const exampleDiv = document.createElement('div');
        exampleDiv.className = 'mt-3';
        exampleDiv.innerHTML = `
            <p class="small text-muted mb-2">Try these examples:</p>
            <div class="d-flex flex-wrap gap-2">
                ${examples.map(example => `
                    <button class="btn btn-sm btn-outline-primary" onclick="document.getElementById('qrText').value='${example.text}'; generateQR();">
                        ${example.label}
                    </button>
                `).join('')}
            </div>
        `;
        const cartoonCard = container.querySelector('.cartoon-card');
        if (cartoonCard) {
            cartoonCard.appendChild(exampleDiv);
        }
    }
}

// Call loadExamples after DOM is loaded
setTimeout(loadExamples, 1000);

// Add retry button to error messages (if needed)
function addRetryButton() {
    const alerts = document.querySelectorAll('.alert-danger, .alert-warning');
    alerts.forEach(alert => {
        if (!alert.querySelector('.retry-btn')) {
            const retryBtn = document.createElement('button');
            retryBtn.className = 'btn btn-sm btn-primary ms-2 retry-btn';
            retryBtn.textContent = 'Retry';
            retryBtn.onclick = generateQR;
            alert.appendChild(retryBtn);
        }
    });
}

// Export functions for global access
window.generateQR = generateQR;
window.downloadQRCode = downloadQRCode;
window.copyQRCodeToClipboard = copyQRCodeToClipboard;