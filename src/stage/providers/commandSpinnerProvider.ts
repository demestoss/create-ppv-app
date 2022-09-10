import { singleton } from "tsyringe";
import type { StageCommand } from "../command";
import { GitInitCommand } from "../gitInitCommand";
import chalk from "chalk";

interface SpinnerData {
  start: string;
  success: string;
  fail: string;
}

interface ICommandSpinnerProvider {
  getSpinnerData(command: StageCommand): SpinnerData;
}

@singleton()
class CommandSpinnerProvider implements ICommandSpinnerProvider {
  private readonly spinnerMap: Record<string, SpinnerData> = {
    [GitInitCommand.name]: {
      start: "Creating a new git repo...",
      success: `${chalk.green("Successfully initialized")} ${chalk.green.bold("git")}`,
      fail: `${chalk.bold.red(
        "Failed:"
      )} could not initialize git. Update git to the latest version!`,
    },
  };

  getSpinnerData(command: StageCommand): SpinnerData {
    return this.spinnerMap[command.constructor.name] || this.getDefaultSpinner();
  }

  private getDefaultSpinner(): SpinnerData {
    return {
      start: "Loading...",
      success: "Successfully loaded",
      fail: "Execution was failed",
    };
  }
}

export { CommandSpinnerProvider };
export type { ICommandSpinnerProvider };
