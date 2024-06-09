import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../usuarios';

@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.page.html',
  styleUrls: ['./autenticacion.page.scss'],
})
export class AutenticacionPage implements OnInit {

  ModoInvi : boolean = false

  constructor(private authService: AuthService,private firestore: AngularFirestore) { }

  ngOnInit() {
  }

  async onGoogleLogin(){
    try{
      this.authService.loginGoogle()
    }
    catch(error){
      console.log("ERROR: " + error)
    }
  }



}
