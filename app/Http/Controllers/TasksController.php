<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Task;
use App\Models\TaskAssigned;
use App\Models\TaskDocument;
use App\Models\TaskObserver;
use App\Models\TaskReminder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /* Logica custom */
        $tasks = Task::with([
            'customer',              // Cliente (Customer) - nome
            'order',                 // Ordine - title
            'orderMilestone',        // Milestone ordine - title
            'opportunity',           // Opportunità - title
            'lead',                  // Lead
            'contact',               // Contatto
            'assignedByUser',        // Utente che ha assegnato - name
            'assignedToUser',        // Utente assegnato a - name
            'area',                  // Area - nome
            'site',                  // Sede cliente - address
            'spazioAttivita',        // Spazio attività
            'spazio',                // Spazio
            'osservatore',           // Osservatore (User)
            'assegnati',             // Utenti assegnati (TaskAssigned)
            'taskdocumenti',         // Documenti task (TaskDocument)
            'tasksubs',              // Sub-tasks (TaskSub)
            'subtasks',              // Sottoattività (Task figli)
            'parenttask',            // Task padre
            'messaggiContestazione', // Messaggi contestazione
            'operatori',             // Operatori
            'reportmod',             // Report
            'taskReminder',          // Promemoria
        ])->paginate(15);
        
       /* $task = $tasks->first();
        dd([
            'id' => $task->id,
            'title' => $task->title,
            'customer' => $task->customer?->name,
            'order' => $task->order?->title,
            'orderMilestone' => $task->orderMilestone?->title,
            'opportunity' => $task->opportunity?->title,
            'contact' => $task->contact?->name,
            'assignedBy' => $task->assignedByUser?->name . ' ' . $task->assignedByUser?->last_name,
            'assignedTo' => $task->assignedToUser?->name . ' ' . $task->assignedToUser?->last_name,
            'area' => $task->area?->nome ?? '',
            'site' => $task->site?->address,
            'spazioAttivita' => $task->spazioAttivita?->nome,
            'observer' => $task->osservatore?->name,
            'all_relations' => $task->relations,
        ]);*/

        return Inertia::render("Tasks/Index", props: [
            'tasks' => $tasks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        
        if ($request->has('search_users')) {
            $query = $request->input('search_users');

            $users = User::where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->get();
        }

        if ($request->has('search_clients')){
            $queryClients = $request->input('search_clients');

            $clients = Company::where('name', 'like', "%{$queryClients}%")
            ->get();
        }

        if ($request->has('selected_client')){
            $clientId = $request->input('selected_client');

            $client = Company::find($clientId);

            /* Recupero contatti aziendali */
            $client_contacts = $client->contacts()->get();

            //$commesse_client = ;
            $opp = $client->opportunity()->get(['id', 'title', 'status']);
        }

        return Inertia::render('Tasks/create', [
            'filtered_users' => $users ?? [],
            'filtered_clients' => $clients ?? [],
            'commesse_client' => $commesse_client ?? [],
            'opportunitys_client' => $opp ?? [],
            'contacts_client' => $client_contacts ?? [],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {   
        
        $input = $request->all();

        dd($input);

        $priority = null;
        if ($input['form']['priority'] == 'low') {
            $priority = 1;
        }
        elseif ($input['form']['priority'] == 'normal') {
            $priority = 2;
        }
        elseif ($input['form']['priority'] == 'high') {
            $priority = 3;
        }
        elseif ($input['form']['priority'] == 'urgent') {
            $priority = 4;
        }

        $task_type = null;
        if ($input['form']['task_type'] == 'call') {
            $task_type = 'C';
        }
        elseif ($input['form']['task_type'] == 'meeting') {
            $task_type = 'I';
        }
        elseif ($input['form']['task_type'] == 'todo') {
            $task_type = 'T';
        }

        $task = Task::create([
            'title' => $input['form']['title'],
            'description' => $input['form']['description'],
            'typetask' => $task_type,
            'datatask' => null,
            'datataskend' => null,
            'timetask' => null,
            'timetaskend' => null,
            'feedback_required' => ($input['form']['feedback_required']) ? 1 : 0,
            'priority' => $priority,
            'customer_id' => $input['form']['client_id'],
            'assigned_by' => Auth::id(),
        ]);

        if ($input['form']['repeat_task']) {
            $frequency = null;
            if ($input['repeatConfig']['repeatType'] == 'daily') {
                $frequency = 'day';
            }
            elseif ($input['repeatConfig']['repeatType'] == 'weekly') {
                $frequency = 'week';
            }
            elseif ($input['repeatConfig']['repeatType'] == 'monthly') {
                $frequency = 'month';
            }
            elseif ($input['repeatConfig']['repeatType'] == 'yearly') {
                $frequency = 'year';
            }

            $end_type = null;
            if ($input['repeatConfig']['endType'] == 'never') {
                $end_type = 'no';
            }
            elseif ($input['repeatConfig']['endType'] == 'date') {
                $end_type = 'date';
            }
            elseif ($input['repeatConfig']['endType'] == 'occurrences') {
                $end_type = 'iterations';
            }

            TaskReminder::create([
                'task_id' => $task->id,
                'active' => true,
                'frequency' => $frequency,
                'end_type' => $end_type,
                'end_date' => (isset($input['repeatConfig']['endDate'])) ? $input['repeatConfig']['endDate'] : null,
                'end_iterations_number' => (isset($input['repeatConfig']['occurrences'])) ? $input['repeatConfig']['occurrences'] : null,
            ]);
        }

        if (isset($input['form']['assignee_ids'])) {
            if (is_array($input['form']['assignee_ids'])) {
                foreach ($input['form']['assignee_ids'] as $user_id) {
                    TaskAssigned::create([
                        'task_id' => $task->id,
                        'user_id' => $user_id,
                    ]);
                }
            }
        }

        if (isset($input['form']['observer_ids'])) {
            if (is_array($input['form']['observer_ids'])) {
                foreach ($input['form']['observer_ids'] as $user_id) {
                    TaskObserver::create([
                        'task_id' => $task->id,
                        'user_id' => $user_id,
                    ]);
                }
            }
        }

        if (isset($input['form']['documents'])) {
            if (is_array($input['form']['documents'])) {
                foreach ($input['form']['documents'] as $document) {
                    $ext = $document->getClientOriginalExtension();
                    $name = $document->getClientOriginalName();
                    $hash = hash('md5', $name . Carbon::now());
                    $document->storeAs('documents/' . app('tenant')->id . '/attachment/', $hash . '.' . $ext);

                    TaskDocument::create([
                        'task_id' => $task->id,
                        'attachment' => $name,
                        'hashfile' => $hash . '.' . $ext,
                    ]);
                }
            }
        }

        if (is_array($input['form']['subtasks'])) {
            foreach ($input['form']['subtasks'] as $subtask) {
                $subtask_priority = null;
                if ($subtask['priority'] == 'low') {
                    $subtask_priority = 1;
                }
                elseif ($subtask['priority'] == 'normal') {
                    $subtask_priority = 2;
                }
                elseif ($subtask['priority'] == 'high') {
                    $subtask_priority = 3;
                }
                elseif ($subtask['priority'] == 'urgent') {
                    $subtask_priority = 4;
                }

                $subtask_type = null;
                if ($subtask['task_type'] == 'call') {
                    $subtask_type = 'C';
                }
                elseif ($subtask['task_type'] == 'meeting') {
                    $subtask_type = 'I';
                }
                elseif ($subtask['task_type'] == 'todo') {
                    $subtask_type = 'T';
                }

                $subtask_id = Task::create([
                    'title' => $subtask['title'],
                    'description' => $subtask['description'],
                    'typetask' => $subtask_type,
                    'priority' => $subtask_priority,
                    'parent_id' => $task->id,
                ])->id;

                if (isset($subtask['assignee_ids'])) {
                    if (is_array($subtask['assignee_ids'])) {
                        foreach ($subtask['assignee_ids'] as $user_id) {
                            TaskAssigned::create([
                                'task_id' => $subtask_id,
                                'user_id' => $user_id,
                            ]);
                        }
                    }
                }

                if (isset($subtask['observer_ids'])) {
                    if (is_array($subtask['observer_ids'])) {
                        foreach ($subtask['observer_ids'] as $user_id) {
                            TaskObserver::create([
                                'task_id' => $subtask_id,
                                'user_id' => $user_id,
                            ]);
                        }
                    }
                }
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
