import { inject, injectable } from "tsyringe";
import type { Logger } from "../logger";
import type { ICommandTextProvider } from "./commandTextProvider";

interface ICommand {}

interface ICommandHandler<T extends ICommand> {
  handle(command: T): Promise<void>;
}

@injectable()
class StageCommandDecorator<T extends ICommand> implements ICommandHandler<T> {
  constructor(
    @inject("CommandTextProvider") private readonly textProvider: ICommandTextProvider,
    @inject("Logger") private readonly logger: Logger,
    private readonly commandHandler: ICommandHandler<T>
  ) {}

  async handle(command: T) {
    const text = this.textProvider.getTextByCommand(command);
    if (text) {
      this.logger.info(text);
    }

    await this.commandHandler.handle(command);
  }
}

export { StageCommandDecorator };
export type { ICommand, ICommandHandler };
