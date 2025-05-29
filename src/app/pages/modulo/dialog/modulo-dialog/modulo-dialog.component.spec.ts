import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloDialogComponent } from './modulo-dialog.component';

describe('ModuloDialogComponent', () => {
  let component: ModuloDialogComponent;
  let fixture: ComponentFixture<ModuloDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
