import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function testMongoDB() {
  try {
    await client.connect();
    console.log('✅ Conectado correctamente a MongoDB');

    const db = client.db(); // obtiene la base de datos por defecto desde la URI
    const coleccion = db.collection('usuarios');

    const usuario = await coleccion.findOne({});
    if (usuario) {
      console.log('🟢 Usuario encontrado:', usuario);
    } else {
      console.log('🟡 No se encontraron usuarios en la colección "usuarios".');
    }
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err.message);
  } finally {
    await client.close();
  }
}

testMongoDB();
