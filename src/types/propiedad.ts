export interface Propiedad {
    id: string;
    titulo: string;
    codigo?: string | null;
    descripcion: string | null;
    tipo: string;
    operacion: string;
    ciudad: string;
    barrio?: string | null;
    direccion: string | null;
    precio: number;
    administracion?: number | null;
    habitaciones: number;
    banos: number;
    parqueaderos: number | null;
    area: number;
    estrato: number | null;
    video: string | null;
    mapa?: string | null;
    imagen_principal: string | null;
    imagenes: string[] | null;
    destacado: boolean;
    publicado: boolean;
    estado: string;
}
