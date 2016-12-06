const API_BASE_URL: string = '/api';

export const API_ROUTES = {
  entries: `${API_BASE_URL}/entries`,
  users: {
    register: `${API_BASE_URL}/users/register`,
    login: `${API_BASE_URL}/users/login`,
  },
  lists: {
    single: `${API_BASE_URL}/lists/:listId`,
    entries: {
      add: `${API_BASE_URL}/lists/:listId/items`,
      remove: `${API_BASE_URL}/lists/:listId/items/:itemId`,
    },
  },
};
