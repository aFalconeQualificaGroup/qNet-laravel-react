<?php

namespace App\Utils;

use App\Models\Task;
use App\Models\User;

class TasksHelper
{
    public static function getModelColumns()
    {
        $users = User::orderBy('name')->orderBy('last_name')->get();
        $user_options = [];
        foreach ($users as $user) {
            $user_options[] = [
                'id' => $user->id,
                'name' => $user->name . ' ' . $user->last_name,
            ];
        }

        return [
            'id' => [
                'text' => 'id',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'status' => [
                'text' => 'status',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'set',
                'values' => [
                    [
                        'id' => 1,
                        'name' => 'Attività da fare',
                    ],
                    [
                        'id' => 2,
                        'name' => 'Attività eseguita',
                    ],
                ],
            ],
            'title' => [
                'text' => 'title',
                'editable' => true,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'description' => [
                'text' => 'description',
                'editable' => true,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'typetask' => [
                'text' => 'typetask',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'set',
                'values' => [
                    [
                        'id' => 'T',
                        'name' => 'Task',
                    ],
                    [
                        'id' => 'I',
                        'name' => 'Incontro',
                    ],
                    [
                        'id' => 'C',
                        'name' => 'Chiamata',
                    ],
                    [
                        'id' => 'O',
                        'name' => 'Intervento',
                    ],
                ],
            ],
            'customer_id' => [
                'text' => 'customer_id',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'assigned_to' => [
                'text' => 'assigned_to',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'set',
                'values' => $user_options,
            ],
            'opportunity_id' => [
                'text' => 'opportunity_id',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'order_id' => [
                'text' => 'order_id',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'ordermilestone_id' => [
                'text' => 'ordermilestone_id',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'datatask' => [
                'text' => 'datatask',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'timetask' => [
                'text' => 'timetask',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'site_id' => [
                'text' => 'site_id',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'endtask' => [
                'text' => 'endtask',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'timetaskend' => [
                'text' => 'timetaskend',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'assigned_by' => [
                'text' => 'assigned_by',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'set',
                'values' => $user_options,
            ],
            'feedback' => [
                'text' => 'feedback',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
            'collegato_a' => [
                'text' => 'collegato_a',
                'editable' => false,
                'filterable' => true,
                'sortable' => true,
                'type' => 'text',
            ],
        ];
    }

    public static function updateValue($value, $field, $id)
    {
        $task = Task::find($id);
        $task->update([
            $field => $value,
        ]);
    }
}
