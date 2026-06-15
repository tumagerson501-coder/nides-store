// Central State Management Simulator
const AppState = {
    trendingProducts: [
        { id: 101, name: 'Quantum ANC Headphones', price: 299.99, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
        { id: 102, name: 'Minimalist Chronograph Watch', price: 189.00, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
        { id: 103, name: 'Ergonomic Mechanical Keyboard', price: 145.50, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80' },
        { id: 104, name: 'Ultra-Wide 4K Monitor', price: 549.99, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80' }
    ],
    newArrivals: [
        { id: 201, name: 'Sleek Leather Wallet', price: 45.00, img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80' },
        { id: 202, name: 'Smart Fitness Band v5', price: 79.99, img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=400&q=80' }
    ],
    flashSales: [
        { id: 301, name: 'Wireless Charging Dock', price: 29.99, img: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=400&q=80' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    renderGrid('trending-grid', AppState.trendingProducts);
    renderGrid('new-arrivals-grid', AppState.newArrivals);
    renderGrid('flash-sale-grid', AppState.flashSales);
    initFlashSaleCountdown();
});

// Dynamic component factory builder pattern
function renderGrid(targetId, products) {
    const grid = document.getElementById(targetId);
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <article class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn add-to-cart-btn" onclick="CartController.add(${product.id}, '${product.name}', ${product.price})">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </article>
    `).join('');
}

function initFlashSaleCountdown() {
    const timerElement = document.getElementById('countdown');
    if (!timerElement) return;

    let totalSeconds = 4 * 60 * 60 + 34 * 60 + 12; // 4h 34m 12s mock initialization

    const interval = setInterval(() => {
        if(totalSeconds <= 0) {
            clearInterval(interval);
            timerElement.textContent = "Sale Ended";
            return;
        }
        totalSeconds--;
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        timerElement.textContent = `Ends in: ${hrs.toString().padStart(2,'0')}h ${mins.toString().padStart(2,'0')}m ${secs.toString().padStart(2,'0')}s`;
    }, 1000);
}