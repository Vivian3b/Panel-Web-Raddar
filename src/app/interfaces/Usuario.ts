export interface Usuario {
    idusuario: number;
    rol_idrol: number;
    correo: string; 
    fechacreacion: string;
    fechaactualizacion: string;
    idcreador?: number;
    idactualizacion?: number; 
    estatus: number;
}