<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;

use App\Models\Reliquat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 
use App\Models\Cheque;
use App\Models\Facture;
use App\Models\Remise;

class ReliquatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Vérification de la permission
        if (!auth()->user()->can('create_reliquat')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }
      $data = Reliquat::With([
        'Remise:id,NumRemise',
        'Cheque:id,NumCheque',
        'Facture:id,NumFacture',
      ])->get([
        'id','MontantEnc','dateReliquat','ModeReg','idFacture','idRemise','idCheque'
      ]);
      return response()->json(['data' => $data], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Vérification de la permission
        if (!auth()->user()->can('create_reliquat')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }
        $validatedData = $request->validate([
            'MontantEnc' => 'required|numeric',
            'ModeReg' => 'required|String',
            'dateReliquat' => 'required|date',
            'NumRemise' => 'nullable|string',
            'NumCheque' => 'nullable|string|unique:cheques',
            'NumFacture' => 'required|string' 
     ]);
   DB::beginTransaction();

   try {

    try {
        $facture = Facture::where('NumFacture', $validatedData['NumFacture'])->firstOrFail();
    } catch (ModelNotFoundException $e) {
        DB::rollback();
        return response()->json(['message' => 'Erreur: Facture avec ce numéro non trouvée.'], 404);
    }

    $idFacture = $facture->id;

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
    $reliquat = Reliquat::create([
        'MontantEnc' => $validatedData['MontantEnc'],
        'dateReliquat' => $validatedData['dateReliquat'],
        'ModeReg' => $validatedData['ModeReg'],
        'idFacture' => $idFacture,
        'idRemise' => $remise ? $remise->id : null,
        'idCheque' => $cheque ? $cheque->id : null,
    ]);

        DB::commit();
        return response()->json(['message' => 'Reliquat enregistrée avec succès'], 201);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['message' => 'Erreur lors de l\'enregistrement de la Reliquat', 'error' => $e->getMessage()], 500);
    }
    }

    public function update(Request $request, Reliquat $reliquat)
    {
        if (!auth()->user()->can('edit_reliquat')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Définition des règles de validation
        $rules = [
            'MontantEnc' => 'required|numeric',
            'ModeReg' => 'required|string',
            'dateReliquat' => 'required|date',
            'NumRemise' => 'nullable|string',
            'NumFacture' => 'required|string',
        ];
    
        if ($request->input('ModeReg') === 'CHÈQUE') {
            $rules['NumCheque'] = 'required|string|unique:cheques,NumCheque,' . $reliquat->idCheque;
        }
    
        $validatedData = $request->validate($rules);
    
        // Commence une transaction
        DB::beginTransaction();
    
        try {
             // Trouver la facture associée
             $facture = Facture::where('NumFacture', $validatedData['NumFacture'])->firstOrFail();
             $idFacture = $facture->id;
     
             // Mettre à jour les données du reliquat
             $reliquat->update([
                 'MontantEnc' => $validatedData['MontantEnc'],
                 'dateReliquat' => $validatedData['dateReliquat'],
                 'ModeReg' => $validatedData['ModeReg'],
                 'idFacture' => $idFacture,
             ]);
    
            // Gestion des remises et des chèques
            if ($validatedData['ModeReg'] === 'CHÈQUE') {
                $remise = Remise::updateOrCreate(
                    ['NumRemise' => $validatedData['NumRemise']],
                    ['NumRemise' => $validatedData['NumRemise']]
                );
    
                $cheque = Cheque::updateOrCreate(
                    ['NumCheque' => $validatedData['NumCheque']],
                    ['NumCheque' => $validatedData['NumCheque'], 'idRemise' => $remise->id]
                );
    
                $reliquat->update([
                    'idRemise' => $remise->id,
                    'idCheque' => $cheque->id,
                ]);
            } else {
             
                // Supprime seulement le chèque si le mode de règlement n'est plus un chèque
                if ($reliquat->cheque) {
                    $reliquat->update(['idCheque' => null]);
                    $reliquat->update(['idRemise' => null]);
                    $reliquat->cheque->delete();
                }

                
            }
    
            // Confirme les modifications
            DB::commit();
            return response()->json(['message' => 'Reliquat mis à jour avec succès'], 200);
        } catch (\Exception $e) {
            // Annule les modifications en cas d'erreur
            DB::rollback();
            return response()->json(['message' => 'Erreur lors de la mise à jour du reliquat', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Vérification de la permission
        if (!auth()->user()->can('delete_reliquat')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }
        DB::beginTransaction();
        try {
            $reliquat = Reliquat::findOrFail($id); // Récupérer le reliquat spécifique
    
            // Delete associated Cheques
            if ($reliquat->idCheque) {
                $cheque = Cheque::where('id', $reliquat->idCheque)->first();
                if ($cheque) {
                    $cheque->delete();
                }
            }
    
            // Delete associated Remises and associated Cheques
            if ($reliquat->idRemise) {
                $remise = Remise::where('id', $reliquat->idRemise)->first();
                if ($remise) {
                    $remiseCheques = Cheque::where('idRemise', $remise->id)->get();
                    foreach ($remiseCheques as $cheque) {
                        $cheque->delete();
                    }
                    $remise->delete();
                }
            }
    
            // Delete Reliquat
            $reliquat->delete();
    
            DB::commit();
            return response()->json(['message' => 'All associated records successfully deleted'], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Error during deletion', 'error' => $e->getMessage()], 500);
        }
    }

    public function getReliquatByNumeroFacture($NumFacture)
    {
          // Vérification de la permission
          if (!auth()->user()->can('view_reliquat')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }
        $data = Reliquat::with([
            'Remise:id,NumRemise',
            'Cheque:id,NumCheque',
            'Facture:id,NumFacture',
        ])->whereHas('Facture', function ($query) use ($NumFacture) {
            $query->where('NumFacture', $NumFacture);
        })->get([
            'id','MontantEnc','dateReliquat','ModeReg','idFacture','idRemise','idCheque'
        ]);
        
        return response()->json(['data' => $data], 200);
    }

}
