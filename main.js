// Variable global para el carrito
let cart = [];

// Función global para eliminar items
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    window.updateCartUI();
}

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const cartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('total-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Event Listeners para abrir/cerrar carrito
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    function toggleCart() {
        cartDrawer.classList.toggle('open');
        cartOverlay.classList.toggle('active');
    }

    // Event Listeners para botones de compra
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            
            addToCart(id, name, price, e.target);
        });
    });

    // Función para añadir al carrito
    function addToCart(id, name, price, buttonElement) {
        const existingItem = cart.find(item => item.id === id);
        
        if(!cartDrawer.classList.contains('open')) {
            toggleCart();
        }

        if (existingItem) {
            showCartMessage("Este paquete ya está en tu carrito. Los planes son de pago único.", "error");
            return;
        }

        cart.push({ id, name, price });
        window.updateCartUI(); 
        
        // Efecto visual en el botón usando clase CSS
        const originalText = buttonElement.innerText;
        buttonElement.innerText = "Añadido";
        buttonElement.classList.add('btn-added'); 
        setTimeout(() => {
            buttonElement.innerText = originalText;
            buttonElement.classList.remove('btn-added');
        }, 1500);
    }

    // Función unificada para mostrar mensajes en el carrito
    function showCartMessage(message, type) {
        const existingMsg = document.getElementById('cart-dynamic-msg');
        if (existingMsg) existingMsg.remove();

        const msgElement = document.createElement('div');
        msgElement.id = 'cart-dynamic-msg';
        msgElement.classList.add('cart-msg');
        
        if (type === "error") {
            msgElement.classList.add('cart-msg-error');
        } else if (type === "success") {
            msgElement.classList.add('cart-msg-success');
        }
        
        msgElement.innerText = message;
        cartItemsContainer.appendChild(msgElement);

        setTimeout(() => {
            if (msgElement.parentNode) {
                msgElement.remove();
            }
        }, 4000);
    }

    // Renderizar UI del carrito
    window.updateCartUI = function() {
        cartCountElement.innerText = cart.length;
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            totalPriceElement.innerText = '0';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            total += item.price;
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            // Usamos toLocaleString('es-CO') para darle formato con puntos de miles
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price-text">$${item.price.toLocaleString('es-CO')} COP</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Eliminar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Aplicamos el mismo formato al total
        totalPriceElement.innerText = total.toLocaleString('es-CO');
    };

    // Lógica del botón Pagar
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showCartMessage("Tu carrito está vacío. Añade un paquete primero.", "error");
            } else {
                const totalStr = totalPriceElement.innerText;
                
                // Vaciamos el carrito visualmente
                cart = [];
                window.updateCartUI(); 
                
                // Ocultamos el texto por defecto de "carrito vacío" para que no estorbe el mensaje de éxito
                const emptyMsg = document.querySelector('.empty-cart-msg');
                if(emptyMsg) emptyMsg.style.display = 'none';

                // Mostramos el mensaje de éxito dentro del carrito
                showCartMessage(`Gracias por tu compra en Developer Dictionary.\nTotal pagado: $${totalStr} COP.`, "success");
                
                // Cerramos el menú automáticamente después de 4 segundos
                setTimeout(() => {
                    if(cartDrawer.classList.contains('open')) {
                        toggleCart();
                        // Restauramos el texto de carrito vacío para futuras aperturas
                        if(emptyMsg) emptyMsg.style.display = 'block'; 
                    }
                }, 4000);
            }
        });
    }
});