document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const savedOrders = JSON.parse(localStorage.getItem('savedOrders')) || [];
    const cartTableBody = document.querySelector('#cart-table tbody');
    const totalPriceElement = document.getElementById('total-price');
    const favoritesTableBody = document.querySelector('#favorites-table tbody');
    const favoritesModal = document.getElementById('favorites-modal');
    const closeModal = document.querySelector('.modal .close');
    const addToFavoritesButton = document.getElementById('add-to-favorites');
    const showFavoritesButton = document.getElementById('show-favorites');
    const applyFavoritesButton = document.getElementById('apply-favorites');
    const clearFavoritesButton = document.getElementById('clear-favorites');
    const modalOverlay = document.querySelector('.modal-overlay');
    const buyNowButton = document.getElementById('buy-now');

    // Function to update the cart table
    function updateCartTable() {
        cartTableBody.innerHTML = '';
        let total = 0;
        cart.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>
                    <button class="decrease-qty" data-name="${item.name}">-</button>
                    ${item.quantity} ${item.unit}
                    <button class="increase-qty" data-name="${item.name}">+</button>
                </td>
                <td>LKR ${item.price.toFixed(2)}</td>
                <td>LKR ${item.totalPrice.toFixed(2)}</td>
                <td><button class="remove-item" data-name="${item.name}">Remove</button></td>
            `;
            cartTableBody.appendChild(row);
            total += item.totalPrice;
        });
        totalPriceElement.textContent = `LKR ${total.toFixed(2)}`;
    }

    // Function to update the favorites table
    function updateFavoritesTable() {
        favoritesTableBody.innerHTML = '';
        favorites.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity} ${item.unit}</td>
                <td>LKR ${item.price.toFixed(2)}</td>
                <td>LKR ${item.totalPrice.toFixed(2)}</td>
                <td><button class="remove-favorite" data-name="${item.name}">Remove</button></td>
            `;
            favoritesTableBody.appendChild(row);
        });
    }

    // Function to add item to the cart
    function addToCart(event) {
        const productItem = event.target.closest('.product-item');
        const name = productItem.querySelector('h4').textContent;
        const priceText = productItem.querySelector('p:nth-of-type(2)').textContent;
        const price = parseFloat(priceText.split('LKR.')[1]);
        const quantityInput = productItem.querySelector('input[type="number"]');
        const quantity = parseFloat(quantityInput.value);
        const unit = quantityInput.placeholder.includes('kg') ? 'kg' : 'unit';

        if (!isNaN(quantity) && quantity > 0) {
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
                alert('Item already in cart, quantity updated.');
            } else {
                const totalPrice = price * quantity;
                cart.push({ name, price, quantity, totalPrice, unit });
                alert('Item added to cart.');
            }
            updateCartTable();
            saveOrder(); // Save the order after updating the cart
            quantityInput.value = '';
        } else {
            alert('Please enter a valid quantity');
        }
    }

   
    // Function to remove item from the cart
    function removeFromCart(name) {
        const index = cart.findIndex(item => item.name === name);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCartTable();
            saveOrder(); // Save the order after updating the cart
        }
    }

    // Function to increase item quantity
    function increaseQuantity(name) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += 1;
            item.totalPrice = item.price * item.quantity;
            updateCartTable();
            saveOrder(); // Save the order after updating the cart
        }
    }

    // Function to decrease item quantity
    function decreaseQuantity(name) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                removeFromCart(name);
            } else {
                item.totalPrice = item.price * item.quantity;
                updateCartTable();
                saveOrder(); // Save the order after updating the cart
            }
        }
    }

    // Function to add items to favorites
    function addToFavorites() {
        localStorage.setItem('favorites', JSON.stringify(cart));
        alert('Cart items added to favorites.');
        updateFavoritesArray();
    }

    // Function to update the favorites array from localStorage
    function updateFavoritesArray() {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.splice(0, favorites.length, ...storedFavorites);
        updateFavoritesTable();
    }

    // Function to show favorites modal
    function showFavorites() {
        updateFavoritesArray();
        favoritesModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    // Function to hide favorites modal
    function hideFavorites() {
        favoritesModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    // Function to apply favorites to the cart
    function applyFavorites() {
        cart.splice(0, cart.length, ...favorites);
        updateCartTable();
        saveOrder(); // Save the order after applying favorites
    }

    // Function to clear all favorites
    function clearFavorites() {
        localStorage.removeItem('favorites');
        favorites.length = 0;
        updateFavoritesTable();
    }

    // Function to remove an item from favorites
    function removeFavorite(name) {
        const index = favorites.findIndex(item => item.name === name);
        if (index !== -1) {
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateFavoritesTable();
        }
    }

    // Function to save total price and redirect to details page
    function proceedToDetailsPage() {
        localStorage.setItem('orderTotal', totalPriceElement.textContent);
        saveOrder(); // Save the order before redirecting
        window.location.href = 'details.html'; // Adjust the path if necessary
    }

    // Function to save the current order
    function saveOrder() {
        const currentOrder = { items: [...cart], total: totalPriceElement.textContent, date: new Date().toLocaleString() };
        savedOrders.push(currentOrder);
        localStorage.setItem('savedOrders', JSON.stringify(savedOrders));
        console.log('Order saved successfully.');
    }

    // Event listener for adding items to the cart
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Event delegation for cart actions
    cartTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const name = event.target.getAttribute('data-name');
            removeFromCart(name);
        } else if (event.target.classList.contains('increase-qty')) {
            const name = event.target.getAttribute('data-name');
            increaseQuantity(name);
        } else if (event.target.classList.contains('decrease-qty')) {
            const name = event.target.getAttribute('data-name');
            decreaseQuantity(name);
        }
    });

    // Event listeners for favorites actions
    addToFavoritesButton.addEventListener('click', addToFavorites);
    showFavoritesButton.addEventListener('click', showFavorites);
    applyFavoritesButton.addEventListener('click', applyFavorites);
    clearFavoritesButton.addEventListener('click', clearFavorites);

    // Event listeners for modal
    closeModal.addEventListener('click', hideFavorites);
    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            hideFavorites();
        }
    });

    // Event listener for buy now button
    buyNowButton.addEventListener('click', proceedToDetailsPage);

    // Event listener for checkout form submission
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Order placed successfully!');
        localStorage.removeItem('orderTotal');
        localStorage.removeItem('savedOrders');
        window.location.href = 'index.html'; // Redirect to the homepage or another appropriate page
    });

    // Display order summary on the details page
    displayOrderSummary();
});