import type { Task } from 'nx/src/config/task-graph';
import { getInputs, filterUsingGlobPatterns } from 'nx/src/hasher/task-hasher';
import { getProjectFileMap } from 'nx/src/project-graph/build-project-graph';
import type { TasksRunner, TaskStatus } from 'nx/src/tasks-runner/tasks-runner';

type TaskRunnerContext = Exclude<Parameters<TasksRunner>[2], undefined>;

export interface DebugRunnerOptions {
  debugOptions?: {
    runner?: string;
    enable?: boolean;
    debugInputPattern?: boolean;
  };
}

function logTaskDebugInfo(
  tasks: Task[],
  context?: TaskRunnerContext,
  debugFileset = false,
) {
  for (const task of tasks) {
    console.log(`DEBUG TASK: ${task.id}`);
    console.log(JSON.stringify(task, null, 2));
    if (debugFileset && context) {
      if (context.daemon?.enabled()) {
        console.log(
          `DEBUG TASK: unable to debug input files when using daemon, please rerun the task with 'NX_DAEMON=false'`,
        );
        continue;
      }
      const inputs = getInputs(task, context.projectGraph, context.nxJson);
      const projectName = task.target.project;
      const p = context.projectGraph.nodes[projectName];
      const selfInputFileSetPatterns = inputs.selfInputs
        .filter((it) => 'fileset' in it)
        .map((it) => (it as { fileset: string }).fileset);
      // when daemon is disabled
      // the projectFileMap should have been built by now
      const { projectFileMap } = getProjectFileMap();
      const selfInputFiles = filterUsingGlobPatterns(
        p.data.root,
        projectFileMap[projectName] ?? [],
        selfInputFileSetPatterns,
      );
      console.log(
        `DEBUG TASK: ${task.id} input\n${selfInputFileSetPatterns.join('\n')}`,
      );
      console.log(JSON.stringify(selfInputFiles, null, 2));
    }
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
    logTaskDebugInfo(tasks, context, options?.debugOptions?.debugInputPattern);
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
