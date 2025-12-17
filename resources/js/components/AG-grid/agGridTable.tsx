import { AG_GRID_LOCALE_IT } from "@ag-grid-community/locale";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, ColumnMovedEvent, ColumnVisibleEvent, ColumnResizedEvent } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { useMemo, useEffect, useState, useCallback } from 'react';
import axios from "axios";
import AGGridLicense from './license';

ModuleRegistry.registerModules([ AllEnterpriseModule ]);
LicenseManager.setLicenseKey(AGGridLicense);

type AGGridTableProps = {
    entity: string;
    settings: Object
}

type ColumnDef = any[];

const myDatasource ={
    getRows: (params: any) => {
        axios.get('/tasks/rows', { params: { params: params.request } }).then(res => {
            console.log(res);
            params.success({
                rowData: res.data.rows,
                rowCount: res.data.rowCount,
            });
        });
    }
};

class TimePickerCellEditor {
    init(params) {
        this.eInput = document.createElement('input');
        this.eInput.type = 'time';
        this.eInput.value = params.value || '';
        this.eInput.classList.add("time-input");
    }

    getGui() {
        return this.eInput;
    }

    afterGuiAttached() {
        this.eInput.focus();
    }

    getValue() {
        console.log(this.eInput.value);
        return this.eInput.value;
    }
}

const AGGridTable = ({ entity, settings}: AGGridTableProps) => {

    const getRowId = (params) => String(params.data.id);

    const onColumnMoved = useCallback((e: ColumnMovedEvent) => {
        const allColumns = e.api.getAllGridColumns();
        const colOrder = allColumns.map(col => col.getColId());
        console.log(colOrder);
        axios.get('/aggrid-update-columns-sort', { params: { entity, list: colOrder } });
    }, [entity]);

    const onColumnVisible = useCallback((e: ColumnVisibleEvent) => {
        e.columns?.forEach((column) => {
            axios.get('/aggrid-update-column-visible', { params: { entity, item: column.getColId(), visible: e.visible == true ? 1 : 0 } });
        });
    }, [entity]);

    const onColumnResized = useCallback((e: ColumnResizedEvent) => {
        console.log(e);
        if (e.source == 'autosizeColumns') {
            var columnWidth: Record<string, number> = {};

            e.columns?.forEach((col) => {
                columnWidth[col.getColId()] = col.getActualWidth();
            });

            axios.post('/aggrid-save-column-width', { entity, columnWidth });
        }
        else if (e.column) {
            var columnWidth: Record<string, number> = {};
            columnWidth[e.column.getColId()] = e.column.getActualWidth();

            axios.post('/aggrid-save-column-width', { entity, columnWidth });
        }
    }, [entity]);

    const onCellValueChanged = useCallback((e: ColumnVisibleEvent) => {
        axios.get('/aggrid-update-column-value', { params: { entity, value: e.newValue, field: e.colDef.name, id: e.data.id } });
    }, [entity]);

    if (!settings) {
        return <div>Caricamento...</div>;
    }

    settings.components.TimePickerCellEditor = TimePickerCellEditor;

    settings.columnDefs.map(col => {
        col.cellRenderer = (params) => {
            return <span dangerouslySetInnerHTML={{ __html: params.value }} />;
        };
        col.tooltipValueGetter = (params) => {
            if (entity == 'tasks' && (params.column.colId == 'status' || params.column.colId == 'typetask' || params.column.colId == 'assigned_by')) {
                return;
            }
            return params.value;
        };
        if (col.filter == 'agSetColumnFilter') {
            col.filterParams.keyCreator = (params) => params.value.id;
            col.filterParams.valueFormatter = (params) => params.value.name;

            return col;
        }
        return col;
    });

    return (
        <div className='w-full h-full'>
            <AgGridReact
                {...settings}
                getRowId={getRowId}
                localeText={AG_GRID_LOCALE_IT}
                onColumnMoved={onColumnMoved}
                onColumnVisible={onColumnVisible}
                onColumnResized={onColumnResized}
                onCellValueChanged={onCellValueChanged}
                serverSideDatasource={myDatasource}
            />
        </div>
    );
}

export default AGGridTable;