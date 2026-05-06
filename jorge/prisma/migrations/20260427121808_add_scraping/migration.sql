-- CreateTable
CREATE TABLE "ScrapingFuente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapingFuente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrendamiento" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "ubicacion" TEXT,
    "descripcion" TEXT,
    "urlFuente" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Arrendamiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapingFuente_url_key" ON "ScrapingFuente"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Arrendamiento_urlFuente_key" ON "Arrendamiento"("urlFuente");
