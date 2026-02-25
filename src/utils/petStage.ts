import { differenceInMilliseconds } from 'date-fns';
import { NEGLECT_THRESHOLD_MS } from './config.js';
import type { Pet } from '../entities/Pet.js';

export type PetStage = {
    stage: string;
    stageEmoji: string;
    cooked: boolean;
};

export function computePetStage(pet: Pet, totalLogs: number): PetStage {
    const ms = differenceInMilliseconds(new Date(), pet.lastFedAt);
    const cooked = ms > NEGLECT_THRESHOLD_MS;

    if (cooked) return { stage: 'Cooked', stageEmoji: '🍗', cooked: true };

    if (totalLogs === 0) return { stage: 'Egg', stageEmoji: '🥚', cooked: false };
    if (totalLogs >= 1 && totalLogs <= 4) return { stage: 'Hatching', stageEmoji: '🐣', cooked: false };
    if (totalLogs >= 5 && totalLogs <= 14) return { stage: 'Growing', stageEmoji: '🐥', cooked: false };
    return { stage: 'Grown', stageEmoji: '🐓', cooked: false };
}

export function cookedPetMessage() {
    return { message: 'This pet has been cooked. Adopt a new one.' };
}

export function clamp0to100(n: number) {
    return Math.max(0, Math.min(100, n));
}