<?php

namespace App\Observers;

use App\Models\Report;
use App\Models\ReportProgressivo;

class ReportObserver
{
    public function created(Report $report)
    {
        $anno = substr($report->task->datatask, 0, 4);

        $reportProgressivo = ReportProgressivo::where('anno', $anno)->firstOrNew([
            'anno' => $anno,
        ]);
        $reportProgressivo->progressivo += 1;
        $reportProgressivo->save();

        $report->progressivo = $reportProgressivo->progressivo . ' / ' . $anno;
        $report->save();
    }
}
