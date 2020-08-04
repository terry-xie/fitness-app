import OauthApi from './OauthApi';

describe('OauthApi', () => {
    describe('getAccessToken', () => {
        test('should resolve with data when successful', () => {
            const accessTokenMock = '1234';
            const refreshTokenMock = '5678';
            const userIdMock = '1234';
            const apiPostMock = jest.fn().mockResolvedValue({
                data: {
                    access_token: accessTokenMock,
                    refresh_token: refreshTokenMock,
                    userid: userIdMock
                }
            });
            const oauth = new OauthApi();
            oauth.api.post = apiPostMock;
    
            expect(oauth.getAccessToken('1234')).resolves.toEqual({
                accessToken: accessTokenMock,
                refreshToken: refreshTokenMock,
                id: `withings${userIdMock}`
            });
            expect(apiPostMock).toHaveBeenCalledTimes(1);
        });
        
        test('should reject with error when unsuccessful', () => {
            const errorMock = 'error';
            const apiPostMock = jest.fn().mockRejectedValue(errorMock);
            const oauth = new OauthApi();
            oauth.api.post = apiPostMock;

            expect(oauth.getAccessToken('1234')).rejects.toEqual(errorMock);
            expect(apiPostMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAuthenticationCodeUrl', () => {
        const OLD_ENV = process.env;
        const clientIdMock = 'clientIdMock';
        const redirectMock = 'redirectMock';

        beforeEach(() => {
            jest.resetModules();
            process.env = {
                ...OLD_ENV,
                REACT_APP_WITHINGS_CLIENT_ID: clientIdMock,
                REACT_APP_WITHINGS_REDIRECT_URI: redirectMock
            };
        });
        
        afterAll(() => {
            process.env = OLD_ENV;
        });

        test('should return demo url when input is true', () => {
            const expectedUrl = 'https://account.withings.com/oauth2_user/authorize2?response_type=code'
                        + `&client_id=${clientIdMock}`
                        + '&state=demo'
                        + '&scope=user.metrics'
                        + `&redirect_uri=${redirectMock}`
                        + '&mode=demo'

            expect(OauthApi.getAuthenticationCodeUrl(true)).toEqual(expectedUrl);
        });
        
        test('should return non-demo url when input is false', () => {
            const expectedUrl = 'https://account.withings.com/oauth2_user/authorize2?response_type=code'
                        + `&client_id=${clientIdMock}`
                        + '&state=normal'
                        + '&scope=user.metrics'
                        + `&redirect_uri=${redirectMock}`
                        + '&mode=';

            expect(OauthApi.getAuthenticationCodeUrl(false)).toEqual(expectedUrl);
        });

        test('should return non-demo url when no input is passed', () => {
            const expectedUrl = 'https://account.withings.com/oauth2_user/authorize2?response_type=code'
                        + `&client_id=${clientIdMock}`
                        + '&state=normal'
                        + '&scope=user.metrics'
                        + `&redirect_uri=${redirectMock}`
                        + '&mode=';

            expect(OauthApi.getAuthenticationCodeUrl()).toEqual(expectedUrl);
        });
    });
})