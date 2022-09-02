#!/usr/bin/env node
import { AppLogger } from "./logger";
import { AppCli } from "./cli/cli";
import { Project } from "./project/project";
import { AppSpinner } from "./spinner";

const logger = new AppLogger();
const spinner = new AppSpinner();

const main = async () => {
  console.log("Welcome to create-ppv app!");

  const cli = new AppCli(logger, spinner);
  const projectSettings = await cli.proceed();

  const project = new Project(logger, spinner, projectSettings);
  await project.createBaseTemplate();
  await project.updatePackages();
  await project.initGit();
  project.logGuide();

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
