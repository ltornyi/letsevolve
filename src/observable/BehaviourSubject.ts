export type Observer<T> = {
  next: (data: T) => void
}

export class BehaviorSubject<T> {
  private observers: Observer<T>[] = [];
  private data: T;

  constructor(initialData: T) {
    this.data = initialData;
  }

  subscribe(observer: Observer<T>) {
    this.observers.push(observer);
    observer.next(this.data);
  }

  unsubscribe(observer: Observer<T>) {
    this.observers = this.observers.filter(s => s !== observer)
  }

  unsubscribeAll() {
    this.observers = [];
  }

  next(data: T) {
    this.data = data;
    this.observers.forEach(observer => observer.next(data))
  }

  get value() {
    return this.data;
  }
}