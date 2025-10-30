import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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

interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
}

interface CheckoutProps {
    cartItems: CartItem[];
    user: User;
}

export default function Checkout({ cartItems, user }: CheckoutProps) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_address: '',
        billing_address: '',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('shop.checkout.process'));
    };

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <>
            <Head title="Checkout" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="border rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Shipping Address *
                                        </label>
                                        <textarea
                                            value={data.shipping_address}
                                            onChange={(e) => setData('shipping_address', e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                            rows={3}
                                            required
                                        />
                                        {errors.shipping_address && (
                                            <p className="text-red-600 text-sm mt-1">{errors.shipping_address}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Billing Address (leave blank if same as shipping)
                                        </label>
                                        <textarea
                                            value={data.billing_address}
                                            onChange={(e) => setData('billing_address', e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                            rows={3}
                                        />
                                        {errors.billing_address && (
                                            <p className="text-red-600 text-sm mt-1">{errors.billing_address}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Order Notes</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                            rows={2}
                                            placeholder="Optional notes about your order"
                                        />
                                        {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {processing ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 shadow-sm sticky top-4">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div>
                                            {item.product.options && typeof item.product.options === 'object' && (
                                                <div className="text-xs text-gray-600">
                                                    {Object.entries(item.product.options)
                                                        .map(([key, value]) => `${key}: ${value}`)
                                                        .join(', ')}
                                                </div>
                                            )}
                                            <span>Qty: {item.quantity}</span>
                                        </div>
                                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
