import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminadoComponent } from './eliminado.component';

describe('EliminadoComponent', () => {
  let component: EliminadoComponent;
  let fixture: ComponentFixture<EliminadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
