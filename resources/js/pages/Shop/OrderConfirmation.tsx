import ShopLayout from '@/layouts/shop-layout';
import { Head, Link } from '@inertiajs/react';

interface ProductVariant {
    id: number;
    product_id: number;
    price: number;
    options?: Record<string, any>;
    product?: {
        id: number;
        title: string;
    };
}

interface OrderItem {
    id: number;
    product_variant_id: number;
    quantity: number;
    price: number;
    options?: Record<string, any>;
    productVariant?: ProductVariant;
}

interface Order {
    id: number;
    customer_id: number;
    status: string;
    total: number;
    shipping_address: string;
    billing_address: string;
    notes?: string;
    created_at: string;
    items: OrderItem[];
}

interface OrderConfirmationProps {
    order: Order;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
    return (
        <ShopLayout>
            <Head title="Order Confirmation" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="text-green-600 mb-4">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600">Thank you for your order</p>
                        <p className="text-sm text-gray-500 mt-2">Order #{order.id}</p>
                    </div>

                    <div className="border rounded-lg p-6 shadow-sm mb-6">
                        <h2 className="text-xl font-bold mb-4">Order Details</h2>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between border-b pb-3">
                                    <div>
                                        {item.productVariant?.product?.title && (
                                            <p className="font-medium">{item.productVariant.product.title}</p>
                                        )}
                                        {item.options && typeof item.options === 'object' && (
                                            <p className="text-sm text-gray-600">
                                                {Object.entries(item.options)
                                                    .map(([key, value]) => `${key}: ${value}`)
                                                    .join(', ')}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                            <span>Total</span>
                            <span>${parseFloat(String(order.total)).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 shadow-sm mb-6">
                        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                        <div className="text-gray-700 whitespace-pre-line">{order.shipping_address}</div>
                    </div>

                    {order.notes && (
                        <div className="border rounded-lg p-6 shadow-sm mb-6">
                            <h2 className="text-xl font-bold mb-4">Order Notes</h2>
                            <p className="text-gray-700">{order.notes}</p>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Link
                            href="/orders"
                            className="flex-1 py-3 bg-blue-600 text-white text-center rounded hover:bg-blue-700"
                        >
                            View All Orders
                        </Link>
                        <Link
                            href="/products"
                            className="flex-1 py-3 border border-blue-600 text-blue-600 text-center rounded hover:bg-blue-50"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
