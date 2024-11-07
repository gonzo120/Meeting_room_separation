import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RoomService } from '../../services/room.service';
import Swal from 'sweetalert2';

interface StateRoom {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-edit-rooms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './add-edit-rooms.component.html',
  styleUrls: ['./add-edit-rooms.component.css']
})
export class AddEditRoomsComponent implements OnInit {

  stateRooms: StateRoom[] = [
    { value: '1', viewValue: 'Available' },
    { value: '2', viewValue: 'Maintenance' },
    { value: '3', viewValue: 'Occupied' }
  ];
  form: FormGroup;
  title: string = '';
  id: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomService: RoomService,
    private dialogRef: MatDialogRef<AddEditRoomsComponent>
  ) {
    this.form = new FormGroup({
      name: new FormControl(''),
      places: new FormControl(''),
      floor: new FormControl(''),
      description: new FormControl(''),
      stateCodeId: new FormControl('')
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.title = this.data.bandera === 0 ? 'Create' : 'Edit';
    if (this.data.bandera === 1 && this.data.room) {
      this.form.patchValue({
        name: this.data.room.nombre,
        places: this.data.room.plazas,
        floor: this.data.room.planta,
        description: this.data.room.descripcion,
        stateCodeId: this.data.room.estadoSalaId
      });
    }
  }

  public showSuccessAlert() {
    Swal.fire({
      title: 'Success',
      text: 'Room created successfully.',
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
      text: 'Room edited successfully.',
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
    console.log(form.value);
    if (this.data.bandera === 1) {
      this.id = this.data.room.id;
      this.roomService.editRoom(form.value, this.id).subscribe({
        next: (result) => {
          this.showSuccessAlert2();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }else {
      this.roomService.createRoom(form.value).subscribe({
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