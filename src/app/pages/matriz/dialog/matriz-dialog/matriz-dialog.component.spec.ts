import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizDialogComponent } from './matriz-dialog.component';

describe('MatrizDialogComponent', () => {
  let component: MatrizDialogComponent;
  let fixture: ComponentFixture<MatrizDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
