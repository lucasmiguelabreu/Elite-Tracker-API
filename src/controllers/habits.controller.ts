import { type Request, type Response } from 'express';

import { habitModel } from '../models/habit.model';
import { z } from 'zod';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message.util';

export class HabbitsController { 
    store = async (request: Request, response: Response): Promise<Response> => {
        const schema = z.object({
            name: z.string(),
        
        })

        const habit = schema.safeParse(request.body);

        if (!habit.success) {
            const errors = buildValidationErrorMessage(habit.error.issues);
    
            return response.status(422).json({ message: errors });
        }

        const findHabit = await habitModel.findOne({
            name: habit.data.name,
        });

        if(findHabit) {
            return response.status(400).json({ message:'Habit already existis.' });
        }

        const newHabits = await habitModel.create({
            name:  habit.data.name,
            completedDates: [],
        });

        return response.status(201).json(newHabits);
    };
}