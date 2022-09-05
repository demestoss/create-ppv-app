import { injectable, injectAll } from "tsyringe";
import type { Stage } from "./stage";

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
