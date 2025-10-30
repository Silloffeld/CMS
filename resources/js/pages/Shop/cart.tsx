import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';

interface ProductVariant {
    id: number;
    price: number;
    options?: Record<string, any>;
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: ProductVariant;
}

interface CartProps {
    cart: CartItem[];
}

function Cart({ cart }: CartProps) {
    const [updating, setUpdating] = useState<number | null>(null);

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) return;
        setUpdating(itemId);
        router.put(
            `/cart/${itemId}`,
            { quantity },
            {
                onFinish: () => setUpdating(null),
                preserveScroll: true,
            }
        );
    };

    const removeItem = (itemId: number) => {
        if (confirm('Are you sure you want to remove this item?')) {
            setUpdating(itemId);
            router.delete(`/cart/${itemId}`, {
                onFinish: () => setUpdating(null),
                preserveScroll: true,
            });
        }
    };

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <ShopLayout>
            <Head title="Shopping Cart" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            {cart?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4 shadow-sm flex items-center gap-4">
                                    <div className="flex-1">
                                        {item.product.options && typeof item.product.options === 'object' && (
                                            <div className="text-sm mb-2">
                                                {Object.entries(item.product.options).map(([key, value]) => (
                                                    <span key={key} className="mr-2">
                                                        <strong>{key}:</strong> {String(value)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-lg font-semibold">${item.product.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={updating === item.id || item.quantity <= 1}
                                            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 border rounded">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={updating === item.id}
                                            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            disabled={updating === item.id}
                                            className="text-red-600 text-sm hover:underline disabled:opacity-50"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 shadow-sm sticky top-4">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                className="block w-full py-3 bg-blue-600 text-white text-center rounded hover:bg-blue-700"
                            >
                                Proceed to Checkout
                            </Link>
                            <Link
                                href="/products"
                                className="block w-full py-3 mt-2 border border-blue-600 text-blue-600 text-center rounded hover:bg-blue-50"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                    <Link
                        href="/products"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
            </div>
        </ShopLayout>
    );
}

export default Cart;
