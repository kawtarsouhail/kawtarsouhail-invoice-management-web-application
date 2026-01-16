<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remise extends Model
{
   
   // protected $primaryKey = 'NumRemise';

    protected $fillable = ['NumRemise'];

    public function cheque()
    {
        return $this->hasMany('App\Models\Cheque', 'idRemise');
    }
    public function Facture()
    {
        return $this->hasMany('App\Models\Facture', 'idRemise');
    }
    public function Reliquat()
    {
        return $this->hasMany('App\Models\Reliquat', 'idRemise');
    }


}
