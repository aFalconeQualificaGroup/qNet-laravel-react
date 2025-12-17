<?php

namespace App\Http\Controllers;

use App\Models\FieldsTable;
use App\Utils\TasksHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgGridController extends Controller
{
    public function settings(Request $request)
    {
        $entity = $request->input('entity');

        $model_columns = [];
        if ($entity == 'tasks') {
            $model_columns = TasksHelper::getModelColumns();
        }

        $fields = $this->saveColumns($entity, $model_columns);

        $fields = FieldsTable::where('controller', $entity)
            ->where('id_user', Auth::id())
            ->orderBy('position')
            ->get();

        $columnDefs = [];

        foreach ($fields as $field) {
            if (!isset($model_columns[$field->text])) {
                continue;
            }

            $field_name = $field->text;
            if ($entity == 'tasks') {
                if ($field_name == 'customer_id') {
                    $field_name = 'company_name';
                }
                elseif ($field_name == 'order_id') {
                    $field_name = 'order_title';
                }
                elseif ($field_name == 'opportunity_id') {
                    $field_name = 'opportunity_title';
                }
            }

            $cellEditor = 'agTextCellEditor';

            if ($model_columns[$field->text]['type'] == 'set') {
                $cellEditor = 'agRichSelectCellEditor';
            }
            elseif ($model_columns[$field->text]['type'] == 'date') {
                $cellEditor = 'agDateStringCellEditor';
            }

            $filter = false;
            $filterParams = [];

            if ($model_columns[$field->text]['filterable']) {
                $filterParams = [
                    'buttons' => ['reset'],
                    'filterOptions' => ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith', 'blank'],
                    'maxNumConditions' => 1,
                    'debounceMs' => 1000,
                ];

                if ($model_columns[$field->text]['type'] == 'set') {
                    $filter = 'agSetColumnFilter';

                    $filterParams['values'] = $model_columns[$field->text]['values'];

                    $filterParams['defaultToNothingSelected'] = true;
                }
                elseif ($model_columns[$field->text]['type'] == 'date' || $model_columns[$field->text]['type'] == 'datetime') {
                    $filter = 'agDateColumnFilter';

                    $filterParams['filterOptions'] = ['equals', 'notEqual', 'lessThan', 'greaterThan', 'inRange', 'blank'];
                }
                else {
                    $filter = 'agTextColumnFilter';
                }
            }

            $columnDefs[] = [
                'hide' => ($field->visible) ? false : true,
                'suppressMovable' => false,
                'lockVisible' => false,
                'cellEditor' => $cellEditor,
                'cellEditorPopup' => true,
                'suppressHeaderMenuButton' => false,
                'name' => $field->text,
                'headerName' => trans('dictionary.' . $field->text_visible),
                'headerTooltip' => trans('dictionary.' . $field->text_visible),
                'field' => $field_name,
                'editable' => $model_columns[$field->text]['editable'],
                'filter' => $filter,
                'filterParams' => $filterParams,
                'sortable' => $model_columns[$field->text]['sortable'],
                'width' => ($field->width) ? $field->width : 100,
            ];
        }

        return response()->json([
            'settings' => [
                'components' => [],
                'rowSelection' => [
                    'mode' => 'multiRow',
                ],
                'enableFilterHandlers' => true,
                'sideBar' => [
                    'toolPanels' => [
                        [
                            'id' => 'columns',
                            'labelDefault' => 'Columns',
                            'labelKey' => 'columns',
                            'iconKey' => 'columns',
                            'toolPanel' => 'agColumnsToolPanel',
                            'toolPanelParams' => [
                                'suppressRowGroups' => true,
                                'suppressValues' => true,
                                'suppressPivots' => true,
                                'suppressPivotMode' => true,
                            ],
                        ],
                        [
                            'id' => 'filters-new',
                            'labelDefault' => 'Filters',
                            'labelKey' => 'filters',
                            'iconKey' => 'filter',
                            'toolPanel' => 'agNewFiltersToolPanel',
                        ],
                    ],
                ],
                'suppressContextMenu' => true,
                'stopEditingWhenCellsLoseFocus' => true,
                'tooltipShowDelay' => 500,
                'tooltipShowMode' => 'whenTruncated',
                'tooltipMouseTrack' => true,
                'rowModelType' => 'serverSide',
                'pagination' => true,
                'paginationPageSizeSelector' => [10, 20, 50],
                'paginationPageSize' => 20,
                'cacheBlockSize' => 200,
                'domLayout' => 'autoHeight',
                'headerHeight' => 34,
                'rowHeight' => 34,
                'rowClass' => 'divide-x divide-y divide-gray-300',
                'columnDefs' => $columnDefs,
            ],
        ]);
    }

    public function updateColumnsSort(Request $request)
    {
        $entity = $request->input('entity');
        $list = $request->input('list');

        foreach ($list as $i => $item) {
            $field = str_replace('callback_', '', $item);
            $field = str_replace('-', '.', $field);

            FieldsTable::where('controller', $entity)
                ->where('text', $field)
                ->where('id_user', Auth::id())
                ->update(['position' => $i]);
        }
    }

    public function updateColumnVisible(Request $request)
    {
        $entity = $request->input('entity');
        $item = $request->input('item');
        $visible = ($request->input('visible')) ? 1 : 0;

        $field = str_replace('callback_', '', $item);
        $field = str_replace('-', '.', $field);


        FieldsTable::where('controller', $entity)
            ->where('text', $field)
            ->where('id_user', Auth::id())
            ->update(['visible' => $visible]);
    }

    public function saveColumnWidth(Request $request)
    {
        $entity = $request->input('entity');
        $columnWidth = $request->input('columnWidth');

        if (!empty(array_filter($columnWidth))) {
            foreach ($columnWidth as $field => $width) {
                FieldsTable::where('controller', $entity)
                    ->where('text', $field)
                    ->where('id_user', Auth::id())
                    ->update(['width' => $width]);
            }
        }
    }

    public function updateColumnValue(Request $request)
    {
        $entity = $request->input('entity');
        $value = $request->input('value');
        $field = $request->input('field');
        $id = $request->input('id');

        if ($entity == 'tasks') {
            TasksHelper::updateValue($value, $field, $id);
        }
    }

    public function saveColumns($entity, $model_columns)
    {
        $cols = FieldsTable::where('controller', $entity)
            ->where('id_user', Auth::id())
            ->pluck('text')
            ->toArray();
        $cols_mancanti = array_diff(array_keys($model_columns), $cols);

        if ($cols_mancanti) {
            foreach ($cols_mancanti as $column) {
                FieldsTable::create([
                    'text'=> $column,
                    'text_visible' => $model_columns[$column]['text'],
                    'controller' => $entity,
                    'id_user' => Auth::id(),
                    'visible' => 1,
                    'orderable' => 0,
                ]);
            }
        }

        return FieldsTable::where('controller', $entity)
            ->where('id_user', Auth::id())
            ->whereIn('text', array_keys($model_columns))
            ->orderBy('position')
            ->get();
    }
}
