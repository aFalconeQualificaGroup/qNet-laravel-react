<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadSoaCategory extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getCategoriaAttribute() {
        $name = '';
        $categories = [];
        $categories["0"]  = "OG 1: edifici civili e industriali";
        $categories["1"]  = "OG 2: restauro e manutenzione dei beni immobili sottoposti a tutela";
        $categories["2"]  = "OG 3: strade, autostrade, ponti, viadotti, ferrovie, metropolitane...";
        $categories["3"]  = "OG 4: opere d'arte nel sottosuolo";
        $categories["4"]  = "OG 5: dighe";
        $categories["5"]  = "OG 6: acquedotti, gasdotti, oleodotti...";
        $categories["6"]  = "OG 7: opere marittime e lavori di drenaggio";
        $categories["7"]  = "OG 8: opere fluviali, di difesa, di sistemazione idraulica e di bonifica";
        $categories["8"]  = "OG 9: impianti per la produzione di energia elettrica";
        $categories["9"]  = "OG 10: impianti per la trasformazione alta/media tensione...";
        $categories["10"] = "OG 11: impianti tecnologici";
        $categories["11"] = "OG 12: opere ed impianti di bonifica e protezione ambiente";
        $categories["12"] = "OG 13: opere di ingegneria naturalistica";
        $categories["13"] = "OS 1: lavori in terra";
        $categories["14"] = "OS 2-A: superfici decorate di beni architettonici e beni culturali mobili di interesse storico, artistico, archeologico ed etnoatropologico";
        $categories["15"] = "OS 2-B: beni culturali mobili di interesse archivistico e librario";
        $categories["16"] = "OS 3: impianti idrico-sanitario, cucine, lavanderie";
        $categories["17"] = "OS 4: impianti elettromecanici trasportatori";
        $categories["18"] = "OS 5: impianti pneumatici e antintrusione";
        $categories["19"] = "OS 6: finiture di opere generali in materiali lignei, plastici, metallici e vetrosi";
        $categories["20"] = "OS 7: finiture di opere generali di natura edile";
        $categories["21"] = "OS 8: finiture di opere generali di natura tecnica";
        $categories["22"] = "OS 9: impianti per la segnaletica luminosa e la sicurezza del traffico";
        $categories["23"] = "OS 10: segnaletica stradale non luminosa";
        $categories["24"] = "OS 11: apparecchiature strutturali speciali";
        $categories["25"] = "OS 12-A: barriere stradali di sicurezza";
        $categories["26"] = "OS 12-B: barriere paramassi, fermaneve e simili";
        $categories["27"] = "OS 13: strutture prefabbricate in cemento armato";
        $categories["28"] = "OS 14: impianti di smaltimento e recupero dei rifiuti";
        $categories["29"] = "OS 15: pulizie di acque marine, lacustri, fluviali";
        $categories["30"] = "OS 16: impianti per centrali di produzione energia elettrica";
        $categories["31"] = "OS 17: linee telefoniche ed impianti di telefonia";
        $categories["32"] = "OS 18-A: componenti strutturali in acciaio";
        $categories["33"] = "OS 18-B: componenti per facciate continue";
        $categories["34"] = "OS 19: impianti di reti di telecomunicazione trasmissione dati";
        $categories["35"] = "OS 20-A: rilevamenti topografici";
        $categories["36"] = "OS 20-B: indagini geognostiche";
        $categories["37"] = "OS 21: opere strutturali speciali";
        $categories["38"] = "OS 22: impianti di potabilizzazione e depurazione";
        $categories["39"] = "OS 23: demolizione di opere";
        $categories["40"] = "OS 24: verde e arredo urbano";
        $categories["41"] = "OS 25: scavi archeologici";
        $categories["42"] = "OS 26: pavimentazioni e sovrastrutture speciali";
        $categories["43"] = "OS 27: impianti per la trazione elettrica";
        $categories["44"] = "OS 28: impianti termici e di condizionamento";
        $categories["45"] = "OS 29: armamento ferroviario";
        $categories["46"] = "OS 30: impianti interni elettrici, telefonici, radiotelefonici e televisivi";
        $categories["47"] = "OS 31: impianti per la mobilità sospesa";
        $categories["48"] = "OS 32: strutture in legno";
        $categories["49"] = "OS 33: coperture speciali";
        $categories["50"] = "OS 34: sistemi antirumore per infrastrutture di mobilità";
        $categories["51"] = "OS 35: interventi a basso impatto ambientale";

        if (isset($categories[$this->category])) {
            $name = $categories[$this->category];
        }

        return $name;
    }
}