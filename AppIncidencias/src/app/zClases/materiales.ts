export interface Material{
    id?: string;
    familia : String;
    stock : number;
    marca : String;
    modelo : String;
    codCentro : string;
}

export interface MatCantidad{
    incidencia?: string
    material: Material;
    cantidad: number;
}