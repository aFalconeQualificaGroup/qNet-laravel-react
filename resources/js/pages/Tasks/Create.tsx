import React, { useState, useCallback, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import * as tasksRoutes from '@/routes/tasks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskRepeatConfig, TaskRepeatForm, TaskRepeatModal } from '@/components/generatedComponents/task-repeat';
import AddTaskMonolith from '@/components/generatedComponents/task-generetor/add-task-monolith';

function Create() {
    const [repeatConfig, setRepeatConfig] = useState<Partial<TaskRepeatConfig>>(() => ({
        repeatType: 'none',
        interval: 1,
        startDate: new Date().toISOString().split('T')[0],
        endType: 'never',
        startTime: '09:00',
        endTime: '10:00',
        workDaysOnly: false,
        excludeHolidays: false,
    }));

    useEffect(() => {
        console.log('repeatConfig first mount:', repeatConfig);
    }, []);

    const { data, setData, post, processing, errors } = useForm({
        /* Definire struttura dati da passare per creazione task */
    });

    const handleTaskSubmit = (json: any) => {
        // Logica per invio dati al server
        console.log("Ricevuto JSON:", json);
    }

    function handleRepeatSubmit(e: React.FormEvent) {
        e.preventDefault();
        /* Logica per invio dati al server */
        console.log('repeat config:', repeatConfig);
    }

    // Memoizza la callback per evitare re-render inutili del TaskRepeatForm
    const handleTaskRepeatChange = useCallback(
        (
            config:
                | Partial<TaskRepeatConfig>
                | ((prev: Partial<TaskRepeatConfig>) => Partial<TaskRepeatConfig>)
        ) => {
            console.log('📝 TaskRepeatForm onChange called:', config);
            setRepeatConfig(config);
        },
        []
    );

    return (
         <>
            <Head title="Tasks" />
            <Card className=' rounded-none border-0 '>
                <CardHeader>
                    <CardTitle>
                        <div className='w-full flex justify-between'>
                            <div>
                               Crea Nuovo Task
                            </div>
                            <div>
                                <Link
                                    href={tasksRoutes.index.url()}
                                >
                                    <Button
                                        variant="default"
                                    >
                                        Indietro
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='w-full flex'>
                        <AddTaskMonolith onSubmit={handleTaskSubmit} repeatConfig={repeatConfig} onChangeConfig={handleTaskRepeatChange} showAllOccurrences={showAllOccurrences} onToggleShowAllOccurrences={handleToggleShowAll}/>
                    </div>
                    {/*<div className='w-full flex flex-col'>
                        <TaskRepeatForm
                            value={repeatConfig}
                            onChange={handleTaskRepeatChange}
                        />
                        <Button
                            variant={"outline"}
                            type="submit"
                            onClick={handleRepeatSubmit}
                            disabled={processing}
                            className="mt-4"
                        >
                            Crea Task
                        </Button>
                    </div>*/}
                </CardContent>
            </Card>
        </>
    );
}

export default Create;