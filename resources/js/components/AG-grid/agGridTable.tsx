import { AG_GRID_LOCALE_IT } from "@ag-grid-community/locale";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, ColumnMovedEvent, ColumnVisibleEvent, ColumnResizedEvent } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { useMemo, useEffect, useState } from 'react';
import axios from "axios";
import AGGridLicense from './license';
  
ModuleRegistry.registerModules([ AllEnterpriseModule ]);
LicenseManager.setLicenseKey(AGGridLicense);

type AGGridTableProps = {
    entity: string;
    rowData: any[];
}

type ColumnDef = any[];

const AGGridTable = ({ entity, rowData}: AGGridTableProps) => {

    const [settings, setSettings] = useState<any | null>(null);

    useEffect(() => {
        axios.get('/aggrid-settings', { params: { entity } }).then(res => {
            setSettings(res.data.settings);
        });
    }, []);

    if (!settings) {
        return <div>Caricamento...</div>;
    }

    console.log(settings);

    const myDatasource = {
        getRows: (params: any) => {
            axios.get('/tasks/rows', { params: { params: params.request } }).then(res => {
                console.log(res);
                params.success({
                    rowData: res.data.rows,
                    rowCount: res.data.rowCount,
                });
            });
        }
    }

    const onColumnMoved = (e: ColumnMovedEvent) => {
        const allColumns = e.api.getAllGridColumns();
        const colOrder = allColumns.map(col => col.getColId());
        console.log(colOrder);
        axios.get('/aggrid-update-columns-sort', { params: { entity, list: colOrder } });
    };
    const onColumnVisible = (e: ColumnVisibleEvent) => {
        e.columns?.forEach((column) => {
            axios.get('/aggrid-update-column-visible', { params: { entity, item: column.getColId(), visible: e.visible == true ? 1 : 0 } });
        });
    };
    const onColumnResized = (e: ColumnResizedEvent) => {
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
    };

    return (
        <div className='w-full h-[500px]'>
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