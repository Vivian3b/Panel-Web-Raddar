import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarCambioComponent } from './solicitar-cambio.component';

describe('SolicitarCambioComponent', () => {
  let component: SolicitarCambioComponent;
  let fixture: ComponentFixture<SolicitarCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarCambioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
