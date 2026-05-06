import { PropertySchema } from "../src/domain/entities/property";

const testData = {
  title: "Casita",
  address: "Calle 43 # 80 - 65 Medellín Colombia",
  price: 1000,
  userId: 1
};

try {
  const result = PropertySchema.parse(testData);
  console.log("Zod está funcionando correctamente:");
  console.log(result);
} catch (error) {
  console.error("Error en Zod:");
  console.error(error);
}
