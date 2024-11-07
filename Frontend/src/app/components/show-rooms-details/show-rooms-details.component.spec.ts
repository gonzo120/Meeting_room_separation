import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRoomsDetailsComponent } from './show-rooms-details.component';

describe('ShowRoomsDetailsComponent', () => {
  let component: ShowRoomsDetailsComponent;
  let fixture: ComponentFixture<ShowRoomsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowRoomsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowRoomsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
