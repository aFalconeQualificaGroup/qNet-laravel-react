import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { getColumnDefs } from './columnDefs';
import { useState } from 'react';
import AGGridLicense from './license';
  
ModuleRegistry.registerModules([ AllEnterpriseModule ]);
LicenseManager.setLicenseKey(AGGridLicense);

type AGGridTableProps = {
    entity: string;
    rowData: any[];
}

type ColumnDef = any[];

const AGGridTable = ({ entity, rowData}: AGGridTableProps) => {

    const [colDefs, setColDefs] = useState<ColumnDef>(getColumnDefs(entity));

    /* const [rowData, setRowData] = useState([
        { 
            id: 1, 
            Titolo: "Implementazione CRM", 
            Cliente: "Azienda Alpha S.r.l.", 
            "Data Inizio": "2025-01-15", 
            "Data Fine": "2025-03-30", 
            Stato: "In Lavorazione", 
            Azioni: "⚙️"
        },
        { 
            id: 2, 
            Titolo: "Consulenza ISO 9001", 
            Cliente: "Beta Industries", 
            "Data Inizio": "2025-02-01", 
            "Data Fine": "2025-04-15", 
            Stato: "Pianificata", 
            Azioni: "⚙️"
        },
        { 
            id: 3, 
            Titolo: "Audit di sicurezza", 
            Cliente: "Gamma Corp", 
            "Data Inizio": "2024-12-10", 
            "Data Fine": "2025-01-20", 
            Stato: "Completata", 
            Azioni: "⚙️"
        },
        { 
            id: 4, 
            Titolo: "Formazione personale", 
            Cliente: "Delta Services", 
            "Data Inizio": "2025-03-05", 
            "Data Fine": "2025-03-25", 
            Stato: "In Lavorazione", 
            Azioni: "⚙️"
        },
        { 
            id: 5, 
            Titolo: "Revisione processi", 
            Cliente: "Epsilon Group", 
            "Data Inizio": "2025-01-20", 
            "Data Fine": "2025-02-28", 
            Stato: "In Pausa", 
            Azioni: "⚙️"
        },
    ]); */


    return (
        <div className='w-full h-[500px]'>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
            />
        </div>
    );
}

export default AGGridTable;