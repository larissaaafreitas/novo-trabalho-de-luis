let currentUser = null;
let products = [];
let cart = [];
let selectedPayment = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadTheme();

}

function setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    const brandLink = document.getElementById('brand-link');
    const navSellerBtn = document.getElementById('nav-seller-btn');
    const navClientBtn = document.getElementById('nav-client-btn');
    const navLogoutBtn = document.getElementById('nav-logout-btn');
    const roleSellerBox = document.getElementById('role-seller');
    const roleClientBox = document.getElementById('role-client');
    const sellerLoginForm = document.getElementById('seller-login-form');
    const clientLoginForm = document.getElementById('client-login-form');
    const addProductForm = document.getElementById('add-product-form');
    const productImageInput = document.getElementById('product-image');
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeCheckout = document.getElementById('close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const closeSuccess = document.getElementById('close-success');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (brandLink) {
        brandLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRoleSelection();
        });
    }

    if (navSellerBtn) {
        navSellerBtn.addEventListener('click', function() {
            showSellerLogin();
        });
    }

    if (navClientBtn) {
        navClientBtn.addEventListener('click', function() {
            showClientLogin();
        });
    }

    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', logout);
    }

    if (roleSellerBox) {
        roleSellerBox.addEventListener('click', function() {
            showSellerLogin();
        });
    }

    if (roleClientBox) {
        roleClientBox.addEventListener('click', function() {
            showClientLogin();
        });
    }

    if (sellerLoginForm) {
        sellerLoginForm.addEventListener('submit', handleSellerLogin);
    }

    if (clientLoginForm) {
        clientLoginForm.addEventListener('submit', handleClientLogin);
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    if (productImageInput) {
        productImageInput.addEventListener('change', handleImagePreview);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckout);
    }

    if (closeCheckout) {
        closeCheckout.addEventListener('click', hideCheckout);
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    if (closeSuccess) {
        closeSuccess.addEventListener('click', hideSuccessNotification);
    }

    setupPaymentOptions();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('.material-icons');
    const text = themeToggle.querySelector('.theme-text');
    
    if (theme === 'light') {
        icon.textContent = 'dark_mode';
        text.textContent = 'Modo Escuro';
    } else {
        icon.textContent = 'light_mode';
        text.textContent = 'Modo Claro';
    }
}

function showSection(sectionId) {
    const sections = ['role-selection', 'seller-login', 'client-login', 'seller-dashboard', 'client-dashboard'];
    
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('hidden');
        }
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

function showRoleSelection() {
    currentUser = null;
    updateNavigation();
    showSection('role-selection');
}

function showSellerLogin() {
    showSection('seller-login');
    clearForm('seller-login-form');
}

function showClientLogin() {
    currentUser = { type: 'client', email: 'acesso_direto' };
    updateNavigation();
    showSection('client-dashboard');
    renderProducts();
    renderCart();
}

function updateNavigation() {
    const logoutBtn = document.getElementById('nav-logout-btn');
    
    if (currentUser) {
        logoutBtn.classList.remove('hidden');
    } else {
        logoutBtn.classList.add('hidden');
    }
}

function handleSellerLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = document.getElementById('seller-email').value;
    const password = document.getElementById('seller-password').value;
    
    if (!validateForm(form)) {
        return;
    }
    
    if (email === 'manuelasousa917@gmail.com' && password === 'digo0105') {
        currentUser = { type: 'seller', email: email };
        updateNavigation();
        showSection('seller-dashboard');
        hideError('seller-login-error');
        renderSellerProducts();
    } else {
        showError('seller-login-error', 'Email ou senha incorretos.');
    }
}

function handleClientLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = document.getElementById('client-email').value;
    const password = document.getElementById('client-password').value;
    
    if (!validateForm(form)) {
        return;
    }
    
    if (email === 'cliente@cantinho.com' && password === '123456') {
        currentUser = { type: 'client', email: email };
        updateNavigation();
        showSection('client-dashboard');
        hideError('client-login-error');
        renderProducts();
        renderCart();
    } else {
        showError('client-login-error', 'Email ou senha incorretos.');
    }
}

function logout() {
    currentUser = null;
    cart = [];
    updateNavigation();
    showRoleSelection();
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        let inputValid = true;
        
        if (!value) {
            inputValid = false;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            inputValid = emailRegex.test(value);
        } else if (input.type === 'password') {
            inputValid = value.length >= 6;
        } else if (input.type === 'number') {
            const num = parseFloat(value);
            inputValid = !isNaN(num) && num >= 0;
        } else if (input.type === 'tel') {
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            inputValid = phoneRegex.test(value) || value.length >= 10;
        }
        
        if (inputValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            isValid = false;
        }
    });
    
    return isValid;
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        const inputs = form.querySelectorAll('.form-control, .form-select');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const form = e.target;
    
    if (!validateForm(form)) {
        return;
    }
    
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value;
    const imageFile = document.getElementById('product-image').files[0];
    
    let imageUrl = 'https://via.placeholder.com/300x200?text=Produto';
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            addProductToList(name, price, category, stock, description, imageUrl);
        };
        reader.readAsDataURL(imageFile);
    } else {
        addProductToList(name, price, category, stock, description, imageUrl);
    }
}

function addProductToList(name, price, category, stock, description, imageUrl) {
    const product = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        stock: stock,
        description: description,
        image: imageUrl
    };
    
    products.push(product);
    renderSellerProducts();
    renderProducts();
    clearForm('add-product-form');
    clearImagePreview();
    
    showNotification('Produto adicionado com sucesso!', 'success');
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    const label = document.querySelector('.file-upload-label');
    const container = document.getElementById('image-preview-container');
    
    if (file) {
        label.textContent = file.name;
        label.classList.add('has-file');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            container.innerHTML = `<img src="${e.target.result}" alt="Preview" class="image-preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        clearImagePreview();
    }
}

function clearImagePreview() {
    const label = document.querySelector('.file-upload-label');
    const container = document.getElementById('image-preview-container');
    
    label.textContent = 'Clique para selecionar uma imagem';
    label.classList.remove('has-file');
    container.innerHTML = '';
}

function renderSellerProducts() {
    const container = document.getElementById('seller-products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum produto cadastrado ainda.</p>';
        return;
    }
    
    const html = products.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}" class="product-image-seller">
            <div class="product-item-details">
                <h4>${product.name}</h4>
                <p class="price-text">R$ ${product.price.toFixed(2)}</p>
                <small class="text-muted">Estoque: ${product.stock}</small>
            </div>
            <div class="product-item-actions">
                <button class="btn btn-sm btn-warning btn-custom" onclick="editProduct(${product.id})">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger btn-custom" onclick="deleteProduct(${product.id})">
                    Excluir
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function renderProducts() {
    const container = document.getElementById('products-grid');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">Nenhum produto disponível no momento.</p></div>';
        return;
    }
    
    const html = products.map(product => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="card-body p-3">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="price-text">R$ ${product.price.toFixed(2)}</p>
                    <p class="text-muted small">Estoque: ${product.stock}</p>
                    <button class="btn btn-primary btn-custom w-100" 
                            onclick="addToCart(${product.id})"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Sem Estoque' : 'Adicionar ao Carrinho'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Quantidade máxima em estoque atingida!', 'warning');
            return;
        }
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    renderCart();
    showNotification('Produto adicionado ao carrinho!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (item && product) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity <= product.stock) {
            item.quantity = newQuantity;
            renderCart();
        } else {
            showNotification('Quantidade máxima em estoque atingida!', 'warning');
        }
    }
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted">Seu carrinho está vazio</p>';
        totalElement.textContent = '0,00';
        checkoutBtn.disabled = true;
        return;
    }
    
    const html = cart.map(item => `
        <div class="cart-item">
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 12px;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="price-text mb-0">R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})">×</button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = total.toFixed(2).replace('.', ',');
    
    checkoutBtn.disabled = false;
}

function setupPaymentOptions() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedPayment = this.dataset.payment;
        });
    });
}

function showCheckout() {
    const modal = document.getElementById('checkout-modal');
    const totalElement = document.getElementById('checkout-total');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = total.toFixed(2).replace('.', ',');
    
    modal.classList.remove('hidden');
    clearForm('checkout-form');
    
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(opt => opt.classList.remove('selected'));
    selectedPayment = null;
}

function hideCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('hidden');
}

function handleCheckout(e) {
    e.preventDefault();
    
    const form = e.target;
    
    if (!validateForm(form)) {
        return;
    }
    
    if (!selectedPayment) {
        showNotification('Por favor, selecione uma forma de pagamento!', 'warning');
        return;
    }
    
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    });
    
    cart = [];
    renderCart();
    renderProducts();
    renderSellerProducts();
    
    hideCheckout();
    showSuccessNotification();
}

function showSuccessNotification() {
    const overlay = document.getElementById('success-overlay');
    const notification = document.getElementById('success-notification');
    
    overlay.classList.remove('hidden');
    notification.classList.remove('hidden');
}

function hideSuccessNotification() {
    const overlay = document.getElementById('success-overlay');
    const notification = document.getElementById('success-notification');
    
    overlay.classList.add('hidden');
    notification.classList.add('hidden');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-custom position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function editProduct(productId) {
    showNotification('Funcionalidade de edição em desenvolvimento!', 'info');
}

function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== productId);
        renderSellerProducts();
        renderProducts();
        showNotification('Produto excluído com sucesso!', 'success');
    }
}

function loadSampleProducts() {
    const sampleProducts = [
        {
            id: 1,
            name: 'Body Bebê Manga Longa',
            price: 29.90,
            category: 'roupas',
            stock: 15,
            description: 'Body confortável em algodão 100% para bebês de 0 a 12 meses.',
            image: 'https://via.placeholder.com/300x200?text=Body+Bebê'
        },
        {
            id: 2,
            name: 'Chupeta Ortodôntica',
            price: 12.50,
            category: 'acessorios',
            stock: 25,
            description: 'Chupeta ortodôntica em silicone, livre de BPA.',
            image: 'https://via.placeholder.com/300x200?text=Chupeta'
        },
        {
            id: 3,
            name: 'Ursinho de Pelúcia',
            price: 45.00,
            category: 'brinquedos',
            stock: 8,
            description: 'Ursinho de pelúcia macio e seguro para bebês.',
            image: 'https://via.placeholder.com/300x200?text=Ursinho'
        }
    ];
    
    products = sampleProducts;
}

