import { z } from 'zod';

export const SpeciesEnum = z.enum(['cat', 'dragon', 'blob', 'plant', 'rock']);

export const CreatePetSchema = z.object({
  name: z.string().min(1).max(20),
  species: SpeciesEnum,
});

export const UpdatePetSchema = z.object({
  name: z.string().min(1).max(20),
});