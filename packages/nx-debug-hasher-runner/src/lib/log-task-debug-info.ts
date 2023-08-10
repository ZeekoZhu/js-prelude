import { Task } from 'nx/src/config/task-graph';
import { filterUsingGlobPatterns, getInputs } from 'nx/src/hasher/task-hasher';
import { getProjectFileMap } from 'nx/src/project-graph/build-project-graph';
import { DebugWriter } from './debug-writer';
import { TaskRunnerContext } from './types';

export function logTaskDebugInfo(
  debugWriter: DebugWriter,
  tasks: Task[],
  context?: TaskRunnerContext,
  debugFileset = false,
) {
  for (const task of tasks) {
    debugWriter.writeLine(`DEBUG TASK: ${task.id}`);
    debugWriter.writeLine(JSON.stringify(task, null, 2));
    if (debugFileset && context) {
      if (context.daemon?.enabled()) {
        debugWriter.writeLine(
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
      debugWriter.writeLine(
        `DEBUG TASK: ${task.id} input\n${selfInputFileSetPatterns.join('\n')}`,
      );
      debugWriter.writeLine(JSON.stringify(selfInputFiles, null, 2));
    }
  }
  debugWriter.flush();
}
