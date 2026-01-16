<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cheque extends Model
{
   // protected $primaryKey = 'NumCheque';
    protected $fillable = [
        'NumCheque',
        'idRemise'
    ];
    public function remise()
    {
        return $this->belongsTo('App\Models\Remise', 'idRemise');
    }
    public function Facture()
    {
        return $this->hasOne('App\Models\Facture', 'idCheque');
    }
    public function Reliquat()
    {
        return $this->hasOne('App\Models\Reliquat', 'idCheque');
    }


}
