import React from 'react';
function Cart(cart) {
    return (
        { cart.map((product) => (
            <li key={product.id}>
            <p>{product.name}</p>
            <p>{product.price}</p>
            </li>

            )) }
    );
}

export default Cart;
