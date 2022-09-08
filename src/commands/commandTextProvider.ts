import { singleton } from "tsyringe";
import { ICommand } from "./command";
import { GitInitCommand, TestCommand } from "./gitInitCommand";

interface ICommandTextProvider {
  getTextByCommand(command: ICommand): string;
}

@singleton()
class CommandTextProvider implements ICommandTextProvider {
  private readonly textMap = {
    [GitInitCommand.name]: {
      text: "Initializing Git...",
    },
    [TestCommand.name]: {
      text: "Testovii header",
    },
  };

  getTextByCommand(command: ICommand): string {
    return this.textMap[command.constructor.name].text;
  }
}

export { CommandTextProvider };
export type { ICommandTextProvider };
