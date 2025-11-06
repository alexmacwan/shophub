// Products page functionality
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;
let currentView = 'grid';

// Sample product data (same as main app)
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        category: "Electronics",
        rating: 4.5,
        description: "High-quality wireless headphones with noise cancellation and long battery life."
    },
    {
        id: 2,
        name: "Premium Cotton T-Shirt",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        category: "Fashion",
        rating: 4.2,
        description: "Comfortable and stylish cotton t-shirt available in multiple colors."
    },
    {
        id: 3,
        name: "Smart Fitness Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        category: "Electronics",
        rating: 4.7,
        description: "Advanced fitness tracking with heart rate monitoring and GPS."
    },
    {
        id: 4,
        name: "Modern Coffee Table",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
        category: "Home & Garden",
        rating: 4.4,
        description: "Elegant coffee table perfect for any living room decor."
    },
    {
        id: 5,
        name: "Professional Camera Lens",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
        category: "Electronics",
        rating: 4.8,
        description: "High-performance camera lens for professional photography."
    },
    {
        id: 6,
        name: "Yoga Mat Premium",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        category: "Sports",
        rating: 4.3,
        description: "Non-slip yoga mat perfect for home workouts and studio sessions."
    },
    {
        id: 7,
        name: "Designer Handbag",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
        category: "Fashion",
        rating: 4.6,
        description: "Stylish and spacious handbag with premium materials."
    },
    {
        id: 8,
        name: "Garden Tool Set",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
        category: "Home & Garden",
        rating: 4.1,
        description: "Complete set of essential gardening tools for every gardener."
    },
    {
        id: 9,
        name: "Wireless Gaming Mouse",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        category: "Electronics",
        rating: 4.4,
        description: "High-precision wireless gaming mouse with customizable RGB lighting."
    },
    {
        id: 10,
        name: "Running Shoes Pro",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        category: "Sports",
        rating: 4.6,
        description: "Professional running shoes with advanced cushioning technology."
    },
    {
        id: 11,
        name: "Smart Home Hub",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        category: "Electronics",
        rating: 4.3,
        description: "Central hub for controlling all your smart home devices."
    },
    {
        id: 12,
        name: "Leather Wallet",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
        category: "Fashion",
        rating: 4.2,
        description: "Premium leather wallet with multiple card slots and RFID protection."
    }
];

// Cart state
let cart = [];
let user = null;

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const productsCount = document.getElementById('productsCount');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const gridView = document.getElementById('gridView');
const listView = document.getElementById('listView');
const clearFilters = document.getElementById('clearFilters');
const applyPriceFilter = document.getElementById('applyPriceFilter');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');

// Cart elements
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const userBtn = document.getElementById('userBtn');
const userModal = document.getElementById('userModal');
const closeUserModal = document.getElementById('closeUserModal');
const userForm = document.getElementById('userForm');
const overlay = document.getElementById('overlay');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    allProducts = [...products];
    filteredProducts = [...products];
    loadCartFromStorage();
    updateCartDisplay();
    renderProducts();
    setupEventListeners();
    updatePagination();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    // Filtering
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    applyPriceFilter.addEventListener('click', applyFilters);
    clearFilters.addEventListener('click', clearAllFilters);
    
    // Sorting
    sortSelect.addEventListener('change', applySorting);
    
    // View toggle
    gridView.addEventListener('click', () => setView('grid'));
    listView.addEventListener('click', () => setView('list'));
    
    // Pagination
    prevPage.addEventListener('click', () => changePage(currentPage - 1));
    nextPage.addEventListener('click', () => changePage(currentPage + 1));
    
    // Cart functionality
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // User modal functionality
    userBtn.addEventListener('click', toggleUserModal);
    closeUserModal.addEventListener('click', toggleUserModal);
    
    // Form submission
    userForm.addEventListener('click', handleUserFormSubmit);
    
    // Overlay clicks
    overlay.addEventListener('click', function() {
        closeAllModals();
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Search functionality
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (query === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
    }
    currentPage = 1;
    renderProducts();
    updatePagination();
}

// Apply filters
function applyFilters() {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    
    filteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });
    
    currentPage = 1;
    renderProducts();
    updatePagination();
}

// Clear all filters
function clearAllFilters() {
    document.querySelector('input[name="category"][value="All"]').checked = true;
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    filteredProducts = [...allProducts];
    currentPage = 1;
    renderProducts();
    updatePagination();
}

// Apply sorting
function applySorting() {
    const sortBy = sortSelect.value;
    
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            filteredProducts = [...allProducts];
    }
    
    currentPage = 1;
    renderProducts();
    updatePagination();
}

// Set view mode
function setView(view) {
    currentView = view;
    
    if (view === 'grid') {
        gridView.className = 'p-2 bg-primary text-white rounded-lg';
        listView.className = 'p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300';
        productsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    } else {
        listView.className = 'p-2 bg-primary text-white rounded-lg';
        gridView.className = 'p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300';
        productsGrid.className = 'space-y-4';
    }
    
    renderProducts();
}

// Render products
function renderProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    productsCount.textContent = filteredProducts.length;
    
    if (currentView === 'grid') {
        productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    } else {
        productsGrid.innerHTML = productsToShow.map(product => createProductListCard(product)).join('');
    }
}

// Create product card for grid view
function createProductCard(product) {
    return `
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                    <i class="fas fa-heart text-gray-400 hover:text-red-500 cursor-pointer transition-colors"></i>
                </div>
            </div>
            <div class="p-4">
                <div class="flex items-center mb-2">
                    <div class="flex text-yellow-400">
                        ${generateStarRating(product.rating)}
                    </div>
                    <span class="text-sm text-gray-600 ml-2">(${product.rating})</span>
                </div>
                <h3 class="font-semibold text-gray-800 mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-primary">$${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${product.id})" 
                            class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create product card for list view
function createProductListCard(product) {
    return `
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
            <div class="flex items-center space-x-6">
                <img src="${product.image}" alt="${product.name}" class="w-32 h-32 object-cover rounded-lg">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400">
                            ${generateStarRating(product.rating)}
                        </div>
                        <span class="text-sm text-gray-600 ml-2">(${product.rating})</span>
                        <span class="ml-4 text-sm text-gray-500">${product.category}</span>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${product.name}</h3>
                    <p class="text-gray-600 mb-4">${product.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-primary">$${product.price.toFixed(2)}</span>
                        <button onclick="addToCart(${product.id})" 
                                class="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg transition-colors">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Pagination functions
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Update page numbers
    let pageNumbersHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        pageNumbersHTML += `
            <button onclick="changePage(${i})" 
                    class="px-3 py-2 ${i === currentPage ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'} rounded-lg">
                ${i}
            </button>
        `;
    }
    pageNumbers.innerHTML = pageNumbersHTML;
    
    // Update navigation buttons
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProducts();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCartToStorage();
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${item.name}</h4>
                    <p class="text-primary font-bold">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center space-x-2">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                                class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm">-</button>
                        <span class="text-sm">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" 
                                class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Storage functions
function saveCartToStorage() {
    localStorage.setItem('shopHubCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shopHubCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Modal functions
function toggleCart() {
    cartSidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
}

function toggleUserModal() {
    userModal.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
}

function closeAllModals() {
    cartSidebar.classList.add('translate-x-full');
    userModal.classList.add('hidden');
    overlay.classList.add('hidden');
}

// User form handling
function handleUserFormSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    
    if (email && password) {
        user = { email };
        showNotification('Successfully signed in!');
        closeAllModals();
        updateUserDisplay();
    }
}

function updateUserDisplay() {
    if (user) {
        userBtn.innerHTML = `<i class="fas fa-user-check text-xl"></i>`;
        userBtn.title = `Signed in as ${user.email}`;
    }
}

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for line clamping
const style = document.createElement('style');
style.textContent = `
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
