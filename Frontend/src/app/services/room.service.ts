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
export class RoomService {
  //private baseUrl = 'http://localhost:3000/auth/';
  //private baseUrl = 'https://meeting-room-separation.onrender.com/auth/';
  private baseUrl = environment.baseUrl;

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });
  headers = new HttpHeaders({
    'Authorization': 'Bearer ', // Reemplaza con tu token de autenticación
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, private userAuthService: UserAuthService) { }
  getAllRooms(): Observable<any> {

    return this.http.get<Room[]>(this.baseUrl+'fetchAllRooms');
  }

  createRoom(room: Room): Observable<any> {
    return this.http.post(this.baseUrl+'createRoom', room, { headers: this.headers });
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(this.baseUrl+'deleteRoom/'+id, { headers: this.headers });
  }
  editRoom(room: Room, id: number): Observable<any> { 
    return this.http.put(this.baseUrl+'updateRoom/'+id, room, { headers: this.headers });
  }
}
