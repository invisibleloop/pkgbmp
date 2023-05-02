#!/usr/bin/env node

import inquirer from 'inquirer';

export default async (outdatedPackages, updateToLatest) => {
  const choices = outdatedPackages.map(pkg => ({
    name: `${pkg.name}: ${pkg.current} -> ${updateToLatest ? pkg.latest : pkg.wanted}`,
    value: {
      ...pkg,
      newVersion: updateToLatest ? pkg.latest : pkg.wanted,
    },
  }));

  const { selectedPackages } = await inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Select packages to update:',
      name: 'selectedPackages',
      choices,
    },
  ]);

  return selectedPackages;
}
