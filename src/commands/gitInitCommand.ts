import { inject, injectable } from "tsyringe";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { ICommand, ICommandHandler } from "./command";
import { execAsync } from "../utils";
import chalk from "chalk";

class GitInitCommand implements ICommand {
  constructor(public readonly dir: string) {}
}

@injectable()
class GitInitCommandHandler implements ICommandHandler<GitInitCommand> {
  constructor(@inject("Spinner") protected readonly spinner: Spinner) {}

  async handle(command: GitInitCommand) {
    // this.spinner.start("Creating a new git repo...");
    // try {
    //   let initCmd = "git init --initial-branch=master";
    //   const { stdout: gitVersionOutput } = await execAsync("git --version");
    //   const gitVersionTag = gitVersionOutput.split(" ")[2];
    //   const major = gitVersionTag?.split(".")[0];
    //   const minor = gitVersionTag?.split(".")[1];
    //   if (Number(major) < 2 || Number(minor) < 28) {
    //     initCmd = "git init && git branch -m master";
    //   }
    //   await execAsync(initCmd, { cwd: command.dir });
    //   this.spinner.succeed(`${chalk.green("Successfully initialized")} ${chalk.green.bold("git")}`);
    // } catch (error) {
    //   this.spinner.fail(
    //     `${chalk.bold.red("Failed:")} could not initialize git. Update git to the latest version!`
    //   );
    // }
  }
}

class TestCommand implements ICommand {}

@injectable()
class TestCommandHandler implements ICommandHandler<GitInitCommand> {
  constructor(
    @inject("Logger") protected readonly logger: Logger,
    @inject("Spinner") protected readonly spinner: Spinner
  ) {}

  async handle(command: GitInitCommand) {
    this.logger.error("SAAAAS");
  }
}

export { GitInitCommand, GitInitCommandHandler, TestCommandHandler, TestCommand };
