import {
  bufferCount,
  catchError,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchAll,
} from 'rxjs';

export interface Pending {
  type: 'pending';
}

export interface Ok<T> {
  type: 'ok';
  value: T;
}

export interface Err<TErr> {
  type: 'err';
  error: TErr;
}

export type Result<T, TErr> = Ok<T> | Err<TErr>;
export type AsyncResult<T, TErr> = Pending | Result<T, TErr>;

export function ok<T>(value: T): Ok<T> {
  return { type: 'ok', value: value };
}

export function err<T>(error: T): Err<T> {
  return { type: 'err', error };
}

export const pending: Pending = Object.freeze({ type: 'pending' });

export function isPending<T, TErr>(
  result: AsyncResult<T, TErr>,
): result is Pending {
  return result.type === 'pending';
}

export function isOk<T, TErr>(result: AsyncResult<T, TErr>): result is Ok<T> {
  return result.type === 'ok';
}

export function isErr<T, TErr>(
  result: AsyncResult<T, TErr>,
): result is Err<TErr> {
  return result.type === 'err';
}

export function mapOk<T, TErr, TNew>(
  result: AsyncResult<T, TErr>,
  fn: (value: T) => TNew,
): AsyncResult<TNew, TErr> {
  if (isOk(result)) {
    return ok(fn(result.value));
  }
  return result;
}

export function mapErr<T, TErr, TNew>(
  result: AsyncResult<T, TErr>,
  fn: (error: TErr) => TNew,
): AsyncResult<T, TNew> {
  if (isErr(result)) {
    return err(fn(result.error));
  }
  return result;
}

export function mapResult<T, TErr, TNew, TNewErr>(
  result: AsyncResult<T, TErr>,
  okFn: (value: T) => TNew,
  errFn: (error: TErr) => TNewErr,
): AsyncResult<TNew, TNewErr> {
  if (isOk(result)) {
    return ok(okFn(result.value));
  }
  if (isErr(result)) {
    return err(errFn(result.error));
  }
  return result;
}

export function toAsyncResult<T>(
  src: Observable<T>,
): Observable<AsyncResult<T, unknown>> {
  return src.pipe(
    map((value) => ok(value)),
    startWith(pending),
    catchError((error) => of(err(error))),
  );
}

export function toManyAsyncResult<T>(
  src: Observable<Observable<T>>,
): Observable<AsyncResult<T, unknown>> {
  return src.pipe(map(toAsyncResult), switchAll());
}

export function untilOk<T>(
  src: Observable<AsyncResult<T, unknown>>,
): Observable<Ok<T>> {
  return src.pipe(
    bufferCount(2, 1),
    filter(([prev, curr]) => isOk(curr) && !isOk(prev)),
    map(([, curr]) => curr as Ok<T>),
  );
}
