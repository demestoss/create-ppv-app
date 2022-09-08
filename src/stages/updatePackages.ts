import type { PackageJson } from "type-fest";
import fs from "fs-extra";
import path from "path";
import { inject, injectable } from "tsyringe";
import { execAsync } from "../utils";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { ProjectSettings } from "../project/projectSettings";
import type { Stage } from "../project/commandProcessor";

@injectable()
class UpdatePackagesStage implements Stage {
  private pkgJson!: PackageJson;

  constructor(
    @inject("Logger") protected readonly logger: Logger,
    @inject("Spinner") protected readonly spinner: Spinner
  ) {}

  async proceed(settings: ProjectSettings) {
    this.logger.info("Starting packages update...");
    this.spinner.start(`Updating packages...`);

    await this.parse(settings.dir);
    if (!this.validate()) {
      this.spinner.fail("Package update was failed");
      return;
    }

    await Promise.all([this.updateDependencies(), this.updateDevDependencies()]);
    await this.writePkgJson(settings.dir);

    this.spinner.succeed(`Packages update successfully completed!`);
  }

  private async parse(dir: string) {
    this.pkgJson = (await fs.readJSON(path.join(dir, "package.json"))) as PackageJson;
  }

  private validate(): boolean {
    return !!this.pkgJson && !!this.pkgJson.devDependencies && !!this.pkgJson.dependencies;
  }

  private async updateDependencies() {
    await this.update(this.pkgJson.dependencies!);
  }

  private async updateDevDependencies() {
    await this.update(this.pkgJson.devDependencies!);
  }

  private async update(dependencies: PackageJson.Dependency) {
    const updates = await Promise.all(
      Object.entries(dependencies).map((dep) =>
        new DependencyService(this.logger, dep[0], dep[1]).update()
      )
    );
    updates.map(([name, version]) => {
      dependencies[name] = version;
    });
  }

  private async writePkgJson(dir: string) {
    await fs.writeJSON(path.join(dir, "package.json"), this.pkgJson, {
      spaces: 2,
    });
  }
}

class DependencyService {
  constructor(
    private readonly logger: Logger,
    private readonly name: string,
    private version: string
  ) {}

  async update(): Promise<[string, string]> {
    await this.updateVersion();
    return [this.name, this.version];
  }

  private async updateVersion() {
    if (!this.name) {
      return;
    }

    const { stdout: latestVersion } = await execAsync(`npm show ${this.name} version`);
    if (!latestVersion) {
      this.logger.warn("WARN: Failed to resolve latest version of package:", this.name);
    } else {
      this.version = `^${latestVersion.trim()}`;
    }
  }
}

export { UpdatePackagesStage };
