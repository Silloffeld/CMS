import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import * as url from 'node:url';
// import { InteractiveLineChart } from '@/components/interactive-line-chard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];


export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" style={{ backgroundImage:'url(https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Finsights.globalspec.com%2Fimages%2Fassets%2F596%2F5596%2FBlacksmith_working.jpg&f=1&nofb=1&ipt=9f8d30e104e5a92ad352be99fc64f3d301218ef139a1a49ee9e7491c5222909c)' }}>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-vjideo overflow-hidden backdrop-blur-md shadow-lg bg-gradient-to-br  from-transparent  to-white/10 rounded-xl border-2 border-white/10 text-center">
                        <h1 className={"text-2xl font-bold text-white shadow-lg px-1 w-fit mx-auto "}>ironForge Dashboard</h1>
                    </div>
                    <div className="relative aspect-video overflow-hidden backdrop-blur-md shadow-lg bg-gradient-to-br  from-transparent  to-white/10 rounded-xl border-2 border-white/10 text-center">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden backdrop-blur-md shadow-lg bg-gradient-to-br  from-transparent  to-white/10 rounded-xl border-2 border-white/10 text-center">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative flex-1  overflow-hidden backdrop-blur-md shadow-lg bg-gradient-to-br  from-transparent  to-white/10 rounded-xl border-2 border-white/10 text-center ">

                </div>
            </div>
        </AppLayout>
    );
}
