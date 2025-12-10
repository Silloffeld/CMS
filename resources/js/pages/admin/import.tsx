import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'import products',
        href: '/import',
    },
];
const categories = ['producten', 'klanten', 'inventaris'];

function Import({ csrfToken, flash }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form method="post" encType="multipart/form-data" action={route('admin.import')} className="mx-4">
                <h2 className="mb-4 text-2xl font-bold text-gray-700">Import Shopify CSV</h2>

                <input type="hidden" name="_token" value={csrfToken} />

                <div>
                    <label htmlFor="shopify_csv" className="mb-1 block font-medium text-gray-600">
                        Choose CSV File
                    </label>
                    <input
                        type="file"
                        name="shopify_csv"
                        accept=".csv"
                        required
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="mb-1 block font-medium text-gray-600">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="my-4 w-full rounded-md bg-primary px-4 py-2 font-semibold text-orange-700 shadow transition hover:bg-secondary"
                >
                    Import Shopify CSV
                </button>

                {flash?.success && <div className="mt-2 rounded border border-green-400 bg-green-100 p-2 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mt-2 rounded border border-red-400 bg-red-100 p-2 text-red-700">{flash.error}</div>}
            </form>
        </AppLayout>
    );
}

export default Import;
