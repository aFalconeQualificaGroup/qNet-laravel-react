<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
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

        if($request->has('search_clients')){
            $queryClients = $request->input('search_clients');

            $clients = Company::where('name', 'like', "%{$queryClients}%")
            ->get();
        }

        if($request->has('selected_client')){
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
        dd($request->all());
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
