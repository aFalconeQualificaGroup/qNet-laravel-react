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
import axios from "axios";

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
    const [settings, setSettings] = useState<Object | null>(null);

    useEffect(() => {
        axios.get('/aggrid-settings', { params: { entity: 'tasks' } }).then(res => {
            setSettings(res.data.settings);
        });
    }, []);

    useEffect(() => {
        console.log('Tasks page mounted with tasks: ', tasks);
    }, []);

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
                            {settings && <AGGridTable entity="tasks" settings={settings} />}
                        </TabsContent>
                        
                        <TabsContent value="kanban">
                            <TasksKanbanBoard />
                        </TabsContent>

                        <TabsContent value="calendar">
                            <TaskCalendar tasks={tasks.data} />
                        </TabsContent>

                        
                    </Tabs>
                </CardContent>
            </Card>
        </>
    );
}

