export interface Usuario{
    id?: string;
    nombre?: string;
    apellidos?: string;
    email?: string;
    telefono?: string;
    foto?:string;
    /**
     * Rol -> 0 = Usuario Normal
     * Rol -> 1 = Tecnico
     * Rol -> 2 = Admin
     * Rol -> 3 = Control de la APP
     */
    rol?: number;
    departamento?: string;
    centro?: string;
    estado?: string
}