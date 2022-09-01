import { type PackageJson } from "type-fest";
import fs from "fs-extra";
import path from "path";
import { execAsync } from "../execAsync";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";

class PackageJsonService {
  private pkgJson!: PackageJson;

  constructor(
    private readonly logger: Logger,
    private readonly spinner: Spinner,
    private readonly dir: string
  ) {}

  async updatePackages() {
    this.logger.info("Starting packages update...");
    this.spinner.start(`Updating packages...`);

    await this.parse();
    if (!this.validate()) {
      this.spinner.fail("Package update was failed");
      return;
    }

    await this.updateDependencies();
    await this.updateDevDependencies();
    await this.writePkgJson();

    this.spinner.succeed(`Packages update successfully completed!`);
  }

  private async parse() {
    this.pkgJson = (await fs.readJSON(path.join(this.dir, "package.json"))) as PackageJson;
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

  private async writePkgJson() {
    await fs.writeJSON(path.join(this.dir, "package.json"), this.pkgJson, {
      spaces: 2,
    });
  }

  private async update(dependencies: PackageJson.Dependency) {
    for (const pkgName of Object.keys(dependencies)) {
      if (pkgName === "") {
        continue;
      }

      const { stdout: latestVersion } = await execAsync(`npm show ${pkgName} version`);
      if (!latestVersion) {
        this.logger.warn("WARN: Failed to resolve latest version of package:", pkgName);
        continue;
      }

      dependencies[pkgName] = `^${latestVersion.trim()}`;
    }
  }
}

export { PackageJsonService };
