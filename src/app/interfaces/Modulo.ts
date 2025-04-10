export interface Modulo {
    idmodulo: number;
    permiso_idpermiso: number;
    rol_idrol: number;
    idcreador: number | null;
    idactualizacion: number | null;
    fechacreacion: string | null;
    fechaactualizacion: string | null;
    eliminado: boolean | null;
  }
  