import { Logger } from "./logger";
import { Spinner } from "./spinner";
import chalk from "chalk";
import { utils } from "./utils";
import path from "path";
import { PKG_ROOT } from "./stages/template";
import fs from "fs-extra";

interface PackageManager {
  name: string;
  install(dir: string): Promise<void>;
  logGuide(projectName: string): void;
  copyLockFile(dir: string): Promise<void>;
}

abstract class BasePackageManager implements PackageManager {
  protected readonly lockDir = path.join(PKG_ROOT, "template/packageManager");

  name: string = "";
  protected lockFile: string = "";
  protected installed: boolean = false;

  constructor(protected readonly logger: Logger, protected readonly spinner: Spinner) {}

  async install(dir: string) {
    this.spinner.start(`Running ${chalk.cyan.bold(this.name + " install")}...`);
    await utils(`${this.name} install`, { cwd: dir });
    this.spinner.succeed(`Packages successfully installed!`);
    this.installed = true;
  }

  logGuide(projectName: string) {
    this.logger.info("Next steps:");
    this.logger.info(`  cd ${projectName}`);
    if (!this.installed) {
      this.logger.info(`  ${this.name} install`);
    }
  }

  async copyLockFile(dir: string) {
    await fs.copy(path.join(this.lockDir, this.lockFile), path.join(dir, this.lockFile));
  }
}

class NpmPackageManager extends BasePackageManager {
  name = "npm";
  lockFile = "package-lock.json";

  logGuide(projectName: string) {
    super.logGuide(projectName);

    this.logger.info(`  ${this.name} run dev`);
  }
}

class YarnPackageManager extends BasePackageManager {
  name = "yarn";
  lockFile = "yarn.lock";

  logGuide(projectName: string) {
    super.logGuide(projectName);

    this.logger.info(`  ${this.name} dev`);
  }
}

class PnpmPackageManager extends BasePackageManager {
  name = "pnpm";
  lockFile = "pnpm-lock.yaml";

  logGuide(projectName: string) {
    super.logGuide(projectName);

    this.logger.info(`  ${this.name} dev`);
  }
}

export { NpmPackageManager, PnpmPackageManager, YarnPackageManager };
export type { PackageManager };
