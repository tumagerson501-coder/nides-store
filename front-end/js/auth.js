/**
 * Nides Store User Authorization Management Controller
 */
const AuthEngine = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.checkURLContext();
    },

    cacheDOM() {
        this.form = document.getElementById('login-auth-form');
        this.emailInput = document.getElementById('login-email');
        this.passwordInput = document.getElementById('login-password');
        this.visibilityToggle = document.getElementById('pass-toggle');
        this.statusBanner = document.getElementById('auth-status-msg');
    },

    bindEvents() {
        if (this.visibilityToggle) {
            this.visibilityToggle.addEventListener('click', () => this.togglePasswordVisibility());
        }
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.processLoginValidation(e));
        }
    },

    checkURLContext() {
        // Intercept account redirect variables (e.g. freshly signed out users or required login blocks)
        const params = new URLSearchParams(window.location.search);
        if (params.get('context') === 'auth_required') {
            this.showAlert('Authentication required: Sign in to complete checkout processing.', 'error');
        } else if (params.get('status') === 'registered') {
            this.showAlert('Account generated successfully. Please check your credentials below.', 'success');
        }
    },

    togglePasswordVisibility() {
        const icon = this.visibilityToggle.querySelector('i');
        if (this.passwordInput.type === 'password') {
            this.passwordInput.type = 'text';
            icon.className = 'fa-solid fa-eye-slash';
        } else {
            this.passwordInput.type = 'password';
            icon.className = 'fa-solid fa-eye';
        }
    },

    processLoginValidation(e) {
        e.preventDefault();
        this.clearAlert();

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();

        // Regex parsing configuration 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            this.showAlert('All authorization credential parameters are mandatory.', 'error');
            return;
        }

        if (!emailRegex.test(email)) {
            this.showAlert('Invalid formatting string identified within Email field address.', 'error');
            return;
        }

        if (password.length < 6) {
            this.showAlert('Security protocol mismatch: Password length must be 6 characters minimum.', 'error');
            return;
        }

        // Mock Admin and Customer tier login conditions for preview testing
        this.showAlert('Verifying user tokens...', 'success');
        
        setTimeout(() => {
            // Check for mock administrator routing hook
            if (email === 'admin@nides.com') {
                alert("Session context mapped to Administrator permissions level.");
                window.location.href = 'account.html?tier=administrator';
            } else {
                alert("Session token authorized successfully.");
                window.location.href = 'account.html?tier=customer';
            }
        }, 800);
    },

    showAlert(message, type) {
        this.statusBanner.textContent = message;
        this.statusBanner.className = `auth-alert-banner ${type}`;
    },

    clearAlert() {
        this.statusBanner.textContent = '';
        this.statusBanner.className = 'auth-alert-banner hidden';
    }
};

document.addEventListener('DOMContentLoaded', () => AuthEngine.init());

/**
 * Nides Store Identity Matrix Framework
 */
const AuthEngine = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.checkURLContext();
    },

    cacheDOM() {
        // Form context extraction targets
        this.loginForm = document.getElementById('login-auth-form');
        this.registerForm = document.getElementById('register-auth-form');
        this.statusBanner = document.getElementById('auth-status-msg');
        
        // Input context elements cache maps
        this.loginEmail = document.getElementById('login-email');
        this.loginPassword = document.getElementById('login-password');
        
        this.regFirstName = document.getElementById('reg-first-name');
        this.regLastName = document.getElementById('reg-last-name');
        this.regEmail = document.getElementById('reg-email');
        this.regPassword = document.getElementById('reg-password');
        this.regConfirmPassword = document.getElementById('reg-confirm-password');
        this.termsFlag = document.getElementById('terms-agreement-flag');
        this.strengthIndicator = document.getElementById('strength-indicator');
        
        // Select visibility toggles collectively
        this.visibilityToggles = document.querySelectorAll('.pass-toggle-btn, #pass-toggle');
    },

    bindEvents() {
        // Universal structural password view toggles looping logic
        this.visibilityToggles.forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePasswordVisibility(e.currentTarget));
        });

        // Form pipeline conditional triggers
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.processLoginValidation(e));
        }
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => this.processRegistrationValidation(e));
            this.regPassword.addEventListener('input', () => this.evaluatePasswordStrength());
        }
    },

    checkURLContext() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('context') === 'auth_required') {
            this.showAlert('Authentication required: Sign in to complete checkout processing.', 'error');
        } else if (params.get('status') === 'registered') {
            this.showAlert('Account generated successfully. Please check your credentials below.', 'success');
        }
    },

    togglePasswordVisibility(targetButton) {
        // Determine targets programmatically via custom data attributes or explicit layout strings
        const inputId = targetButton.getAttribute('data-target') || 'login-password';
        const targetInput = document.getElementById(inputId);
        const icon = targetButton.querySelector('i');

        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            icon.className = 'fa-solid fa-eye-slash';
        } else {
            targetInput.type = 'password';
            icon.className = 'fa-solid fa-eye';
        }
    },

    evaluatePasswordStrength() {
        const pass = this.regPassword.value;
        this.strengthIndicator.className = 'strength-bar'; // Reset

        if (pass.length === 0) return;

        // Simple conditional length rules testing matrix variables
        if (pass.length < 6) {
            this.strengthIndicator.classList.add('strength-weak');
        } else if (pass.length >= 6 && (/[A-Z]/.test(pass) && /[0-9]/.test(pass))) {
            this.strengthIndicator.classList.add('strength-strong');
        } else {
            this.strengthIndicator.classList.add('strength-medium');
        }
    },

    processLoginValidation(e) {
        e.preventDefault();
        this.clearAlert();

        const email = this.loginEmail.value.trim();
        const password = this.loginPassword.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            this.showAlert('All authorization credential parameters are mandatory.', 'error');
            return;
        }
        if (!emailRegex.test(email)) {
            this.showAlert('Invalid formatting string identified within Email field address.', 'error');
            return;
        }

        this.showAlert('Verifying credentials...', 'success');
        setTimeout(() => {
            window.location.href = email === 'admin@nides.com' ? 'account.html?tier=administrator' : 'account.html?tier=customer';
        }, 800);
    },

    processRegistrationValidation(e) {
        e.preventDefault();
        this.clearAlert();

        const data = {
            first: this.regFirstName.value.trim(),
            last: this.regLastName.value.trim(),
            email: this.regEmail.value.trim(),
            pass: this.regPassword.value.trim(),
            confirm: this.regConfirmPassword.value.trim(),
            agreed: this.termsFlag.checked
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Security Field Checks
        if (!data.first || !data.last || !data.email || !data.pass || !data.confirm) {
            this.showAlert('Registration failure: All data structural inputs are mandatory.', 'error');
            return;
        }
        if (!emailRegex.test(data.email)) {
            this.showAlert('Formatting mismatch: Please pass a valid email framework.', 'error');
            return;
        }
        if (data.pass.length < 6) {
            this.showAlert('Cryptographic constraint: Password asset requires 6 characters minimum.', 'error');
            return;
        }
        if (data.pass !== data.confirm) {
            this.showAlert('Security mismatch: Confirmation target string must align with original password.', 'error');
            return;
        }
        if (!data.agreed) {
            this.showAlert('Legal authorization checkpoint: You must verify agreement to our terms layout.', 'error');
            return;
        }

        // Mock Account Creation Redirection Flow
        this.showAlert('Compiling profile matrix tokens...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html?status=registered';
        }, 1200);
    },

    showAlert(message, type) {
        this.statusBanner.textContent = message;
        this.statusBanner.className = `auth-alert-banner ${type}`;
    },

    clearAlert() {
        this.statusBanner.textContent = '';
        this.statusBanner.className = 'auth-alert-banner hidden';
    }
};

document.addEventListener('DOMContentLoaded', () => AuthEngine.init());