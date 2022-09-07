import { injectable, injectAll } from "tsyringe";

interface Stage {
  proceed(): Promise<void>;
}

interface StagesProcessor {
  proceed(): Promise<void>;
}

@injectable()
class ProjectStagesProcessor implements StagesProcessor {
  constructor(@injectAll("ProjectStage") private readonly stages: Stage[]) {}

  async proceed() {
    for await (const stage of this.stages) {
      await stage.proceed();
    }
  }
}

export { ProjectStagesProcessor };
export type { Stage, StagesProcessor };
