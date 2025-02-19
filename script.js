let productsData = [];
let currentSort = {
    column: 'id',
    direction: 'asc'
};

// Function to create star rating HTML
const createStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
};

// Function to get nested object value
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Function to sort products
const sortProducts = (column) => {
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    productsData.sort((a, b) => {
        let valueA = getNestedValue(a, column);
        let valueB = getNestedValue(b, column);
        
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }
        
        if (valueA < valueB) return currentSort.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    renderProducts();
};

// Function to render products
const renderProducts = () => {
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = productsData.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.title}" class="product-image"></td>
            <td>${product.title}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="category-badge">${product.category}</span></td>
            <td>
                <span class="stars">${createStarRating(product.rating.rate)}</span>
                <span>(${product.rating.count})</span>
            </td>
        </tr>
    `).join('');
};

// Fetch and display products
const fetchData = async () => {
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading products...</td></tr>';

    try {
        const response = await fetch('https://fakestoreapi.com/products');
        productsData = await response.json();
        renderProducts();
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Error loading products. Please try again later.</td></tr>';
        console.error(error);
    }
};

// Add event listeners for sorting
document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        sortProducts(th.dataset.sort);
    });
});

// Initialize the page
fetchData();