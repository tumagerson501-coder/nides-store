/**
 * Checkout State Verification & Card Formatting Engine
 */
const CheckoutEngine = {
    init() {
        // Intercept empty cart instances before rendering
        const currentCart = CartController.get();
        if (currentCart.length === 0) {
            alert("Checkout context initialization impossible: Shopping Cart is empty.");
            window.location.href = 'products.html';
            return;
        }

        this.cacheDOM();
        this.bindEvents();
        this.renderManifest(currentCart);
    },

    cacheDOM() {
        this.form = document.getElementById('secure-checkout-form');
        this.cardNumberInput = document.getElementById('card-number');
        this.cardExpiryInput = document.getElementById('card-expiry');
        this.cardBrandLogo = document.getElementById('brand-logo-preview');
        this.errorBanner = document.getElementById('checkout-error-msg');
        
        // Sum total elements re-caps
        this.subtotalLabel = document.getElementById('manifest-subtotal');
        this.taxLabel = document.getElementById('manifest-tax');
        this.totalLabel = document.getElementById('manifest-total');
        this.btnTotalRecap = document.getElementById('btn-total-recap');
        this.manifestContainer = document.getElementById('manifest-items-list');
    },

    bindEvents() {
        // Card regex formatting mask handler
        this.cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e));
        // Expiration auto slash masking handler
        this.cardExpiryInput.addEventListener('input', (e) => this.formatCardExpiry(e));
        // Global interception layer submission logic
        this.form.addEventListener('submit', (e) => this.handleOrderCompilation(e));
    },

    renderManifest(cart) {
        this.manifestContainer.innerHTML = cart.map(item => `
            <div class="manifest-item-line">
                <div class="manifest-item-meta">
                    <h4>${item.name}</h4>
                    <span>Qty: ${item.quantity}</span>
                </div>
                <div class="manifest-item-value">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const grandTotal = subtotal + tax;

        this.subtotalLabel.textContent = `$${subtotal.toFixed(2)}`;
        this.taxLabel.textContent = `$${tax.toFixed(2)}`;
        this.totalLabel.textContent = `$${grandTotal.toFixed(2)}`;
        this.btnTotalRecap.textContent = `$${grandTotal.toFixed(2)}`;
    },

    formatCardNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        // Visa / Mastercard basic detection simulation layer
        if(value.startsWith('4')) {
            this.cardBrandLogo.className = "fa-brands fa-cc-visa card-brand-icon text-primary";
        } else if(value.startsWith('5')) {
            this.cardBrandLogo.className = "fa-brands fa-cc-mastercard card-brand-icon";
        } else {
            this.cardBrandLogo.className = "fa-solid fa-credit-card card-brand-icon";
        }
        
        let chunks = value.match(/.{1,4}/g);
        e.target.value = chunks ? chunks.join(' ') : value;
    },

    formatCardExpiry(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        } else {
            e.target.value = value;
        }
    },

    handleOrderCompilation(e) {
        e.preventDefault();
        this.errorBanner.classList.add('hidden');

        // Extract input strings validation
        const expiry = this.cardExpiryInput.value;
        const [month, year] = expiry.split('/').map(v => parseInt(v, 10));

        // Basic date parameter validation checks (assuming 2026 current year)
        if (!month || month < 1 || month > 12) {
            this.showError("Invalid payment processing schema: Card Expiration month parameter out of bounds.");
            return;
        }

        // Processing order simulation execution sequence
        alert("Authorization validation successful! Processing Nides Store receipt manifest...");
        
        // Purge state data clearing cart assets
        localStorage.removeItem(CartController.storageKey);
        
        // Route customer directly to account landing confirmation interface mapping context
        window.location.href = 'account.html?status=success_order';
    },

    showError(msg) {
        this.errorBanner.textContent = msg;
        this.errorBanner.classList.remove('hidden');
        window.scrollTo({ top: this.errorBanner.offsetTop - 100, behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', () => CheckoutEngine.init());