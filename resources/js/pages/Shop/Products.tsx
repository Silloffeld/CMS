import ShopLayout from '@/layouts/shop-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface ProductVariant {
    options?: Record<string, any>;
    id: number;
    price?: number;
    compare_at_price?: number;
    inventory_qty?: number;
    sku?: string;
}

interface IndivProducts {
    id: number;
    title?: string;
    body_html?: string;
    vendor?: string;
    product_category?: string;
    variants: ProductVariant[];
}

interface ProductProps {
    products: IndivProducts[];
}

function Products({ products }: ProductProps) {
    const [adding, setAdding] = useState<number | null>(null);

    const addToCart = (variantId: number) => {
        setAdding(variantId);
        router.post(
            '/cart/add',
            { product_id: variantId, quantity: 1 },
            {
                onFinish: () => setAdding(null),
                preserveScroll: true,
            }
        );
    };

    return (
        <ShopLayout>
            <Head title="Products" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Our Products</h1>
            {products?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-semibold mb-2">{product.title || 'Product'}</h3>

                            {product.body_html && (
                                <div
                                    className="text-sm text-gray-600 mb-4"
                                    dangerouslySetInnerHTML={{ __html: product.body_html }}
                                />
                            )}

                            {product.vendor && <p className="text-sm text-gray-500 mb-1">By: {product.vendor}</p>}
                            {product.product_category && (
                                <p className="text-sm text-gray-500 mb-4">Category: {product.product_category}</p>
                            )}

                            {product.variants?.length > 0 && (
                                <div className="space-y-3">
                                    {product.variants.map((variant) => (
                                        <div key={variant.id} className="border-t pt-3">
                                            {variant.options && typeof variant.options === 'object' && (
                                                <div className="text-sm mb-2">
                                                    {Object.entries(variant.options).map(([key, value]) => (
                                                        <span key={key} className="mr-2">
                                                            <strong>{key}:</strong> {String(value)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {variant.price && (
                                                <div className="mb-2">
                                                    <span className="text-lg font-bold">${variant.price}</span>
                                                    {variant.compare_at_price && (
                                                        <span className="text-sm text-gray-500 line-through ml-2">
                                                            ${variant.compare_at_price}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                {variant.inventory_qty !== undefined && variant.inventory_qty > 0 ? (
                                                    <p className="text-sm text-green-600">In Stock</p>
                                                ) : (
                                                    <p className="text-sm text-red-600">Out of Stock</p>
                                                )}
                                                <button
                                                    onClick={() => addToCart(variant.id)}
                                                    disabled={
                                                        adding === variant.id ||
                                                        (variant.inventory_qty !== undefined && variant.inventory_qty <= 0)
                                                    }
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    {adding === variant.id ? 'Adding...' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                    <p className="text-gray-600 text-center">No products available</p>
                )}
            </div>
        </ShopLayout>
    );
}

export default Products;
