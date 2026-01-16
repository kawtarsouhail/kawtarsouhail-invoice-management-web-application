<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\BonLivraison;
use App\Models\Cheque;
use App\Models\Client;
use App\Models\Emetteur;
use App\Models\Facture;
use App\Models\Remise;

use Illuminate\Http\Request;

class FactureController extends Controller
{

 /****************** cree facture******************* */
public function store(Request $request)
{
        // Vérification de la permission
     if (!auth()->user()->can('create_factures')) {
        return response()->json(['message' => 'Unauthorized'], 403);
        }

    // Validate the request data
    $validatedData = $request->validate([
        'NumFacture' => 'required|string|unique:factures',
        'MontantHT' => 'required|numeric',
        'DateFacture' => 'required|date',
        'Taux' => 'required|numeric',
        'DatePayement' => 'required|date',
        'TypeContrat' => 'required|string',
        'EtabliPar' => 'required|string',
        'EtaPayement' => 'required|string',
        'ModeReg' => 'required|string',
        'NomEmetteur' => 'required|string',
        'NomClient' => 'required|string',
        'NumBonLiv' => 'required|string|unique:bon_livraisons',
        'dateBonLiv' => 'required|date',
        'TypeValidation' => 'required|string',
        'dateValidation' => 'required|date',
        'NumBonCommande' => 'nullable|string',
        'NumRemise' => 'nullable|string',
        'MontantEnc' => 'required|numeric',
        'NumCheque' => 'nullable|string|unique:cheques'
    ]);

    DB::beginTransaction();

    try {
        $emetteur = Emetteur::create(['NomEmetteur' => $validatedData['NomEmetteur']]);

        $client = Client::create(['NomClient' => $validatedData['NomClient']]);

        $bonLivraison = BonLivraison::create([
            'NumBonLiv' => $validatedData['NumBonLiv'],
            'idClient' => $client->id,
            'dateBonLiv' => $validatedData['dateBonLiv'],
            'TypeValidation' => $validatedData['TypeValidation'],
            'dateValidation' => $validatedData['dateValidation'],
            'NumBonCommande' => $validatedData['NumBonCommande']
        ]);
        $idBonLivraison = $bonLivraison->id;
        $remise = null;
        $cheque = null;

        if (!empty($validatedData['NumRemise'])) {
            $remise = Remise::create([
                'NumRemise' => $validatedData['NumRemise'],
            ]);
        }

        if (!empty($validatedData['NumCheque']) && $remise) {
            $cheque = Cheque::create([
                'NumCheque' => $validatedData['NumCheque'],
                'idRemise' => $remise->id,
            ]);
        }
        
        $facture = Facture::create([
            'NumFacture' => $validatedData['NumFacture'],
            'MontantHT' => $validatedData['MontantHT'],
            'DateFacture' => $validatedData['DateFacture'],
            'Taux' => $validatedData['Taux'],
            'MontantTTC' => $validatedData['MontantHT'] + $validatedData['MontantHT'] * $validatedData['Taux'] / 100,
            'TVA' => $validatedData['MontantHT'] * $validatedData['Taux'] / 100,
            'idEmetteur' => $emetteur->id,
            'idClient' => $client->id,
            'TypeContrat' => $validatedData['TypeContrat'],
            'EtabliPar' => $validatedData['EtabliPar'],
            'EtaPayement' => $validatedData['EtaPayement'],
            'ModeReg' => $validatedData['ModeReg'],
            'MontantEnc' => $validatedData['MontantEnc'], 
            'DatePayement' => $validatedData['DatePayement'],
            'idBonLiv' => $idBonLivraison, 
            'idRemise' => $remise ? $remise->id : null,
            'idCheque' => $cheque ? $cheque->id : null,
        ]);
        

        DB::commit();
        return response()->json(['message' => 'Facture enregistrée avec succès'], 201);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['message' => 'Erreur lors de l\'enregistrement de la facture', 'error' => $e->getMessage()], 500);
    }
}

     /****************** afficher les factures ****************** */

 public function getDonnees()
    {
        // Vérification de la permission
        if (!auth()->user()->can('view_all_factures')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }

        $donnees = Facture::with([
            'Emetteur:id,NomEmetteur', 
            'Client:id,NomClient', 
            'Remise:id,NumRemise', 
            'BonLivraison:id,NumBonLiv,dateBonLiv,TypeValidation,dateValidation,NumBonCommande',
            'Cheque:id,NumCheque',
        ])->get([
            'id','NumFacture', 'MontantHT', 'MontantEnc','DateFacture', 'Taux', 'TVA', 'MontantTTC', 
            'TypeContrat', 'EtabliPar', 'EtaPayement', 'ModeReg','DatePayement',
            'idClient', 'idEmetteur', 'idBonLiv', 'idCheque', 'idRemise'
        ]);


        return response()->json(['donnees' => $donnees], 200);
    }
        


        /****************** update facture******************* */
        public function update(Request $request, $id)
        {
            // Vérification de la permission
        if (!auth()->user()->can('edit_factures')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }

            $facture = Facture::findOrFail($id); // Trouver la facture par ID, ou échouer si non trouvée

            // Validation des données entrantes
            $validatedData = $request->validate([
                'MontantEnc' => 'required|numeric',
            ]);

            // Sauvegarde de l'ancien montant
            $ancienMontant = $facture->MontantEnc;

            // Mise à jour de la facture avec les données validées
            $facture->update($validatedData);

            // Retourner uniquement le montant modifié
            $nouveauMontant = $facture->MontantEnc;

            return response()->json([
                'message' => 'Facture mise à jour avec succès',
                'ancienMontant' => $ancienMontant,
                'nouveauMontant' => $nouveauMontant
            ], 200);
    }


    /****************** Delete facture******************* */


     public function delete($id)
        {
        // Vérification de la permission
        if (!auth()->user()->can('delete_factures')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }

            DB::beginTransaction();
            try {
                $bonLivraison = BonLivraison::findOrFail($id);
                $factures = Facture::where('idBonLiv', $id)->get();
        
                foreach ($factures as $facture) {
                    // Delete associated Cheques
                    if ($facture->idCheque) {
                        $cheque = Cheque::where('id', $facture->idCheque)->first();
                        if ($cheque) {
                            $facture->idCheque=null;
                            $facture->save();
                            $cheque->delete();
                            

                        }
                    }
        
                    // Delete associated Remises
                    if ($facture->idRemise) {
                        $remise = Remise::where('id', $facture->idRemise)->first();
                        if ($remise) {
                            $facture->idRemise=null;
                            $facture->save();
                            $remiseCheques = Cheque::where('idRemise', $remise->id)->get();
                            foreach ($remiseCheques as $cheque) {
                                $cheque->delete();
                            }
                            $remise->delete();
                        }
                    }
        
                    // Delete the Facture
                    $facture->delete();
                }
                  
                        // Delete Bon de Livraison
                $bonLivraison->delete();

                // Delete Client
                $client = Client::where('id', $bonLivraison->idClient)->first();
                if ($client) {
                    $client->delete();
                }
        
                DB::commit();
                return response()->json(['message' => 'All associated records successfully deleted'], 200);
            } catch (\Exception $e) {
                DB::rollback();
                return response()->json(['message' => 'Error during deletion', 'error' => $e->getMessage()], 500);
            }
        }
        
        
        public function getFactureByNumero($Num)
        {
       // Vérification de la permission
        if (!auth()->user()->can('view_facture_by_num')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }
            // Recherche de la facture dans la base de données
            $facture = Facture::with([
                'Emetteur:id,NomEmetteur', 
                'Client:id,NomClient', 
                'Remise:id,NumRemise', 
                'BonLivraison:id,NumBonLiv,idClient,dateBonLiv,TypeValidation',
                'Cheque:id,NumCheque,idRemise',
            ])->where('NumFacture', $Num)->first([
                'id','NumFacture', 'MontantHT', 'DateFacture', 'Taux', 'TVA', 'MontantTTC', 
                'TypeContrat', 'EtabliPar', 'EtaPayement', 'ModeReg', 'MontantEnc',
                'idClient', 'idEmetteur', 'idBonLiv', 'idCheque', 'idRemise','DatePayement'
            ]);
            
            // Vérification si la facture existe
            if ($facture) {
                // Retourner les données de la facture
                return response()->json($facture);
            } else {
                // Retourner une réponse si la facture n'est pas trouvée
                return response()->json(['error' => 'Facture non trouvée'], 404);
            }
        }

}    

