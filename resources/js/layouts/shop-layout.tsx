import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function ShopLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <nav className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-xl font-bold text-gray-900">
                                Shop
                            </Link>
                            <Link
                                href={route('shop.products')}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                Products
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('shop.cart')}
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Cart
                                    </Link>
                                    <Link
                                        href={route('shop.orders')}
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Orders
                                    </Link>
                                    <Link
                                        href={route('shop.account')}
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Account
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('shop.login')}
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('shop.register')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
            <main>{children}</main>
            <footer className="bg-white border-t mt-12">
                <div className="container mx-auto px-4 py-6 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Shop. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
