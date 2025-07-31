"use client";

import { useState } from "react";
import { Search, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";

interface Product {
    id: number;
    title?: string;
}

interface ProductVariant {
    id: number;
    product?: Product;
    options?: string | Record<string, any>; // <--- allow both string and object
    sku?: string;
    stock?: number;
    price?: number | string;
    status?: string;
}

interface InventoryTableProps {
    inventoryData: ProductVariant[];
    editLink: string;
    addLink: string;
}

export default function InventoryTable({
                                           inventoryData,
                                           editLink,
                                           addLink,
                                       }: InventoryTableProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter data based on search (checks product title and option)
    const filteredData = inventoryData.filter((variant) =>
        [
            variant.product?.title,
            variant.options,
            variant.sku,
            variant.price,
            variant.status,
        ]
            .map((v) => v?.toString().toLowerCase())
            .some((v) => v?.includes(searchTerm.toLowerCase()))
    );

    // Parse options safely
    const parseOption = (option?: string | Record<string, any>) => {
        if (!option) return "-";
        if (typeof option === "object") {
            // Already an object
            return Object.entries(option)
                .map(([key, val]) => `${key}: ${val}`)
                .join(", ");
        }
        try {
            const parsed = JSON.parse(option);
            if (typeof parsed === "object" && parsed !== null) {
                return Object.entries(parsed)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(", ");
            }
            return String(parsed);
        } catch {
            return option;
        }
    };
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Manage your inventory with search and actions</CardDescription>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search inventory"
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
                                <TableHead>Product Title</TableHead>
                                <TableHead>Option</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        No inventory found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((variant) => (
                                   <TableRow key={variant.id} >
                                        <TableCell className="font-medium">
                                            {variant.product?.title || "Untitled"}
                                        </TableCell>
                                        <TableCell className={''}>
                                            <code className="text-xs  bg-muted px-1 py-0.5 rounded">
                                                {parseOption(variant.options)}
                                            </code>
                                        </TableCell>
                                        <TableCell>{variant.sku || "-"}</TableCell>
                                        <TableCell>{variant.stock ?? "-"}</TableCell>
                                        <TableCell>{variant.price ?? "-"}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    variant.status === "active"
                                                        ? "default"
                                                        : variant.status === "draft"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {variant.status || "Unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        alert(
                                                            `View variant: ${
                                                                variant.product?.title || variant.id
                                                            }`
                                                        )
                                                    }
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Link
                                                    href={route(editLink, variant.id)}
                                                    className={"h-8 w-8 p-0"}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) }
                        </TableBody>
                    </Table>
                </div>
                <div className={"flex"}>
                    {filteredData.length > 0 && (
                        <div className="flex items-center justify-between px-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {filteredData.length} of {inventoryData.length} inventory items
                            </div>
                        </div>
                    )}
                    <Link href={route(addLink)} className={"ms-auto my-auto"}>
                        Add inventory
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
