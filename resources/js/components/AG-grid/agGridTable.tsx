import { AG_GRID_LOCALE_IT } from "@ag-grid-community/locale";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { getColumnDefs } from './columnDefs';
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

    const [settings, setSettings] = useState(null);

    useEffect(() => {
        axios.get('/aggrid-settings', { params: { entity } }).then(res => {
            setSettings(res.data.settings);
        });
    }, []);

    if (!settings) {
        return <div>Caricamento...</div>;
    }

    const myDatasource = {
        getRows: params => {
            axios.get('/tasks/rows', { params: { params: params.request } }).then(res => {
                console.log(res);
                params.success({
                    rowData: res.data.rows,
                    rowCount: res.data.rowCount,
                });
            });
        }
    }

    settings.localeText = AG_GRID_LOCALE_IT;
    settings.serverSideDatasource = myDatasource;
    settings.onColumnMoved = (e) => {
        const allColumns = e.api.getAllGridColumns();
        const colOrder = allColumns.map(col => col.getColId());
        console.log(colOrder);
        axios.get('/aggrid-update-columns-sort', { params: { entity, list: colOrder } });
    };
    settings.onColumnVisible = (e) => {
        e.columns.forEach((column) => {
            axios.get('/aggrid-update-column-visible', { params: { entity, item: column.getColId(), visible: e.visible } });
        });
    };
    settings.onColumnResized = (e) => {
        console.log(e);
        if (e.source == 'autosizeColumns') {
            var columnWidth = {};

            e.columns.forEach((col) => {
                columnWidth[col.colId] = col.actualWidth;
            });

            axios.post('/aggrid-save-column-width', { entity, columnWidth });
        }
        else {
            var columnWidth = {};
            columnWidth[e.column.colId] = e.column.actualWidth;

            axios.post('/aggrid-save-column-width', { entity, columnWidth });
        }
    };

    console.log(settings);

    return (
        <div className='w-full h-[500px]'>
            <AgGridReact
                {...settings}
            />
        </div>
    );
}

export default AGGridTable;