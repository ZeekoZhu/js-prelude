import { Task } from 'nx/src/config/task-graph';
import defaultTasksRunner from 'nx/src/tasks-runner/default-tasks-runner';
import { TasksRunner, TaskStatus } from 'nx/src/tasks-runner/tasks-runner';

export interface DebugRunnerOptions {
  // todo: support custom runner
  // runnerImpl: string;
  debugOptions: {
    runner: string;
    enable: boolean;
  };
}

function logTaskDebugInfo(tasks: Task[]) {
  for (const task of tasks) {
    console.log(`DEBUG TASK: ${task.id}`);
    console.log(JSON.stringify(task.hashDetails, null, 2));
  }
}

function getEnableDebug(options: DebugRunnerOptions) {
  const debugOptions = options?.debugOptions ?? { enable: false };
  return (
    process.env['NX_DEBUG_HASHER_RUNNER']?.toLowerCase() === 'true' ||
    debugOptions.enable
  );
}

function getRunnerImpl(options: DebugRunnerOptions) {
  const runnerImpl =
    options?.debugOptions?.runner ?? 'nx/tasks-runners/default';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(runnerImpl).default as TasksRunner;
}

export const debugRunner: TasksRunner<DebugRunnerOptions> = async (
  tasks,
  options,
  context,
) => {
  const runnerImpl = getRunnerImpl(options);
  const enableDebug = getEnableDebug(options);
  const runnerOptions = omit(options, ['debugOptions']);
  const runnerResult: Promise<{
    [id: string]: TaskStatus;
  }> = runnerImpl(
    tasks,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runnerOptions as any,
    context,
  );
  const awaitedRunnerResult = await runnerResult;
  if (enableDebug) {
    logTaskDebugInfo(tasks);
  }
  return awaitedRunnerResult;
};

function omit<T>(obj: T, keys: (keyof T)[]): Omit<T, keyof typeof keys> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}