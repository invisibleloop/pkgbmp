// main.js
import { program } from 'commander';
import ora from 'ora';
import Table from 'cli-table3';
import kleur from 'kleur';
import packageFiles from './packageFiles.js';
import checkOutdatedPackages from './checkOutdatedPackages.js';
import promptForUpdates from './promptForUpdates.js';
import updatePackageJson from './updatePackageJson.js';

export const printOutdatedPackages = (outdatedPackages) => {
  const table = new Table({
    head: ['Name', 'Current', 'Wanted', 'Latest'].map(header => kleur.green(header)),
    style: {
      head: [],
      border: [],
    },
  });

  outdatedPackages.forEach((pkg) => {
    table.push([
      kleur.cyan(pkg.link),
      pkg.current,
      pkg.wanted,
      pkg.latest,
    ]);
  });

  console.log(table.toString());
};

export default async () => {
  program
    .option('-i, --interactive', 'Interactive mode to select packages to update')
    .option('-l, --latest', 'Update packages to the latest version')
    .option('-n, --new-file', 'Generate a new package.json file instead of modifying the existing one')
    .option('-f, --filter <string>', 'Filter packages by string')
    .option('-r, --recursive', 'Check all package.json files recursively and generate a report')
    .parse(process.argv);

  const authToken = process.env.NPM_TOKEN;

  const spinner = ora();

  const { interactive, latest, newFile, filter, recursive } = program.opts();

  console.log(kleur.green('------------------------------------------------'));

  spinner.start('Checking for package.json files.');

  const { files: packageJsonFiles, message } = await packageFiles(recursive);

  if (!packageJsonFiles.length) {
    spinner.fail(message);
  } else {
    spinner.succeed(message);

    let count = 0;

    for (const packageJsonFilePath of packageJsonFiles) {
      console.log(`${kleur.cyan(count === 0 ? ' ' : '   |__')} ${packageJsonFilePath}`);

      count++;
    }

    console.log(kleur.green('------------------------------------------------'));

    console.log('\r');
  }

  spinner.stop();

  spinner.start('Checking for outdated packages files.');

  for (const packageJsonFilePath of packageJsonFiles) {
    const outdatedPackages = await checkOutdatedPackages(packageJsonFilePath, filter, spinner, authToken);

    if (!outdatedPackages.length) {
      spinner.succeed('Zero packages to update.');
      console.log(kleur.green('------------------------------------------------'));
      console.log('\r');
    } else {
      console.log(kleur.green('------------------------------------------------'));

      spinner.succeed('There are packages to update.');

      printOutdatedPackages(outdatedPackages);

      console.log('\r');

      if (interactive) {
        const selectedPackages = await promptForUpdates(outdatedPackages, latest);

        if (selectedPackages.length) {
          await updatePackageJson(packageJsonFilePath, selectedPackages, newFile, latest);

          spinner.succeed(`Updated packages in ${kleur.green(packageJsonFilePath)}`);

          console.log('\r');
        } else {
          spinner.fail('No packages were selected for update');

          console.log('\r');
        }
      }
    }
  }
};
