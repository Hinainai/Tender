import express from 'express';

import { createPet, listPets, getPet, updatePet, deletePet } from './controllers/pets.js';
import { createHabit, listHabits } from './controllers/habits.js';
import { createLog, listLogs } from './controllers/logs.js'; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pets
app.post('/pets', createPet);
app.get('/pets', listPets);
app.get('/pets/:petId', getPet);
app.put('/pets/:petId', updatePet);
app.delete('/pets/:petId', deletePet);

// Habits
app.post('/pets/:petId/habits', createHabit);
app.get('/pets/:petId/habits', listHabits);

// Logs
app.post('/pets/:petId/logs', createLog);
app.get('/pets/:petId/logs', listLogs); 

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Tender API running on port ${PORT}`);
});