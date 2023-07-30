# ts-sync-ref

`ts-sync-ref` is a cli tool that provides a way to
update [typescript project references](https://www.typescriptlang.org/docs/handbook/project-references.html#what-is-a-project-reference)
in your monorepo.

## Installation

```shell
# via npm
npm install -g @zeeko/ts-sync-ref
# via volta
volta install @zeeko/ts-sync-ref
```

## Usage

```shell
# from the root of your monorepo
ts-sync-ref -p packages/my-lib/tsconfig.json -f 'src/**/*.ts' -m .

# for more detailed help
ts-sync-ref --help

Usage: ts-sync-ref [options]

Options:
  -p, --project <path>      Path to project's tsconfig.json
                            default = './tsconfig.json'
  -f, --files <glob>        Glob pattern for source files,
                            relative to containing dir of 'project'
                            default = 'src/**/*.ts'
  -m, --monorepo <path>     Path to monorepo root
                            default = './'
  --dry-run                 Do not write to tsconfig.json
  --verbose                 Print verbose logs
  -h, --help                Display this message
```

## Development

### Building

Run `nx build ts-sync-ref` to build the library.

### Running unit tests

Run `nx test ts-sync-ref` to execute the unit tests.
