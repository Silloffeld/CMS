"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, useForm } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout';
import {Trash2} from "lucide-react"

interface ProductVariant {
    variantName?: string
    options: VariantOption[]
    price?: string
    [key: string]: any
}
interface VariantOption {
    name: string;
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
                variantName: "",
                options: [],
                price: "",
            }
        ],
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setData(e.target.name as keyof typeof data, e.target.value)
    }
    function handleOptionChange(
        variantIdx: number,
        optionIdx: number,
        field: keyof VariantOption,
        value: string
    ) {
        setData("variants", [
            ...(data.variants as ProductVariant[]).map((variant, vIdx) =>
                vIdx === variantIdx
                    ? {
                        ...variant,
                        options: variant.options.map((option, oIdx) =>
                            oIdx === optionIdx
                                ? { ...option, [field]: value }
                                : option
                        )
                    }
                    : variant
            ),
        ]);
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
                variantName: "",
                options: [],
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
                            <Button type={'submit'} disabled={processing} className={"p-5 font-bold text-lg text-black"}>
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
                                        <TableHead>variant name</TableHead>
                                        <TableHead>Options</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.variants && data.variants.length > 0 ? (
                                        data.variants.map((variant: ProductVariant, idx: number) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Input
                                                        value={variant.variantName || ""}
                                                        onChange={e => handleVariantChange(idx, "variantName", e.target.value)}
                                                        className="min-w-[100px]"
                                                        placeholder="variant name"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {variant.options.map((option, optIdx) => (
                                                        <div key={optIdx} className="flex flex-wrap gap-2 mb-2">
                                                            <Input
                                                                value={option.name}
                                                                onChange={e => handleOptionChange(idx, optIdx, "name", e.target.value)}
                                                                placeholder="Option Name"
                                                                className={"flex-1 "}
                                                            />
                                                                <button type={'button'}
                                                                    onClick={() => {
                                                                        const updatedVariants = [...data.variants];
                                                                        updatedVariants[idx].options = updatedVariants[idx].options.filter((_, i) => i !== optIdx);
                                                                        setData("variants", updatedVariants);
                                                                    }}
                                                                    disabled={variant.options.length === 1}
                                                                >
                                                                    <Trash2 className={'w-5 text-red-700'}/>
                                                                </button>
                                                        </div>

                                                    ))}
                                                    <button type={'button'}
                                                        onClick={() => {
                                                            const updatedVariants = [...data.variants];
                                                            updatedVariants[idx].options.push({ name: ""});
                                                            setData("variants", updatedVariants);
                                                        }}
                                                    >
                                                        Add Option
                                                    </button>
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
