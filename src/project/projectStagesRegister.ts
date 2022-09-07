import { ClassProvider, DependencyContainer } from "tsyringe";
import { CliOptions } from "./project";
import { CreateTemplateStage } from "../stages/createTemplate";
import { UpdatePackagesStage } from "../stages/updatePackages";
import { InstallPackagesStage } from "../stages/installPackages";
import { GitStage } from "../stages/git";
import { GuideStage } from "../stages/guide";
import { CopyLockFileStage } from "../stages/copyLockFile";

class ProjectStagesRegister {
  constructor(private readonly container: DependencyContainer) {}

  register(options: CliOptions) {
    this.registerStage({
      useClass: CreateTemplateStage,
    });
    this.registerStage({
      useClass: UpdatePackagesStage,
    });
    this.registerStage({
      useClass: CopyLockFileStage,
    });

    if (options.install) {
      this.registerStage({
        useClass: InstallPackagesStage,
      });
    }

    if (options.git) {
      this.registerStage({
        useClass: GitStage,
      });
    }

    this.registerStage({
      useClass: GuideStage,
    });
  }

  private registerStage<T>(provider: ClassProvider<T>) {
    this.container.register("ProjectStage", provider);
  }
}

export { ProjectStagesRegister };
