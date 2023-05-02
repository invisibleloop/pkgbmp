#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

export default async (packageJsonPath, updatedPackages, newFile, latest) => {
  // console.log('updatedPackages', updatedPackages);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  for (const updatedPackage of updatedPackages) {
    const nonNumericPrefix = updatedPackage.versionRange.match(/^\D+/)?.[0] ?? '';

    if (packageJson.dependencies && packageJson.dependencies[updatedPackage.name]) {
      packageJson.dependencies[updatedPackage.name] = `${nonNumericPrefix}${updatedPackage.newVersion}`;
    }

    if (packageJson.devDependencies && packageJson.devDependencies[updatedPackage.name]) {
      packageJson.devDependencies[updatedPackage.name] = `${nonNumericPrefix}${updatedPackage.newVersion}`;
    }
  }

  const outputPath = newFile
    ? path.join(path.dirname(packageJsonPath), `package.json.${latest ? 'latest' : 'wanted'}`)
    : packageJsonPath;

  fs.writeFileSync(outputPath, JSON.stringify(packageJson, null, 2));
}
