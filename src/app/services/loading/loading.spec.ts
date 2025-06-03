import { LoadingService } from './loading';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('starts with loading equal to false', () => {
    expect(service.loading()).toBeFalse();
  });

  it('loading becomes true after a single start call', () => {
    service.start();
    expect(service.loading()).toBeTrue();
  });

  it('loading stays true after multiple start calls', () => {
    service.start();
    service.start();
    expect(service.loading()).toBeTrue();
  });

  it('loading returns to false after balanced start/end calls', () => {
    service.start();
    service.start();
    service.end();
    service.end();
    expect(service.loading()).toBeFalse();
  });

  it('end never decrements below zero', () => {
    service.end();
    expect(service.loading()).toBeFalse();
    service.end();
    expect(service.loading()).toBeFalse();
  });
});
