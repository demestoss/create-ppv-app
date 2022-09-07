import { ClassProvider, DependencyContainer } from "tsyringe";
import type { ProjectOptions } from "./project";
import { CreateTemplateStage } from "../stages/createTemplate";
import { UpdatePackagesStage } from "../stages/updatePackages";
import { InstallPackagesStage } from "../stages/installPackages";
import { GitStage } from "../stages/git";
import { GuideStage } from "../stages/guide";
import { CopyLockFileStage } from "../stages/copyLockFile";

interface StagesRegistry {
  registerStages(options: ProjectOptions): void;
}

class ProjectStagesRegistry implements StagesRegistry {
  constructor(private readonly container: DependencyContainer) {}

  registerStages(options: ProjectOptions) {
    this.register({
      useClass: CreateTemplateStage,
    });
    this.register({
      useClass: UpdatePackagesStage,
    });
    this.register({
      useClass: CopyLockFileStage,
    });

    if (options.install) {
      this.register({
        useClass: InstallPackagesStage,
      });
    }

    if (options.git) {
      this.register({
        useClass: GitStage,
      });
    }

    this.register({
      useClass: GuideStage,
    });
  }

  private register<T>(provider: ClassProvider<T>) {
    this.container.register("ProjectStage", provider);
  }
}

export { ProjectStagesRegistry };
export type { StagesRegistry };
