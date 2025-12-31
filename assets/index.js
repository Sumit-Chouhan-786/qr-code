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

// Store generated QR code data for sharing
let currentQRCode = {
    text: '',
    url: '',
    blob: null,
    filename: ''
};

// Main QR Generation Function
async function generateQR() {
    const text = document.getElementById("qrText").value.trim();
    const color = document.getElementById("qrColor").value;
    const qrResult = document.getElementById("qrResult");
    const qrImage = document.getElementById("qrImage");
    const downloadBtn = document.getElementById("downloadBtn");
    const currentColor = document.getElementById("currentColor");
    
    if (!text) {
        showAlert("Please enter text or URL to generate QR code", "warning");
        return;
    }
    
    // Update current style info
    currentColor.textContent = color;
    currentColor.style.color = color;
    
    // Show loading
    qrResult.style.display = "block";
    qrImage.src = "";
    qrImage.alt = "Generating QR code...";
    
    // Add loading animation
    qrImage.classList.add('loading-qr');
    
    try {
        // Generate QR code using API (more reliable for scannability)
        const qrData = await generateQRCodeAPI(text, color);
        
        if (!qrData.url) {
            throw new Error("Failed to generate QR code");
        }
        
        qrImage.onload = () => {
            qrImage.classList.remove('loading-qr');
            downloadBtn.href = qrData.url;
            downloadBtn.download = qrData.filename;
            qrResult.classList.add('fade-in');
            
            // Store QR code data for sharing
            currentQRCode = {
                text: text,
                url: qrData.url,
                blob: qrData.blob,
                filename: qrData.filename
            };
            
            // Setup sharing links
            setupShareLinks(text, qrData.url);
            
            // Show success message
            showAlert(`
                <strong>QR Code Generated Successfully!</strong><br>
                Color: ${color}
            `, "success");
            
            // Smooth scroll to result on mobile
            if (window.innerWidth < 768) {
                qrResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        };
        
        qrImage.onerror = () => {
            qrImage.classList.remove('loading-qr');
            throw new Error("Failed to load QR code image");
        };
        
        qrImage.src = qrData.url;
        
    } catch (error) {
        console.error("QR generation error:", error);
        showAlert("Failed to generate QR code. Please try again.", "danger");
    }
}

// Generate QR code using reliable API
async function generateQRCodeAPI(text, color) {
    // Format text for URL
    const encodedText = encodeURIComponent(text);
    const timestamp = Date.now();
    const filename = `qr-code-${timestamp}.png`;
    
    // Use multiple APIs for reliability
    const apis = [
        // QRServer API (most reliable)
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedText}&format=png&margin=10&color=${color.replace('#', '')}&bgcolor=ffffff`,
        
        // QuickChart API
        `https://quickchart.io/qr?text=${encodedText}&size=250&margin=2&dark=${color.replace('#', '')}&light=ffffff`,
    ];
    
    for (let api of apis) {
        try {
            // Test if API is working
            const response = await fetch(api);
            if (response.ok) {
                // Create blob for download and sharing
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                
                return {
                    url: blobUrl,
                    blob: blob,
                    filename: filename
                };
            }
        } catch (error) {
            console.log(`API failed, trying next...`);
            continue;
        }
    }
    
    // If all APIs fail, use Google Charts as fallback
    const fallbackUrl = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodedText}&choe=UTF-8&chld=H|2&chco=${color.replace('#', '')}`;
    const response = await fetch(fallbackUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    return {
        url: blobUrl,
        blob: blob,
        filename: filename
    };
}

// Simple QR Code (Black and White - 100% Scannable)
async function generateSimpleQR() {
    const text = document.getElementById("qrText").value.trim();
    if (!text) {
        showAlert("Please enter text or URL", "warning");
        return;
    }
    
    const qrImage = document.getElementById('qrImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const qrResult = document.getElementById('qrResult');
    const currentColor = document.getElementById("currentColor");
    
    // Update current style info
    currentColor.textContent = "#000000";
    currentColor.style.color = "#000000";
    
    // Generate simple black and white QR
    const encodedText = encodeURIComponent(text);
    const timestamp = Date.now();
    const filename = `simple-qr-${timestamp}.png`;
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedText}&format=png&margin=10&color=000000&bgcolor=ffffff`;
    
    qrResult.style.display = "block";
    qrImage.src = "";
    qrImage.alt = "Generating QR code...";
    qrImage.classList.add('loading-qr');
    
    try {
        const response = await fetch(qrURL);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        qrImage.onload = () => {
            qrImage.classList.remove('loading-qr');
            downloadBtn.href = blobUrl;
            downloadBtn.download = filename;
            
            // Store QR code data for sharing
            currentQRCode = {
                text: text,
                url: blobUrl,
                blob: blob,
                filename: filename
            };
            
            // Setup sharing links
            setupShareLinks(text, blobUrl);
            
            showAlert(`
                <strong>Simple QR Code Generated</strong><br>
                <span class="small">100% scannable by all devices</span>
            `, "success");
        };
        
        qrImage.onerror = () => {
            qrImage.classList.remove('loading-qr');
            showAlert("Failed to generate QR code. Please try again.", "danger");
        };
        
        qrImage.src = blobUrl;
        
    } catch (error) {
        qrImage.classList.remove('loading-qr');
        showAlert("Failed to generate QR code. Please try again.", "danger");
    }
}

// Setup Share Links
// Setup Share Links
function setupShareLinks(text, qrURL) {
    const whatsapp = document.getElementById("whatsapp");
    const instagram = document.getElementById("instagram");
    const twitter = document.getElementById("twitter");
    const facebook = document.getElementById("facebook");
    const copyBtn = document.getElementById("copyBtn");
    
    // Create share message
    const shareMessage = `Check out this QR code I created using QRGen!\n\nContent: ${text}\n\nScan it to see what's inside!`;
    const websiteUrl = window.location.href;
    
    // WhatsApp - Direct share with image
    whatsapp.onclick = async (e) => {
        e.preventDefault();
        
        // Check if we have blob data
        if (!currentQRCode.blob) {
            // Try to fetch the blob
            try {
                const response = await fetch(qrURL);
                currentQRCode.blob = await response.blob();
            } catch (error) {
                console.error("Failed to fetch blob:", error);
            }
        }
        
        // Try Web Share API first (mobile only)
        if (navigator.share && currentQRCode.blob) {
            try {
                const file = new File([currentQRCode.blob], 'qr-code.png', { type: 'image/png' });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'QR Code',
                        text: shareMessage
                    });
                    return;
                }
            } catch (shareError) {
                console.log("Web Share API failed:", shareError);
            }
        }
        
        // Create a temporary link for sharing
        const tempLink = document.createElement('a');
        tempLink.href = qrURL;
        tempLink.download = 'qr-code.png';
        
        // For mobile: show instructions
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            showAlert(`
                <strong>To share on WhatsApp:</strong><br>
                <span class="small">1. Download the QR code first using the Download button above</span><br>
                <span class="small">2. Then open WhatsApp and attach the downloaded image</span><br>
                <span class="small">3. Add this message:</span><br>
                <code class="d-block mt-2 p-2 bg-light rounded small">${shareMessage}</code>
            `, "info", 8000);
        } else {
            // For desktop: open WhatsApp Web with text
            const whatsappURL = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareMessage + '\n\n' + websiteUrl)}`;
            window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        }
    };
    
    // Twitter - Share text
    twitter.onclick = (e) => {
        e.preventDefault();
        try {
            const tweetText = `I just created a QR code using QRGen! Scan it to see what's inside! ${text}`;
            const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            window.open(twitterURL, '_blank', 'width=550,height=420,noopener,noreferrer');
        } catch (error) {
            showAlert("Failed to open Twitter. Please try again.", "warning");
        }
    };
    
    // Facebook - Share website link
    facebook.onclick = (e) => {
        e.preventDefault();
        try {
            const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}&quote=${encodeURIComponent(shareMessage)}`;
            window.open(facebookURL, '_blank', 'width=550,height=420,noopener,noreferrer');
        } catch (error) {
            showAlert("Failed to open Facebook. Please try again.", "warning");
        }
    };
    
    // Instagram - Instructions
    instagram.onclick = (e) => {
        e.preventDefault();
        showAlert(`
            <strong>To share on Instagram:</strong><br>
            <span class="small">1. Download the QR code first using the Download button above</span><br>
            <span class="small">2. Open Instagram app</span><br>
            <span class="small">3. Create a new post and select the downloaded QR code image</span><br>
            <span class="small">4. Add this caption:</span><br>
            <code class="d-block mt-2 p-2 bg-light rounded small">${shareMessage}</code>
        `, "info", 8000);
    };
    
    // Copy QR Code Image to Clipboard
    copyBtn.onclick = (e) => {
        e.preventDefault();
        copyQRCodeToClipboard(qrURL);
    };
}
// Download QR Code
async function downloadQRCode(url, filename) {
    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    } catch (error) {
        console.error("Download failed:", error);
        showAlert("Failed to download QR code. Please try again.", "warning");
        return false;
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
function showAlert(message, type = 'info', duration = 4000) {
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
    
    // Auto-remove after specified duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, duration);
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    
    // Add color change listener
    document.getElementById('qrColor').addEventListener('input', function() {
        const colorValue = this.value;
        const hexInput = document.getElementById('qrColorHex');
        if (hexInput) {
            hexInput.value = colorValue.replace('#', '');
        }
    });
    
    // Add hex color input listener
    const hexInput = document.getElementById('qrColorHex');
    if (hexInput) {
        hexInput.addEventListener('input', function() {
            let hexValue = this.value;
            if (!hexValue.startsWith('#')) {
                hexValue = '#' + hexValue;
            }
            if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
                document.getElementById('qrColor').value = hexValue;
            }
        });
    }
    
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
        
        /* Loading animation for QR code */
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .loading-qr {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Add example QR codes
    setTimeout(() => {
        const examples = [
          { text: 'https://www.google.com', label: '🌐 Website' },
  { text: 'Hello from QRGen!', label: '👋 Text Message' },
  { text: 'tel:+1234567890', label: '📞 Call' },
  { text: 'mailto:hello@example.com', label: '✉️ Email' },
  { text: 'https://wa.me/1234567890', label: '💬 WhatsApp' },
  { text: 'https://maps.google.com/?q=New+Delhi,India', label: '📍 Location' },
  { text: 'Happy New Year! 🎉 Wishing you success and happiness.', label: '🎊 Wishes' }
        ];
        
        const container = document.querySelector('.cartoon-card');
        if (container) {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'mt-3';
            exampleDiv.innerHTML = `
                <p class="small text-muted mb-2"><i class="bi bi-lightbulb me-1"></i> Try examples:</p>
                <div class="d-flex flex-wrap gap-2">
                    ${examples.map(ex => `
                        <button class="btn btn-sm btn-outline-primary" 
                                onclick="document.getElementById('qrText').value='${ex.text}'; generateQR();">
                            ${ex.label}
                        </button>
                    `).join('')}
                </div>
            `;
            container.appendChild(exampleDiv);
        }
    }, 500);
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

// Export functions for global access
window.generateQR = generateQR;
window.generateSimpleQR = generateSimpleQR;
window.downloadQRCode = downloadQRCode;
window.copyQRCodeToClipboard = copyQRCodeToClipboard;