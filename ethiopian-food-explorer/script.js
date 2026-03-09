/**
 * Ethiopian Food Explorer
 * Complete JavaScript Implementation
 * Author: Senior Front-End Developer
 * Description: Interactive food exploration page with dynamic content
 */

// ===== FOOD DATABASE =====
const foodDatabase = {
    injera: {
        id: 'injera',
        title: '🍞 Injera',
        name: 'Injera',
        description: 'Injera is a sourdough flatbread with a unique, spongy texture. Made from teff flour, it\'s the staple of Ethiopian cuisine and serves as both a plate and utensil! Traditional Ethiopian meals are served on a large injera, with various stews and dishes placed on top. The fermentation process gives it a slightly tangy flavor that perfectly complements spicy stews.',
        longDescription: 'Injera is more than just bread - it\'s a cultural icon. Made from teff, a tiny grain native to Ethiopia, the batter is fermented for several days, giving it its distinctive tangy flavor and airy texture. It\'s naturally gluten-free and rich in iron, calcium, and amino acids. The fermentation process also creates natural preservatives, allowing injera to stay fresh for several days. In Ethiopian culture, the meal isn\'t complete without injera, and it\'s considered wasteful to leave any injera uneaten.',
        image: 'images/injera.jpg',
        origin: 'Ethiopian Highlands',
        spiceLevel: 'Mild',
        prepTime: '3-4 days (including fermentation)',
        culturalSignificance: 'Injera is central to Ethiopian identity and dining culture. The shared eating from a communal injera platter symbolizes unity and friendship.',
        funFact: 'The bubbles on injera are carefully cultivated during fermentation - the more bubbles, the more skilled the cook!'
    },
    'doro-wat': {
        id: 'doro-wat',
        title: '🍗 Doro Wat',
        name: 'Doro Wat',
        description: 'Doro Wat is a spicy Ethiopian chicken stew, often considered the national dish. It\'s made with chicken, hard-boiled eggs, and berbere spice blend. This aromatic dish is traditionally served during special occasions and celebrations. The slow-cooking process allows the flavors to develop deeply, creating a rich and complex taste.',
        longDescription: 'Doro Wat is simmered for hours with berbere (a blend of chili peppers, garlic, ginger, and up to 15 other spices) and niter kibbeh (spiced clarified butter). The hard-boiled eggs are added near the end, absorbing the rich, spicy flavors. Traditionally, this dish is made with free-range chicken and served during holidays, weddings, and special family gatherings. The depth of flavor comes from the careful caramelization of onions and the slow cooking process that can take several hours.',
        image: 'images/doro-wat.jpg',
        origin: 'Ethiopian Empire',
        spiceLevel: 'Hot',
        prepTime: '2-3 hours',
        culturalSignificance: 'Doro Wat is often served during Ethiopian Christmas (Genna) and Easter (Fasika). The number of eggs in the stew can indicate the occasion\'s importance.',
        funFact: 'In traditional preparation, the chicken is always cut into 12 pieces - one for each apostle!'
    },
    kitfo: {
        id: 'kitfo',
        title: '🥩 Kitfo',
        name: 'Kitfo',
        description: 'Kitfo is a traditional Ethiopian dish made from minced raw beef, seasoned with mitmita (a spicy chili powder) and niter kibbeh (clarified butter). It\'s often served with ayib (fresh cheese) and cooked greens. This dish represents the rich culinary heritage of the Ethiopian highlands.',
        longDescription: 'Kitfo can be served raw (as traditional), leb leb (lightly cooked), or fully cooked. The meat is typically minced by hand and the quality of beef is crucial. It\'s rich in protein and traditionally eaten during holidays and celebrations. The dish is usually accompanied by ayib (a mild fresh cheese that balances the heat) and gomen (collard greens). The preparation of kitfo is considered an art form, requiring the perfect balance of spices and the freshest possible meat.',
        image: 'images/kitfo.jpg',
        origin: 'Gurage Region',
        spiceLevel: 'Very Hot',
        prepTime: '30 minutes',
        culturalSignificance: 'Kitfo holds special importance in Gurage culture and is often served during Meskel (Finding of the True Cross) and other celebrations.',
        funFact: 'The mitmita spice in kitfo is so potent that it\'s believed to have warming properties in the cool Ethiopian highlands!'
    }
};

// ===== DOM ELEMENT SELECTION =====
class FoodExplorer {
    constructor() {
        this.initializeDOMElements();
        this.attachEventListeners();
        this.currentFood = null;
        this.loading = false;
    }

    initializeDOMElements() {
        // Main elements
        this.foodSelect = document.getElementById('foodSelect');
        this.foodImage = document.getElementById('foodImage');
        this.foodTitle = document.getElementById('foodTitle');
        this.foodDescription = document.getElementById('foodDescription');
        
        // Buttons
        this.learnMoreBtn = document.getElementById('learnMoreBtn');
        this.favoriteBtn = document.getElementById('favoriteBtn');
        
        // Modal elements
        this.modal = document.getElementById('foodModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalText = document.getElementById('modalText');
        this.closeModal = document.querySelector('.close-modal');
        
        // Form elements
        this.feedbackForm = document.getElementById('feedbackForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.messageInput = document.getElementById('message');
        
        // Error elements
        this.nameError = document.getElementById('nameError');
        this.emailError = document.getElementById('emailError');
        this.messageError = document.getElementById('messageError');
    }

    attachEventListeners() {
        // Dropdown change
        this.foodSelect.addEventListener('change', (e) => this.handleFoodSelection(e));
        
        // Button clicks
        this.learnMoreBtn.addEventListener('click', () => this.showLearnMore());
        this.favoriteBtn.addEventListener('click', () => this.addToFavorites());
        
        // Modal close events
        this.closeModal.addEventListener('click', () => this.closeModalWindow());
        window.addEventListener('click', (e) => this.handleWindowClick(e));
        
        // Form submission
        this.feedbackForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Input validation on the fly
        this.nameInput.addEventListener('input', () => this.validateField('name'));
        this.emailInput.addEventListener('input', () => this.validateField('email'));
        this.messageInput.addEventListener('input', () => this.validateField('message'));
    }

    // ===== FOOD SELECTION HANDLER =====
    handleFoodSelection(event) {
        const selectedFoodId = event.target.value;
        
        if (!selectedFoodId) {
            this.resetDisplay();
            return;
        }

        this.currentFood = foodDatabase[selectedFoodId];
        
        if (this.currentFood) {
            this.updateFoodDisplay(this.currentFood);
            this.showNotification(`🍽️ You selected ${this.currentFood.name}!`, 'success');
        }
    }

    // ===== UPDATE DISPLAY =====
    updateFoodDisplay(food) {
        // Update text content
        this.foodTitle.textContent = food.title;
        this.foodDescription.textContent = food.description;
        
        // Create and load image
        this.loadFoodImage(food.image, food.name);
    }

    loadFoodImage(imagePath, foodName) {
        this.foodImage.innerHTML = ''; // Clear previous content
        
        // Show loading state
        const loader = this.createLoader();
        this.foodImage.appendChild(loader);
        
        const img = new Image();
        
        img.onload = () => {
            // Remove loader
            this.foodImage.innerHTML = '';
            
            // Style and append image
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.alt = `${foodName} - Traditional Ethiopian Dish`;
            img.title = foodName;
            
            // Add fade-in animation
            img.style.animation = 'fadeIn 0.5s ease';
            
            this.foodImage.appendChild(img);
        };
        
        img.onerror = () => {
            this.foodImage.innerHTML = '';
            this.foodImage.appendChild(this.createImagePlaceholder(foodName));
        };
        
        img.src = imagePath;
    }

    createLoader() {
        const loader = document.createElement('div');
        loader.className = 'image-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <p>Loading image...</p>
        `;
        return loader;
    }

    createImagePlaceholder(foodName) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = `
            <span class="placeholder-icon">🍽️</span>
            <p>${foodName} image coming soon!</p>
            <small>Please check back later</small>
        `;
        return placeholder;
    }

    // ===== RESET DISPLAY =====
    resetDisplay() {
        this.currentFood = null;
        this.foodTitle.textContent = 'Ethiopian Cuisine';
        this.foodDescription.textContent = 'Ethiopian cuisine is one of the most unique and flavorful in the world. Choose a dish from the dropdown above to learn more about its rich history and preparation.';
        
        this.foodImage.innerHTML = `
            <div class="image-placeholder">
                <span class="placeholder-icon">🇪🇹</span>
                <p>Select a dish to see its image</p>
            </div>
        `;
    }

    // ===== LEARN MORE FEATURE =====
    showLearnMore() {
        if (!this.currentFood) {
            this.showNotification('Please select a dish first!', 'warning');
            return;
        }

        // Populate modal with detailed information
        this.modalTitle.textContent = `📖 About ${this.currentFood.name}`;
        
        const modalContent = `
            <div class="food-details-modal">
                <p><strong>${this.currentFood.longDescription}</strong></p>
                
                <div class="food-specs">
                    <div class="spec-item">
                        <span class="spec-label">📍 Origin:</span>
                        <span class="spec-value">${this.currentFood.origin}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">🌶️ Spice Level:</span>
                        <span class="spec-value">${this.currentFood.spiceLevel}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">⏱️ Prep Time:</span>
                        <span class="spec-value">${this.currentFood.prepTime}</span>
                    </div>
                </div>
                
                <div class="cultural-significance">
                    <h4>✨ Cultural Significance</h4>
                    <p>${this.currentFood.culturalSignificance}</p>
                </div>
                
                <div class="fun-fact">
                    <h4>💡 Fun Fact</h4>
                    <p>${this.currentFood.funFact}</p>
                </div>
            </div>
        `;
        
        this.modalText.innerHTML = modalContent;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // ===== FAVORITE BUTTON FEATURE =====
    addToFavorites() {
        if (!this.currentFood) {
            this.showNotification('Please select a dish first!', 'warning');
            return;
        }

        // Create a more interactive favorite experience
        const favorites = this.getFavorites();
        
        if (!favorites.includes(this.currentFood.id)) {
            favorites.push(this.currentFood.id);
            localStorage.setItem('favoriteFoods', JSON.stringify(favorites));
            
            this.showNotification(
                `❤️ ${this.currentFood.name} added to favorites!`, 
                'success',
                () => {
                    // Optional callback after notification closes
                    console.log('Favorite added successfully');
                }
            );
            
            // Add animation to favorite button
            this.animateFavoriteButton();
        } else {
            this.showNotification(
                `${this.currentFood.name} is already in your favorites!`, 
                'info'
            );
        }
    }

    getFavorites() {
        const favorites = localStorage.getItem('favoriteFoods');
        return favorites ? JSON.parse(favorites) : [];
    }

    animateFavoriteButton() {
        this.favoriteBtn.style.transform = 'scale(1.1)';
        this.favoriteBtn.style.backgroundColor = '#FF1493';
        
        setTimeout(() => {
            this.favoriteBtn.style.transform = 'scale(1)';
            this.favoriteBtn.style.backgroundColor = '';
        }, 200);
    }

    // ===== CUSTOM NOTIFICATION SYSTEM =====
    showNotification(message, type = 'info', callback = null) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                           type === 'warning' ? '#ff9800' : '#2196F3';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.style.zIndex = '2000';
        notification.style.animation = 'slideIn 0.3s ease';
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.marginLeft = '10px';
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(notification);
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
                if (callback) callback();
            }
        }, 3000);
        
        document.body.appendChild(notification);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    }

    // ===== MODAL MANAGEMENT =====
    closeModalWindow() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    handleWindowClick(event) {
        if (event.target === this.modal) {
            this.closeModalWindow();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Escape' && this.modal.style.display === 'block') {
            this.closeModalWindow();
        }
    }

    // ===== FORM VALIDATION =====
    handleFormSubmit(event) {
        event.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }

    validateForm() {
        let isValid = true;
        
        // Validate each field
        if (!this.validateField('name')) isValid = false;
        if (!this.validateField('email')) isValid = false;
        if (!this.validateField('message')) isValid = false;
        
        return isValid;
    }

    validateField(fieldName) {
        let isValid = true;
        let errorMessage = '';
        
        switch(fieldName) {
            case 'name':
                const name = this.nameInput.value.trim();
                if (name === '') {
                    errorMessage = 'Please enter your name';
                    isValid = false;
                } else if (name.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                }
                this.nameError.textContent = errorMessage;
                break;
                
            case 'email':
                const email = this.emailInput.value.trim();
                if (email === '') {
                    errorMessage = 'Please enter your email';
                    isValid = false;
                } else if (!this.isValidEmail(email)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                this.emailError.textContent = errorMessage;
                break;
                
            case 'message':
                const message = this.messageInput.value.trim();
                if (message === '') {
                    errorMessage = 'Please enter your message';
                    isValid = false;
                } else if (message.length < 10) {
                    errorMessage = 'Message must be at least 10 characters long';
                    isValid = false;
                }
                this.messageError.textContent = errorMessage;
                break;
        }
        
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    submitForm() {
        // Get form data
        const formData = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim(),
            message: this.messageInput.value.trim(),
            timestamp: new Date().toISOString(),
            selectedDish: this.currentFood ? this.currentFood.name : 'None'
        };
        
        // In a real application, you would send this to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        this.showNotification(
            'Thank you for your feedback! 🇪🇹 We appreciate your interest in Ethiopian cuisine.',
            'success'
        );
        
        // Reset form
        this.feedbackForm.reset();
        
        // Clear error messages
        this.nameError.textContent = '';
        this.emailError.textContent = '';
        this.messageError.textContent = '';
        
        // You could also save to localStorage
        this.saveFeedbackToLocal(formData);
    }

    saveFeedbackToLocal(feedback) {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Create instance of FoodExplorer
    const foodExplorer = new FoodExplorer();
    
    // Add any additional initialization here
    console.log('🇪🇹 Ethiopian Food Explorer is ready!');
    
    // Check if there are any previously saved favorites
    const favorites = JSON.parse(localStorage.getItem('favoriteFoods') || '[]');
    if (favorites.length > 0) {
        console.log(`You have ${favorites.length} saved favorite(s)`);
    }
});

// ===== ADD SOME ADDITIONAL STYLES FOR NOTIFICATIONS AND LOADER =====
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .image-loader {
        text-align: center;
        padding: 50px;
    }
    
    .loader-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--ethiopian-green);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .food-details-modal {
        line-height: 1.8;
    }
    
    .food-specs {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
    }
    
    .spec-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #ddd;
    }
    
    .spec-item:last-child {
        border-bottom: none;
    }
    
    .spec-label {
        font-weight: bold;
        color: var(--ethiopian-brown);
    }
    
    .spec-value {
        color: var(--ethiopian-red);
    }
    
    .cultural-significance, .fun-fact {
        margin: 20px 0;
        padding: 15px;
        border-radius: 8px;
    }
    
    .cultural-significance {
        background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
        border-left: 4px solid var(--ethiopian-green);
    }
    
    .fun-fact {
        background: linear-gradient(135deg, #fff3e0, #ffe0b2);
        border-left: 4px solid var(--ethiopian-gold);
    }
    
    .cultural-significance h4, .fun-fact h4 {
        margin-bottom: 10px;
        color: var(--ethiopian-brown);
    }
    
    .notification {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(additionalStyles);