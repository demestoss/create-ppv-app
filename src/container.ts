import { container } from "tsyringe";
import { ConsoleLogger } from "./logger";
import { AppSpinner } from "./spinner";
import { NodeEnvironment } from "./cli/environment";
import { CommandProgram } from "./cli/program";
import { ProjectDirectory } from "./project/directory";
import { AppCli } from "./cli/cli";
import { ProjectStagesRegistry } from "./project/projectStagesRegistry";
import { PpvProject, Project, ProjectOptions } from "./project/project";
import { ProjectStagesProcessor } from "./project/stagesProcessor";
import { PpvProjectSettings } from "./project/projectSettings";

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
container.register("ProjectStagesRegistry", {
  useFactory: (dependencyContainer) => {
    return new ProjectStagesRegistry(dependencyContainer);
  },
});
container.register("ProjectSettingsFactory", {
  useFactory: (dependencyContainer) => {
    return (options: ProjectOptions) => {
      const settings = new PpvProjectSettings(options);
      dependencyContainer.register("ProjectSettings", {
        useValue: settings,
      });
      return settings;
    };
  },
});
container.register("StagesProcessor", {
  useClass: ProjectStagesProcessor,
});

export { container };
