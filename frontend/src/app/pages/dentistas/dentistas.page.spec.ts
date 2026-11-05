import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DentistasPage } from './dentistas.page';

describe('DentistasPage', () => {
  let component: DentistasPage;
  let fixture: ComponentFixture<DentistasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DentistasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
