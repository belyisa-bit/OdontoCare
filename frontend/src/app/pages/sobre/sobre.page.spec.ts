import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { SobrePage } from './sobre.page';

describe('SobrePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobrePage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SobrePage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});