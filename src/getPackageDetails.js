#!/usr/bin/env node

import axios from 'axios';
import semver from 'semver';
import kleur from 'kleur';

export default async (packageName, versionRange, spinner, authToken = '') => {
  try {
    // Set the headers object conditionally, including the Authorization header if authToken is provided
    const headers = authToken
      ? {
          Authorization: `Bearer ${authToken}`,
        }
      : {};

    const response = await axios.get(`https://registry.npmjs.org/${packageName}`, { headers });

    const packageData = response.data;

    // Get the 'dist-tags' object that contains the 'latest' version
    const latestVersion = packageData['dist-tags']?.latest;

    // Clean the version range string to remove range characters
    const current = semver.valid(semver.minVersion(versionRange));
    const wanted = semver.clean(latestVersion);
    const latest = semver.clean(latestVersion);

    return {
      current,
      wanted,
      latest,
    };
  } catch (error) {
    spinner.fail(`Error getting package details for ${kleur.green(packageName)}: ${kleur.red(error.message)}`);
    return null;
  }
};
