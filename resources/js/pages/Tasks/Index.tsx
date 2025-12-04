import { Head, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import * as tasksRoutes from '@/routes/tasks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AGGridTable from '@/components/AG-grid/agGridTable';
import { useEffect, useState } from 'react';
import TaskDataParsing, { OriginalTaskType } from '@/components/AG-grid/helper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksKanbanBoard } from '@/components/kanban-board/TasksKanbanBoard';
import { TaskCalendar } from '@/components/calendar/TaskCalendar';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
    page?: number;
}

interface TasksPagination {
    current_page: number;
    data: OriginalTaskType[];
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

export interface TasksByDeadline {
    overdue: OriginalTaskType[];
    today: OriginalTaskType[];
    week: OriginalTaskType[];
    month: OriginalTaskType[];
}

export default function Index({ tasks }: { tasks: TasksPagination }) {
    const [activeTab, setActiveTab] = useState('table');
    
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

    useEffect(() => {
        console.log('Tasks page mounted with tasks: ', tasks);
    }, []);

    const dataForAgGrid = TaskDataParsing(tasks.data);
    
    return (
        <>
            <Head title="Tasks" />
            <Card className=' rounded-none border-0 '>
                <CardHeader>
                    <CardTitle>
                        <div className='w-full flex justify-between items-center'>
                            <div>
                                Elenco Tasks
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({tasks.total} totali)
                                </span>
                            </div>
                            <div>
                                <Link
                                    href={tasksRoutes.create.url()}
                                >
                                    <Button
                                        variant="default"
                                    >
                                        Crea Nuovo Task
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="table">Tabella</TabsTrigger>
                            <TabsTrigger value="kanban">Kanban</TabsTrigger>
                            <TabsTrigger value="calendar">Calendario</TabsTrigger>
                        </TabsList>
                    
                        <TabsContent value="table">
                            <AGGridTable entity="tasks" rowData={dataForAgGrid} />
                        </TabsContent>
                        
                        <TabsContent value="kanban">
                            <TasksKanbanBoard />
                        </TabsContent>

                        <TabsContent value="calendar">
                            <TaskCalendar tasks={tasks.data} />
                        </TabsContent>

                        
                    </Tabs>

                    {/* Pagination - Visibile solo nella vista Tabella */}
                    {activeTab === 'table' && (
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
                    )}
                </CardContent>
            </Card>
        </>
    );
}

