import ShopLayout from '@/layouts/shop-layout';
import { Head, Link } from '@inertiajs/react';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    status: string;
    total: number;
    created_at: string;
    items: OrderItem[];
}

interface OrdersProps {
    orders: Order[];
}

export default function Orders({ orders }: OrdersProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ShopLayout>
            <Head title="My Orders" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {orders?.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                                        <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        </p>
                                        <p className="text-lg font-bold">${parseFloat(String(order.total)).toFixed(2)}</p>
                                    </div>
                                    <Link
                                        href={`/order/${order.id}/confirmation`}
                                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-600 mb-4">You haven't placed any orders yet</p>
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
