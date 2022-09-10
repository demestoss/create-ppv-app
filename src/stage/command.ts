import { inject, injectable } from "tsyringe";
import type { Logger } from "../logger";
import type { ICommandTitleProvider } from "./providers/commandTitleProvider";
import type { ICommandSpinnerProvider } from "./providers/commandSpinnerProvider";
import type { Spinner } from "../spinner";

interface StageCommand {}

interface StageCommandHandler<T extends StageCommand> {
  handle(command: T): Promise<void>;
}

@injectable()
class StageCommandTitleDecorator<T extends StageCommand> implements StageCommandHandler<T> {
  constructor(
    @inject("CommandTitleProvider") private readonly titleProvider: ICommandTitleProvider,
    @inject("Logger") private readonly logger: Logger,
    private readonly commandHandler: StageCommandHandler<T>
  ) {}

  async handle(command: T) {
    const title = this.titleProvider.getTitle(command);
    if (title) {
      this.logger.info(title);
    }

    await this.commandHandler.handle(command);
  }
}

@injectable()
class StageCommandSpinnerDecorator<T extends StageCommand> implements StageCommandHandler<T> {
  constructor(
    @inject("CommandTitleProvider") private readonly spinnerProvider: ICommandSpinnerProvider,
    @inject("Spinner") private readonly spinner: Spinner,
    private readonly commandHandler: StageCommandHandler<T>
  ) {}

  async handle(command: T) {
    const { start, success, fail } = this.spinnerProvider.getSpinnerData(command);

    try {
      this.spinner.start(start);

      await this.commandHandler.handle(command);

      this.spinner.succeed(success);
    } catch (e) {
      this.spinner.fail(fail);
    }
  }
}

export { StageCommandTitleDecorator, StageCommandSpinnerDecorator };
export type { StageCommand, StageCommandHandler };
