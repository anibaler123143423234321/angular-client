import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarcoordinarListComponent } from './asignarcoordinar-list.component';

describe('AsignarcoordinarListComponent', () => {
  let component: AsignarcoordinarListComponent;
  let fixture: ComponentFixture<AsignarcoordinarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarcoordinarListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarcoordinarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
