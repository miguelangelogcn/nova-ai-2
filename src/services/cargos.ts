'use server';

import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export type Cargo = {
    id: string;
    name: string;
    createdAt: string; // ISO string
};

type FirestoreCargo = Omit<Cargo, 'id' | 'createdAt'> & {
    createdAt: Timestamp;
};

export async function getCargos(): Promise<Cargo[]> {
    const cargosSnapshot = await adminDb.collection('cargos').orderBy('name').get();
    const cargos = cargosSnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreCargo;
        return {
            id: doc.id,
            name: data.name,
            createdAt: data.createdAt.toDate().toISOString(),
        } as Cargo;
    });
    return cargos;
}

export async function addCargo(name: string): Promise<{ id: string }> {
    const cargoRef = adminDb.collection('cargos').doc();
    const newCargo: FirestoreCargo = {
        name,
        createdAt: Timestamp.now(),
    };
    await cargoRef.set(newCargo);
    
    revalidatePath('/dashboard/admin/cargos');
    revalidatePath('/dashboard/admin/users');
    revalidatePath('/dashboard/profile');

    return { id: cargoRef.id };
}

export async function updateCargo(id: string, name: string): Promise<void> {
    const cargoRef = adminDb.collection('cargos').doc(id);
    await cargoRef.update({ name });
    
    revalidatePath('/dashboard/admin/cargos');
    revalidatePath('/dashboard/admin/users');
    revalidatePath('/dashboard/profile');
}

export async function deleteCargo(id: string): Promise<void> {
    const cargoRef = adminDb.collection('cargos').doc(id);
    await cargoRef.delete();
    
    revalidatePath('/dashboard/admin/cargos');
    revalidatePath('/dashboard/admin/users');
    revalidatePath('/dashboard/profile');
}
