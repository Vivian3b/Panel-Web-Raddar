export interface Rol {
    idrol: number;
    nombre: string;
    idcreador: number;
    idactualizacion?: number | null;
    fechacreacion: string;
    fechaactualizacion?: string | null;
  }
  