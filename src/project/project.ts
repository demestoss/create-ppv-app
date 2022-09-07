import { inject, injectable } from "tsyringe";
import { container } from "../container";
import type { StagesRegistry } from "./projectStagesRegistry";
import type { StagesProcessor } from "./stagesProcessor";
import type { ProjectSettings } from "./projectSettings";

interface ProjectOptions {
  name: string;
  git: boolean;
  install: boolean;
  packageManager: string;
}

interface Project {
  create(options: ProjectOptions): Promise<void>;
}

@injectable()
class PpvProject implements Project {
  constructor(
    @inject("ProjectStagesRegistry") private readonly registry: StagesRegistry,
    @inject("ProjectSettingsFactory")
    private readonly projectSettingsFactory: (o: ProjectOptions) => ProjectSettings
  ) {}

  async create(options: ProjectOptions) {
    // register in container
    this.registry.registerStages(options);
    const processor = container.resolve<StagesProcessor>("StagesProcessor");

    const settings = this.projectSettingsFactory(options);
    await processor.proceed(settings);
  }
}

export { PpvProject };
export type { ProjectOptions, Project };
