import { container } from "tsyringe";
import { AppLogger } from "./logger";
import { AppSpinner } from "./spinner";
import { NodeEnvironment } from "./environment";
import { GitStage } from "./stages/git";
import { UpdatePackagesStage } from "./stages/updatePackages";
import { CreateTemplateStage } from "./stages/createTemplate";
import { InstallPackagesStage } from "./stages/installPackages";
import { GuideStage } from "./stages/guide";

container.register("Logger", {
  useClass: AppLogger,
});
container.register("Spinner", {
  useClass: AppSpinner,
});
container.register("Environment", {
  useClass: NodeEnvironment,
});

container.register("ProjectStage", {
  useClass: CreateTemplateStage,
});
container.register("ProjectStage", {
  useClass: UpdatePackagesStage,
});
container.register("ProjectStage", {
  useClass: InstallPackagesStage,
});
container.register("ProjectStage", {
  useClass: GitStage,
});
container.register("ProjectStage", {
  useClass: GuideStage,
});

export { container };
