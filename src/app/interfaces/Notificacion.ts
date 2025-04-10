export interface Notificacion {
    idnotificacion: number;
    cliente_idcliente: number;
    promocion_idpromocion: number;
    fechayhora: string;  // Podría ser tipo Date, pero es mejor mantenerlo como string para el formato de la fecha
    leido: boolean;
    eliminado: boolean;
  }
  