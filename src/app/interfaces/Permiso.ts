export interface Permiso {
    idpermiso: number;
    nombre: 'Crear' | 'Consultar' | 'Actualizar' | 'Eliminar';
    idcreador: number | null;
    idactualizacion: number | null;
    fechacreacion: string | null;
    fechaactualizacion: string | null;
    eliminado: boolean | null;
  }
  