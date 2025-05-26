import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoDialogComponent } from './permiso-dialog.component';

describe('PermisoDialogComponent', () => {
  let component: PermisoDialogComponent;
  let fixture: ComponentFixture<PermisoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
