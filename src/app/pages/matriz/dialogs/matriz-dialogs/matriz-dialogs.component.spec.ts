import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizDialogsComponent } from './matriz-dialogs.component';

describe('MatrizDialogsComponent', () => {
  let component: MatrizDialogsComponent;
  let fixture: ComponentFixture<MatrizDialogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizDialogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
