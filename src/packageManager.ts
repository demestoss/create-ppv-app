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
  copyLockFile(dir: string): void;
}

abstract class BasePackageManager implements PackageManager {
  protected readonly lockDir = path.join(PKG_ROOT, "template/packageManager");

  name: string = "";
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

  abstract copyLockFile(dir: string): void;
}

class NpmPackageManager extends BasePackageManager {
  name = "npm";

  logGuide(projectName: string) {
    super.logGuide(projectName);

    this.logger.info(`  ${this.name} run dev`);
  }

  copyLockFile(dir: string) {
    fs.copySync(`${this.lockDir}/package-lock.json`, dir);
  }
}

class YarnPackageManager extends BasePackageManager {
  name = "yarn";

  logGuide(projectName: string) {
    super.logGuide(projectName);

    this.logger.info(`  ${this.name} dev`);
  }

  copyLockFile(dir: string) {
    fs.copySync(`${this.lockDir}/yarn.lock`, dir);
  }
}

class PnpmPackageManager extends BasePackageManager {
  name = "pnpm";

  logGuide(projectName: string) {
    super.logGuide(projectName);

    this.logger.info(`  ${this.name} dev`);
  }

  copyLockFile(dir: string) {
    fs.copySync(`${this.lockDir}/pnpm-lock.yaml`, dir);
  }
}

export { NpmPackageManager, PnpmPackageManager, YarnPackageManager };
export type { PackageManager };
