interface ProductVariant {
    options : []
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
    return (
        <div>
            <h1>Our Products</h1>
            {products?.length > 0 ? (
                <div>
                    {products.map((product) => (
                        <div key={product.id}>
                            <h3>{product.title || 'Product'}</h3>

                            {product.body_html && <div dangerouslySetInnerHTML={{ __html: product.body_html }} />}

                            {product.vendor && <p>By: {product.vendor}</p>}
                            {product.product_category && <p>Category: {product.product_category}</p>}

                            {product.variants?.length > 0 && (
                                <div>
                                    {product.variants.map((variant) => (
                                        <div key={variant.id}>
                                            <div>{variant.options}</div>
                                            {variant.price && (
                                                <div>
                                                    <span>${variant.price}</span>
                                                    {variant.compare_at_price && <span> (was ${variant.compare_at_price})</span>}
                                                </div>
                                            )}
                                            {variant.inventory_qty !== undefined && variant.inventory_qty > 0 ? <p>In Stock</p> : <p>Out of Stock</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button>Add to Cart</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
}

export default Products;
