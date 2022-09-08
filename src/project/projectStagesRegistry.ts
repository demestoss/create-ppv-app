import type { ProjectOptions } from "./project";
import { ICommand } from "../commands/command";
import { GitInitCommand, TestCommand } from "../commands/gitInitCommand";
import type { ProjectSettings } from "./projectSettings";

class ProjectStagesRegistry {
  readonly commands: ICommand[] = [];

  constructor(
    private readonly options: ProjectOptions,
    private readonly settings: ProjectSettings
  ) {
    this.registerStages();
  }

  private registerStages() {
    // this.register({
    //   useClass: CreateTemplateStage,
    // });
    // this.register({
    //   useClass: UpdatePackagesStage,
    // });
    // this.register({
    //   useClass: CopyLockFileStage,
    // });
    //
    // if (options.install) {
    //   this.register({
    //     useClass: InstallPackagesStage,
    //   });
    // }
    this.commands.push(new TestCommand());

    if (this.options.git) {
      this.commands.push(new GitInitCommand(this.settings.dir));
    }

    // this.register({
    //   useClass: GuideStage,
    // });
  }
}

export { ProjectStagesRegistry };
