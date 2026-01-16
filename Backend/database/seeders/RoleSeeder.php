<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class RoleSeeder extends Seeder
{
    public function run()
    {

      
        
        foreach (UserRole::getRoles() as $role) {
            // Vérifier si le rôle existe déjà dans la table
            $roleId = DB::table('roles')->where('name', $role)->where('guard_name', 'web')->value('id');

            if (!$roleId) {
                $roleId = DB::table('roles')->insertGetId([
                    'name' => $role,
                    'guard_name' => 'web',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Vérifier le rôle et insérer les permissions appropriées
            if ($role === UserRole::SUPER_ADMIN) {
                $permissions = [
                    'edit_users', 'delete_users', 'view_all_users', 'create_users',
                    'edit_factures', 'delete_factures', 'create_factures', 'view_all_factures',
                    'view_facture_by_num','view_reliquat','delete_reliquat','edit_reliquat','create_reliquat'

                ];
            } elseif ($role === UserRole::ADMIN) {
                $permissions = [
                    'edit_factures', 'delete_factures', 'create_factures', 'view_all_factures',
                    'view_facture_by_num','view_reliquat','delete_reliquat','edit_reliquat','create_reliquat'
                ];
            } elseif ($role === UserRole::USER) {
                $permissions = [
                    'view_all_factures','view_facture_by_num','view_reliquat'
                ];
            }

            foreach ($permissions as $permission) {
                // Vérifier si la permission existe déjà dans la table
                $permissionId = DB::table('permissions')->where('name', $permission)->where('guard_name', 'web')->value('id');

                if (!$permissionId) {
                    $permissionId = DB::table('permissions')->insertGetId([
                        'name' => $permission,
                        'guard_name' => 'web',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // Vérifier si la relation existe déjà dans la table pivot
                if (!DB::table('role_has_permissions')->where('role_id', $roleId)->where('permission_id', $permissionId)->exists()) {
                    DB::table('role_has_permissions')->insert([
                        'role_id' => $roleId,
                        'permission_id' => $permissionId,
                    ]);
                }
            }
        }
         // Crée un utilisateur avec un rôle spécifique
        
        User::create([
            'name' => 'super Admin',
            'email' => 'superadmin@gmail.com',
            'password' => Hash::make('superadmin@123'),
        ])->assignRole(UserRole::SUPER_ADMIN);
        User::create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin@123'),
        ])->assignRole(UserRole::ADMIN);
        User::create([
            'name' => 'user',
            'email' => 'user@gmail.com',
            'password' => Hash::make('user@123'),
        ])->assignRole(UserRole::USER);
        

    }
}
