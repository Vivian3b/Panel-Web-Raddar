export interface Empresa {
    idempresa: number;
    usuario_idusuario: number;
    matriz_idmatriz: number;
    nombre: string;
    descripcion: string;
    ubicacion: {
        x: number;
        y: number;
    };
    eliminado: number;

}