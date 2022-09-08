import { inject, injectable } from "tsyringe";
import { ProjectSettings } from "./projectSettings";
import { ProjectStagesRegistry } from "./projectStagesRegistry";
import type { IProcessor } from "./commandProcessor";

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
  constructor(@inject("CommandProcessor") private readonly processor: IProcessor) {}

  async create(options: ProjectOptions) {
    const settings = new ProjectSettings(options);
    const registry = new ProjectStagesRegistry(options, settings);

    await this.processor.proceed(registry);
  }
}

export { PpvProject };
export type { ProjectOptions, Project };
