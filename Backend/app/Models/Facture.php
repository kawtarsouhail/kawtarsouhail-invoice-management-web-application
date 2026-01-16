<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    //protected $primaryKey = 'NumFacture';

    protected $fillable = [
        'id',
        'NumFacture',
        'MontantHT',
        'DateFacture',
        'Taux',
        'TVA',
        'MontantTTC',
        'idEmetteur',
        'idClient',
        'idBonLiv',
        'TypeContrat',
        'EtabliPar',
        'EtaPayement',
        'ModeReg',
        'idRemise',
        'idCheque',
        'MontantEnc',
        'DatePayement',

    ];

    public function Emetteur()
    {
        return $this->belongsTo('App\Models\Emetteur', 'idEmetteur');
    }

    public function Client()
    {
        return $this->belongsTo('App\Models\Client', 'idClient');
    }
    public function BonLivraison()
    {
        return $this->belongsTo('App\Models\BonLivraison', 'idBonLiv');
    }

    public function remise()
    {
        return $this->belongsTo('App\Models\Remise', 'idRemise');
    }
    public function Cheque()
    {
        return $this->belongsTo('App\Models\Cheque', 'idCheque');
    }
    public function Reliquat()
    {
        return $this->hasOne('App\Models\Reliquat', 'idFacture');
    }
}
