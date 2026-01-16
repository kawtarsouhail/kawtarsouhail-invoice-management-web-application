<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bon_livraisons', function (Blueprint $table) {
            $table->id();
            $table->string('NumBonLiv');
            $table->bigInteger('idClient')->unsigned(); 
            $table->date('dateBonLiv');
            $table->string('TypeValidation');
            $table->date('dateValidation');
            $table->string('NumBonCommande')->nullable();
            $table->timestamps();
        
            $table->foreign('idClient')->references('id')->on('clients') ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bon_livraisons');
    }
    // public function down()
    // {
    //     Schema::table('bon_livraisons', function (Blueprint $table) {
    //         $table->string('NumBonCommande')->change();
    //     });
    // }
};
