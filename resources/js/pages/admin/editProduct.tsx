"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, useForm } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface ProductVariant {
    id: number
    sku?: string
    option1_name?: string
    option1_value?: string
    option2_name?: string
    option2_value?: string
    option3_name?: string
    option3_value?: string
    price?: string
    [key: string]: any
}

interface ProductData {
    id: number
    handle?: string
    title?: string
    body_html?: string
    vendor?: string
    product_category?: string
    type?: string
    tags?: string
    published?: string
    gift_card?: string
    seo_title?: string
    seo_description?: string
    status?: string
    variants?: ProductVariant[]
}

interface ProductEditProps {
    product: ProductData
}

export default function EditProduct({ product }: ProductEditProps) {

    const { props } = usePage();
    const successMessage = props.flash?.success;

    const { data, setData, post, processing, errors } = useForm({
        handle: product.handle || "",
        title: product.title || "",
        body_html: product.body_html || "",
        vendor: product.vendor || "",
        product_category: product.product_category || "",
        type: product.type || "",
        tags: product.tags || "",
        published: product.published || 0,
        gift_card: product.gift_card || "",
        seo_title: product.seo_title || "",
        seo_description: product.seo_description || "",
        status: product.status || "",
        variants: product.variants
            ? product.variants.map(v => ({
                id: v.id,
                sku: v.sku || "",
                option1_name: v.option1_name || "",
                option1_value: v.option1_value || "",
                option2_name: v.option2_name || "",
                option2_value: v.option2_value || "",
                option3_name: v.option3_name || "",
                option3_value: v.option3_value || "",
                price: v.price || "",
            }))
            : [],
    });

    function addVariant() {
        setData("variants", [
            ...(data.variants as ProductVariant[]),
            {
                sku: "",
                option1_name: "",
                option1_value: "",
                option2_name: "",
                option2_value: "",
                option3_name: "",
                option3_value: "",
                price: "",
            },
        ]);
    }

    function removeVariant(idx: number) {
        setData("variants", (data.variants as ProductVariant[]).filter((_, i) => i !== idx));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setData(e.target.name as keyof typeof data, e.target.value)
    }

    function handleVariantChange(
        idx: number,
        field: keyof ProductVariant,
        value: string
    ) {
        setData("variants", [
            ...(data.variants as ProductVariant[]).map((variant, vIdx) =>
                vIdx === idx
                    ? { ...variant, [field]: value }
                    : variant
            ),
        ]);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        post(route("admin.editProduct", product.id))
    }


    return (
        <AppLayout>
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Product: {product.title || "Untitled"}</CardTitle>
                    <CardDescription>
                        Update product information. Changes will be saved immediately upon clicking save.
                    </CardDescription>
                    <div className="mt-4">
                        <Link href={route("admin.manage")} className="text-sm underline text-muted-foreground">
                            ← Back to Product Management
                        </Link>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1">Handle</label>
                            <Input name="handle" value={data.handle} onChange={handleChange} />
                            {errors.handle && <div className="text-destructive text-xs">{errors.handle}</div>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Title</label>
                            <Input name="title" value={data.title} onChange={handleChange} />
                            {errors.title && <div className="text-destructive text-xs">{errors.title}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium mb-1">Body HTML</label>
                            <textarea
                                name="body_html"
                                value={data.body_html}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1 text-sm min-h-[60px]"
                            />
                            {errors.body_html && <div className="text-destructive text-xs">{errors.body_html}</div>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Vendor</label>
                            <Input name="vendor" value={data.vendor} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Product Category</label>
                            <Input name="product_category" value={data.product_category} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Type</label>
                            <Input name="type" value={data.type} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Tags</label>
                            <Input name="tags" value={data.tags} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Published</label>
                            <input
                                type="checkbox"
                                name="published"
                                checked={!!data.published}
                                onChange={e => setData('published', e.target.checked ? 1 : 0)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Gift Card</label>
                            <Input name="gift_card" value={data.gift_card}  onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">SEO Title</label>
                            <Input name="seo_title" value={data.seo_title} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">SEO Description</label>
                            <Input name="seo_description" value={data.seo_description} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Status</label>
                            <Input name="status" value={data.status} onChange={handleChange} />
                        </div>
                        <div className="mt-5 flex justify-center">
                            <Button type="submit" disabled={processing} className={"p-5 font-bold text-lg text-black"}>
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>

                    {/* Editable Variants Table */}
                    <CardHeader>
                        <CardTitle className="text-base mt-6">Variants</CardTitle>
                        <CardDescription>Edit variants below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Option1 Name</TableHead>
                                        <TableHead>Option1 Value</TableHead>
                                        <TableHead>Option2 Name</TableHead>
                                        <TableHead>Option2 Value</TableHead>
                                        <TableHead>Option3 Name</TableHead>
                                        <TableHead>Option3 Value</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(data.variants && data.variants.length > 0) ? (
                                        data.variants.map((variant: ProductVariant, idx: number) => (
                                            <TableRow key={variant.id}>
                                                <TableCell>
                                                    <Input
                                                        value={variant.sku || ""}
                                                        onChange={e =>
                                                            handleVariantChange(idx, "sku", e.target.value)
                                                        }
                                                        className="min-w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option1_name || ""}
                                                        onChange={e =>
                                                            handleVariantChange(idx, "option1_name", e.target.value)
                                                        }
                                                        className="min-w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option1_value || ""}
                                                        onChange={e =>
                                                            handleVariantChange(idx, "option1_value", e.target.value)
                                                        }
                                                        className="min-w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option2_name || ""}
                                                        onChange={e =>
                                                            handleVariantChange(idx, "option2_name", e.target.value)
                                                        }
                                                        className="min-w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option2_value || ""}
                                                        onChange={e =>
                                                            handleVariantChange(idx, "option2_value", e.target.value)
                                                        }
                                                        className="min-w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option3_name || ""}
                                                        onChange={e =>
                                                            handleVariantChange(idx, "option3_name", e.target.value)
                                                        }
                                                        className="min-w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option3_value || ""}
                                                        onChange={e =>
                                                            handleVariantChange(idx, "option3_value", e.target.value)
                                                        }
                                                        className="min-w-[100px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.price || ""}
                                                        onChange={e =>
                                                            handleVariantChange(idx, "price", e.target.value)
                                                        }
                                                        className="min-w-[70px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => removeVariant(idx)}
                                                        disabled={data.variants.length === 1}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">
                                                No variants
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <div className="flex justify-center mt-4">
                                <Button type="button" onClick={addVariant} variant="secondary">
                                    Add Variant
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </form>
                {successMessage && (
                    <div className="flex text-green-700 ">
                        {successMessage}
                    </div>
                )}
            </Card>
        </AppLayout>
    )
}
