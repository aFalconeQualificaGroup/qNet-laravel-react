import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

interface Task {
    id: number;
    title: string;
    description: string | null;
    datatask: string;
    endtask: string;
    status: number;
    customer_id: number;
    assigned_to: number | null;
    priority: number | null;
    typetask: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
    page?: number;
}

interface TasksPagination {
    current_page: number;
    data: Task[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export default function Index({ tasks }: { tasks: TasksPagination }) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    const getStatusBadge = (status: number) => {
        const statusMap: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
            0: { label: 'Aperto', variant: 'default' },
            1: { label: 'In corso', variant: 'secondary' },
            2: { label: 'Completato', variant: 'outline' },
        };
        
        const statusInfo = statusMap[status] || { label: 'Sconosciuto', variant: 'outline' };
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            
            <Card>
                <CardHeader>
                    <CardTitle>
                        Elenco Tasks
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({tasks.total} totali)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Titolo</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Data Inizio</TableHead>
                                    <TableHead>Data Fine</TableHead>
                                    <TableHead>Stato</TableHead>
                                    <TableHead className="text-right">Azioni</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            Nessun task trovato.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tasks.data.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="font-medium">{task.id}</TableCell>
                                            <TableCell className="max-w-[300px] truncate">
                                                {task.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{task.typetask}</Badge>
                                            </TableCell>
                                            <TableCell>{task.customer_id}</TableCell>
                                            <TableCell>{task.datatask}</TableCell>
                                            <TableCell>{task.endtask}</TableCell>
                                            <TableCell>{getStatusBadge(task.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.visit(`/tasks/${task.id}`)}
                                                >
                                                    Dettagli
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {tasks.from} - {tasks.to} di {tasks.total} risultati
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(tasks.prev_page_url)}
                                disabled={!tasks.prev_page_url}
                            >
                                Precedente
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {tasks.links
                                    .filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;' && link.label !== '...')
                                    .slice(0, 7)
                                    .map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handlePageChange(link.url)}
                                            disabled={!link.url}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(tasks.next_page_url)}
                                disabled={!tasks.next_page_url}
                            >
                                Successivo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}

