
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Highlight } from './highlight';

@Component({
  standalone: true,
  imports: [Highlight],
  template: '<div appHighlight>Teste da diretiva</div>',
})
class TestHostComponent {}

describe('Highlight', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create the directive', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');

    expect(element).toBeTruthy();
  });

  it('should highlight the element on mouseenter', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');

    element.dispatchEvent(new MouseEvent('mouseenter'));

    expect(element.style.backgroundColor).toBe('rgb(219, 234, 254)');
  });

  it('should remove the highlight on mouseleave', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');

    element.dispatchEvent(new MouseEvent('mouseenter'));
    element.dispatchEvent(new MouseEvent('mouseleave'));

    expect(element.style.backgroundColor).toBe('');
  });
});