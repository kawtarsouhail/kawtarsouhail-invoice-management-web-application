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
        Schema::create('reliquats', function (Blueprint $table) {
            $table->id();
            $table->float('MontantEnc');
            $table->date('dateReliquat');
            $table->String('ModeReg');
            $table->bigInteger('idFacture')->unsigned();
            $table->unsignedBigInteger('idRemise')->nullable();
            $table->unsignedBigInteger('idCheque')->nullable();
            $table->timestamps();
            $table->foreign('idFacture')->references('id')->on('factures')->onDelete('cascade');
            $table->foreign('idRemise')->references('id')->on('remises')->onDelete('cascade');;
            $table->foreign('idCheque')->references('id')->on('cheques')->onDelete('cascade'); ;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reliquats');
    }
};
