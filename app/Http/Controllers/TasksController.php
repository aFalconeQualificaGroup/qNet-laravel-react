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
use PhpParser\Node\Stmt\TryCatch;

class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
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
        
        $year = $request->input('year');
        $date = $request->input('date');
        return Inertia::render("Tasks/Index", [
            'tasks' => $tasks,
            'tasksByDeadline' => Inertia::lazy(fn () => $this->getTasksByDeadlineData($year)),
            'tasksForCalendarView' => Inertia::lazy(fn () => $this->getTasksForCalendarView($date)),
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
            'endtask' => $input['form']['due_date'],
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
    public function update(Request $request, $id )
    {
        try {
            $task = Task::findOrFail($id);
            
            if ($request->has('endtask')) {
                $task->endtask = $request->input("endtask");
            }
            
            $task->save();

            return back()->with('success', 'Task aggiornato con successo!');
        } catch (\Exception $e) {
            return back()->with('error', 'Errore durante l\'aggiornamento: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Recupera i dati dei task raggruppati per scadenza (metodo privato per lazy loading)
     */
    private function getTasksByDeadlineData($year = null)
    {
        try {
            // Se year non è specificato, ritorna dati vuoti
            if (!$year) {
                return [
                    'overdue' => [],
                    'today' => [],
                    'week' => [],
                    'month' => [],
                ];
            }

            $today = Carbon::today();
            $endOfWeek = Carbon::today()->endOfWeek();
            $endOfMonth = Carbon::today()->endOfMonth();

            $relations = ['assignedToUser:id,name,last_name'];

            $overdueTasks = Task::with($relations)
                ->select('id', 'title', 'description', 'endtask', 'assigned_to')
                ->whereNotNull('endtask')
                ->whereYear('endtask', $year)
                ->whereDate('endtask', '<', $today)
                ->orderBy('endtask', 'desc')
                ->limit(50)
                ->get();

            $todayTasks = Task::with($relations)
                ->select('id', 'title', 'description', 'endtask', 'assigned_to')
                ->whereYear('endtask', $year)
                ->whereDate('endtask', '=', $today)
                ->orderBy('endtask', 'desc')
                ->limit(50)
                ->get();

            $weekTasks = Task::with($relations)
                ->select('id', 'title', 'description', 'endtask', 'assigned_to')
                ->whereNotNull('endtask')
                ->whereYear('endtask', $year)
                ->whereDate('endtask', '>', $today)
                ->whereDate('endtask', '<=', $endOfWeek)
                ->orderBy('endtask', 'desc')
                ->limit(50)
                ->get();

            $monthTasks = Task::with($relations)
                ->select('id', 'title', 'description', 'endtask', 'assigned_to')
                ->whereNotNull('endtask')
                ->whereYear('endtask', $year)
                ->whereDate('endtask', '>', $endOfWeek)
                ->whereDate('endtask', '<=', $endOfMonth)
                ->orderBy('endtask', 'desc')
                ->limit(50)
                ->get();

            return [
                'overdue' => $overdueTasks,
                'today' => $todayTasks,
                'week' => $weekTasks,
                'month' => $monthTasks,
            ];
        } catch (\Exception $e) {
            \Log::error('Errore nel recupero dei task per scadenza: ' . $e->getMessage());
            return [
                'overdue' => [],
                'today' => [],
                'week' => [],
                'month' => [],
            ];
        }
    }

    private function getTasksForCalendarView($date = null)
    {
        try {
            // Se date non è specificato, usa oggi
            $date = $date ?? Carbon::today()->format('Y-m-d');

            return Task::with([
                'customer',
                'order',
                'orderMilestone',
                'opportunity',
                'lead',
                'contact',
                'assignedByUser',
                'assignedToUser',
                'area',
                'site',
                'spazioAttivita',
                'spazio',
                'osservatore',
                'assegnati',
                'taskdocumenti',
                'tasksubs',
                'subtasks',
                'parenttask',
                'messaggiContestazione',
                'operatori',
                'reportmod',
                'taskReminder',
            ])
            ->whereNotNull('endtask')
            ->whereDate('endtask', $date)
            ->orderBy('endtask', 'asc')
            ->get();
        } catch (\Exception $e) {
            \Log::error('Errore nel recupero dei task per calendar view: ' . $e->getMessage());
            return [];
        }
    }
}
