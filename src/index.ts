#!/usr/bin/env node
import { Command } from "commander";
import { AppLogger } from "./logger";
import { AppCli } from "./cli";
import { Project } from "./project";
import { AppSpinner } from "./spinner";

export type PackageManager = "npm" | "pnpm" | "yarn";

export interface ProjectOptions {
  name: string;
  dir: string;
  packageManager: PackageManager;
}

const logger = new AppLogger();
const spinner = new AppSpinner();

const main = async () => {
  console.log("Welcome to create-ppv app!");
  const program = new Command()
    .name("create-ppv-app")
    .description("Create web application with a zero config")
    .argument("[name]", "The name of the application")
    .parse(process.argv);

  const cli = new AppCli(program.args);
  const options = await cli.proceed();

  const project = new Project(logger, spinner, options);
  await project.createBaseTemplate();
  await project.updatePackages();
  await project.initGit();

  process.exit(0);
};

main().catch((e) => {
  logger.error("Aborting installation...");
  if (e instanceof Error) {
    logger.error(e);
  } else {
    logger.error("An unknown error has occurred");
    logger.error(e);
  }
  process.exit(1);
});
