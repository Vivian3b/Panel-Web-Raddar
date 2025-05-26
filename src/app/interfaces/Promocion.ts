export interface Promocion {
    idpromocion: number;
    empresa_idempresa: number;
    categoria_idcategoria: number;
    nombre: string;
    descripcion: string;
    precio: number | null;
    vigenciainicio: string;
    vigenciafin: string;
    tipo: string;
    eliminado: number;
    imagen?: string | null;

}