/**
 * Product Interface Data Management Controller Engine
 */
const CatalogEngine = {
    // Shared Central Database Simulation Matrix
    products: [
        { id: 101, name: 'Quantum ANC Headphones', price: 299.99, category: 'electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
        { id: 102, name: 'Minimalist Chronograph Watch', price: 189.00, category: 'electronics', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
        { id: 103, name: 'Ergonomic Mechanical Keyboard', price: 145.50, category: 'electronics', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80' },
        { id: 104, name: 'Ultra-Wide 4K Monitor', price: 549.99, category: 'electronics', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80' },
        { id: 201, name: 'Sleek Leather Wallet', price: 45.00, category: 'fashion', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80' },
        { id: 202, name: 'Smart Fitness Band v5', price: 79.99, category: 'fashion', img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=400&q=80' },
        { id: 203, name: 'Classic Denim Jacket', price: 110.00, category: 'fashion', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80' },
        { id: 301, name: 'Wireless Charging Dock', price: 29.99, category: 'electronics', img: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=400&q=80' },
        { id: 401, name: 'Minimalist Ceramic Vase', price: 35.00, category: 'home', img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80' }
    ],

    filters: {
        categories: [],
        maxPrice: 1000,
        searchQuery: '',
        sortBy: 'default'
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.readURLParams();
        this.applyPipeline();
    },

    cacheDOM() {
        this.grid = document.getElementById('catalog-products-grid');
        this.countLabel = document.getElementById('current-count');
        this.priceSlider = document.getElementById('price-range');
        this.priceMaxLabel = document.getElementById('price-max-label');
        this.catCheckboxes = document.querySelectorAll('.cat-checkbox');
        this.catAll = document.getElementById('cat-all');
        this.sortDropdown = document.getElementById('sort-selector');
        this.clearBtn = document.getElementById('clear-filters');
        this.searchInput = document.getElementById('catalog-search-input');
        
        // Layout structural view triggers
        this.gridViewBtn = document.getElementById('grid-view-btn');
        this.listViewBtn = document.getElementById('list-view-btn');
    },

    bindEvents() {
        // Price slider changes
        this.priceSlider.addEventListener('input', (e) => {
            this.filters.maxPrice = parseFloat(e.target.value);
            this.priceMaxLabel.textContent = `Max: $${this.filters.maxPrice}`;
            this.applyPipeline();
        });

        // Category selections
        this.catCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                this.catAll.checked = false;
                this.updateCategoryFilterArray();
            });
        });

        this.catAll.addEventListener('change', () => {
            if(this.catAll.checked) {
                this.catCheckboxes.forEach(cb => cb.checked = false);
                this.filters.categories = [];
                this.applyPipeline();
            }
        });

        // Sorting triggers
        this.sortDropdown.addEventListener('change', (e) => {
            this.filters.sortBy = e.target.value;
            this.applyPipeline();
        });

        // Search keystrokes interceptor
        this.searchInput.addEventListener('input', (e) => {
            this.filters.searchQuery = e.target.value.toLowerCase().trim();
            this.applyPipeline();
        });

        // Clear layout
        this.clearBtn.addEventListener('click', () => this.resetAllFilters());

        // View Toggles
        this.gridViewBtn.addEventListener('click', () => {
            this.gridViewBtn.classList.add('active');
            this.listViewBtn.classList.remove('active');
            this.grid.classList.remove('list-view-active');
        });

        this.listViewBtn.addEventListener('click', () => {
            this.listViewBtn.classList.add('active');
            this.gridViewBtn.classList.remove('active');
            this.grid.classList.add('list-view-active');
        });
    },

    readURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const categoryParam = urlParams.get('category');

        if (searchParam) {
            this.filters.searchQuery = searchParam.toLowerCase();
            this.searchInput.value = searchParam;
        }

        if (categoryParam) {
            this.catAll.checked = false;
            this.catCheckboxes.forEach(cb => {
                if(cb.value === categoryParam) cb.checked = true;
            });
            this.updateCategoryFilterArray();
        }
    },

    updateCategoryFilterArray() {
        this.filters.categories = Array.from(this.catCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        if(this.filters.categories.length === 0) {
            this.catAll.checked = true;
        }
        this.applyPipeline();
    },

    resetAllFilters() {
        this.catAll.checked = true;
        this.catCheckboxes.forEach(cb => cb.checked = false);
        this.priceSlider.value = 1000;
        this.priceMaxLabel.textContent = "Max: $1000";
        this.searchInput.value = '';
        this.sortDropdown.value = 'default';

        this.filters = {
            categories: [],
            maxPrice: 1000,
            searchQuery: '',
            sortBy: 'default'
        };
        this.applyPipeline();
    },

    applyPipeline() {
        // Step 1: Filter
        let processed = this.products.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(this.filters.searchQuery);
            const matchesPrice = item.price <= this.filters.maxPrice;
            const matchesCategory = this.filters.categories.length === 0 || this.filters.categories.includes(item.category);
            return matchesSearch && matchesPrice && matchesCategory;
        });

        // Step 2: Sort
        if (this.filters.sortBy === 'price-low') {
            processed.sort((a, b) => a.price - b.price);
        } else if (this.filters.sortBy === 'price-high') {
            processed.sort((a, b) => b.price - a.price);
        }

        // Step 3: Render
        this.render(processed);
    },

    render(data) {
        this.countLabel.textContent = data.length;

        if (data.length === 0) {
            this.grid.innerHTML = `<div class="catalog-loader">No items match current filtering conditions.</div>`;
            return;
        }

        this.grid.innerHTML = data.map(product => `
            <article class="product-card">
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
};

// Start execution once engine parameters finalize mount
document.addEventListener('DOMContentLoaded', () => CatalogEngine.init());