import React from 'react';
import AppLayout from '@/layouts/app-layout';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'addAdmin',
        href: '/addAdmin',
    },
];
export default function AddAdmin() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className={"bg-secondary h-1/2 rounded-xl m-5"}>
                <form method={"post"} className={"m-3"}>
                    <input type="email" className={"w-20 h-10 bg-primary rounded-xl"} />
                </form>
            </div>
        </AppLayout>
    );
}


