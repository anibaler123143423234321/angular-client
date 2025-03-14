import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteResidencialListComponent} from './clienteResidencial-list.component';

describe('ClienteResidencialListComponent', () => {
  let component: ClienteResidencialListComponent;
  let fixture: ComponentFixture<ClienteResidencialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteResidencialListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteResidencialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
