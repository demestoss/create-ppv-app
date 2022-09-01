import inquirer from "inquirer";
import type { ProjectOptions, PackageManager, CliOptions } from "./index";
import path from "path";

interface Cli {
  proceed(): Promise<ProjectOptions>;
}

class AppCli implements Cli {
  private readonly name: NameOption;
  private readonly packageManager: PackageManagerOption;
  private readonly noGit: boolean;

  constructor(options: CliOptions) {
    this.name = new NameOption(options.name);
    this.noGit = options.noGit;
    this.packageManager = new PackageManagerOption();
  }

  async proceed() {
    const name = await this.name.proceed();
    const packageManager = await this.packageManager.proceed();
    const dir = path.resolve(process.cwd(), name);
    const git = !this.noGit;

    return { name, dir, packageManager, git };
  }
}

interface Validator {
  validate(input: string): string | boolean;
}

class NameValidator implements Validator {
  private readonly regExp = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

  validate = (name: string): string | boolean => {
    return (
      this.regExp.test(name ?? "") ||
      "App name must be lowercase, alphanumeric, and only use -, _, and @"
    );
  };
}

interface CliOption<TValue = any> {
  proceed(): Promise<TValue>;
}

abstract class BaseCliOption<TValue> implements CliOption<TValue> {
  protected abstract defaultValue: TValue;
  abstract proceed(): Promise<TValue>;
}

class NameOption extends BaseCliOption<string> {
  protected readonly validator = new NameValidator();
  protected readonly defaultValue = "my-app";

  constructor(private readonly passedName: string) {
    super();
  }

  async proceed() {
    if (this.isPassedNameValid()) {
      return this.passedName;
    }

    const { name } = await inquirer.prompt<{ name: string }>({
      name: "name",
      type: "input",
      message: "What will your project be called?",
      default: this.defaultValue,
      validate: this.validator.validate,
      transformer: (input: string) => {
        return input.trim();
      },
    });

    return name;
  }

  private isPassedNameValid() {
    return this.passedName && this.validator.validate(this.passedName) === true;
  }
}

class PackageManagerOption extends BaseCliOption<PackageManager> {
  protected readonly defaultValue = "npm";

  async proceed(): Promise<PackageManager> {
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent?.startsWith("npm")) return "npm";
    if (userAgent?.startsWith("yarn")) return "yarn";
    if (userAgent?.startsWith("pnpm")) return "pnpm";

    return this.defaultValue;
  }
}

export { AppCli };
