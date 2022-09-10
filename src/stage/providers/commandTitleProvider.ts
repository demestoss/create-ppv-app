import { singleton } from "tsyringe";
import type { StageCommand } from "../command";
import { GitInitCommand, TestCommand } from "../gitInitCommand";

interface ICommandTitleProvider {
  getTitle(command: StageCommand): string;
}

@singleton()
class CommandTitleProvider implements ICommandTitleProvider {
  private readonly titleMap: Record<string, string> = {
    [GitInitCommand.name]: "Initializing Git...",
    [TestCommand.name]: "Testovii header",
  };

  getTitle(command: StageCommand): string {
    return this.titleMap[command.constructor.name] || "";
  }
}

export { CommandTitleProvider };
export type { ICommandTitleProvider };
