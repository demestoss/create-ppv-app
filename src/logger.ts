import chalk from "chalk";

interface Logger {
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  success(...args: unknown[]): void;
}

class AppLogger implements Logger {
  error(...args: unknown[]) {
    console.log(chalk.red(...args));
  }

  info(...args: unknown[]) {
    console.log(chalk.blue(...args));
  }

  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args));
  }

  success(...args: unknown[]) {
    console.log(chalk.green(...args));
  }
}

export { AppLogger, Logger };
