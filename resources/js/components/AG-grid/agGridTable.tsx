import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { getColumnDefs } from './columnDefs';
import { useMemo, useState } from 'react';
import AGGridLicense from './license';
  
ModuleRegistry.registerModules([ AllEnterpriseModule ]);
LicenseManager.setLicenseKey(AGGridLicense);

type AGGridTableProps = {
    entity: string;
    rowData: any[];
}

type ColumnDef = any[];

const AGGridTable = ({ entity, rowData}: AGGridTableProps) => {

    //const [colDefs, setColDefs] = useState<ColumnDef>(getColumnDefs(entity));

    const colDefs: ColumnDef = useMemo(() => getColumnDefs(entity), [entity]);

    const object = {
        rowData: rowData,
        columnDefs: colDefs,
    }

    return (
        <div className='w-full h-[500px]'>
            <AgGridReact
                /*rowData={rowData}
                columnDefs={colDefs}*/
                {...object}
            />
        </div>
    );
}

export default AGGridTable;