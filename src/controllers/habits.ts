import type { Request, Response } from 'express';

import { pets } from '../models/pets.js';
import { habits, habitIdCounter } from '../models/habits.js';
import { logs } from '../models/logs.js';

import { CreateHabitSchema } from '../validators/habits.js';
import { computePetStage, cookedPetMessage } from '../utils/petStage.js';

function totalLogsForPet(petId: number) {
  return logs.filter(l => l.petId === petId).length;
}

export function createHabit(req: Request, res: Response) {
  const petId = Number(req.params.petId);

  const pet = pets.find(p => p.id === petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });

  const { cooked } = computePetStage(pet, totalLogsForPet(petId));
  if (cooked) return res.status(400).json(cookedPetMessage());

  const parsed = CreateHabitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const habit = {
    id: habitIdCounter.value++,
    petId,
    ...parsed.data,
  };

  habits.push(habit);
  return res.status(201).json(habit);
}

export function listHabits(req: Request, res: Response) {
  const petId = Number(req.params.petId);

  const pet = pets.find(p => p.id === petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });

  let result = habits.filter(h => h.petId === petId);

  const category = req.query.category;
  if (typeof category === 'string') {
    result = result.filter(h => h.category === category);
  }

  return res.status(200).json(result);
}