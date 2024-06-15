import { Component, OnInit,HostListener } from '@angular/core';
import { AuthService } from '../../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../../zClases/usuarios';

@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.page.html',
  styleUrls: ['./autenticacion.page.scss'],
})
export class AutenticacionPage implements OnInit {

  ModoInvi : boolean = false
  btnTamPantalla: any

  constructor(private authService: AuthService,private firestore: AngularFirestore) { }

  ngOnInit() {
    this.TamañoPantalla()
  }

  async onGoogleLogin(){
    try{
      this.authService.loginGoogle()
    }
    catch(error){
      console.log("ERROR: " + error)
    }
  }

  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false
    } else {
      this.btnTamPantalla = true
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.TamañoPantalla();
  }



}
