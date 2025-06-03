import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HoldScrollDirective } from './hold-scroll';

@Component({
  template: `
    <div #scrollTarget style="height:200px; overflow:auto"></div>
    <button
      holdScroll
      [holdScroll]="scrollTarget"
      [direction]="scrollDirection"
      [scrollAmount]="scrollDistance"
    ></button>
  `,
  standalone: true,
  imports: [HoldScrollDirective],
})
class HostComponent {
  scrollDirection: 'up' | 'down' = 'down';
  scrollDistance = 40;
}

describe('HoldScrollDirective (integration)', () => {
  let realSetInterval: typeof setInterval;
  let realClearInterval: typeof clearInterval;

  beforeEach(() => {
    realSetInterval = window.setInterval;
    realClearInterval = window.clearInterval;

    spyOn(window, 'setInterval').and.callFake((handler: TimerHandler) => {
      if (typeof handler === 'function') handler();
      return 123;
    });
    spyOn(window, 'clearInterval');
  });

  afterEach(() => {
    window.setInterval = realSetInterval;
    window.clearInterval = realClearInterval;
  });

  it('should scroll down while pressed and stop after release', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    const targetEl = fixture.debugElement.query(By.css('div'))
      .nativeElement as HTMLElement;

    const scrollSpy = spyOn(targetEl, 'scrollBy') as any;

    buttonEl.triggerEventHandler('mousedown', {});
    expect(scrollSpy).toHaveBeenCalledWith({ top: 40 });

    const callsDuringPress = scrollSpy.calls.count();

    buttonEl.triggerEventHandler('mouseup', {});
    expect(window.clearInterval).toHaveBeenCalledWith(123);
    expect(scrollSpy.calls.count()).toBe(callsDuringPress);
  });

  it('should scroll up when direction is "up"', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.scrollDirection = 'up';
    fixture.componentInstance.scrollDistance = 30;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    const targetEl = fixture.debugElement.query(By.css('div'))
      .nativeElement as HTMLElement;

    const scrollSpy = spyOn(targetEl, 'scrollBy') as any;

    buttonEl.triggerEventHandler('mousedown', {});
    expect(scrollSpy).toHaveBeenCalledWith({ top: -30 });
  });

  it('should not start a new interval if one is already running', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    const targetEl = fixture.debugElement.query(By.css('div'))
      .nativeElement as HTMLElement;
    const scrollSpy = spyOn(targetEl, 'scrollBy') as any;

    buttonEl.triggerEventHandler('mousedown', {});
    const callsAfterFirstPress = scrollSpy.calls.count();

    buttonEl.triggerEventHandler('mousedown', {});
    expect(window.setInterval).toHaveBeenCalledTimes(1);
    expect(scrollSpy.calls.count()).toBe(callsAfterFirstPress);
  });
});
