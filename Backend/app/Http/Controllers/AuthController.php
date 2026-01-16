<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB; 

use App\Enums\UserRole;


class AuthController extends Controller {

    //cree users
    public function register(RegisterRequest $request)
    {
     
        // Vérification de la permission
        if (!auth()->user()->can('create_users')) {
            return response()->json(['message' => 'Unauthorized'], 403);
            }

        DB::beginTransaction(); // Start transaction

        try {
            // Create user
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                //'role' => $request->input('role'),
                'password' => bcrypt($request->input('password')),
            ]);

            // Assign role
            $roleName = $request->input('role');
            if (UserRole::isValidRole($roleName)) {
                $user->assignRole($roleName); // Automatically assigns permissions associated with the role
            } else {
                throw new Exception("Invalid role specified: $roleName");
            }

            DB::commit(); // Commit transaction
            return response()->json($user, 201); // Return success with user data
        } catch (Exception $e) {
            DB::rollBack(); // Roll back the transaction on error
            return response()->json(['error' => $e->getMessage()], 500); // Return error
        }
    }

    

    // login a user method
    public function login(LoginRequest $request) {

        $data = $request->validated();
    
        $user = User::where('email', $data['email'])->first();
    
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Email or password is incorrect!'
            ], 401);
        }
    
        // Créer un jeton d'authentification pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'user' => new UserResource($user),
                'token' => $token,
            ]);

    }
    
    // logout a user method
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        $cookie = cookie()->forget('token');

        return response()->json([
            'message' => 'Logged out successfully!'
        ])->withCookie($cookie);
    }

    // get the authenticated user method
    public function user(Request $request) {
        $user = $request->user();
        // S'assurer que l'utilisateur a au moins un rôle attribué
        $role = $user->roles()->first();
        // Assurer que le rôle existe avant d'essayer d'accéder à son nom
        $roleName = $role ? $role->name : 'No role assigned';  
        return response()->json([
            'user' => new UserResource($user),
            'role' => $roleName
        ]);
    }
    
   //affiche users
    public function afficher() {

         // Vérification de la permission
     if (!auth()->user()->can('view_all_users')) {
        return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::with('roles')->get();  // Eager-load roles
        return response()->json($users->map(function ($user) {
            $userResource = new UserResource($user);
            $roles = $user->getRoleNames();  // getRoleNames returns an array of role names
            return [
                'user' => $userResource,
                'roles' => $roles // make sure it's an array, consistent with how single user roles are sent
            ];
        }));
    }
    

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        // Vérification de la permission
        if (!auth()->user()->can('edit_users')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string',
            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ]
        ]);
    
        // Vérifier si un nouveau rôle est spécifié
        if ($request->has('role')) {
            $roleName = $request->input('role');
            if (UserRole::isValidRole($roleName)) {
                // Révoquer l'ancien rôle de l'utilisateur s'il en a un
                if ($user->roles->count() > 0) {
                    $user->removeRole($user->roles->first());
                }
                // Assigner le nouveau rôle
                $user->assignRole($roleName);
            } else {
                throw new Exception("Invalid role specified: $roleName");
            }
        }
    
        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }
        
        $user->update($validatedData);
    
        return response()->json(['message' => 'User updated successfully', 'user' => new UserResource($user), 'role' => $roleName]);
    }
    

    //supprimer user
    public function destroy($id) {

        // Vérification de la permission
        if (!auth()->user()->can('delete_users')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
            
        // Récupération de l'utilisateur par ID
        $user = User::findOrFail($id);
    
        // Suppression de l'utilisateur
        $user->delete();
    
        // Retourner une réponse informant de la suppression
        return response()->json([
            'message' => 'User account has been deleted successfully'
        ]);
    }
        
     
}