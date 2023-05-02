import packageFiles from '../src/packageFiles.js';
import glob from 'fast-glob';

jest.mock('fast-glob');

describe('packageFiles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return message if no package.json files found', async () => {
    glob.sync.mockReturnValue([]);
    const result = await packageFiles(false);
    expect(result.files).toEqual([]);
    expect(result.message).toBe('No Package.json file found.');
  });

  test('should return message if one package.json file found', async () => {
    glob.sync.mockReturnValue(['path/to/package.json']);
    const result = await packageFiles(false);
    expect(result.files).toEqual(['path/to/package.json']);
    expect(result.message).toBe('Package.json file found.');
  });

  test('should return message if multiple package.json files found', async () => {
    glob.sync.mockReturnValue([
      'path/to/package.json',
      'another/path/to/package.json',
    ]);
    const result = await packageFiles(false);
    expect(result.files).toEqual([
      'path/to/package.json',
      'another/path/to/package.json',
    ]);
    expect(result.message).toBe('2 Package.json files found.');
  });

  test('should return message if no package.json files found with recursive flag', async () => {
    glob.sync.mockReturnValue([]);
    const result = await packageFiles(true);
    expect(result.files).toEqual([]);
    expect(result.message).toBe('No Package.json files found.');
  });

  test('should ignore node_modules directories', async () => {
    glob.sync.mockReturnValue([
      'path/to/package.json',
      'another/path/to/package.json',
    ]);
    await packageFiles(true);
    expect(glob.sync).toHaveBeenCalledWith('**/package.json', {
      ignore: '**/node_modules/**',
    });
  });
});
