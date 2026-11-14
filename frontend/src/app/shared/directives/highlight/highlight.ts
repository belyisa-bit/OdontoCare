
import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class Highlight {
  constructor(
    private el: ElementRef,  /**permiti acessar o elemento HTML associado à diretiva */
    private renderer: Renderer2 /**permiti modificar o estilo e elemento de maneira compatível*/
  ) {}

  @HostListener('mouseenter') /**escuta eventos, como entrada e saída de mouse */
  onMouseEnter(): void {   /**Escuta o destaque quando o mouse entra */
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      '#dbeafe'
    );
  }

  @HostListener('mouseleave')
  onMouseLeave(): void { /**remove o destaque quando mouse sai. */
    this.renderer.removeStyle(
      this.el.nativeElement,
      'backgroundColor'
    );
  }
}
