import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _pending = signal(0);
  readonly loading = computed(() => this._pending() > 0);
  start() {
    this._pending.set(this._pending() + 1);
  }
  end() {
    this._pending.set(Math.max(0, this._pending() - 1));
  }
}
