import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const arrendamientosSeed = [
    {
        titulo: "Casa en arriendo en Belen Los Alpes",
        precio: 1850000,
        ubicacion: "Belen, Medellin",
        descripcion: "Casa de 3 habitaciones, 2 banos, patio y excelente acceso a transporte.",
        imagen: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        urlFuente: "seed-medellin-belen-los-alpes-1",
    },
    {
        titulo: "Apartamento en arriendo en Laureles",
        precio: 2300000,
        ubicacion: "Laureles, Medellin",
        descripcion: "Apartamento amplio de 2 habitaciones con balcon y parqueadero.",
        imagen: "https://images.unsplash.com/photo-1494526585095-c41746248156",
        urlFuente: "seed-medellin-laureles-2",
    },
    {
        titulo: "Casa unifamiliar en arriendo en Robledo",
        precio: 1600000,
        ubicacion: "Robledo, Medellin",
        descripcion: "Vivienda de 3 habitaciones con sala comedor y cocina remodelada.",
        imagen: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
        urlFuente: "seed-medellin-robledo-3",
    },
    {
        titulo: "Apartamento en arriendo en El Poblado",
        precio: 3200000,
        ubicacion: "El Poblado, Medellin",
        descripcion: "Apartamento moderno de 1 habitacion en sector residencial y seguro.",
        imagen: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        urlFuente: "seed-medellin-poblado-4",
    },
    {
        titulo: "Casa en arriendo en Buenos Aires",
        precio: 1450000,
        ubicacion: "Buenos Aires, Medellin",
        descripcion: "Casa tradicional con 2 habitaciones, patio pequeno y buena iluminacion.",
        imagen: "https://images.unsplash.com/photo-1448630360428-65456885c650",
        urlFuente: "seed-medellin-buenos-aires-5",
    },
    {
        titulo: "Apartamento familiar en arriendo en Manrique",
        precio: 1250000,
        ubicacion: "Manrique, Medellin",
        descripcion: "Apartamento de 3 habitaciones cerca de comercio y rutas de bus.",
        imagen: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        urlFuente: "seed-medellin-manrique-6",
    },
    {
        titulo: "Casa en arriendo en Castilla",
        precio: 1700000,
        ubicacion: "Castilla, Medellin",
        descripcion: "Casa de dos niveles con 4 habitaciones y terraza.",
        imagen: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
        urlFuente: "seed-medellin-castilla-7",
    },
    {
        titulo: "Apartamento en arriendo en Envigado limite Medellin",
        precio: 2100000,
        ubicacion: "Envigado, Area Metropolitana de Medellin",
        descripcion: "Apartamento de 2 habitaciones con estudio, unidad cerrada y zonas comunes.",
        imagen: "https://images.unsplash.com/photo-1460317442991-0ec209397118",
        urlFuente: "seed-medellin-envigado-8",
    },
];

async function main() {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    await prisma.user.upsert({
        where: { email: "andres@admin.com" },
        update: {},
        create: {
            email: "andres@admin.com",
            password: adminPassword,
            role: "ADMIN",
        },
    });

    await prisma.user.upsert({
        where: { email: "andres@user.com" },
        update: {},
        create: {
            email: "andres@user.com",
            password: userPassword,
            role: "USER",
        },
    });

    for (const arrendamiento of arrendamientosSeed) {
        await prisma.arrendamiento.upsert({
            where: { urlFuente: arrendamiento.urlFuente },
            update: arrendamiento,
            create: arrendamiento,
        });
    }

    console.log("Seed completado: usuarios base y 8 arrendamientos de Medellin");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
