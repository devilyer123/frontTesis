import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order, RespuestaOrders } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor( private http: HttpClient ) { }

  getOrdersByClient(id: number) {
    return this.http.get<RespuestaOrders>(`${ URL }/orders/client/${ id }`);
  }

  getOrders() {
    return this.http.get<RespuestaOrders>(`${ URL }/orders`);
  }

  registerOrder(order: Order) {
    return this.http.post(`${ URL }/orders/create`, order);
  }

  getOneOrder(id: number) {
    return this.http.get<Order>(`${ URL }/orders/${ id }`);
  }

  updateOrder(id: number, ord: Order) {
    return this.http.put(`${ URL }/orders/${ id }`, ord);
  }

  getDelete(id: number) {
    return this.http.delete(`${ URL }/orders/${ id }`);
  }

}
