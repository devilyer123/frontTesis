import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product, MenuCompenente, RespuestaProds } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http: HttpClient ) { }

  getMenuOpts() {
    return this.http.get<MenuCompenente[]>('/assets/data-menu/menu-opts.json');
  }

  getProducts() {
    return this.http.get<RespuestaProds>(`${ URL }/products`);
  }

  registerProduct(product: Product) {
    return this.http.post(`${ URL }/products/create`, product);
  }

  getOneProduct(id: number) {
    return this.http.get<Product>(`${ URL }/products/${ id }`);
  }

  updateProduct(id: number, prod: Product){
    return this.http.put(`${ URL }/products/${ id }`, prod);
  }

  getDelete(id: number){
    return this.http.delete(`${ URL }/products/${ id }`);
  }

}
