'use server';

import { getAllUsers } from '@/services/user.admin';

/**
 * Server action to get all users and sort them alphabetically by display name.
 * This function is called by the AdminUsersPage.
 * @returns A promise that resolves to a sorted array of AppUser objects.
 */
export async function getUsersAction() {
    try {
        const users = await getAllUsers();
        // Sort users by display name alphabetically before returning
        users.sort((a, b) => a.displayName.localeCompare(b.displayName));
        return users;
    } catch (error: any) {
        console.error("Erro ao buscar usuários (ação):", error.message);
        // Re-throw the original error message to provide clear feedback on the UI
        throw new Error(error.message);
    }
}
