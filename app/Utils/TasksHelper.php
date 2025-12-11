<?php

namespace App\Utils;

class TasksHelper
{
    public static function getModelColumns()
    {
        return [
            'id' => 'id',
            'status' => 'status',
            'title' => 'title',
            'description' => 'description',
            'typetask' => 'typetask',
            'customer_id' => 'customer_id',
            'assigned_to' => 'assigned_to',
            'opportunity_id' => 'opportunity_id',
            'order_id' => 'order_id',
            'ordermilestone_id' => 'ordermilestone_id',
            'datatask' => 'datatask',
            'timetask' => 'timetask',
            'site_id' => 'site_id',
            'endtask' => 'endtask',
            'timetaskend' => 'timetaskend',
            'assigned_by' => 'assigned_by',
            'feedback' => 'feedback',
            'collegato_a' => 'collegato_a',
        ];
    }
}
