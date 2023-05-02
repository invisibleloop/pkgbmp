import fs from 'fs/promises';
import path from 'path';
import checkOutdatedPackages from '../src/checkOutdatedPackages.js';
import getPackageDetails from '../src/getPackageDetails.js';
import suppressConsoleOutput from './utils/suppressConsoleOutput.js';

jest.mock('fs/promises');
jest.mock('../src/getPackageDetails.js');

const mockSpinner = {
  stopAndPersist: jest.fn(),
  succeed: jest.fn(),
  stop: jest.fn(),
};

describe('checkOutdatedPackages', () => {
  suppressConsoleOutput();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns outdated packages', async () => {
    const packageJsonFilePath = path.join(__dirname, '__fixtures__', 'package.json');
    const filter = '';

    const packageJson = {
      dependencies: {
        'package-1': '^1.0.0',
      },
      devDependencies: {
        'package-2': '~2.0.0',
      },
    };

    fs.readFile.mockResolvedValueOnce(JSON.stringify(packageJson));

    getPackageDetails
      .mockResolvedValueOnce({
        current: '1.0.0',
        wanted: '1.1.0',
        latest: '1.1.0',
      })
      .mockResolvedValueOnce({
        current: '2.0.0',
        wanted: '2.1.0',
        latest: '2.1.0',
      });

    const outdatedPackages = await checkOutdatedPackages(packageJsonFilePath, filter, mockSpinner);

    const expectedResult = [
      {
        versionRange: '^1.0.0',
        link: expect.stringContaining('https://www.npmjs.com/package/package-1'),
        name: 'package-1',
        current: '1.0.0',
        wanted: '1.1.0',
        latest: '1.1.0',
      },
      {
        versionRange: '~2.0.0',
        link: expect.stringContaining('https://www.npmjs.com/package/package-2'),
        name: 'package-2',
        current: '2.0.0',
        wanted: '2.1.0',
        latest: '2.1.0',
      },
    ];

    expect(outdatedPackages).toEqual(expectedResult);
  });
});
