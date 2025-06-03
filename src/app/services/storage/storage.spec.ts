import { StorageService } from './storage';

class LocalStorageMock {
  private store = new Map<string, string>();
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

describe('StorageService', () => {
  let service: StorageService;
  let localStorageMock: LocalStorageMock;

  beforeEach(() => {
    service = new StorageService();
    localStorageMock = new LocalStorageMock();
    (service as any).storage = localStorageMock;
  });

  it('stores a JSON-stringified value with setItem', () => {
    const testData = { name: 'Pikachu', level: 12 };
    service.setItem('pokemon', testData);
    expect(localStorageMock.getItem('pokemon')).toBe(JSON.stringify(testData));
  });

  it('retrieves and parses a JSON value with getItem', () => {
    localStorageMock.setItem('pokemon', '{"name":"Bulbasaur"}');
    expect(service.getItem('pokemon')).toEqual({ name: 'Bulbasaur' });
  });

  it('returns raw string when stored value is not JSON', () => {
    localStorageMock.setItem('greeting', 'hello');
    expect(service.getItem('greeting')).toBe('hello');
  });

  it('returns undefined when the key does not exist', () => {
    expect(service.getItem('missing')).toBeUndefined();
  });
  it('returns undefined when the key does not exist', () => {
    expect(service.removeItem('missing')).toBeUndefined();
  });
});
