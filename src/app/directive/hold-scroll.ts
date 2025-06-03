import { Directive, HostListener, input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[holdScroll]',
  standalone: true,
})
export class HoldScrollDirective implements OnDestroy {
  direction = input<'up' | 'down'>('down');
  scrollAmount = input(100);

  private scrollIntervalId: any;
  elementRef = input<HTMLElement>(undefined, {
    alias: 'holdScroll',
  });

  @HostListener('mousedown')
  @HostListener('touchstart')
  startScroll(): void {
    if (this.scrollIntervalId || !this.elementRef()) return;
    const step =
      this.direction() === 'up' ? -this.scrollAmount() : this.scrollAmount();

    this.scrollIntervalId = setInterval(() => {
      this.elementRef()?.scrollBy({ top: step });
    });
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  stopScroll(): void {
    if (this.scrollIntervalId) {
      clearInterval(this.scrollIntervalId);
      this.scrollIntervalId = null;
    }
  }

  ngOnDestroy(): void {
    this.stopScroll();
  }
}
