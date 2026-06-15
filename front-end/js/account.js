/**
 * Nides Store User Dashboard Display Engine
 */
const AccountDashboardController = {
    init() {
        this.cacheDOM();
        this.parseIdentityContext();
        this.bindEvents();
    },

    cacheDOM() {
        this.globalTierIndicator = document.getElementById('global-tier-indicator');
        this.userGreetingName = document.getElementById('user-greeting-name');
        this.userMetaString = document.getElementById('user-meta-string');
        this.systemNoticeBanner = document.getElementById('dashboard-system-notice');
        this.logoutBtn = document.getElementById('action-session-terminate');

        // Layout container layout nodes
        this.customerDeck = document.getElementById('view-customer-deck');
        this.adminDeck = document.getElementById('view-admin-deck');
    },

    bindEvents() {
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.terminateSession());
        }
    },

    parseIdentityContext() {
        const urlParams = new URLSearchParams(window.location.search);
        const systemTier = urlParams.get('tier') || 'customer'; // Defaults to standard client profile data
        const actionStatus = urlParams.get('status');

        // Check for success feedback from the Checkout controller layout redirect
        if (actionStatus === 'success_order') {
            this.systemNoticeBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> Transaction finalized successfully. Order tracking entry added to manifest stack.`;
            this.systemNoticeBanner.classList.remove('hidden');
        }

        // Toggle visibility views based on matching parameter strings
        if (systemTier === 'administrator') {
            this.displayAdminWorkspace();
        } else {
            this.displayCustomerWorkspace();
        }
    },

    displayCustomerWorkspace() {
        this.customerDeck.classList.remove('hidden');
        this.adminDeck.classList.add('hidden');

        // Populate metadata values
        this.globalTierIndicator.textContent = "Consumer Profile";
        this.globalTierIndicator.style.backgroundColor = "var(--primary-color)";
        this.userGreetingName.textContent = "Welcome Back, John Doe";
        this.userMetaString.innerHTML = `Account Tier: <span class="text-bold">Standard Client</span> | Session: Active Node`;
    },

    displayAdminWorkspace() {
        this.adminDeck.classList.remove('hidden');
        this.customerDeck.classList.add('hidden');

        // Populate metadata values
        this.globalTierIndicator.textContent = "System Admin";
        this.globalTierIndicator.style.backgroundColor = "var(--accent-red)";
        this.userGreetingName.textContent = "Console Root: Administrator Account";
        this.userMetaString.innerHTML = `Account Tier: <span class="text-bold">Global Master Root</span> | Security Zone Alpha`;
    },

    terminateSession() {
        const confirmation = confirm("Are you sure you want to terminate your active session?");
        if (confirmation) {
            // Drop variables and bounce state engine vectors out to index landing homepage
            window.location.href = 'index.html';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => AccountDashboardController.init());