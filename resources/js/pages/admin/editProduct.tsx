"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, useForm } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout';

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

export default function editProduct({ product }: ProductEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        handle: product.handle || "",
        title: product.title || "",
        body_html: product.body_html || "",
        vendor: product.vendor || "",
        product_category: product.product_category || "",
        type: product.type || "",
        tags: product.tags || "",
        published: product.published || "",
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
                            <Input name="published" value={data.published} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Gift Card</label>
                            <Input name="gift_card" value={data.gift_card} onChange={handleChange} />
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
                        <div className="md:col-span-2 flex justify-end">
                            <Button type="submit" disabled={processing}>
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
                        <div className="flex flex-wrap gap-4">
                            {(data.variants && data.variants.length > 0) ? (
                                data.variants.map((variant: ProductVariant, idx: number) => (
                                    <div
                                        key={variant.id}
                                        className="bg-muted border rounded p-4 flex flex-col gap-2 flex-1 min-w-[300px] max-w-xs"
                                        style={{ flexBasis: "320px" }}
                                    >
                                        <div>
                                            <label className="block text-xs font-medium mb-1">SKU</label>
                                            <Input
                                                value={variant.sku || ""}
                                                onChange={e => handleVariantChange(idx, "sku", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Option1 Name</label>
                                            <Input
                                                value={variant.option1_name || ""}
                                                onChange={e => handleVariantChange(idx, "option1_name", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Option1 Value</label>
                                            <Input
                                                value={variant.option1_value || ""}
                                                onChange={e => handleVariantChange(idx, "option1_value", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Option2 Name</label>
                                            <Input
                                                value={variant.option2_name || ""}
                                                onChange={e => handleVariantChange(idx, "option2_name", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Option2 Value</label>
                                            <Input
                                                value={variant.option2_value || ""}
                                                onChange={e => handleVariantChange(idx, "option2_value", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Option3 Name</label>
                                            <Input
                                                value={variant.option3_name || ""}
                                                onChange={e => handleVariantChange(idx, "option3_name", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Option3 Value</label>
                                            <Input
                                                value={variant.option3_value || ""}
                                                onChange={e => handleVariantChange(idx, "option3_value", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Price</label>
                                            <Input
                                                value={variant.price || ""}
                                                onChange={e => handleVariantChange(idx, "price", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center w-full">No variants</div>
                            )}
                        </div>
                    </CardContent>
                </form>
            </Card>
        </AppLayout>
    )
}
