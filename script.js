// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Product Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const productGrids = document.querySelectorAll('.product-grid');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and grids
        tabButtons.forEach(btn => btn.classList.remove('active'));
        productGrids.forEach(grid => grid.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Show corresponding grid
        const tabName = button.getAttribute('data-tab');
        const targetGrid = document.getElementById(tabName);
        if (targetGrid) {
            targetGrid.classList.add('active');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (name && email && message) {
        // In a real application, you would send this data to a server
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon at ${email}.`);
        
        // Reset form
        contactForm.reset();
    } else {
        alert('Please fill in all required fields.');
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Product Loading from Admin Panel
const STORAGE_KEY = 'doughDoughProducts';

function loadProductsFromStorage() {
    // Try localStorage first, then sessionStorage as fallback
    let stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        stored = sessionStorage.getItem(STORAGE_KEY);
        console.log('localStorage empty, trying sessionStorage...');
    }
    
    let products = [];
    
    try {
        products = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error parsing products from storage:', e);
        products = [];
    }
    
    console.log('Loading products:', products.length, 'found');
    console.log('Raw storage data:', stored ? (stored.length > 200 ? stored.substring(0, 200) + '...' : stored) : 'null');
    console.log('Storage key:', STORAGE_KEY);
    console.log('All localStorage keys:', Object.keys(localStorage));
    
    const sweetGrid = document.getElementById('sweet');
    const savoryGrid = document.getElementById('savory');
    
    if (!sweetGrid || !savoryGrid) {
        console.error('Product grids not found! sweetGrid:', sweetGrid, 'savoryGrid:', savoryGrid);
        return;
    }
    
    sweetGrid.innerHTML = '';
    savoryGrid.innerHTML = '';
    
    if (products.length === 0) {
        console.log('No products found in storage');
        // Show default placeholder products if no products exist
        sweetGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px; grid-column: 1 / -1;">No products available yet. Check back soon!</p>';
        savoryGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px; grid-column: 1 / -1;">No products available yet. Check back soon!</p>';
        return;
    }
    
    console.log('Products to display:', products);
    console.log('Sweet products:', products.filter(p => p.category === 'sweet'));
    console.log('Savory products:', products.filter(p => p.category === 'savory'));
    
    let sweetCount = 0;
    let savoryCount = 0;
    
    products.forEach(product => {
        console.log('Processing product:', product.name, 'Category:', product.category);
        const card = createProductCard(product);
        if (product.category === 'sweet') {
            sweetGrid.appendChild(card);
            sweetCount++;
            console.log('Added to sweet grid:', product.name);
        } else if (product.category === 'savory') {
            savoryGrid.appendChild(card);
            savoryCount++;
            console.log('Added to savory grid:', product.name);
        } else {
            console.warn('Product has unknown category:', product.category, product);
        }
    });
    
    console.log('Total products displayed - Sweet:', sweetCount, 'Savory:', savoryCount);
    
    // If no products in active tab, show message
    if (sweetCount === 0 && document.getElementById('sweet').classList.contains('active')) {
        sweetGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px; grid-column: 1 / -1;">No sweet products available yet.</p>';
    }
    if (savoryCount === 0 && document.getElementById('savory').classList.contains('active')) {
        savoryGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px; grid-column: 1 / -1;">No savory products available yet.</p>';
    }
    
    // Observe new product cards for animations after a short delay
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }, 100);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Determine background class based on category
    const bgClass = product.category === 'sweet' ? 'sweet-' + (Math.floor(Math.random() * 6) + 1) : 'savory-' + (Math.floor(Math.random() * 6) + 1);
    
    // Use first image if available, otherwise use icon
    let imageContent = '';
    if (product.images && product.images.length > 0) {
        imageContent = `<img src="${product.images[0]}" alt="${product.name}" class="product-image">`;
    } else {
        imageContent = `<div class="product-icon">${product.icon || '🍞'}</div>`;
    }
    
    card.innerHTML = `
        <div class="product-image-container ${bgClass}">
            ${imageContent}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            ${product.price ? `<div class="product-price">$${product.price.toFixed(2)}</div>` : ''}
        </div>
    `;
    
    return card;
}

// Refresh button and Import Modal
let refreshBtn = null;
let importModal = null;
let importProductsBtn = null;
let closeImportModal = null;
let cancelImportBtn = null;
let confirmImportBtn = null;
let importData = null;

// Load products when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        loadProductsFromStorage();
    }, 50);
    
    // Add refresh button listener
    refreshBtn = document.getElementById('refreshProducts');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            console.log('Refresh button clicked');
            const beforeCount = document.querySelectorAll('.product-card').length;
            console.log('Products before refresh:', beforeCount);
            loadProductsFromStorage();
            const afterCount = document.querySelectorAll('.product-card').length;
            console.log('Products after refresh:', afterCount);
            
            // Show visual feedback
            const originalText = refreshBtn.textContent;
            refreshBtn.textContent = '✓ Refreshed!';
            setTimeout(() => {
                refreshBtn.textContent = originalText;
            }, 2000);
            
            // Alert if no products found
            if (afterCount === 0) {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (!stored) {
                    alert('No products found in storage.\n\nPlease:\n1. Go to Admin Panel\n2. Click "📋 Export Products"\n3. Click "📥 Import" button here\n4. Paste the data');
                }
            }
        });
    }
    
    // Get import modal elements
    importModal = document.getElementById('importModal');
    importProductsBtn = document.getElementById('importProductsBtn');
    closeImportModal = document.getElementById('closeImportModal');
    cancelImportBtn = document.getElementById('cancelImportBtn');
    confirmImportBtn = document.getElementById('confirmImportBtn');
    importData = document.getElementById('importData');
    
    console.log('Import elements:', {
        modal: importModal,
        importBtn: importProductsBtn,
        closeBtn: closeImportModal,
        cancelBtn: cancelImportBtn,
        confirmBtn: confirmImportBtn,
        dataField: importData
    });
    
    // Import button
    if (importProductsBtn) {
        importProductsBtn.addEventListener('click', () => {
            console.log('Open import modal clicked');
            if (importModal) {
                importModal.classList.remove('hidden');
            } else {
                alert('Import modal not found');
            }
        });
    } else {
        console.error('Import products button not found');
    }
    
    // Close import modal
    if (closeImportModal) {
        closeImportModal.addEventListener('click', closeImportModalFunc);
    }
    if (cancelImportBtn) {
        cancelImportBtn.addEventListener('click', closeImportModalFunc);
    }
    
    // Confirm import
    if (confirmImportBtn) {
        console.log('Setting up import button handler');
        console.log('Button element:', confirmImportBtn);
        console.log('Button style:', window.getComputedStyle(confirmImportBtn));
        
        // Test click
        confirmImportBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Import button clicked via onclick!');
            handleImport();
        };
        
        confirmImportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Import button clicked via addEventListener!');
            handleImport();
        }, true); // Use capture phase
        
        function handleImport() {
            
            const dataElement = document.getElementById('importData');
            if (!dataElement) {
                console.error('importData element not found');
                alert('Error: Import textarea not found');
                return;
            }
            
            const data = dataElement.value.trim();
            console.log('Data length:', data.length);
            console.log('Data preview:', data.substring(0, 100));
            
            if (!data) {
                alert('Please paste product data first!');
                return;
            }
            
            try {
                console.log('Attempting to parse JSON...');
                const products = JSON.parse(data);
                console.log('Parsed products:', products);
                
                if (!Array.isArray(products)) {
                    throw new Error('Data is not an array');
                }
                
                if (products.length === 0) {
                    throw new Error('No products in the data');
                }
                
                console.log('Saving products to storage...');
                const jsonString = JSON.stringify(products);
                localStorage.setItem(STORAGE_KEY, jsonString);
                sessionStorage.setItem(STORAGE_KEY, jsonString);
                
                // Verify save
                const verify = localStorage.getItem(STORAGE_KEY);
                if (!verify) {
                    throw new Error('Failed to save to localStorage');
                }
                
                console.log('Products saved successfully! Count:', products.length);
                alert(`✅ Successfully imported ${products.length} product(s)!`);
                closeImportModalFunc();
                loadProductsFromStorage();
            } catch (e) {
                console.error('Import error:', e);
                console.error('Error stack:', e.stack);
                alert('Error: ' + e.message + '\n\nCheck the console (F12) for details.');
            }
        }
        
        console.log('Import button handler attached');
    } else {
        console.error('confirmImportBtn not found!');
    }
    
    // Close modal when clicking outside
    if (importModal) {
        importModal.addEventListener('click', (e) => {
            if (e.target === importModal) {
                closeImportModalFunc();
            }
        });
    }
    
    // Listen for storage changes (when admin panel updates products in different tab)
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            console.log('Storage changed, reloading products...');
            loadProductsFromStorage();
        }
    });
    
    // Check periodically for changes
    let lastKnownData = localStorage.getItem(STORAGE_KEY);
    setInterval(() => {
        const currentData = localStorage.getItem(STORAGE_KEY);
        if (currentData !== lastKnownData) {
            console.log('Products updated, reloading...');
            loadProductsFromStorage();
            lastKnownData = currentData;
        }
    }, 1000); // Check every 1 second
    
    // Observe existing content sections
    document.querySelectorAll('.about-content, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Also listen for storage changes (in case admin panel updates products)
window.addEventListener('storage', () => {
    loadProductsFromStorage();
});

// Make loadProductsFromStorage available globally for debugging
window.loadProductsFromStorage = loadProductsFromStorage;

