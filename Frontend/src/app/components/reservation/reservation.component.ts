import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { Room } from '../../_model/room.model';
import { AddEditRoomsComponent } from '../add-edit-rooms/add-edit-rooms.component';
import { ReservationService } from '../../services/reservation.service';
import { AddEditReservationComponent } from '../add-edit-reservation/add-edit-reservation.component';
import { ClienteService } from '../../services/cliente.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule,MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent  implements OnInit {
  idUser!: number;
  showLoadMoreProductButton = false;
  dataSource = new MatTableDataSource();
  showTable = false;
  pageNumber: number = 0;
  reservationDetails: Room[] = [];
  reservationDetailsUser: Room[] = [];
  
  //displayedColumns: string[] = ['Id', 'Name', 'day', 'hour_start' ,'duration', 'description', 'user','room','Actions' ];
  displayedColumns: string[] = [];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog,
    private reservationService: ReservationService,
    private router: Router,
    public userService: ClienteService
  ) { }

  ngOnInit(): void {
    this.getAllReservations();
    
    
    if (this.userService.roleMatch(['Admin'])) {
      
      this.displayedColumns = ['Id', 'Name', 'day', 'hour_start', 'duration', 'description', 'user', 'room', 'Actions'];
    } else {
      this.displayedColumns = ['Id', 'Name', 'day', 'hour_start', 'duration', 'description', 'room', 'Actions'];
    }
  }
  
  
  public getAllReservations() {
    
    this.showTable = false;
    if(this.userService.roleMatch(['Admin'])){
      this.reservationService.getAllReservations()
      .subscribe(
        (resp) => {
           console.log(resp);
           this.reservationDetails = resp; 
           this.dataSource.data = resp;
        }, (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
    } else {
      this.reservationService.getAllReservations()
        .subscribe(
          (resp) => {
            console.log(resp);
            if (isPlatformBrowser(this.platformId)) {
              const userId = localStorage.getItem('userId');
              this.idUser = userId ? parseInt(userId, 10) : 1; // Inicializa con 1 si no se encuentra en localStorage
              console.log('idUser', this.idUser);
            }
            this.reservationDetailsUser = resp.filter((reservation: any) => reservation.userId == this.idUser);
            this.reservationDetails = this.reservationDetailsUser;
            this.dataSource.data = this.reservationDetailsUser;
          }, (error: HttpErrorResponse) => {
            console.log(error);
          }
        );
    } 
  }

  getStateRoomName(estadoSalaId: number): string {
    switch (estadoSalaId) {
      case 1:
        return 'Available';
      case 2:
        return 'Maintenance';
      case 3:
        return 'Occupied';
      default:
        return 'DESCONOCIDO';
    }
  }

  addReservation() {
    
      
    const dialogRef = this.dialog.open(AddEditReservationComponent, {
      data: {
        bandera: 0
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log('El diálogo se cerró', result);
        // Aquí puedes realizar acciones después de cerrar
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al cerrar el diálogo:', error);

      }
    });
  }

  showImages(element: any): void {
    // Lógica para mostrar imágenes
  }

  editReservation(id: number): void {
     console.log('Editando el producto con id:', id);
    const reservation = this.reservationDetails.find(room => room.id === id);
    if (reservation) {
      const dialogRef = this.dialog.open(AddEditReservationComponent, {
        data: {
          bandera: 1,
          reservation: reservation
        }
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          console.log('El diálogo se cerró', result);
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Error al cerrar el diálogo:', error);
        }
      });
    } else {
      console.error('No se encontró la habitación con el id:', id);
    } 
  }

  deleteReservation(id: number, roomId:number): void {
    // Lógica para eliminar producto
     this.reservationService.deleteReservation(id, roomId).subscribe({
      next: (result) => {
        console.log('El producto se eliminó correctamente', result);
        // Aquí puedes realizar acciones después de cerrar
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    }); 
    

  }
}