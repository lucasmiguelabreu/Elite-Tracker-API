import { Router } from 'express';
import packageJson from '../package.json';
import { HabbitsController } from './controllers/habits.controller';
import { FocusTimeController } from './controllers/focus-time.controller';

export const routes = Router();

const habbitsController = new HabbitsController();
const focusTimeController = new FocusTimeController


routes.get('/', (request, response) => {
    const { name, description, version } = packageJson;

    return response.status(200).json({ name, description, version })
});

routes.get('/habits', habbitsController.index);

routes.post('/habits', habbitsController.store);

routes.delete('/habits/:id', habbitsController.remove);

routes.patch('/habits/:id/toggle', habbitsController.toggle);


routes.post('/focus-time', focusTimeController.store)









/**
 * M (Model) => Responsável por se comunicar com o banco;
 * V (View) => Mostrar isso para o usuário (React);
 * C (Controller) => Controla a requisição, chama a Model, define RN's e faz retorno para o Usuário;
 */