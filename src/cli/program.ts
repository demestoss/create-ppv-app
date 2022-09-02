import { Command } from "commander";

interface ProgramOptions {
  name: string;
  noGit: boolean;
  noInstall: boolean;
}

class Program {
  private readonly program: Command;

  constructor() {
    this.program = new Command()
      .name("create-ppv-app")
      .description("Create web application with a zero config")
      .argument("[name]", "The name of the application")
      .option("--noGit", "Pass if Git shouldn't be initialized")
      .option("--noInstall", "Pass if dependencies shouldn't be installed");
  }

  parse(argv: string[]): ProgramOptions {
    this.program.parse(argv);
    return this.program.opts<ProgramOptions>();
  }
}

export { Program };
export type { ProgramOptions };
