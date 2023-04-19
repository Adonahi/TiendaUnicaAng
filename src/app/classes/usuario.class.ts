export class Usuario{
    usuario_id: number;
    nombre: string;
    login: string;
    correo: number;
    contrasenha: number;
    permiso: number;

    constructor(
        usuario_id: number,
        nombre: string,
        login: string,
        correo: number,
        contrasenha: number,
        permiso: number
    ){
        this.usuario_id = usuario_id;
        this.nombre = nombre;
        this.login = login;
        this.correo = correo;
        this.contrasenha = contrasenha;
        this.permiso = permiso;
    }
}