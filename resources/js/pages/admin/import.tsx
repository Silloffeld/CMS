import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'import products',
        href: '/import',
    },
];
function Import( { is_super , csrfToken , flash}) {
    return (
        <AppLayout  breadcrumbs={breadcrumbs} isSuper={is_super}>
            <form method="post" encType="multipart/form-data" action={route('admin.import')}>
                <input type="file" name="shopify_csv" accept=".csv" required />
                <input type="hidden" name="_token" value={csrfToken} />
                <button type="submit">Import Shopify CSV</button>
                {flash?.success && <div className="success">{flash.success}</div>}
                {flash?.error && <div className="error">{flash.error}</div>}
            </form>
        </AppLayout>
    );
}

export default Import;
