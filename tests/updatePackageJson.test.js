import fs from 'fs';
import updatePackageJson from '../src/updatePackageJson.js';

jest.mock('fs');

describe('updatePackageJson', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates package.json with the provided updatedPackages', async () => {
    const packageJsonPath = 'path/to/package.json';
    const packageJson = {
      dependencies: {
        'package-1': '^1.0.0',
      },
      devDependencies: {
        'package-2': '~2.0.0',
      },
    };

    fs.readFileSync.mockReturnValueOnce(JSON.stringify(packageJson));

    const updatedPackages = [
      {
        name: 'package-1',
        versionRange: '^1.0.0',
        newVersion: '1.1.0',
      },
      {
        name: 'package-2',
        versionRange: '~2.0.0',
        newVersion: '2.1.0',
      },
    ];

    await updatePackageJson(packageJsonPath, updatedPackages, false, false);

    const expectedUpdatedPackageJson = {
      dependencies: {
        'package-1': '^1.1.0',
      },
      devDependencies: {
        'package-2': '~2.1.0',
      },
    };

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      packageJsonPath,
      JSON.stringify(expectedUpdatedPackageJson, null, 2),
    );
  });
});
