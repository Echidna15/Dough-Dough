// Admin Panel JavaScript

// Default admin credentials (in production, use proper authentication)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Storage keys
const STORAGE_KEY = 'doughDoughProducts';
const AUTH_KEY = 'doughDoughAuth';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const productsList = document.getElementById('productsList');
const productImages = document.getElementById('productImages');
const imagePreview = document.getElementById('imagePreview');
const existingImages = document.getElementById('existingImages');

// Check authentication on load
window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProducts();
});

// Login functionality
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'true');
        showDashboard();
    } else {
        alert('Invalid username or password');
    }
});

// Logout functionality
logoutBtn.addEventListener('open', () => {
    localStorage.removeItem(AUTH_KEY);
    showLogin();
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    showLogin();
});

// Check authentication
function checkAuth() {
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
    if (isAuthenticated) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginScreen.classList.remove('hidden');
    dashboard.classList.add('hidden');
}

function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadProducts();
}

// Product Management
let currentProductId = null;
let newImages = [];
let imagesToRemove = [];

// Add Product Button
addProductBtn.addEventListener('click', () => {
    openProductModal();
});

// Close Modal
closeModal.addEventListener('click', closeProductModal);
cancelBtn.addEventListener('click', closeProductModal);

// Close modal when clicking outside
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeProductModal();
    }
});

function openProductModal(product = null) {
    currentProductId = product ? product.id : null;
    newImages = [];
    imagesToRemove = [];
    
    document.getElementById('modalTitle').textContent = product ? 'Edit Product' : 'Add New Product';
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productIcon').value = product.icon || '';
        
        // Display existing images
        displayExistingImages(product.images || []);
    } else {
        productForm.reset();
        imagePreview.innerHTML = '';
        existingImages.innerHTML = '';
    }
    
    productModal.classList.remove('hidden');
}

function closeProductModal() {
    productModal.classList.add('hidden');
    productForm.reset();
    imagePreview.innerHTML = '';
    existingImages.innerHTML = '';
    newImages = [];
    imagesToRemove = [];
    currentProductId = null;
}

// Image Upload Preview
productImages.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = {
                    file: file,
                    dataUrl: event.target.result,
                    id: Date.now() + Math.random()
                };
                newImages.push(imageData);
                displayImagePreview();
            };
            reader.readAsDataURL(file);
        }
    });
});

function displayImagePreview() {
    imagePreview.innerHTML = '';
    newImages.forEach((image, index) => {
        const div = document.createElement('div');
        div.className = 'image-preview-item';
        div.innerHTML = `
            <img src="${image.dataUrl}" alt="Preview">
            <button type="button" class="remove-image" onclick="removeNewImage(${index})">×</button>
        `;
        imagePreview.appendChild(div);
    });
}

function removeNewImage(index) {
    newImages.splice(index, 1);
    displayImagePreview();
}

function displayExistingImages(images) {
    existingImages.innerHTML = '';
    images.forEach((image, index) => {
        const div = document.createElement('div');
        div.className = 'existing-image-item';
        div.innerHTML = `
            <img src="${image}" alt="Existing">
            <button type="button" class="remove-existing" onclick="removeExistingImage(${index})">×</button>
        `;
        existingImages.appendChild(div);
    });
}

function removeExistingImage(index) {
    const products = getProducts();
    const product = products.find(p => p.id === currentProductId);
    if (product && product.images) {
        imagesToRemove.push(product.images[index]);
        product.images.splice(index, 1);
        displayExistingImages(product.images);
    }
}

// Product Form Submit
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProduct();
});

function saveProduct() {
    try {
        const products = getProducts();
        const productData = {
            id: currentProductId || Date.now(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            icon: document.getElementById('productIcon').value || '🍞',
            images: []
        };

        console.log('Saving product:', productData);

        // Add existing images (excluding removed ones)
        if (currentProductId) {
            const existingProduct = products.find(p => p.id === currentProductId);
            if (existingProduct && existingProduct.images) {
                productData.images = existingProduct.images.filter(img => 
                    !imagesToRemove.includes(img)
                );
            }
        }

        // Add new images
        newImages.forEach(image => {
            productData.images.push(image.dataUrl);
        });

        // Save or update product
        if (currentProductId) {
            const index = products.findIndex(p => p.id === currentProductId);
            if (index !== -1) {
                products[index] = productData;
            }
        } else {
            products.push(productData);
        }

        console.log('Products array before save:', products);
        saveProducts(products);
        console.log('Products saved. Verifying...', localStorage.getItem(STORAGE_KEY));
        
        // Verify save
        const verify = getProducts();
        console.log('Verification - products in storage:', verify.length);
        
        if (verify.length === 0) {
            alert('Error: Product was not saved! Check console for details.');
            return;
        }
        
        alert(`Product saved successfully!\n\n⚠️ Remember to refresh the main website page to see your changes.`);
        closeProductModal();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product: ' + error.message);
    }
}

// Get/Save Products
function getProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveProducts(products) {
    try {
        const jsonString = JSON.stringify(products);
        localStorage.setItem(STORAGE_KEY, jsonString);
        console.log('Saved to localStorage:', STORAGE_KEY, 'Length:', jsonString.length);
        
        // Also try sessionStorage as backup
        sessionStorage.setItem(STORAGE_KEY, jsonString);
        
        // Verify immediately
        const verify = localStorage.getItem(STORAGE_KEY);
        if (!verify) {
            throw new Error('Failed to save to localStorage');
        }
        console.log('Verification successful. Storage contains:', verify.substring(0, 100) + '...');
        
        // Show alert with data for manual copy if needed
        console.log('Products JSON (for debugging):', jsonString);
    } catch (error) {
        console.error('Error in saveProducts:', error);
        throw error;
    }
}

// Load and Display Products
function loadProducts() {
    const products = getProducts();
    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">No products yet. Click "Add New Product" to get started!</p>';
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product);
        productsList.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card-admin';
    
    const imagesHtml = product.images && product.images.length > 0
        ? `<div class="product-card-images">
            ${product.images.slice(0, 3).map(img => `<img src="${img}" alt="${product.name}">`).join('')}
            ${product.images.length > 3 ? `<span>+${product.images.length - 3}</span>` : ''}
           </div>`
        : '<p style="color: var(--text-light); font-size: 0.85rem;">No images</p>';

    card.innerHTML = `
        <div class="product-card-header">
            <div>
                <div class="product-card-title">${product.name}</div>
                <div class="product-card-category">${product.category}</div>
            </div>
            <div class="product-card-actions">
                <button class="btn btn-primary" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
        <div class="product-card-body">
            <div class="product-card-description">${product.description}</div>
            <div class="product-card-price">$${product.price ? product.price.toFixed(2) : '0.00'}</div>
        </div>
        ${imagesHtml}
    `;

    return card;
}

function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
        openProductModal(product);
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = getProducts();
        const filtered = products.filter(p => p.id !== id);
        saveProducts(filtered);
        loadProducts();
    }
}

// Make functions globally available
// Refresh Products Button
const refreshProductsBtn = document.getElementById('refreshProductsBtn');
if (refreshProductsBtn) {
    refreshProductsBtn.addEventListener('click', () => {
        loadProducts();
        alert('Products list refreshed!');
    });
}

// Import Products Modal
const importModal = document.getElementById('importModal');
const importProductsBtn = document.getElementById('importProductsBtn');
const closeImportModal = document.getElementById('closeImportModal');
const cancelImportBtn = document.getElementById('cancelImportBtn');
const confirmImportBtn = document.getElementById('confirmImportBtn');
const importData = document.getElementById('importData');

if (importProductsBtn) {
    importProductsBtn.addEventListener('click', () => {
        importModal.classList.remove('hidden');
    });
}

if (closeImportModal) {
    closeImportModal.addEventListener('click', closeImportModalFunc);
}

if (cancelImportBtn) {
    cancelImportBtn.addEventListener('click', closeImportModalFunc);
}

if (confirmImportBtn) {
    confirmImportBtn.addEventListener('click', () => {
        const data = importData.value.trim();
        if (!data) {
            alert('Please paste product data first!');
            return;
        }
        
        try {
            const products = JSON.parse(data);
            if (!Array.isArray(products)) {
                throw new Error('Data is not an array');
            }
            
            saveProducts(products);
            alert(`Successfully imported ${products.length} product(s)!`);
            closeImportModalFunc();
            loadProducts();
        } catch (e) {
            alert('Error: ' + e.message);
        }
    });
}

if (importModal) {
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) {
            closeImportModalFunc();
        }
    });
}

function closeImportModalFunc() {
    if (importModal) importModal.classList.add('hidden');
    if (importData) importData.value = '';
}

// Export Products Button
const exportProductsBtn = document.getElementById('exportProductsBtn');
if (exportProductsBtn) {
    exportProductsBtn.addEventListener('click', () => {
        const products = getProducts();
        if (products.length === 0) {
            alert('No products to export!');
            return;
        }
        
        const jsonData = JSON.stringify(products);
        
        // Copy to clipboard
        navigator.clipboard.writeText(jsonData).then(() => {
            alert(`✅ Copied ${products.length} product(s) to clipboard!`);
        }).catch(() => {
            // Fallback: show in prompt
            prompt('Copy this data (Ctrl+C):', jsonData);
        });
    });
}

window.removeNewImage = removeNewImage;
window.removeExistingImage = removeExistingImage;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

