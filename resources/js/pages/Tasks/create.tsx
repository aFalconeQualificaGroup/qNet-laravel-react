import { useState, useCallback, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import * as tasksRoutes from '@/routes/tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskRepeatConfig } from '@/components/generatedComponents/task-repeat';
import { AddTaskForm } from '@/components/generatedComponents/task-generator';
import { TaskForm } from '@/components/generatedComponents/task-repeat/types';
import { router } from "@inertiajs/react";

export type UserType = {
    filtered_users?: any[];
    filtered_clients?: any[];
    commesse_client?: any[];
    opportunitys_client?: any[];
    contacts_client?: any[];
};

function Create({ filtered_users=[], filtered_clients=[], commesse_client=[], opportunitys_client=[], contacts_client=[] }: UserType) {

    useEffect(() => {
        console.log('Filtered Users:', filtered_users);
    }, [filtered_users]);

    const [form, setForm] = useState<TaskForm>({
            title: "",
            description: "",
            task_type: "call",
            priority: "low",
            note: "",
            assignee_ids: [],
            observer_ids: [],
            contact_ids: [],
            due_date: null,
            start_date: null,
            is_completed_task: false,
            client_id: "",
            collegato_id: "",
            feedback_required: false,
            is_private: false,
            repeat_task: false,
            subtasks: [],
    });

    const [repeatConfig, setRepeatConfig] = useState<Partial<TaskRepeatConfig>>(() => ({
        repeatType: '',
        interval: 1,
        startDate: new Date().toISOString().split('T')[0],
        endType: '',
        startTime: '09:00',
        endTime: '10:00',
        workDaysOnly: false,
        excludeHolidays: false,
    }));

    useEffect(() => {
        console.log('repeatConfig first mount:', repeatConfig);
    }, [repeatConfig]);

    const { data, setData, post, processing, errors } = useForm({
        form: form,
        repeatConfig: repeatConfig,
    });

    // Sincronizza i dati di useForm con gli stati locali
    useEffect(() => {
        setData('form', form);
    }, [form]);

    useEffect(() => {
        setData('repeatConfig', repeatConfig);
    }, [repeatConfig]);

    useEffect(() => {
        // Fai la richiesta solo se c'è effettivamente un client_id
        if (form.client_id && form.client_id.trim() !== '') {
            router.get(
                tasksRoutes.create.url(),
                { selected_client: form.client_id },
                { 
                    preserveState: true,
                    preserveScroll: true,
                    only: ['commesse_client', 'opportunitys_client', 'contacts_client'], // Ricarica solo questi dati
                }
            );
        }
    }, [form.client_id]);

    useEffect(() => {
        console.log('contacts_client changed', contacts_client);
    }, [contacts_client]);

    const handleTaskSubmit = (formData: TaskForm) => {
        setData('form', formData);
        // Invia i dati al backend
        post(tasksRoutes.store.url(), {
            onSuccess: () => {
                console.log('Task creato con successo');
            },
            onError: (errors) => {
                console.error('Errore creazione task:', errors);
            },
        });
    }

    // Memoizza la callback per evitare re-render inutili del TaskRepeatForm
    const handleTaskRepeatChange = useCallback(
        (
            config:
                | Partial<TaskRepeatConfig>
                | ((prev: Partial<TaskRepeatConfig>) => Partial<TaskRepeatConfig>)
        ) => {
            console.log('TaskRepeatForm new entry:', config);
            setRepeatConfig(config);
        },
        []
    );

    const handleFormDataChange = (key: keyof TaskForm, value: any) => {
        setForm(prevForm => ({
            ...prevForm,
            [key]: value,
        }));
    }

    const handleReset = () => {
        // Reset form
        setForm({
            title: "",
            description: "",
            task_type: "call",
            priority: "",
            note: "",
            assignee_ids: [],
            observer_ids: [],
            contact_ids: [],
            due_date: null,
            start_date: null,
            is_completed_task: false,
            client_id: "",
            collegato_id: "",
            feedback_required: false,
            is_private: false,
            repeat_task: false,
            documents: undefined,
            subtasks: [],
        });
        
        // Reset repeatConfig
        setRepeatConfig({
            repeatType: '',
            interval: 1,
            startDate: new Date().toISOString().split('T')[0],
            endType: '',
            endDate: '',
            occurrences: 1,
            startTime: '09:00',
            endTime: '10:00',
            workDaysOnly: false,
            excludeHolidays: false,
        });
    }

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
                        <AddTaskForm 
                            onSubmit={handleTaskSubmit}
                            onReset={handleReset}
                            repeatConfig={repeatConfig} 
                            onChangeConfig={handleTaskRepeatChange} 
                            form={form} 
                            handleFormDataChange={handleFormDataChange} 
                            users={filtered_users}
                            clients={filtered_clients}
                            commesse_client={commesse_client}
                            opportunitys_client={opportunitys_client}
                            contacts_client={contacts_client} 
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default Create;