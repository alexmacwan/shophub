// Sample product data
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
    }
];

// Cart state
let cart = [];
let user = null;

// DOM elements
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
const featuredProducts = document.getElementById('featuredProducts');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    if (typeof featuredProducts !== 'undefined' && featuredProducts) {
        loadFeaturedProducts();
    }
    setupEventListeners();
    loadCartFromStorage();
    updateCartDisplay();
});

// Setup event listeners
function setupEventListeners() {
    // Cart functionality
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    
    // User modal functionality
    if (userBtn) userBtn.addEventListener('click', toggleUserModal);
    if (closeUserModal) closeUserModal.addEventListener('click', toggleUserModal);
    
    // Form submission
    if (userForm) userForm.addEventListener('submit', handleUserFormSubmit);
    
    // Overlay clicks
    if (overlay) overlay.addEventListener('click', function() {
        closeAllModals();
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Load featured products
function loadFeaturedProducts() {
    const featured = products.slice(0, 4); // Show first 4 products
    featuredProducts.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Create product card HTML
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
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
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
    
    // Update total
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
    
    // Simple validation (in a real app, this would connect to a backend)
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
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search functionality
function searchProducts(query) {
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update the display with filtered products
    // This could be expanded to show results in a dedicated search results section
    console.log('Search results:', filtered);
}

// Category filtering
function filterByCategory(category) {
    const filtered = category === 'All' ? products : products.filter(product => product.category === category);
    // Update the display with filtered products
    console.log('Category filter results:', filtered);
}

// Add some CSS for line clamping
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
