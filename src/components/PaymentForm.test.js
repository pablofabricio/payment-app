import { loginAndGetJWT, submitFormData } from './PaymentForm';

describe('loginAndGetJWT function', () => {
  it('should return access token upon successful login', async () => {
    const mockResponse = { access_token: 'mockToken' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const token = await loginAndGetJWT();

    expect(token).toBe('mockToken');
  });

  it('should throw an error upon failed login', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    await expect(loginAndGetJWT()).rejects.toThrow('Failed to login');
  });
});

describe('submitFormData function', () => {
  it('should return response data upon successful form submission', async () => {
    const mockFormData = { mock: 'data' };
    const mockToken = 'mockToken';
    const mockResponse = { success: true };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const responseData = await submitFormData(mockFormData, mockToken);

    expect(responseData).toEqual(mockResponse);
  });

  it('should throw an error upon failed form submission', async () => {
    const mockFormData = { mock: 'data' };
    const mockToken = 'mockToken';

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    await expect(submitFormData(mockFormData, mockToken)).rejects.toThrow('Failed to submit form data');
  });
});
