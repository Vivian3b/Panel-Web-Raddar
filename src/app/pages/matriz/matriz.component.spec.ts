import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizComponent } from './matriz.component';

describe('MatrizComponent', () => {
  let component: MatrizComponent;
  let fixture: ComponentFixture<MatrizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
