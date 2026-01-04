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
    const stored = localStorage.getItem(STORAGE_KEY);
    const products = stored ? JSON.parse(stored) : [];
    
    const sweetGrid = document.getElementById('sweet');
    const savoryGrid = document.getElementById('savory');
    
    if (!sweetGrid || !savoryGrid) {
        console.error('Product grids not found');
        return;
    }
    
    sweetGrid.innerHTML = '';
    savoryGrid.innerHTML = '';
    
    if (products.length === 0) {
        // Show default placeholder products if no products exist
        sweetGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px; grid-column: 1 / -1;">No products available yet. Check back soon!</p>';
        savoryGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px; grid-column: 1 / -1;">No products available yet. Check back soon!</p>';
        return;
    }
    
    products.forEach(product => {
        const card = createProductCard(product);
        if (product.category === 'sweet') {
            sweetGrid.appendChild(card);
        } else if (product.category === 'savory') {
            savoryGrid.appendChild(card);
        }
    });
    
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

// Load products when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadProductsFromStorage();
    
    // Observe existing content sections
    document.querySelectorAll('.about-content, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

