<?php

namespace App\Enums;

class UserRole
{
    const SUPER_ADMIN = 'Super Admin';
    const ADMIN = 'Admin';
    const USER = 'Utilisateur';

    public static function getRoles()
    {
        return [
            self::SUPER_ADMIN,
            self::ADMIN,
            self::USER,
        ];
    }

    public static function isValidRole($role)
    {
        return in_array($role, self::getRoles());
    }
}
