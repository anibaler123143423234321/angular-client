import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObtenerclientesdeasesorComponent } from './obtenerclientesdeasesor.component';

describe('ObtenerclientesdeasesorComponent', () => {
  let component: ObtenerclientesdeasesorComponent;
  let fixture: ComponentFixture<ObtenerclientesdeasesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObtenerclientesdeasesorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObtenerclientesdeasesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
