
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAuthService } from './user-auth.service';
import { Room } from '../_model/room.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  //private baseUrl = 'http://localhost:3000/auth/';
  //private baseUrl = 'https://meeting-room-separation.onrender.com/auth/';
  private baseUrl = environment.baseUrl;

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });
  headers = new HttpHeaders({
    'Authorization': 'Bearer ', // Reemplaza con tu token de autenticación
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, private userAuthService: UserAuthService) { }

  getAllReservations(): Observable<any> {
    return this.http.get<Room[]>(this.baseUrl+'fetchAllReservations/rooms');
  }
  /* getAllReservationsByUser(id: number): Observable<any> {
    return this.http.get<Room[]>(this.baseUrl+'findReservationById/'+id);
  } */
  getAllReservationsByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}findReservationById/${userId}`);
  }
  getAllRoomsAvailable(): Observable<any> { 
    return this.http.get<Room[]>(this.baseUrl+'findRoomsAvailable');
  }
  deleteReservation(id: number, roomId:number): Observable<any> {  
    return this.http.delete(this.baseUrl+'deleteReservation/'+id+'/'+roomId, { headers: this.headers });
  }
  editRoom(room: Room, id: number): Observable<any> { 
    return this.http.put(this.baseUrl+'updateRoom/'+id, room, { headers: this.headers });
  }
  editReservation(reservation: any, id: number): Observable<any> {
    return this.http.put(this.baseUrl+'updateReservation/'+id, reservation, { headers: this.headers });
  }
  createReservation(reservation: any): Observable<any> {
    return this.http.post(this.baseUrl+'createRersevation', reservation, { headers: this.headers });
  }
  updateStateLastRoom( id: number): Observable<any> {
    return this.http.put(this.baseUrl+'updateStateLastRoom/'+id, { headers: this.headers });
  }
  
}
