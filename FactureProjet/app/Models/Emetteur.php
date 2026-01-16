<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emetteur extends Model
{
    protected $fillable = [
        'NomEmetteur'
    ];
    public function facture()
    {
        return $this->hasMany('App\Models\Facture', 'idEmetteur');
    }
}
