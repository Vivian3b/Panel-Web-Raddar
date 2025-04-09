export interface MetodoPago {
    idmetododepago: number;
    cliente_idcliente: number;
    tipo: 'tarjeta' | 'paypal' | 'transferencia';
    eliminado?: boolean;
  }
  