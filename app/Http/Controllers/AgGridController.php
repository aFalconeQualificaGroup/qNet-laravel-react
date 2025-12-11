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
}
