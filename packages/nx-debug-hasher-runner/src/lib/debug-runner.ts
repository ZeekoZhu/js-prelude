import type { TasksRunner, TaskStatus } from 'nx/src/tasks-runner/tasks-runner';
import { getDebugWriter } from './debug-writer';
import { logTaskDebugInfo } from './log-task-debug-info';
import { DebugRunnerOptions } from './types';
import { omit } from './utils';

function getEnableDebug(options: DebugRunnerOptions) {
  const debugOptions = options?.debugOptions ?? { enable: false };
  return (
    process.env['NX_DEBUG_HASHER_RUNNER']?.toLowerCase() === 'true' ||
    debugOptions.enable
  );
}

function getDebugOutputFile(options: DebugRunnerOptions) {
  const envVar = process.env['NX_DEBUG_HASHER_RUNNER_OUTPUT_FILE'];
  const debugOptions = options?.debugOptions ?? {};
  return debugOptions.outputFile ?? envVar;
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
    logTaskDebugInfo(
      getDebugWriter(getDebugOutputFile(options)),
      tasks,
      context,
      options?.debugOptions?.debugInputPattern,
    );
  }
  return awaitedRunnerResult;
};
