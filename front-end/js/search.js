document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('global-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchForm.querySelector('input').value.trim();
            if (query) {
                // Route query context parameter seamlessly to dedicated product catalog engine
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
});