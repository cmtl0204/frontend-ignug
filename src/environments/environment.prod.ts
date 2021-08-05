const API_URL_PRIVATE = 'http://siga_backend.test/api/v1/private/';
const API_URL_PUBLIC = 'http://siga_backend.test/api/v1/public/';
const URL = 'http://siga_backend.test/';

export const environment = {
  production: true,
  URL,
  STORAGE_URL: URL + 'storage/',
  API_URL_AUTHENTICATION: 'http://siga_backend.test/api/v1/authentication/',
  API_URL_PRIVATE_APP: API_URL_PRIVATE + 'app/',
  API_URL_PUBLIC_APP: API_URL_PUBLIC + 'app/',
};
