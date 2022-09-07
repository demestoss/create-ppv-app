import { inject, injectable } from "tsyringe";
import fs from "fs-extra";
import path from "path";
import type { Directory } from "../project/directory";
import type { ProjectSettings } from "../project/projectSettings";
import type { Stage } from "../project/stagesProcessor";

@injectable()
class CopyLockFileStage implements Stage {
  constructor(
    @inject("Directory") private readonly env: Directory,
    @inject("ProjectSettings") private readonly settings: ProjectSettings
  ) {}

  async proceed() {
    await this.copyLockFile();
  }

  private get lockDir() {
    return path.join(this.env.packageRoot, "template/packageManager");
  }

  private async copyLockFile() {
    await fs.copy(
      path.join(this.lockDir, this.settings.packageManager.lockFile),
      path.join(this.settings.dir, this.settings.packageManager.lockFile)
    );
  }
}

export { CopyLockFileStage };
