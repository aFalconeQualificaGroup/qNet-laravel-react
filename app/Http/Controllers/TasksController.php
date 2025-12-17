<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Task;
use App\Models\TaskAssigned;
use App\Models\TaskDocument;
use App\Models\TaskObserver;
use App\Models\TaskReminder;
use App\Models\User;
use App\Utils\TasksHelper;
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
            'tasksAgGridData' => Inertia::lazy( fn () => $this->getTasksAgGridConfig($request)),
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
        try {
            $input = $request->all();
           
            $priority = null;
            if ($input['form']['priority'] == 'low') {
                $priority = 1;
            } elseif ($input['form']['priority'] == 'normal') {
                $priority = 2;
            } elseif ($input['form']['priority'] == 'high') {
                $priority = 3;
            } elseif ($input['form']['priority'] == 'urgent') {
                $priority = 4;
            }

            $task_type = null;
            if ($input['form']['task_type'] == 'call') {
                $task_type = 'C';
            } elseif ($input['form']['task_type'] == 'meeting') {
                $task_type = 'I';
            } elseif ($input['form']['task_type'] == 'todo') {
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
                } elseif ($input['repeatConfig']['repeatType'] == 'weekly') {
                    $frequency = 'week';
                } elseif ($input['repeatConfig']['repeatType'] == 'monthly') {
                    $frequency = 'month';
                } elseif ($input['repeatConfig']['repeatType'] == 'yearly') {
                    $frequency = 'year';
                }

                $end_type = null;
                if ($input['repeatConfig']['endType'] == 'never') {
                    $end_type = 'no';
                } elseif ($input['repeatConfig']['endType'] == 'date') {
                    $end_type = 'date';
                } elseif ($input['repeatConfig']['endType'] == 'occurrences') {
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
                    } elseif ($subtask['priority'] == 'normal') {
                        $subtask_priority = 2;
                    } elseif ($subtask['priority'] == 'high') {
                        $subtask_priority = 3;
                    } elseif ($subtask['priority'] == 'urgent') {
                        $subtask_priority = 4;
                    }

                    $subtask_type = null;
                    if ($subtask['task_type'] == 'call') {
                        $subtask_type = 'C';
                    } elseif ($subtask['task_type'] == 'meeting') {
                        $subtask_type = 'I';
                    } elseif ($subtask['task_type'] == 'todo') {
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

            return back()->with('success', 'Task creato con successo!');

        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Errore durante la creazione del task: ' . $e->getMessage());
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

    public function rows(Request $request)
    {
        $params = $request->input('params');

        $start = $params['startRow'];
        $end = $params['endRow'];

        $query = Task::query();

        $query->leftJoin('companies', 'tasks.customer_id', '=', 'companies.id');
        $query->leftJoin('orders', 'tasks.order_id', '=', 'orders.id');
        $query->leftJoin('opportunities', 'tasks.opportunity_id', '=', 'opportunities.id');
        $query->leftJoin('task_assigneds', 'tasks.id', '=', 'task_assigneds.task_id');
        $query->groupBy('tasks.id');

        $query->where('typetask', '!=', 'O');
        $query->where('parent_id', 0);

        $model_columns = TasksHelper::getModelColumns();
        unset($model_columns['collegato_a']);
        $query->select(array_map(fn($valore) => 'tasks.' . $valore, array_keys($model_columns)));
        $query->addSelect(['companies.name as company_name', 'orders.title as order_title', 'opportunities.title as opportunity_title']);

        if (!empty($params['filterModel'])) {
            foreach ($params['filterModel'] as $col => $filter) {
                if ($col == 'id' || $col == 'title' || $col == 'status' || $col == 'assigned_by' || $col == 'datatask' || $col == 'timetask' || $col == 'timetaskend') {
                    $col = 'tasks.' . $col;
                }
                elseif ($col == 'company_name') {
                    $col = 'companies.name';
                }
                elseif ($col == 'order_title') {
                    $col = 'orders.title';
                }
                elseif ($col == 'opportunity_title') {
                    $col = 'opportunities.title';
                }

                if ($filter['filterType'] == 'text') {
                    if ($filter['type'] == 'equals') {
                        $query->where($col, $filter['filter']);
                    }
                    elseif ($filter['type'] == 'notEqual') {
                        $query->where($col, '!=', $filter['filter']);
                    }
                    elseif ($filter['type'] == 'contains') {
                        $query->where($col, 'LIKE', '%' . $filter['filter'] . '%');
                    }
                    elseif ($filter['type'] == 'notContains') {
                        $query->where($col, 'NOT LIKE', '%' . $filter['filter'] . '%');
                    }
                    elseif ($filter['type'] == 'startsWith') {
                        $query->where($col, 'LIKE', $filter['filter'] . '%');
                    }
                    elseif ($filter['type'] == 'endsWith') {
                        $query->where($col, 'LIKE', '%' . $filter['filter']);
                    }
                    elseif ($filter['type'] == 'blank') {
                        $query->whereRaw('COALESCE(' . $col . ', "") = ""');
                    }
                }
                elseif ($filter['filterType'] == 'date') {
                    if ($filter['type'] == 'equals') {
                        $query->whereDate($col, $filter['dateFrom']);
                    }
                    elseif ($filter['type'] == 'notEqual') {
                        $query->whereDate($col, '!=', $filter['dateFrom']);
                    }
                    elseif ($filter['type'] == 'lessThan') {
                        $query->whereDate($col, '<=', $filter['dateFrom']);
                    }
                    elseif ($filter['type'] == 'greaterThan') {
                        $query->whereDate($col, '>=', $filter['dateFrom']);
                    }
                    elseif ($filter['type'] == 'inRange') {
                        $query->whereDate($col, '>=', $filter['dateFrom']);
                        $query->whereDate($col, '<=', $filter['dateTo']);
                    }
                    elseif ($filter['type'] == 'blank') {
                        $query->whereRaw('COALESCE(' . $col . ', "") = ""');
                    }
                }
                elseif ($filter['filterType'] == 'set') {
                    if ($col == 'assigned_to') {
                        $col = 'task_assigneds.user_id';
                    }

                    $query->whereIn($col, $filter['values']);
                }
            }
        }

        if (!empty($params['sortModel'])) {
            $query->orderBy($params['sortModel'][0]['colId'], $params['sortModel'][0]['sort']);
        }

        $rowCount = $query->get()->count();

        $tasks = $query->offset($start)->limit($end - $start)->get();

        foreach ($tasks as $id => $task) {
            $tasks[$id]->status = $this->formatTaskStatus($task->status, $task->contestata);
            $tasks[$id]->typetask = $this->formatTypeTask($task->typetask);
            $tasks[$id]->assigned_by = $this->formatAssignedBy($task->assigned_by);
            $tasks[$id]->assigned_to = $this->formatAssignedTo($task);
        }

        return [
            'rows' => $tasks,
            'rowCount' => $rowCount,
        ];
    }

    private function formatTaskStatus($status, $contestata)
    {
        $output = '';
        if ($status == 2) {
            $output = '<i title="Attività eseguita" class="bx bxs-check-circle text-green-600 bx-sm align-middle"></i>';
        }
        elseif ($status == 1 && $contestata == null) {
            $output = '<i title="Contrassegna come completata" role="button" class="bx bx-check-circle bx-sm align-middle"></i>';
        }
        elseif ($status == 1 && $contestata == 1) {
            $output = '<i title="Attività bloccata" class="bx bxs-check-circle text-red-600 bx-sm align-middle"></i>';
        }

        return $output;
    }

    private function formatTypeTask($typetask)
    {
        if ($typetask == 'I') {
            return '<i title="Incontro" class="bx bx-group align-middle"></i>';
        }
        elseif ($typetask == 'T') {
            return '<i title="Task" class="bx bx-task align-middle"></i>';
        }
        elseif ($typetask == 'C') {
            return '<i class="bx bx-phone-call align-middle"></i>';
        }
    }

    private function formatAssignedBy($assigned_by)
    {
        if ($assigned_by) {
            return '<ul class="users-list flex items-center"><li class="avatar pull-up my-0" title="' . $this->userFull($assigned_by) . '"><span class="badge badge-circle white">' . $this->userInitial($assigned_by) . '</span></li></ul>';
        }
    }

    private function formatAssignedTo($task)
    {
        if (!$task->operatori->isEmpty()) {
            $output = '<ul class="users-list flex items-center">';
            foreach ($task->operatori as $item) {
                $output .= '<li class="avatar pull-up my-0" title="' . $item->UserTask . '"> <span class="badge badge-circle white badge-circle-sm">' . $this->userInitial($item->user_id) . '</span></li>';
            }
            $output .= '</ul>';

            return $output;
        }
    }

    private function userInitial($userId)
    {
        if (isset($this->users[$userId])) {
            $user = $this->users[$userId];
            return substr($user->name, 0, 1) . substr($user->last_name, 0, 1);
        }
        elseif ($user = User::find($userId)) {
            $this->users[$userId] = $user;
            return substr($user->name, 0, 1) . substr($user->last_name, 0, 1);
        }
        else {
            return ' ';
        }
    }

    private function userFull($userId)
    {
        if (isset($this->users[$userId])) {
            $user = $this->users[$userId];
            return $user->name . ' ' . $user->last_name;
        }
        elseif ($user = User::find($userId)) {
            $this->users[$userId] = $user;
            return $user->name . ' ' . $user->last_name;
        }
        else {
            return ' ';
        }
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

    private function getTasksAgGridConfig(Request $request)
    {
        // Esempio di configurazione di base per ag-Grid
        $columnDefs = [
            ['headerName' => 'ID', 'field' => 'id', 'sortable' => true, 'filter' => true],
            ['headerName' => 'Title', 'field' => 'title', 'sortable' => true, 'filter' => true],
            ['headerName' => 'Description', 'field' => 'description', 'sortable' => false, 'filter' => false],
            ['headerName' => 'Due Date', 'field' => 'endtask', 'sortable' => true, 'filter' => 'agDateColumnFilter'],
            ['headerName' => 'Priority', 'field' => 'priority', 'sortable' => true, 'filter' => true],
            ['headerName' => 'Assigned To', 'field' => 'assigned_to', 'sortable' => true, 'filter' => true],
        ];

        // Puoi aggiungere logica per personalizzare la configurazione in base alla richiesta
        return [
            'columnDefs' => $columnDefs,
            'defaultColDef' => [
                'resizable' => true,
                'flex' => 1,
                'minWidth' => 100,
            ],
            'pagination' => true,
            'paginationPageSize' => 15,
        ];
    }
}
