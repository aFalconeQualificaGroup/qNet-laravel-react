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
            'tasksAgGridData' => Inertia::lazy( fn () => $this->getTasksAgGridConfig($request)),
            'userForAdvancedFilter' => Inertia::lazy( fn () => $this->getUserForAdvancedFilter($request)),
            'clientsForAdvancedFilter' => Inertia::lazy( fn () => $this->getClientsForAdvancedFilter($request)),
            'ordersForAdvancedFilter' => Inertia::lazy( fn () => $this->getCommesseForClient($request)),
            'opportunitysForAdvancedFilter' => Inertia::lazy( fn () => $this->getOpportunitysForClient($request)),
            'assegnatariForAdvancedFilter' => Inertia::lazy( fn () => $this->getUserForAdvancedFilter($request)),
            'osservatoriForAdvancedFilter' => Inertia::lazy( fn () => $this->getUserForAdvancedFilter($request)),
            'userSavedFilters' => Inertia::lazy( fn () => $this->getUserSavedFilters($request)),
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

        $query = Task::with([
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
        ]);

        $rowCount = $query->count();

        $tasks = $query->offset($start)->limit($end - $start)->get();

        return [
            'rows' => $tasks,
            'rowCount' => $rowCount,
        ];
    }

    public function saveUserTasksFilter(Request $request)
    {   

        if($request->has('id')){
           $filterId = $request->input('id');
           if($filterId){
                $filterNewValue = [
                    'filters' => $request->input('filters'),
                    'collegatoA' => $request->input('collegatoA'),
                    'searchText' => $request->input('searchText'),
                    'name' => $request->input('name'),
                    'description' => $request->input('description'),
                    'is_favorite' => $request->input('is_favorite', false),
                ];
                // qui recuperi il filtro esistente dal database e lo aggiorni con i dati di $filterNewValue

                return back()->with('success', 'Filtro aggiornato con successo!');
           }    
        }

        $newFilter = [
            'filters' => $request->input('filters'),
            'collegatoA' => $request->input('collegatoA'),
            'searchText' => $request->input('searchText'),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'is_favorite' => $request->input('is_favorite', false),
        ];

        // qui salvi $newFilter nel database associandolo all'utente corrente

        /* Esempio di risposta dopo aver salvato il filtro dell' utente */
        return back()->with('success', 'Filtro creato con successo!');
       
        //return back()->with('error', 'Errore durante la creazione del filtro.');
        
    }

    public function updateFavoriteFilterStatus(Request $request, $filterId)
    {
       //dd($request->all(), $filterId);
       return back()->with('success', 'Stato filtro preferito aggiornato con successo!');

       //return back()->with('error', 'Errore durante l\'aggiornamento dello stato del filtro preferito.');
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

    private function getUserForAdvancedFilter(Request $request)
    {
        $serchParams = $request->input('search');
        $query = User::query();

        if ($serchParams) {
            $query->where('name', 'like', "%{$serchParams}%")
                  ->orWhere('email', 'like', "%{$serchParams}%")
                  ->orWhere('last_name', 'like', "%{$serchParams}%");
        }
        
        return $query->select('id', 'name')
            ->limit(50)
            ->get();
    }

    private function getClientsForAdvancedFilter(Request $request)
    {
        $searchParams = $request->input('search');
        
        $query = Company::query();
        
        if ($searchParams) {
            $query->where('name', 'like', "%{$searchParams}%");
        }
        
        return $query->select('id', 'name')
            ->limit(50)
            ->get();
    }

    private function getCommesseForClient(Request $request)
    {
        $searchParams = $request->input('search');
        $clientId = $request->input('client_id');

        $client = Company::find($clientId);

        if (!$client) {
            return [];
        }

        $query = $client->orders()->select('id', 'title');

        if ($searchParams && $searchParams != '') {
            $query->where('title', 'like', "%{$searchParams}%");
        }

        return $query->paginate(10);
    }

    private function getOpportunitysForClient(Request $request)
    {
        $searchParams = $request->input('search');
        $clientId = $request->input('client_id');

        $client = Company::find($clientId);

        if (!$client) {
            return [];
        }

        $query = $client->opportunity()->select('id', 'title');

        if ($searchParams && $searchParams != '') {
            $query->where('title', 'like', "%{$searchParams}%");
        }

        return $query->paginate(10);
    }

    private function getUserSavedFilters(Request $request)
    {
       $savedFilters = [
           [
               'id' => 1,
               'name' => 'Task Urgenti Aperti',
               'description' => 'Tutti i task con priorità urgente e stato aperto',
               'filters' => json_encode([
                   'statoAttivita' => ['conditions' => [['id' => '1', 'operator' => 'equals', 'values' => ['Aperto'], 'logic' => null]]],
                   'priorita' => ['conditions' => [['id' => '3', 'operator' => 'equals', 'values' => ['Urgente'], 'logic' => null]]],
               ]),
               'collegatoA' => json_encode(['tipo' => 'Nessuno', 'azienda' => '', 'contatto' => '', 'sottoTipo' => 'Nessuno', 'commessa' => '', 'opportunita' => '']),
               'searchText' => '',
               'createdAt' => '2025-12-01T10:00:00.000Z',
               'isFavorite' => true,
           ],
           [
               'id' => 2,
               'name' => 'Task Scadenza Oggi',
               'description' => 'Task con scadenza odierna',
               'filters' => json_encode([
                   'dataScadenza' => ['conditions' => [['id' => '7', 'operator' => 'equals', 'values' => [date('Y-m-d')], 'logic' => null]]],
               ]),
               'collegatoA' => json_encode(['tipo' => 'Nessuno', 'azienda' => '', 'contatto' => '', 'sottoTipo' => 'Nessuno', 'commessa' => '', 'opportunita' => '']),
               'searchText' => '',
               'createdAt' => '2025-12-10T14:30:00.000Z',
               'isFavorite' => false,
           ],
           [
               'id' => 3,
               'name' => 'Commesse Cliente XYZ',
               'description' => 'Task collegati alle commesse del cliente XYZ',
               'filters' => json_encode([
                   'assegnatario' => ['conditions' => [['id' => '2', 'operator' => 'in', 'values' => ['1', '2'], 'logic' => null, 'users' => [['id' => 1, 'name' => 'Mario Rossi'], ['id' => 2, 'name' => 'Luigi Verdi']]]]],
               ]),
               'collegatoA' => json_encode(['tipo' => 'Azienda', 'azienda' => '5', 'contatto' => '', 'sottoTipo' => 'Commessa', 'commessa' => '12', 'opportunita' => '']),
               'searchText' => '',
               'createdAt' => '2025-12-15T09:15:00.000Z',
               'isFavorite' => true,
           ],
       ];

        return $savedFilters;
    }
}   
