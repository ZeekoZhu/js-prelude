export interface DebugWriter {
  writeLine: (line: string) => void;
  flush: () => void;
}

class ConsoleDebugWriter implements DebugWriter {
  writeLine(line: string) {
    console.log(line);
  }

  flush(): void {
    // noop
  }
}

class FileDebugWriter implements DebugWriter {
  private readonly fs = require('fs');
  private readonly fd: number;

  constructor(private readonly outputFile: string) {
    this.fd = this.fs.openSync(outputFile, 'w');
  }

  writeLine(line: string) {
    this.fs.writeSync(this.fd, line + '\n');
  }

  flush(): void {
    this.fs.closeSync(this.fd);
  }
}

export function getDebugWriter(outputFile?: string): DebugWriter {
  if (outputFile) {
    return new FileDebugWriter(outputFile);
  }
  return new ConsoleDebugWriter();
}
