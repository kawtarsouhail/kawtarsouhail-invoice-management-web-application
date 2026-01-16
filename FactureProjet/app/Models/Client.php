<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'NomClient'
    ];
    public function facture()
    {
        return $this->hasMany('App\Models\Facture', 'idClient');
    }

}
