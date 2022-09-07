import { injectable, injectAll } from "tsyringe";

interface CliOptions {
  name: string;
  git: boolean;
  install: boolean;
  packageManager: string;
}

interface Stage {
  proceed(): Promise<void>;
}

@injectable()
class Project {
  constructor(@injectAll("ProjectStage") private readonly stages: Stage[]) {}

  async proceedStages() {
    for await (const stage of this.stages) {
      await stage.proceed();
    }
  }
}

export { Project };
export type { Stage, CliOptions };
