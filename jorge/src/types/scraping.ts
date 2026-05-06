export interface ScrapingFuente {
    nombre: string;
    url: string;
    activo?: boolean;
}

export interface ArrendamientoNormalizado {
    titulo: string;
    precio: number;
    ubicacion?: string;
    descripcion?: string;
    imagen?: string;
    urlFuente: string;
}
