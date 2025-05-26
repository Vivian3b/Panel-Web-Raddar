export interface Cliente {
    idusuario: number;
    rol_idrol: number;
    //rol?: string;
    correo: string; 
    fechacreacion: string;
    fechaactualizacion: string;
    idcreador?: number;
    idactualizacion?: number; 
    estatus: number;
  }