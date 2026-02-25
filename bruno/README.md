# Tender HW1 

## Description
This Bruno collection was created to test the Tender virtual pet API.
The API stores data in memory, so pets, habits, and logs reset whenever the server restarts. This behavior is expected for this assignment.

## Environment Setup
Environment Name: local

Variables:

api = http://localhost:3000  
petId = set after creating a pet  
habitId = set after creating a habit

Make sure the correct environment is selected before running requests.

## Running the Server
Start the server with:

npm run dev

Expected output:

Tender API running on port 3000

## Testing Steps
1. Create Pet - Valid  
   Expected: 201 Created  
   Save returned id as petId

2. Create Habit - Valid  
   Expected: 201 Created  
   Save returned id as habitId

3. Log Habit - Valid  
   Expected: 201 Created  
   Confirm stat increase

4. Get Pet - By ID  
   Confirm updated stats and stage

## Error Handling Tests
This collection includes requests that intentionally produce errors:

Create Pet - Invalid Body (400)  
Create Habit - Pet Not Found (404)  
Log Habit - Wrong habitId (400)

These tests verify validation and business logic.

## Neglect Test
To test neglect behavior, temporarily modify:

src/utils/config.ts

After restarting the server, wait past the threshold and attempt to log a habit.

Expected: 400 Bad Request