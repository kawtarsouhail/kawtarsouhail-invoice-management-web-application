<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reliquat extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'MontantEnc',
        'dateReliquat',
        'ModeReg',
        'idFacture',
        'idRemise',
        'idCheque',
    ];
    public function remise()
    {
        return $this->belongsTo('App\Models\Remise', 'idRemise');
    }
    public function Cheque()
    {
        return $this->belongsTo('App\Models\Cheque', 'idCheque');
    }
    public function Facture()
    {
        return $this->belongsTo('App\Models\Facture', 'idFacture');
    }
}
