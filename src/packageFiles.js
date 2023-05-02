#!/usr/bin/env node

import glob from 'fast-glob';

export default async (recursive) => {
  const searchPattern = recursive ? '**/package.json' : 'package.json';
  
  const packageFiles = glob.sync(searchPattern, { ignore: ['**/node_modules/**', '**/tests/**'] });

  let message = '';

  if (!packageFiles.length) {
    message += `No Package.json file${recursive ? 's' : ''} found.`;
  } else if (packageFiles.length === 1) {
    message += 'Package.json file found.';
  } else if (packageFiles.length > 1) {
    message += `${packageFiles.length} Package.json files found.`;
  }

  return {
    files: packageFiles,
    message,
  };
}
