let carritoDeCompras = [];

const botonesAñadir = document.querySelectorAll('.botonesTarjetas');
const iconoCarrito = document.getElementById('contenedorCarritoIcono');
const menuCarrito = document.getElementById('menuCarrito');
const listaProductosCarrito = document.getElementById('listaProductosCarrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const totalCarritoElemento = document.getElementById('totalCarrito');

iconoCarrito.addEventListener('click', () => {
    menuCarrito.classList.toggle('mostrar');
});

botonesAñadir.forEach((boton) => {
    // Evitamos que el botón de "Proceder al Pago" active esta lógica
    if(boton.id === 'btnPagar') return; 

    boton.addEventListener('click', (evento) => {
        const tarjeta = evento.target.parentElement;
        const titulo = tarjeta.querySelector('.tituloTarjetas').innerText;
        const precioTexto = tarjeta.querySelector('.valorSuscripcionTarjetas').innerText;
        
        // Limpiamos el texto del precio para poder sumarlo matemáticamente
        // Quita todo lo que no sea un número (ej. "$9.999 COP" -> 9999)
        const precioNumerico = parseInt(precioTexto.replace(/[^0-9]/g, ''));
        const yaExiste = carritoDeCompras.some(producto => producto.nombre === titulo);

        if (yaExiste) {
            alert("Este paquete de terminología ya se encuentra en su carrito. Es una compra de pago único.");
            return; 
        }

        const nuevoProducto = {
            nombre: titulo,
            precio: precioNumerico,
            precioOriginal: precioTexto 
        };

        carritoDeCompras.push(nuevoProducto);
        actualizarInterfaz();
    });
});

function actualizarInterfaz() {
    
    contadorCarrito.innerText = carritoDeCompras.length;
    listaProductosCarrito.innerHTML = '';
    let totalMatematico = 0;

    carritoDeCompras.forEach((producto, indice) => {
        totalMatematico += producto.precio;

        const elementoDIV = document.createElement('div');
        elementoDIV.classList.add('item-carrito');
    
        elementoDIV.innerHTML = `
            <span style="flex: 1;">${producto.nombre}</span>
            <span style="margin: 0 10px; color: rgb(0, 217, 255);">${producto.precioOriginal}</span>
            <button class="btn-eliminar" onclick="eliminarProducto(${indice})">X</button>
        `;

        listaProductosCarrito.appendChild(elementoDIV);
    });

    totalCarritoElemento.innerText = "$" + totalMatematico.toLocaleString('es-CO') + " COP";
}

window.eliminarProducto = function(indice) {
    carritoDeCompras.splice(indice, 1);
    actualizarInterfaz();
};