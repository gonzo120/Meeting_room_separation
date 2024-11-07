import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { Room } from '../../_model/room.model';
import { RoomService } from '../../services/room.service';
import { AddEditRoomsComponent } from '../add-edit-rooms/add-edit-rooms.component';

@Component({
  selector: 'app-show-rooms-details',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './show-rooms-details.component.html',
  styleUrl: './show-rooms-details.component.css'
})
export class ShowRoomsDetailsComponent implements OnInit {

  showLoadMoreProductButton = false;
  dataSource = new MatTableDataSource();
  showTable = false;
  pageNumber: number = 0;
  roomsDetails: Room[] = [];
  displayedColumns: string[] = ['Id', 'Name', 'places', 'floor' ,'description', 'state room', 'Actions' ];

  constructor(
    private dialog: MatDialog,
    private roomService: RoomService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllProducts();

    
  }

  public getAllProducts() {
    this.showTable = false;
    this.roomService.getAllRooms()
    .subscribe(
      (resp) => {
         console.log(resp.rooms);
         this.roomsDetails = resp.rooms; 
         this.dataSource.data = resp.rooms;
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
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

  addRoom() {
    const dialogRef = this.dialog.open(AddEditRoomsComponent, {
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

  editRoomsDetails(id: number): void {
    console.log('Editando el producto con id:', id);
    const room = this.roomsDetails.find(room => room.id === id);
    if (room) {
      const dialogRef = this.dialog.open(AddEditRoomsComponent, {
        data: {
          bandera: 1,
          room: room
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

  deleteRoom(id: number): void {
    // Lógica para eliminar producto
    this.roomService.deleteRoom(id).subscribe({
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