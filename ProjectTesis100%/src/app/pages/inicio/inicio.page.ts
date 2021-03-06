import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  slideOpts = {
    speed: 400
  };

  constructor(private router: Router,
    public menuCtrl: MenuController,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.cleanData();
    this.menuCtrl.enable(false);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  cleanData() {
    this.usuarioService.logout();
  }

}
