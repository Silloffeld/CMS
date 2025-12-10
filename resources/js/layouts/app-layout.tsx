import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    isSuper?: boolean; // <-- add this
}

export default function AppLayout({ children, breadcrumbs, isSuper }: AppLayoutProps) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} isSuper={isSuper}>
            {children}
        </AppLayoutTemplate>
    );
}
