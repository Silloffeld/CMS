"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, useForm } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Trash2 } from "lucide-react"

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
        images: [] as File[],
        variantChosen: [] as string[]
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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setData("images", [
                ...(data.images as File[]),
                ...Array.from(e.target.files)
            ]);
        }
    }

    function handleRemoveImage(idx: number) {
        setData("images", (data.images as File[]).filter((_, i) => i !== idx));
        setData("variantChosen", (data.variantChosen as string[]).filter((_, i) => i !== idx));
    }

    function getVariantOptionMenu() {
        const menu: { label: string, value: string }[] = [];
        (data.variants as ProductVariant[]).forEach((variant, idx) => {
            // Create options based on the variant's option names and values
            const option1 = variant.option1_name && variant.option1_value
                ? `${variant.option1_name}: ${variant.option1_value}`
                : null;
            const option2 = variant.option2_name && variant.option2_value
                ? `${variant.option2_name}: ${variant.option2_value}`
                : null;
            const option3 = variant.option3_name && variant.option3_value
                ? `${variant.option3_name}: ${variant.option3_value}`
                : null;

            if (option1) {
                menu.push({
                    label: `Variant ${idx + 1}: ${option1}`,
                    value: `variant_${variant.id}_option1`
                });
            }
            if (option2) {
                menu.push({
                    label: `Variant ${idx + 1}: ${option2}`,
                    value: `variant_${variant.id}_option2`
                });
            }
            if (option3) {
                menu.push({
                    label: `Variant ${idx + 1}: ${option3}`,
                    value: `variant_${variant.id}_option3`
                });
            }
        });
        return menu;
    }

    function getVariantChosenValue(idx: number) {
        const chosen = data.variantChosen[idx] || "";
        const menu = getVariantOptionMenu();
        if (chosen && menu.some(opt => opt.value === chosen)) return chosen;
        return menu[0]?.value || "";
    }

    function variantGroup() {
        const groups: Record<string, File[]> = {};
        (data.images as File[]).forEach((file, idx) => {
            const variant = data.variantChosen[idx] || "Unassigned";
            if (!groups[variant]) groups[variant] = [];
            groups[variant].push(file);
        });
        return groups;
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
                            <label className="block text-xs font-medium mb-1">Vendor(merknaam)</label>
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
                                        <TableHead>Actions</TableHead>
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

                        {/* Image Upload Section - Same as AddProduct */}
                        <div className="md:col-span-2 mt-6">
                            <label className="block text-xs font-medium mb-1">Add New Images</label>
                            <p className={"text-white/70"}>Select multiple images then select the corresponding option/category from existing variants.</p>
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full border rounded px-2 py-1 text-sm"
                            />
                            {Object.entries(variantGroup()).map(([variant, files]) => (
                                <div key={variant} className="mb-6">
                                    <h4 className="font-semibold text-sm mb-2">{variant === "Unassigned" ? "Unassigned" : variant}</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {files.map((file, idx) => {
                                            const imageIdx = data.images.findIndex(f => f === file);
                                            return (
                                                <div key={imageIdx} className="flex items-center gap-2">
                                                    <span className="text-xs">{file.name}</span>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleRemoveImage(imageIdx)}
                                                    >
                                                        Remove
                                                    </Button>
                                                    <select
                                                        value={getVariantChosenValue(imageIdx)}
                                                        onChange={e => {
                                                            const updated = [...data.variantChosen];
                                                            updated[imageIdx] = e.target.value;
                                                            setData('variantChosen', updated);
                                                        }}
                                                        className="border rounded px-2 py-1 text-sm bg-white text-black"
                                                        name="variantChosen"
                                                    >
                                                        {getVariantOptionMenu().map(({ label, value }) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
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
