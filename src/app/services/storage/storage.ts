import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = localStorage;

  setItem<T>(key: string, value: T) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  getItem(key: string) {
    let value;
    const keyStoraged = this.storage.getItem(key);
    if (!keyStoraged) return undefined;
    try {
      value = JSON.parse(keyStoraged);
    } catch {
      value = keyStoraged;
    }
    return value;
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }
}
