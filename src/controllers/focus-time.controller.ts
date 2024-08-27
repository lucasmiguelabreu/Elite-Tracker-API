import { type Request, type Response } from 'express';

import { z } from 'zod';
import dayjs from 'dayjs';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message.util';
import { FocusTimeModel } from '../models/focus-time-model';


export class FocusTimeController { 
    store = async (request: Request, response: Response) => {
        const schema = z.object({
            timeFrom: z.coerce.date(),
            timeTo: z.coerce.date(),
        });

        const focusTime = schema.safeParse(request.body);
    
        if (!focusTime.success) {
            const errors = buildValidationErrorMessage(focusTime.error.issues);
    
            return response.status(422).json({ message: errors });
        }

        const timeFrom = dayjs(focusTime.data.timeFrom);
        const timeTo = dayjs(focusTime.data.timeTo);

        const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom);

        if (isTimeToBeforeTimeFrom) {
            return response.status(400).json({ message: 'timeTo cannot be in the past' })
        }

        const createFocusTime = await FocusTimeModel.create({
            timeFrom: timeFrom.toDate(),
            timeTo: timeTo.toDate(),
        })

        return response.status(201).json(createFocusTime);
    };

}



