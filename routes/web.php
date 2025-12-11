<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    /*return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);*/
     return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('tasks/rows', [App\Http\Controllers\TasksController::class, 'rows']);

    Route::resource("tasks", App\Http\Controllers\TasksController::class);

    Route::get('aggrid-settings', [App\Http\Controllers\AgGridController::class, 'settings']);
});

require __DIR__.'/settings.php';
