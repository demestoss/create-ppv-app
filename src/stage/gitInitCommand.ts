import { inject, injectable } from "tsyringe";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { StageCommand, StageCommandHandler } from "./command";
import { execAsync } from "../utils";

class GitInitCommand implements StageCommand {
  constructor(public readonly dir: string) {}
}

@injectable()
class GitInitCommandHandler implements StageCommandHandler<GitInitCommand> {
  async handle(command: GitInitCommand) {
    //   let initCmd = "git init --initial-branch=master";
    //   const { stdout: gitVersionOutput } = await execAsync("git --version");
    //   const gitVersionTag = gitVersionOutput.split(" ")[2];
    //   const major = gitVersionTag?.split(".")[0];
    //   const minor = gitVersionTag?.split(".")[1];
    //   if (Number(major) < 2 || Number(minor) < 28) {
    //     initCmd = "git init && git branch -m master";
    //   }
    //   await execAsync(initCmd, { cwd: command.dir });
  }
}

class TestCommand implements StageCommand {}

@injectable()
class TestCommandHandler implements StageCommandHandler<GitInitCommand> {
  constructor(
    @inject("Logger") protected readonly logger: Logger,
    @inject("Spinner") protected readonly spinner: Spinner
  ) {}

  async handle(command: GitInitCommand) {
    this.logger.error("SAAAAS");
  }
}

export { GitInitCommand, GitInitCommandHandler, TestCommandHandler, TestCommand };
