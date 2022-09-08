import { type DependencyContainer, injectable } from "tsyringe";
import { ProjectStagesRegistry } from "./projectStagesRegistry";
import type { ICommandHandler } from "../commands/command";

interface IProcessor {
  proceed(registry: ProjectStagesRegistry): Promise<void>;
}

@injectable()
class CommandProcessor implements IProcessor {
  constructor(private readonly dependencyContainer: DependencyContainer) {}

  async proceed(registry: ProjectStagesRegistry) {
    for await (const command of registry.commands) {
      // TODO: Patterns???
      const handler = this.dependencyContainer.resolve<ICommandHandler<any>>(
        command.constructor.name
      );
      await handler.handle(command);
    }
  }
}

interface Stage {}

export type { IProcessor, Stage };
export { CommandProcessor };
