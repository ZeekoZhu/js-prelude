# nx-debug-hasher-runner

This is a custom Nx runner that can be used to debug the hashers used by Nx.

## Usage

1. update your nx.json to use the debug runner

```json5
// nx.json
{
  tasksRunnerOptions: {
    default: {
      // change the default runner to `@zeeko/nx-debug-hasher-runner`
      runner: '@zeeko/nx-debug-hasher-runner',
      options: {
        // see the following table for the available options
        debugOptions: {
          runner: 'your-custom-runner',
          enable: false,
          debugInputPattern: true,
        },
        // all other options are passed to the actual runner (see debugOptions.runner)
        cacheableOperations: ['build'],
      },
    },
  },
}
```

2. run your tasks with `NX_DAEMON=false`

```shell
NX_DAEMON=false NX_DEBUG_HASHER_RUNNER=true nx build my-project
```

### debugOptions

| Option name       | ENV variable           | Description                                                    | Default                             |
| ----------------- | ---------------------- | -------------------------------------------------------------- | ----------------------------------- |
| runner            | -                      | The runner to use for running tasks.                           | Optional, `nx/tasks-runner/default` |
| enable            | NX_DEBUG_HASHER_RUNNER | Set to `true` to enable the debug runner.                      | Optional, `false`                   |
| debugInputPattern | -                      | Set to `true` to debug the input fileset patterns of the task. | Optional, `false`                   |

## Building

Run `nx build nx-debug-hasher-runner` to build the library.

## Running unit tests
