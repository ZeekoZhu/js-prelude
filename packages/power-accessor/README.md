# power-accessor

## Installation

```shell
npm i @zeeko/power-accessor
```

## Usage

```typescript
import { Accessor, Matcher } from '@zeeko/power-accessor';

const obj = {
  a: {
    bob: { c: 1 },
    alice: { c: 2 },
    cindy: { c: 3 },
    bill: { c: 4 },
  },
};

const accessor = new Accessor('a', Matcher.when(key => key.startsWith('b')), 'c');
const values = accessor.get(obj);
console.log(values); // [1, 4]
accessor.set(obj, 5);
const updatedValues = accessor.get(obj);
console.log(updatedValues); // [5, 5]
```

## Building

Run `nx build power-accessor` to build the library.
