import type { Request, Response } from 'express';
import { pets, petIdCounter } from '../models/pets.js';
import { habits } from '../models/habits.js';
import { logs } from '../models/logs.js';
import { CreatePetSchema, UpdatePetSchema } from '../validators/pets.js';
import { computePetStage } from '../utils/petStage.js';

function totalLogsForPet(petId: number) {
  return logs.filter(l => l.petId === petId).length;
}

function petToResponse(pet: (typeof pets)[number]) {
  const totalLogs = totalLogsForPet(pet.id);
  const { stage, stageEmoji } = computePetStage(pet, totalLogs);
  return { ...pet, stage, stageEmoji };
}

export function createPet(req: Request, res: Response) {
  const parsed = CreatePetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const pet = {
    id: petIdCounter.value++,
    name: parsed.data.name,
    species: parsed.data.species,
    happiness: 50,
    hunger: 50,
    energy: 50,
    lastFedAt: new Date(),
  };

  pets.push(pet);
  return res.status(201).json(petToResponse(pet));
}

export function listPets(req: Request, res: Response) {
  let result = [...pets];

  if (req.query.species) {
    result = result.filter(p => p.species === req.query.species);
  }

  if (req.query.minHappiness) {
    const min = Number(req.query.minHappiness);
    result = result.filter(p => p.happiness >= min);
  }

  return res.status(200).json(result.map(petToResponse));
}

export function getPet(req: Request, res: Response) {
  const petId = Number(req.params.petId);

  const pet = pets.find(p => p.id === petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });

  return res.status(200).json(petToResponse(pet));
}

export function updatePet(req: Request, res: Response) {
  const petId = Number(req.params.petId);

  const pet = pets.find(p => p.id === petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });

  const parsed = UpdatePetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  pet.name = parsed.data.name;

  return res.status(200).json(petToResponse(pet));
}

export function deletePet(req: Request, res: Response) {
  const petId = Number(req.params.petId);

  const index = pets.findIndex(p => p.id === petId);
  if (index === -1) return res.status(404).json({ message: 'Pet not found' });

  pets.splice(index, 1);

  return res.status(204).send();
}