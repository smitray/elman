import { isAuthenticated } from '@mid';

import { filesCreate, deleteFiles } from './controller';

export const baseUrl = '/api/files';

export const routes = [
  {
    method: 'POST',
    route: '/',
    handlers: [
      isAuthenticated,
      filesCreate
    ]
  },
  {
    method: 'POST',
    route: '/delete',
    handlers: [
      isAuthenticated,
      deleteFiles
    ]
  }
];
