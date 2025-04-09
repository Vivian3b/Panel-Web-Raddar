export interface Usuario {
    idusuario: number;
    rol_idrol: number;
    //rol?: string;
    correo: string; 
    fechacreacion: string;
    fechaactualizacion: string;
    idcreador?: number;
    idactualizacion?: number; 
}