import { Router } from 'express';
import packageJson from '../package.json';
import { HabbitsController } from './controllers/habits.controller';

export const routes = Router();

const habbitsController = new HabbitsController();

routes.get('/', (request, response) => {
    const { name, description, version } = packageJson;

    return response.status(200).json({ name, description, version })
});

routes.post('/habits', habbitsController.store);




/**
 * M (Model) => Responsável por se comunicar com o banco;
 * V (View) => Mostrar isso para o usuário (React);
 * C (Controller) => Controla a requisição, chama a Model, define RN's e faz retorno para o Usuário;
 */