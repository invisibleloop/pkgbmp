#!/usr/bin/env node

import fs from 'fs';
import kleur from 'kleur';
import getPackageDetails from './getPackageDetails.js';

function hyperlink(text, url) {
  return `\u001b]8;;${url}\u0007${text}\u001b]8;;\u0007`;
}

async function readPackageJson(packageFilePath) {
  const fileContent = await fs.promises.readFile(packageFilePath, 'utf-8');
  return JSON.parse(fileContent);
}

export default async (packageJsonFilePath, filter, spinner, authToken = '') => {
  const packageJson = await readPackageJson(packageJsonFilePath);
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  const allDependencies = { ...dependencies, ...devDependencies };

  let filteredDependencies = filter
    ? Object.entries(allDependencies).filter(([name]) => name.includes(filter))
    : Object.entries(allDependencies);
  
  filteredDependencies = filteredDependencies.map(([packageName, versionRange]) => ({ packageName, versionRange }));

  const outdatedPackages = [];

  spinner.stopAndPersist({
    text: `Scanning ${kleur.green(packageJsonFilePath)}`,
    symbol: '🔎'
  });

  console.log('\r');

  for (const { packageName, versionRange } of filteredDependencies) {
    spinner.succeed(`Checking ${kleur.green(packageName)}`);

    const packageDetails = await getPackageDetails(packageName, versionRange, spinner, authToken);

    if (!packageDetails) continue;

    const { current, wanted, latest } = packageDetails;

    if (current !== wanted) {
      outdatedPackages.push({
        versionRange,
        link: hyperlink(packageName, `https://www.npmjs.com/package/${packageName}`),
        name: packageName,
        current,
        wanted,
        latest,
      });
    }
    spinner.stop();
  }

  console.log('\r');

  return outdatedPackages;
};
