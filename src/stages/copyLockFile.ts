import { inject, injectable } from "tsyringe";
import fs from "fs-extra";
import path from "path";
import type { Directory } from "../project/directory";
import type { ProjectSettings } from "../project/projectSettings";
import type { Stage } from "../project/stagesProcessor";

@injectable()
class CopyLockFileStage implements Stage {
  constructor(@inject("Directory") private readonly env: Directory) {}

  async proceed(settings: ProjectSettings) {
    await fs.copy(
      path.join(this.lockDir, settings.packageManager.lockFile),
      path.join(settings.dir, settings.packageManager.lockFile)
    );
  }

  private get lockDir() {
    return path.join(this.env.packageRoot, "template/packageManager");
  }
}

export { CopyLockFileStage };
