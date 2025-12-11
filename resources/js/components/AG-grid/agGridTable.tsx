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

const AGGridTable = ({ entity, settings}: AGGridTableProps) => {

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

     if (!settings) {
        return <div>Caricamento...</div>;
    }


    return (
        <div className='w-full h-full'>
            <AgGridReact
                {...settings}
                localeText={AG_GRID_LOCALE_IT}
                onColumnMoved={onColumnMoved}
                onColumnVisible={onColumnVisible}
                onColumnResized={onColumnResized}
                serverSideDatasource={myDatasource}
            />
        </div>
    );
}

export default AGGridTable;