import { container } from "tsyringe";
import { AppLogger } from "./logger";
import { AppSpinner } from "./spinner";
import { NodeEnvironment } from "./cli/environment";
import { GitStage } from "./stages/git";
import { UpdatePackagesStage } from "./stages/updatePackages";
import { CreateTemplateStage } from "./stages/createTemplate";
import { InstallPackagesStage } from "./stages/installPackages";
import { GuideStage } from "./stages/guide";
import { CommandProgram } from "./cli/program";
import { ProjectDirectory } from "./project/directory";

// Base Singletons
container.register("Logger", {
  useClass: AppLogger,
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
container.register("Program", {
  useClass: CommandProgram,
});

// Project Stages

export { container };
