import type { Request, Response } from 'express';

import { pets } from '../models/pets.js';
import { habits } from '../models/habits.js';
import { logs, logIdCounter } from '../models/logs.js';

import { CreateLogSchema } from '../validators/logs.js';
import { clamp0to100, computePetStage, cookedPetMessage } from '../utils/petStage.js';
import type { Log } from '../entities/Log.js';

// POST /pets/:petId/logs
export function createLog(req: Request, res: Response) {
  const petId = Number(req.params.petId);

  const pet = pets.find(p => p.id === petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });

  const totalLogs = logs.filter(l => l.petId === petId).length;
  const { cooked } = computePetStage(pet, totalLogs);
  if (cooked) return res.status(400).json(cookedPetMessage());

  const parsed = CreateLogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const habit = habits.find(h => h.id === parsed.data.habitId);
  if (!habit || habit.petId !== petId) {
    return res.status(400).json({ message: 'Habit does not belong to this pet' });
  }

  const stat = habit.statBoost; // 'happiness' | 'hunger' | 'energy'
  pet[stat] = clamp0to100(pet[stat] + 10);

  pet.lastFedAt = new Date();

  const log: Log = {
    id: logIdCounter.value++,
    petId,
    habitId: parsed.data.habitId,
    date: parsed.data.date,
    ...(parsed.data.note !== undefined ? { note: parsed.data.note } : {}),
  };

  logs.push(log);
  return res.status(201).json(log);
}

// GET /pets/:petId/logs
export function listLogs(req: Request, res: Response) {
  const petId = Number(req.params.petId);

  const pet = pets.find(p => p.id === petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });

  const petLogs = logs.filter(l => l.petId === petId);
  return res.status(200).json(petLogs);
}