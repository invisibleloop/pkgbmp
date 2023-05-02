import promptForUpdates from '../src/promptForUpdates.js';
import inquirer from 'inquirer';

jest.mock('inquirer');

describe('promptForUpdates', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return selected packages for update', async () => {
    const outdatedPackages = [
      {
        name: 'package1',
        current: '1.0.0',
        wanted: '1.1.0',
        latest: '2.0.0',
      },
      {
        name: 'package2',
        current: '3.0.0',
        wanted: '3.0.1',
        latest: '4.0.0',
      },
    ];

    inquirer.prompt.mockResolvedValue({
      selectedPackages: [
        { ...outdatedPackages[0], newVersion: outdatedPackages[0].wanted },
      ],
    });

    const result = await promptForUpdates(outdatedPackages, false);

    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'checkbox',
        message: 'Select packages to update:',
        name: 'selectedPackages',
        choices: [
          {
            name: 'package1: 1.0.0 -> 1.1.0',
            value: { ...outdatedPackages[0], newVersion: '1.1.0' },
          },
          {
            name: 'package2: 3.0.0 -> 3.0.1',
            value: { ...outdatedPackages[1], newVersion: '3.0.1' },
          },
        ],
      },
    ]);

    expect(result).toEqual([
      { ...outdatedPackages[0], newVersion: outdatedPackages[0].wanted },
    ]);
  });

  test('should update to latest version when updateToLatest flag is true', async () => {
    const outdatedPackages = [
      {
        name: 'package1',
        current: '1.0.0',
        wanted: '1.1.0',
        latest: '2.0.0',
      },
      {
        name: 'package2',
        current: '3.0.0',
        wanted: '3.0.1',
        latest: '4.0.0',
      },
    ];

    inquirer.prompt.mockResolvedValue({
      selectedPackages: [
        { ...outdatedPackages[0], newVersion: outdatedPackages[0].latest },
      ],
    });

    const result = await promptForUpdates(outdatedPackages, true);

    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'checkbox',
        message: 'Select packages to update:',
        name: 'selectedPackages',
        choices: [
          {
            name: 'package1: 1.0.0 -> 2.0.0',
            value: { ...outdatedPackages[0], newVersion: '2.0.0' },
          },
          {
            name: 'package2: 3.0.0 -> 4.0.0',
            value: { ...outdatedPackages[1], newVersion: '4.0.0' },
          },
        ],
      },
    ]);

    expect(result).toEqual([
      { ...outdatedPackages[0], newVersion: outdatedPackages[0].latest },
    ]);
  });
});
