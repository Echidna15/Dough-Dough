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

// Observe product cards and sections
document.querySelectorAll('.product-card, .about-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Image Gallery Modal Functionality
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalThumbnails = document.getElementById('modalThumbnails');
const closeModal = document.querySelector('.modal-close');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Product images mapping
const productImages = {
    1: ['1 main.jpg', '1 second.jpg', '1 third.jpg'],
    2: ['2 main.jpg', '2 second.jpg', '2 third.jpg'],
    3: ['3 main.jpg', '3 second.jpg'],
    4: ['4 main.jpg', '4 second.jpg', '4 third.jpg'],
    5: ['5 main.jpg', '5 second.jpg'],
    6: ['6 main.jpg', '6 second.jpg'],
    7: ['7 main.jpg', '7 second.jpg', '7 third.jpg'],
    8: ['8 main.jpg', '8 second.jpg', '8 third.jpg'],
    9: ['9 main.jpg', '9 second.jpg', '9 third.jpg']
};

let currentProduct = null;
let currentImageIndex = 0;
let currentImages = [];

// Open modal with product images
function openModal(productNumber) {
    currentProduct = productNumber;
    currentImages = productImages[productNumber] || [];
    currentImageIndex = 0;
    
    if (currentImages.length > 0) {
        updateModalImage();
        updateThumbnails();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Update modal image
function updateModalImage() {
    if (currentImages.length > 0) {
        modalImage.src = currentImages[currentImageIndex];
        modalImage.alt = `Product ${currentProduct} - Image ${currentImageIndex + 1}`;
    }
}

// Update thumbnails
function updateThumbnails() {
    modalThumbnails.innerHTML = '';
    currentImages.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.className = 'modal-thumbnail' + (index === currentImageIndex ? ' active' : '');
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateModalImage();
            updateThumbnails();
        });
        modalThumbnails.appendChild(thumbnail);
    });
}

// Close modal
function closeModalFunc() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Navigate images
function nextImage() {
    if (currentImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateModalImage();
        updateThumbnails();
    }
}

function prevImage() {
    if (currentImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
        updateThumbnails();
    }
}

// Event listeners
document.querySelectorAll('.product-card').forEach(card => {
    const productNumber = parseInt(card.getAttribute('data-product'));
    if (productNumber) {
        card.addEventListener('click', () => {
            openModal(productNumber);
        });
    }
});

closeModal.addEventListener('click', closeModalFunc);
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeModalFunc();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }
});

