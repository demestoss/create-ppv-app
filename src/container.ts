import { container } from "tsyringe";
import { ConsoleLogger } from "./logger";
import { AppSpinner } from "./spinner";
import { NodeEnvironment } from "./cli/environment";
import { CommandProgram } from "./cli/program";
import { ProjectDirectory } from "./project/directory";
import { AppCli } from "./cli/cli";
import { PpvProject, Project } from "./project/project";
import { CommandProcessor } from "./project/commandProcessor";
import {
  GitInitCommand,
  GitInitCommandHandler,
  TestCommand,
  TestCommandHandler,
} from "./commands/gitInitCommand";
import { StageCommandDecorator } from "./commands/command";
import { CommandTextProvider } from "./commands/commandTextProvider";

// Base Singletons
container.register("Logger", {
  useClass: ConsoleLogger,
});
container.register("CommandTextProvider", {
  useClass: CommandTextProvider,
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

// Command Handlers
container.register("GitInitCommand.name", {
  useClass: GitInitCommandHandler,
});

container.register(GitInitCommand.name, {
  useFactory: (dependencyContainer) => {
    return new StageCommandDecorator<GitInitCommand>(
      dependencyContainer.resolve("CommandTextProvider"),
      dependencyContainer.resolve("Logger"),
      dependencyContainer.resolve("GitInitCommand.name")
    );
  },
});

container.register("TestCommand.name", {
  useClass: TestCommandHandler,
});

container.register("TestCommandSpinnerDecorator", {
  useFactory: (dependencyContainer) => {
    return new SpinnerCommandDecorator<TestCommand>(
      dependencyContainer.resolve("CommandTextProvider"),
      dependencyContainer.resolve("Logger"),
      dependencyContainer.resolve("TestCommand.name")
    );
  },
});

container.register(TestCommand.name, {
  useFactory: (dependencyContainer) => {
    return new StageCommandDecorator<TestCommand>(
      dependencyContainer.resolve("CommandTextProvider"),
      dependencyContainer.resolve("Logger"),
      dependencyContainer.resolve("TestCommandSpinnerDecorator")
    );
  },
});

export { container };
