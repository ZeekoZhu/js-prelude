# nx-debug-hasher-runner

This is a custom Nx runner that can be used to debug the hashers used by Nx.

## Usage

1. Update your nx.json to use the debug runner

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

2. Run your tasks with `NX_DAEMON=false`

```shell
NX_DAEMON=false NX_DEBUG_HASHER_RUNNER=true nx build my-project
```

3. Now you will see the debug output from the runner, for example:

```text
DEBUG TASK: nx-debug-hasher-runner:build
{
  "id": "nx-debug-hasher-runner:build",
  "target": {
    "project": "nx-debug-hasher-runner",
    "target": "build"
  },
  "projectRoot": "packages/nx-debug-hasher-runner",
  "overrides": {
    "__overrides_unparsed__": []
  },
  "hash": "8244009900898338034",
  "hashDetails": {
    "command": "1710125247983764296",
    "nodes": {
      "nx-debug-hasher-runner:{projectRoot}/**/*": "12720395929004522337",
      "ProjectConfiguration": "17990397324634414488",
      "TsConfig": "11181298256226281826",
      // many other dependencies' hashes are omitted
    },
    "implicitDeps": {},
    "runtime": {}
  },
  "startTime": 1691655852529
}
DEBUG TASK: nx-debug-hasher-runner:build input {projectRoot}/**/*
[
  {
    "file": "packages/nx-debug-hasher-runner/.eslintrc.json",
    "hash": "16896711999632553762"
  },
  // many other file hashes are omitted
]
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
