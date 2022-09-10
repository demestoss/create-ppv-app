import { DependencyContainer } from "tsyringe";
import {
  type StageCommand,
  type StageCommandHandler,
  StageCommandSpinnerDecorator,
  StageCommandTitleDecorator,
} from "../stage/command";

interface DecoratorBuilder<TCommand extends StageCommand> {
  decorator: new (...args: any[]) => StageCommandHandler<TCommand>;
  dependencies: string[];
}

class TitleDecoratorBuilder<T extends StageCommand> implements DecoratorBuilder<T> {
  decorator = StageCommandTitleDecorator;
  dependencies = ["CommandTitleProvider", "Logger"];
}

class SpinnerDecoratorBuilder<T extends StageCommand> implements DecoratorBuilder<T> {
  decorator = StageCommandSpinnerDecorator;
  dependencies = ["CommandSpinnerProvider", "Spinner"];
}

class CommandHandlerRegistry {
  constructor(private readonly container: DependencyContainer) {}

  registerCommandHandler<T extends StageCommand>(
    command: StageCommand,
    handler: new (...args: any[]) => StageCommandHandler<T>,
    decoratorBuilders: DecoratorBuilder<T>[] = []
  ) {
    // @ts-ignore
    const commandName = command.name;

    if (!decoratorBuilders.length) {
      return this.registerHandler(commandName, handler);
    }

    const baseName = commandName + "Base";
    this.registerHandler(baseName, handler);

    decoratorBuilders.reverse().reduce((dependencyName, builder, idx) => {
      const isLast = idx === decoratorBuilders.length - 1;
      const name = isLast ? commandName : commandName + builder.decorator.name;

      this.registerStageDecorator(builder, name, dependencyName);
      return name;
    }, baseName);
  }

  private registerHandler<T extends StageCommand>(
    name: string,
    handler: new (...args: any[]) => StageCommandHandler<T>
  ) {
    this.container.register(name, {
      useClass: handler,
    });
  }

  private registerStageDecorator<T extends StageCommand>(
    builder: DecoratorBuilder<T>,
    name: string,
    dependencyName: string
  ) {
    const { decorator, dependencies } = builder;

    this.container.register(name, {
      useFactory: (dependencyContainer) => {
        return new decorator(
          ...dependencies.map((dep) => dependencyContainer.resolve(dep)),
          dependencyContainer.resolve(dependencyName)
        );
      },
    });
  }
}

export { CommandHandlerRegistry, TitleDecoratorBuilder, SpinnerDecoratorBuilder };
