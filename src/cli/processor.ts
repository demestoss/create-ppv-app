import inquirer from "inquirer";
import { ProgramOptions } from "./program";
import {
  NpmPackageManager,
  PackageManager,
  PnpmPackageManager,
  YarnPackageManager,
} from "../packageManager";

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

class NameProcessor implements CliProcessor<string> {
  private readonly validator = new NameValidator();
  private readonly defaultValue = "my-app";

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

class PackageManagerProcessor implements CliProcessor<PackageManager> {
  constructor(private readonly userAgent: string) {}

  async proceed(): Promise<PackageManager> {
    if (this.userAgent?.startsWith("yarn")) return new YarnPackageManager();
    if (this.userAgent?.startsWith("pnpm")) return new PnpmPackageManager();

    return new NpmPackageManager();
  }
}

export { NameProcessor, PackageManagerProcessor };
export type { CliProcessor };
