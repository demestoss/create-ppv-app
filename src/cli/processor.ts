import inquirer from "inquirer";
import { ProgramOptions } from "./program";
import {
  NpmPackageManager,
  PackageManager,
  PnpmPackageManager,
  YarnPackageManager,
} from "../packageManager";
import { Logger } from "../logger";
import { Spinner } from "../spinner";

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

interface CliProcessor<TValue = any> {
  proceed(options: ProgramOptions): Promise<TValue>;
}

abstract class BaseCliProcessor<TValue> implements CliProcessor<TValue> {
  protected abstract defaultValue: TValue;

  constructor(protected readonly logger: Logger, protected readonly spinner: Spinner) {}

  abstract proceed(options: ProgramOptions): Promise<TValue>;
}

class NameProcessor extends BaseCliProcessor<string> {
  protected readonly validator = new NameValidator();
  protected readonly defaultValue = "my-app";

  async proceed(options: ProgramOptions) {
    if (this.isPassedNameValid(options.name)) {
      return options.name;
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

  private isPassedNameValid(passedName: string) {
    return passedName && this.validator.validate(passedName) === true;
  }
}

class PackageManagerProcessor extends BaseCliProcessor<PackageManager> {
  protected readonly defaultValue = new NpmPackageManager(this.logger, this.spinner);

  async proceed(): Promise<PackageManager> {
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent?.startsWith("npm")) return new NpmPackageManager(this.logger, this.spinner);
    if (userAgent?.startsWith("yarn")) return new YarnPackageManager(this.logger, this.spinner);
    if (userAgent?.startsWith("pnpm")) return new PnpmPackageManager(this.logger, this.spinner);

    return this.defaultValue;
  }
}

export { NameProcessor, PackageManagerProcessor };
export type { CliProcessor };
