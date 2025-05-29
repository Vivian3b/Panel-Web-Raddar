export interface Usuario {
    idusuario: number;
    rol_idrol: number;
    correo: string; 
    email: string;
    fechacreacion: string;
    fechaactualizacion: string;
    idcreador?: number;
    idactualizacion?: number; 
    estatus: number;
}