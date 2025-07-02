'use server';

import { addLog } from '@/services/logs';

export async function logLoginAction(uid: string) {
    if (!uid) return;
    await addLog(uid, 'USER_LOGIN');
}

export async function logLogoutAction(uid: string) {
    if (!uid) return;
    await addLog(uid, 'USER_LOGOUT');
}
