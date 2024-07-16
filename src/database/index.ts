import mongoose, { mongo } from 'mongoose';

export async function setupMongo() {
    try {
        if (mongoose.connection.readyState === 1){
            return;
        }

        console.log('🎲 Conectando ao banco de dados...');
        await mongoose.connect('mongodb://localhost:27017/elitetracker', { serverSelectionTimeoutMS: 5000,});
        console.log('✅ Banco de Dados conectado');
    } catch {
        throw new Error('❌ Banco de Dados não conectado',);
    }
}