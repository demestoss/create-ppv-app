import { injectable, injectAll } from "tsyringe";
import type { ProjectSettings } from "./projectSettings";

interface Stage {
  proceed(settings: ProjectSettings): Promise<void>;
}

interface StagesProcessor {
  proceed(settings: ProjectSettings): Promise<void>;
}

@injectable()
class ProjectStagesProcessor implements StagesProcessor {
  constructor(@injectAll("ProjectStage") private readonly stages: Stage[]) {}

  async proceed(settings: ProjectSettings) {
    for await (const stage of this.stages) {
      await stage.proceed(settings);
    }
  }
}

export { ProjectStagesProcessor };
export type { Stage, StagesProcessor };
