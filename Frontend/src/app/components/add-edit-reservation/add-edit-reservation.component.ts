import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RoomService } from '../../services/room.service';
import Swal from 'sweetalert2';
import { ReservationService } from '../../services/reservation.service';
import { HttpErrorResponse } from '@angular/common/http';

interface StateRoom {
  id: number;
  nombre: string;
  plazas: number;
  planta: number;
  Descripcion: string;
  estadoSalaId: number;
}
@Component({
  selector: 'app-add-edit-reservation',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule],
  templateUrl: './add-edit-reservation.component.html',
  styleUrl: './add-edit-reservation.component.css'
})

export class AddEditReservationComponent implements OnInit {

  stateRooms: StateRoom[] = [];
  form: FormGroup;
  title: string = '';
  id: number = 0;
  userId: string | null = null;
  minDate: string = '';
  stateCodeId: number = 2;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private roomService: RoomService,
    public reservationService: ReservationService,
    private dialogRef: MatDialogRef<AddEditReservationComponent>
  ) {
    this.form = new FormGroup({
      name: new FormControl(''),
      day: new FormControl(''),
      hour_start: new FormControl(''),
      duration: new FormControl(''),
      description: new FormControl(''),
      roomId: new FormControl(''),
      userId: new FormControl(''),
      stateCodeId: new FormControl('')
    });
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  
  ngOnInit(): void {
    
    
    console.log(this.data);
    this.title = this.data.bandera === 0 ? 'Create' : 'Edit';
    if (this.data.bandera === 1 && this.data.reservation) {
      const formattedDate = new Date(this.data.reservation.dia).toISOString().split('T')[0];
      this.form.patchValue({
        name: this.data.reservation.nombre_reserva,
        day: formattedDate,
        hour_start: this.data.reservation.hora_inicio,
        duration: this.data.reservation.duracion_sala,
        description: this.data.reservation.descripcion,
        roomId: this.data.reservation.salaId,
        userId: this.data.reservation.userId
      });
    
    }
    this.reservations();
    this.getUserId();
    
  }
  getUserId() {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('userId');
    }
  }
  reservations() {
    this.reservationService.getAllRoomsAvailable()
      .subscribe(
        (resp: StateRoom[]) => {
          console.log('Habitaciones disponibles', resp);
          this.stateRooms = resp;
          console.log('Habitaciones disponibles', this.stateRooms);

          if (this.data.bandera === 1 && this.data.reservation) {
            this.stateRooms.push({
              id: this.data.reservation.salaId,
              nombre: this.data.reservation.nombre,
              plazas: this.data.reservation.plazas || 0, // Proporciona un valor predeterminado si es necesario
              planta: this.data.reservation.planta || 0, // Proporciona un valor predeterminado si es necesario
              Descripcion: this.data.reservation.Descripcion || '', // Proporciona un valor predeterminado si es necesario
              estadoSalaId: this.data.reservation.estadoSalaId || 0 // Proporciona un valor predeterminado si es necesario
            });
            this.form.patchValue({
              roomId: this.data.reservation.salaId
            });
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }
  public showSuccessAlert() {
    Swal.fire({
      title: 'Success',
      text: 'Reservation created successfully.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }
  public showSuccessAlert2() {
    Swal.fire({
      title: 'Success',
      text: 'Reservation edited successfully.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }
  createRoom(form: FormGroup) {
    form.value.userId = this.userId !== null ? parseInt(this.userId, 10) : null;
    form.value.roomId = form.value.roomId !== null ? parseInt(form.value.roomId, 10) : null;
    form.value.stateCodeId =  this.stateCodeId;
    console.log(form.value);
    if (this.data.bandera === 1) {
      this.id = this.data.reservation.id;
      this.reservationService.editReservation(form.value, this.id).subscribe({
        next: (result) => {
          this.showSuccessAlert2();
          if(form.value.roomId !== this.data.reservation.salaId){
            console.log('sala pasada a actualizar',this.data.reservation.salaId);
            this.reservationService.updateStateLastRoom(this.data.reservation.salaId).subscribe({
            next: (result) => { 
              console.log(result);
            },
            error: (error) => {
              console.log(error);
            }
          });
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }else {
      this.reservationService.createReservation(form.value).subscribe({
        next: (result) => {
          this.showSuccessAlert();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}