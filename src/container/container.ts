import { container } from "tsyringe";
import { ConsoleLogger } from "../logger";
import { AppSpinner } from "../spinner";
import { NodeEnvironment } from "../cli/environment";
import { CommandProgram } from "../cli/program";
import { ProjectDirectory } from "../project/directory";
import { AppCli } from "../cli/cli";
import { PpvProject, Project } from "../project/project";
import { CommandProcessor } from "../project/commandProcessor";
import {
  GitInitCommand,
  GitInitCommandHandler,
  TestCommand,
  TestCommandHandler,
} from "../stage/gitInitCommand";
import { CommandTitleProvider } from "../stage/providers/commandTitleProvider";
import { CommandSpinnerProvider } from "../stage/providers/commandSpinnerProvider";
import {
  CommandHandlerRegistry,
  SpinnerDecoratorBuilder,
  TitleDecoratorBuilder,
} from "./commandHandlerRegistry";

// Base Singletons
container.register("Logger", {
  useClass: ConsoleLogger,
});
container.register("Spinner", {
  useClass: AppSpinner,
});
container.register("Environment", {
  useClass: NodeEnvironment,
});
container.register("Directory", {
  useClass: ProjectDirectory,
});
container.register("CommandTitleProvider", {
  useClass: CommandTitleProvider,
});
container.register("CommandSpinnerProvider", {
  useClass: CommandSpinnerProvider,
});

// CLI
container.register("Cli", {
  useClass: AppCli,
});
container.register("Program", {
  useClass: CommandProgram,
});

// Project
container.register("Project", {
  useClass: PpvProject,
});
container.register("CommandProcessor", {
  useFactory: (dependencyContainer) => new CommandProcessor(dependencyContainer),
});

// StageCommand Handlers
const handlersRegistry = new CommandHandlerRegistry(container);

handlersRegistry.registerCommandHandler(GitInitCommand, GitInitCommandHandler, [
  new TitleDecoratorBuilder(),
  new SpinnerDecoratorBuilder(),
]);

handlersRegistry.registerCommandHandler(TestCommand, TestCommandHandler, [
  new TitleDecoratorBuilder(),
]);

export { container };
