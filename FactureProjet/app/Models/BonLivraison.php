<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BonLivraison extends Model
{
   // protected $primaryKey = 'NumBonLiv';

    protected $fillable = [
        'NumBonLiv', 'idClient', 'dateBonLiv', 'TypeValidation','dateValidation','NumBonCommande'
    ];
    public function Facture()
{
    return $this->hasOne('App\Models\Facture', 'idBonLiv');
}


}
