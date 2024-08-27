import { type Request, type Response } from 'express';

import { habitModel } from '../models/habit.model';
import { z } from 'zod';
import dayjs from 'dayjs';
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

    index = async (request: Request, response: Response) => {
        const habits = await habitModel.find().sort({ name: 1 });

        return response.status(201).json(habits);
    };

    remove = async (request: Request, response: Response) => {
        const schema = z.object({
            id: z.string(),
        
        });

        const habit = schema.safeParse(request.params);
        
        if (!habit.success) {
            const errors = buildValidationErrorMessage(habit.error.issues);
    
            return response.status(422).json({ message: errors });
        };

        const findhabit = await habitModel.findOne({
            _id: habit.data.id,
        });

        if (!findhabit) {
            return response.status(422).json({ message: 'Habit not found' });
        }

        await habitModel.deleteOne({
            _id: habit.data.id,
        })

        return response.status(204).send()
    }

    toggle = async (request: Request, response: Response) => {
        const schema = z.object({
            id: z.string(),
        
        });

        const validated = schema.safeParse(request.params);
        
        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues);
    
            return response.status(422).json({ message: errors });
        };

        const findHabit = await habitModel.findOne({
            _id: validated.data.id,
        });

        if (!findHabit) {
            return response.status(422).json({ message: 'Habit not found' });
        }

        const now = dayjs().startOf('day').toISOString();

        const isHabitCompletedOnDate = findHabit.toObject()?.completedDates.find((item) => dayjs(String(item)).toISOString() === now);

        console.log(isHabitCompletedOnDate)

        if (isHabitCompletedOnDate) {
            const habitUpdated = await habitModel.findOneAndUpdate({
                _id: validated.data.id,
            }, 
            {
                $pull: {
                    completedDates: now,
                }
            },
            {
                returnDocument: 'after'
            })


            return response.status(200).json(habitUpdated);
        }

        const habitUpdated = await habitModel.findOneAndUpdate({
            _id: validated.data.id,
        }, 
        {
            $push: {
                completedDates: now,
            }
        },
        {
            returnDocument: 'after'
        })

        return response.status(200).json(habitUpdated)
    }
}



