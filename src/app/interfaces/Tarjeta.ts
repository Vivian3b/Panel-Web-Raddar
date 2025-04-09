export interface Tarjeta {
    idtarjeta?: number;
    metododepago_idmetododepago: number;
    numero: string;
    nombrecliente: string;
    fechaexpiracion: string;
    cvv: string;
    eliminado?: number;
  }
  