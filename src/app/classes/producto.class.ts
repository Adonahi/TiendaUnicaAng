export class Producto{
    producto_id: number;
    nombre: string;
    codigo_barras: string;
    precio_compra: number;
    precio_venta: number;
    usuario_fk: number;
    existencia: number;
    imagen_url: string;

    constructor(
        producto_id: number,
        nombre: string,
        codigo_barras: string,
        precio_compra: number,
        precio_venta: number,
        usuario_fk: number,
        existencia: number,
        imagen_url: string
    ){
        this.producto_id = producto_id;
        this.nombre = nombre;
        this.codigo_barras = codigo_barras;
        this.precio_compra = precio_compra;
        this.precio_venta = precio_venta;
        this.usuario_fk = usuario_fk;
        this.existencia = existencia;
        this.imagen_url = imagen_url;
    }
}