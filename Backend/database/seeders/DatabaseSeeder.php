<?php

namespace Database\Seeders;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use App\Models\Emetteur;
use App\Models\Client;
use App\Models\BonLivraison;
use App\Models\Facture;
use App\Models\Remise;
use App\Models\Cheque;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
{
    DB::beginTransaction();

    try {
        for ($i = 0; $i < 20; $i++) {
            $emetteur = Emetteur::create(['NomEmetteur' => 'Emetteur ' . $i]);
            $client = Client::create(['NomClient' => 'Client ' . $i]);

            $bonLivraison = BonLivraison::create([
                'NumBonLiv' => 'bona' . $i,
                'idClient' => $client->id,
                'dateBonLiv' => now(),
                'TypeValidation' => 'Type ' . $i,
                'dateValidation' => now()

            ]);

            // Randomly choosing payment status
            $paymentStatus = ['PAYEE', 'IMPAYEE'][rand(0, 1)];
            // Randomly choosing payment mode
            $paymentMode = ['ESPÈCE', 'CHÈQUE', 'VIREMENT', 'PAR EFFET'][rand(0, 3)];

            $remise = null;
            $cheque = null;

            // Create remittance and check records only if mode is CHEQUE and status is PAYEE
            if ($paymentMode == 'CHÈQUE' && $paymentStatus == 'PAYEE') {
                $remise = Remise::create([
                    'NumRemise' => 'r' . $i,
                ]);

                $cheque = Cheque::create([
                    'NumCheque' => 'ch' . $i,
                    'idRemise' => $remise->id,
                ]);
            }

            // Create invoice with conditional fields
            $facture = Facture::create([
                'NumFacture' => 'f' . $i,
                'MontantHT' => rand(1000, 10000),
                'DateFacture' => now(),
                'DatePayement' => now(),
                'Taux' => rand(0, 1),
                'TVA' => rand(500, 2000),
                'MontantTTC' => rand(1100, 1200),
                'idEmetteur' => $emetteur->id,
                'idClient' => $client->id,
                'TypeContrat' => 'contrat', // Assuming 'contrat' is a default constant
                'EtabliPar' => 'Etablissement ' . $i,
                'EtaPayement' => $paymentStatus, // Use generated payment status
                'ModeReg' => $paymentMode, // Use generated payment mode
                'MontantEnc' => ($paymentStatus == 'PAYEE') ? rand(6000, 7000) : 0, // Conditional based on payment status
                'idBonLiv' => $bonLivraison->id,
                'idRemise' => $remise ? $remise->id : null,
                'idCheque' => $cheque ? $cheque->id : null,
            ]);
        }

        DB::commit();
        echo "Les données ont été insérées avec succès.\n";
    } catch (\Exception $e) {
        DB::rollback();
        echo "Une erreur s'est produite : " . $e->getMessage() . "\n";
    }
}

}
