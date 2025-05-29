export interface Movimiento {
  idmovimiento: number;
  cliente_idcliente: number;
  metododepago_idmetododepago: number;
  promocion_idpromocion: number;
  fechamoviento: string;
  montototal: number;
  iva: number;
  eliminado: number; 
}
