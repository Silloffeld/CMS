"use client"

import { useState } from "react"
import { Search, Eye, Edit, Trash2, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Link, router } from '@inertiajs/react';

interface ProductData {
    id: number
    handle?: string
    title?: string
    body_html?: string
    vendor?: string
    product_category?: string
    type?: string
    tags?: string
    published?: number
    gift_card?: string
    seo_title?: string
    seo_description?: string
    status?: string
    variants?: any[]
}

interface SimpleProductTableProps {
    productData: ProductData[]
    title : string
    editLink:string
    addLink:string
}


export default function DataTable({ productData  ,title , editLink , addLink}: SimpleProductTableProps) {
    const [searchTerm, setSearchTerm] = useState("")

    // Filter data based on search
    const filteredData = productData.filter((product) =>
        Object.values(product).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
    const handleAction = (action: "view" | "delete", product: ProductData) => {
        if (action === "view") {
            // Example: You can route to a view page, open a modal, etc.
            // For now, we'll just alert the product's details
            alert(`View product: ${product.title || product.id}`)
            // Example: If you have a route for viewing details:
            // router.push(`/products/${product.id}`)
        }
        if (action === "delete") {
            // Optionally, confirm deletion
            if (window.confirm(`Are you sure you want to delete ${product.title || "this product"}?`)) {
                router.delete(route('admin.manage'), {
                    data: {
                        id: product.id,
                        title: product.title,
                    }
                });
            }
        }
    }
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title} Management</CardTitle>
                <CardDescription>Manage your {title} with search and actions</CardDescription>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={'search' + title}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Handle</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead>Variants</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8">
                                        No {title} found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.title || "Untitled"}</TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-1 py-0.5 rounded">{product.handle || "No handle"}</code>
                                        </TableCell>
                                        <TableCell>{product.vendor || "-"}</TableCell>
                                        <TableCell>{product.product_category || "-"}</TableCell>
                                        <TableCell>{product.type || "-"}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    product.status === "active"
                                                        ? "default"
                                                        : product.status === "draft"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {product.status || "Unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {(product.published == 1) ? (
                                                <Badge>Yes</Badge>
                                            ) : (
                                                <Badge>no</Badge>
                                            )}

                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.variants?.length || 0} variants</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleAction("view", product)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                    <Link href={route(editLink, product.id)} className={"h-8 w-8 p-0"}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>


                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleAction("delete", product)}
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className={'flex'}>
                {filteredData.length > 0 && (
                    <div className="flex items-center justify-between px-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {filteredData.length} of {productData.length} products
                        </div>
                    </div>
                )}
                <Link href={route(addLink)} className={'ms-auto my-auto'}>add {title}</Link>
                </div>
            </CardContent>
        </Card>
    )
}
