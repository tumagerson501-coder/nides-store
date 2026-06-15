/**
 * Nides Store Customer Comms Desk Pipeline Controller
 */
const ContactFormEngine = {
    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.form = document.getElementById('contact-support-form');
        this.nameInput = document.getElementById('contact-name');
        this.emailInput = document.getElementById('contact-email');
        this.reasonSelect = document.getElementById('contact-reason');
        this.msgTextArea = document.getElementById('contact-message');
        this.textCounterLabel = document.getElementById('text-counter');
        this.statusBanner = document.getElementById('contact-status-banner');
    },

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleTicketTransmission(e));
        }
        if (this.msgTextArea) {
            this.msgTextArea.addEventListener('input', () => this.updateCharacterCounter());
        }
    },

    updateCharacterCounter() {
        const length = this.msgTextArea.value.length;
        this.textCounterLabel.textContent = `${length} / 600`;

        // Provide warning feedback context colors on approaching cap limits
        if (length >= 550) {
            this.textCounterLabel.style.color = "var(--accent-red)";
            this.textCounterLabel.style.fontWeight = "700";
        } else {
            this.textCounterLabel.style.color = "var(--text-muted)";
            this.textCounterLabel.style.fontWeight = "500";
        }
    },

    handleTicketTransmission(e) {
        e.preventDefault();
        this.clearBanner();

        const data = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim(),
            reason: this.reasonSelect.value,
            message: this.msgTextArea.value.trim()
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Integrity checks 
        if (!data.name || !data.email || !data.reason || !data.message) {
            this.showBanner('Transmission locked: All tracking form fields are mandatory.', 'error');
            return;
        }

        if (!emailRegex.test(data.email)) {
            this.showBanner('Formatting anomaly detected within target Return Email address input field.', 'error');
            return;
        }

        if (data.message.length < 15) {
            this.showBanner('Message description asset length too low. Provide a minimum of 15 characters.', 'error');
            return;
        }

        // Mock Transmission API Resolution Lifecycle Sequence
    
// Inside frontend/js/contact.js, replace your mock resolve block with this network pipeline:
fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(resData => {
    if (resData.success) {
        this.showBanner(resData.message, 'success');
        this.form.reset();
        this.updateCharacterCounter();
    } else {
        this.showBanner(resData.message, 'error');
    }
})
.catch(err => {
    this.showBanner('Server pipeline transmission error. Try again later.', 'error');
})
.finally(() => {
    btn.disabled = false;
    btn.style.opacity = "1";
});

    },

    showBanner(msg, type) {
        this.statusBanner.textContent = msg;
        this.statusBanner.className = `auth-alert-banner ${type === 'success' ? 'success' : 'error'}`;
    },

    clearBanner() {
        this.statusBanner.textContent = '';
        this.statusBanner.className = 'auth-alert-banner hidden';
    }
};

document.addEventListener('DOMContentLoaded', () => ContactFormEngine.init());