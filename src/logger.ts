import chalk from "chalk";
import { singleton } from "tsyringe";

interface Logger {
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  success(...args: unknown[]): void;
  infoBold(...args: unknown[]): string;
  warningBold(...args: unknown[]): string;
}

@singleton()
class AppLogger implements Logger {
  error(...args: unknown[]) {
    this.log(chalk.red(...args));
  }

  info(...args: unknown[]) {
    this.log(chalk.blue(...args));
  }

  warn(...args: unknown[]) {
    this.log(chalk.yellow(...args));
  }

  success(...args: unknown[]) {
    this.log(chalk.green(...args));
  }

  infoBold(...args: unknown[]): string {
    return chalk.cyan.bold(...args);
  }

  warningBold(...args: unknown[]): string {
    return chalk.redBright.bold(...args);
  }

  private log(str: string) {
    console.log(str);
  }
}

export { AppLogger };
export type { Logger };
