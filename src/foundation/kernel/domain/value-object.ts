//src/foundation/kernel/domain/value-object.ts
export abstract class ValueObject<T> {
  protected readonly props: Readonly<T>;

  constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }

  equals(vo?: ValueObject<T>): boolean {
    if (!vo) return false;

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
