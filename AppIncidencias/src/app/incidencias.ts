export interface Incidencia{
    id?: string;
    nombre : string;
    email : string;
    descripcion : string;
    aula : string;
    fecha : Date;
    atentida : boolean;
    comentario?: string;
    centro : string;    
}