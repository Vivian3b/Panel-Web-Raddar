export interface Cliente {
    idcliente?: number; // Opcional porque no se envía en la creación, solo en consultas
    usuario_idusuario: number; // ID del usuario que registró el cliente
    nombre: string;
    telefono: string;
    ubicacion: {
        lat: number;
        lng: number;
    };
    eliminado?: number; // Opcional si no lo vas a mostrar en la tabla
  }