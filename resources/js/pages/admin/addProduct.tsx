"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, useForm } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout';

interface ProductVariant {
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

export default function AddProduct() {
    const { data, setData, post, processing, errors } = useForm({
        handle: "",
        title: "",
        body_html: "",
        vendor: "",
        product_category: "",
        type: "",
        tags: "",
        published: "",
        gift_card: "",
        seo_title: "",
        seo_description: "",
        status: "",
        variants: [
            {
                sku: "",
                option1_name: "",
                option1_value: "",
                option2_name: "",
                option2_value: "",
                option3_name: "",
                option3_value: "",
                price: "",
            }
        ],
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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        post(route("admin.addProduct")) // make sure this route exists in your routes/web.php
    }

    return (
        <AppLayout>
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                    <CardDescription>
                        Fill in the product information and variants, then click "Create Product".
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
                            <Input name="handle" value={data.handle} onChange={handleChange} placeholder="product-handle" />
                            {errors.handle && <div className="text-destructive text-xs">{errors.handle}</div>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Title</label>
                            <Input name="title" value={data.title} onChange={handleChange} placeholder="Product title" />
                            {errors.title && <div className="text-destructive text-xs">{errors.title}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium mb-1">Body HTML</label>
                            <textarea
                                name="body_html"
                                value={data.body_html}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1 text-sm min-h-[60px]"
                                placeholder="Product description"
                            />
                            {errors.body_html && <div className="text-destructive text-xs">{errors.body_html}</div>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Vendor</label>
                            <Input name="vendor" value={data.vendor} onChange={handleChange} placeholder="Vendor" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Product Category</label>
                            <Input name="product_category" value={data.product_category} onChange={handleChange} placeholder="Category" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Type</label>
                            <Input name="type" value={data.type} onChange={handleChange} placeholder="Type" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Tags</label>
                            <Input name="tags" value={data.tags} onChange={handleChange} placeholder="Comma separated tags" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Published (0 is nee - 1 is ja)</label>
                            <Input name="published" value={data.published} onChange={handleChange} placeholder="0 or 1" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Gift Card</label>
                            <Input name="gift_card" value={data.gift_card} onChange={handleChange} placeholder="Yes/No" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">SEO Title</label>
                            <Input name="seo_title" value={data.seo_title} onChange={handleChange} placeholder="SEO Title" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">SEO Description</label>
                            <Input name="seo_description" value={data.seo_description} onChange={handleChange} placeholder="SEO Description" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Status</label>
                            <Input name="status" value={data.status} onChange={handleChange} placeholder="active/draft" />
                        </div>
                        <div className="mt-5 flex justify-center">
                            <Button type="submit" disabled={processing} className={"p-5 font-bold text-lg text-black"}>
                                Create Product
                            </Button>
                        </div>
                    </CardContent>

                    {/* Editable Variants Table */}
                    <CardHeader>
                        <CardTitle className="text-base mt-6">Variants</CardTitle>
                        <CardDescription>Add one or more product variants</CardDescription>
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
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(data.variants && data.variants.length > 0) ? (
                                        data.variants.map((variant: ProductVariant, idx: number) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Input
                                                        value={variant.sku || ""}
                                                        onChange={e => handleVariantChange(idx, "sku", e.target.value)}
                                                        className="min-w-[100px]"
                                                        placeholder="SKU"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option1_name || ""}
                                                        onChange={e => handleVariantChange(idx, "option1_name", e.target.value)}
                                                        className="min-w-[100px]"
                                                        placeholder="Option1 Name"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option1_value || ""}
                                                        onChange={e => handleVariantChange(idx, "option1_value", e.target.value)}
                                                        className="min-w-[100px]"
                                                        placeholder="Option1 Value"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option2_name || ""}
                                                        onChange={e => handleVariantChange(idx, "option2_name", e.target.value)}
                                                        className="min-w-[100px]"
                                                        placeholder="Option2 Name"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option2_value || ""}
                                                        onChange={e => handleVariantChange(idx, "option2_value", e.target.value)}
                                                        className="min-w-[100px]"
                                                        placeholder="Option2 Value"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option3_name || ""}
                                                        onChange={e => handleVariantChange(idx, "option3_name", e.target.value)}
                                                        className="min-w-[100px]"
                                                        placeholder="Option3 Name"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.option3_value || ""}
                                                        onChange={e => handleVariantChange(idx, "option3_value", e.target.value)}
                                                        className="min-w-[100px]"
                                                        placeholder="Option3 Value"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={variant.price || ""}
                                                        onChange={e => handleVariantChange(idx, "price", e.target.value)}
                                                        className="min-w-[70px]"
                                                        placeholder="Price"
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
                                            <TableCell colSpan={9} className="text-center">
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
            </Card>
        </AppLayout>
    )
}
