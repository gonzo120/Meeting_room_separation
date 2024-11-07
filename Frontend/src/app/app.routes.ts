import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { SummaryComponent } from './components/summary/summary.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { AuthGuard } from './_auth/auth.guard';
import { ShowRoomsDetailsComponent } from './components/show-rooms-details/show-rooms-details.component';
import { ReservationComponent } from './components/reservation/reservation.component';

export const routes: Routes = [

    { path: 'home', component: HomeComponent},
    { path: 'admin', component: AdminComponent, canActivate:[AuthGuard], data:{roles:['Admin']} },
    { path: 'user', component: UserComponent ,  canActivate:[AuthGuard], data:{roles:['User']} },
    { path: 'login', component: LoginComponent},
    { path: 'forbidden', component: ForbiddenComponent},
    { path: 'showRoomDetails', component: ShowRoomsDetailsComponent, canActivate:[AuthGuard], data:{roles:['Admin']} },
    { path: 'reservations', component: ReservationComponent,  data:{roles:['Admin', 'User']} },
    
];
