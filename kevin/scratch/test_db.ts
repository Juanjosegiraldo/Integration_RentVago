import { prisma } from "../src/lib/db/prisma";

async function testConnection() {
  console.log("Intentando conectar a Supabase");
  try {
    const userCount = await prisma.user.count();
    console.log("Conexión exitosa a Supabase");
    console.log(`Número de usuarios en la base de datos: ${userCount}`);
  } catch (error) {
    console.error("Error al conectar a Supabase");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
