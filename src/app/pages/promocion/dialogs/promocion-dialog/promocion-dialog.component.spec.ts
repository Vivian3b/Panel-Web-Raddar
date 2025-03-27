import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionDialogComponent } from './promocion-dialog.component';

describe('PromocionDialogComponent', () => {
  let component: PromocionDialogComponent;
  let fixture: ComponentFixture<PromocionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
