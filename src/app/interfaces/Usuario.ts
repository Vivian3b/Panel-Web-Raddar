export interface Usuario {
    idusuario: number;
    nombre: string;
    correo: string;
    rol: string;
    fechaRegistro: string;
    fechaActualizacion: string;
    idcreador?: number;
}