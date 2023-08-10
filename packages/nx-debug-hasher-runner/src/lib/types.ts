import { TasksRunner } from 'nx/src/tasks-runner/tasks-runner';

export type TaskRunnerContext = Exclude<Parameters<TasksRunner>[2], undefined>;

export interface DebugRunnerOptions {
  debugOptions?: {
    runner?: string;
    enable?: boolean;
    debugInputPattern?: boolean;
    /**
     * set a path to disable console output and write the debug info to
     * a file
     * @default undefined
     */
    outputFile?: string;
  };
}
