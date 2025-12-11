<?php

namespace App\Http\Controllers;

use App\Models\FieldsTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgGridController extends Controller
{
    public function settings(Request $request)
    {
        $entity = $request->input('entity');

        $fields = FieldsTable::where('controller', $entity)
            ->where('id_user', Auth::id())
            ->orderBy('position')
            ->get();

        $columnDefs = [];

        foreach ($fields as $field) {
            $columnDefs[] = [
                'hide' => ($field->visible) ? false : true,
                'suppressMovable' => false,
                'lockVisible' => false,
                'cellEditorPopup' => true,
                'suppressHeaderMenuButton' => false,
                'name' => $field->text,
                'headerName' => trans('dictionary.' . $field->text_visible),
                'headerTooltip' => trans('dictionary.' . $field->text_visible),
                'field' => $field->text,
                'editable' => false,
                'filter' => false,
                'sortable' => true,
                'width' => ($field->width) ? $field->width : 100,
            ];
        }

        return response()->json([
            'settings' => [
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
}
