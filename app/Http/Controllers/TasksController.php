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
        $tasks = Task::paginate(15);
        
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
