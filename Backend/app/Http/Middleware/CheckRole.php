<?php

// namespace App\Http\Middleware;

// use Closure;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth; 
// use Illuminate\Support\Facades\Log;
// use Spatie\Permission\Models\Role;


// class CheckRole
// {  
//     public function handle(Request $request, Closure $next, ...$roles)
//     {
//         $user = Auth()->user();
//         Log::info('Vérification du rôle', ['utilisateur' => $user->name, 'roles' => $roles]);
    
//         foreach ($roles as $role) {
//             if ($user->hasRole($role)) {
//                 return $next($request);
//             }
//         }
        
//         return response()->json(['message' => 'Unauthorized - Role not sufficient'], 403);
//     }
    
// } -->
// Dans App\Http\Middleware\CheckRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class CheckRole
{  
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth()->user();

        // Log pour les vérifications du rôle
        Log::info('Vérification du rôle', ['utilisateur' => $user->name, 'roles' => $roles]);

        // Vérification des rôles
        foreach ($roles as $role) {
            if (is_string($role) && $user->hasRole($role)) {
                return $next($request);
            }
            // Étendre la logique pour inclure la vérification de permissions si spécifiée comme "role|permission"
            if (str_contains($role, '|')) {
                [$roleName, $permission] = explode('|', $role, 2);
                if ($user->hasRole($roleName) && $user->can($permission)) {
                    return $next($request);
                }
            }
        }

        return response()->json(['message' => 'Unauthorized - Role or Permission not sufficient'], 403);
    }  
}

