/**
 * Global Cart State Architecture Logic
 */
const CartController = {
    storageKey: 'nides_store_cart_state',

    get() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch {
            return [];
        }
    },

    save(cart) {
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
        this.updateBadge();
        // Fallback update layer if current page context matches shopping cart workspace
        if (document.getElementById('cart-items-container')) {
            this.renderCartPage();
        }
    },

    add(id, name, price) {
        let cart = this.get();
        // Global item reference dictionary mock image resolution lookup pipeline
        const imgMockMap = {
            101: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80',
            102: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80',
            103: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=100&q=80',
            104: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=100&q=80',
            201: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=100&q=80',
            202: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=100&q=80',
            203: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=100&q=80',
            301: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=100&q=80',
            401: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=100&q=80'
        };

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                id, 
                name, 
                price, 
                quantity: 1, 
                img: imgMockMap[id] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=100&q=80'
            });
        }

        this.save(cart);
        alert(`${name} staged in shopping cart allocation.`);
    },

    updateQuantity(id, delta) {
        let cart = this.get();
        const item = cart.find(item => item.id === id);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }

        this.save(cart);
    },

    removeItem(id) {
        let cart = this.get();
        cart = cart.filter(item => item.id !== id);
        this.save(cart);
    },

    updateBadge() {
        const badges = document.querySelectorAll('.cart-count');
        const cart = this.get();
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        
        badges.forEach(badge => {
            badge.textContent = totalItems;
        });
    },

    renderCartPage() {
        const container = document.getElementById('cart-items-container');
        const checkoutCtaBtn = document.getElementById('checkout-cta-btn');
        if (!container) return;

        const cart = this.get();

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Your current allocation basket is empty.</p>
                </div>`;
            if (checkoutCtaBtn) checkoutCtaBtn.classList.add('disabled');
            this.updateSummaryCalculations(0);
            return;
        }

        if (checkoutCtaBtn) checkoutCtaBtn.classList.remove('disabled');

        container.innerHTML = cart.map(item => `
            <article class="cart-item-row">
                <div class="cart-product-info">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <button class="remove-item-btn" onclick="CartController.removeItem(${item.id})">
                            <i class="fa-solid fa-trash-can"></i> Remove
                        </button>
                    </div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-quantity">
                    <div class="quantity-control-block">
                        <button class="qty-btn" onclick="CartController.updateQuantity(${item.id}, -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="CartController.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</div>
            </article>
        `).join('');

        const itemsSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        this.updateSummaryCalculations(itemsSubtotal);
    },

    updateSummaryCalculations(subtotal) {
        const subtotalEl = document.getElementById('summary-subtotal');
        const taxEl = document.getElementById('summary-tax');
        const totalEl = document.getElementById('summary-total');

        if (!subtotalEl) return;

        const calculatedTax = subtotal * 0.08; // 8% calculated baseline valuation
        const overallTotal = subtotal + calculatedTax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${calculatedTax.toFixed(2)}`;
        totalEl.textContent = `$${overallTotal.toFixed(2)}`;
    }
};

// Application initial mount interceptor mapping hooks
document.addEventListener('DOMContentLoaded', () => {
    CartController.updateBadge();
    if (document.getElementById('cart-items-container')) {
        CartController.renderCartPage();
    }
});