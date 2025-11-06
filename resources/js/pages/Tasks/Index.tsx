import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {  useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function Index({ tasks }: { tasks: any[] }) {

    useEffect(() => {
        console.log(tasks);
    }, [tasks]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
        </AppLayout>
    );
}
