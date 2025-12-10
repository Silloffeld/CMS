interface CartItem {
    product_id: number;
    product_name: string;
    options: any; // or define a specific type instead of JSON
    price: number;
}

interface CartProps {
    cart: CartItem[];
}

function Cart({ cart }: CartProps) {
    return (
        <ul>
            {cart?.length > 0 ? (
                cart.map((product) => (
                    <li key={product.product_id}>
                        <p>{product.product_name}</p>
                        <p>${product.price}</p>
                    </li>
                ))
            ) : (
                <div>
                    <p>Your cart is empty</p>
                    <button>Start Shopping</button>
                </div>
            )}
        </ul>
    );
}

export default Cart;
