import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuarios';
import { AuthService } from '../servicios/auth/auth.service';
import { Auth } from 'firebase/auth';
import { DataServiceService } from '../data-service.service';
import { Centro } from '../centros';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalles-usuario',
  templateUrl: './detalles-usuario.page.html',
  styleUrls: ['./detalles-usuario.page.scss'],
})
export class DetallesUsuarioPage implements OnInit {

  VentanaTitulo: string = ""
  usuario?: Usuario;
  CentroUsuario : any //Tipo Centro
  CodCentro: string | undefined
  ModoEdicion : Boolean = true
  TextModeEdit : String = "Activar Modo Edición"
  btnTamPantalla: any

  constructor(private authService: AuthService, private router : Router) { }

  ngOnInit(): void {
    const navigation = window.history.state;
    this.usuario = navigation.usuario;
    this.VentanaTitulo = navigation.NameVentana;
    this.CodCentro = this.usuario?.centro

    this.authService.ObtenerCentroPorCod(this.CodCentro).subscribe(centro => {
      this.CentroUsuario = centro;
    console.log(this.CentroUsuario);
     
    });
    this.TamañoPantalla()
  }
  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false
    } else {
      this.btnTamPantalla = true
    }
  }

  CancelarForm(){
    
    if(this.VentanaTitulo == 'Tecnicos'){
      this.router.navigate(['tecnicos']);
    }else if (this.VentanaTitulo == 'Usuarios'){
      this.router.navigate(['usuarios']);
    }
    
  }

  ModoEditar(){
    
    if(this.ModoEdicion === true){
      this.ModoEdicion = false
      this.TextModeEdit = "Activar Modo Edición"
    }else{
      this.ModoEdicion = true
      this.TextModeEdit = "Desactivar Modo Edición"
    }
  }

}
