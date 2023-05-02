import axios from 'axios';
import getPackageDetails from '../src/getPackageDetails.js';

jest.mock('axios');

const mockSpinner = {
  fail: jest.fn(),
};

describe('getPackageDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns package details', async () => {
    const packageName = 'sample-package';
    const versionRange = '^1.0.0';

    const packageData = {
      'dist-tags': {
        latest: '1.1.0',
      },
    };

    axios.get.mockResolvedValueOnce({ data: packageData });

    const result = await getPackageDetails(packageName, versionRange, mockSpinner);

    expect(result).toEqual({
      current: '1.0.0',
      wanted: '1.1.0',
      latest: '1.1.0',
    });
  });

  it('handles errors and returns null', async () => {
    const packageName = 'sample-package';
    const versionRange = '^1.0.0';

    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    const result = await getPackageDetails(packageName, versionRange, mockSpinner);

    expect(mockSpinner.fail).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('returns null on error', async () => {
    const packageName = 'sample-package';
    const versionRange = '^1.0.0';

    axios.get.mockRejectedValueOnce(new Error('Request failed'));

    const result = await getPackageDetails(packageName, versionRange, mockSpinner);

    expect(result).toBeNull();
    expect(mockSpinner.fail).toHaveBeenCalled();
  });
});
