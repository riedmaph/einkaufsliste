const API_BASE_URL: string = '/api';

export const API_ROUTES = {
  entries: `${API_BASE_URL}/entries`,
  users: {
    register: `${API_BASE_URL}/users/register`,
    login: `${API_BASE_URL}/users/login`,
  },
  lists: {
    create: `${API_BASE_URL}/lists`,
    single: `${API_BASE_URL}/lists/:listId`,
    all: `${API_BASE_URL}/lists`,
    entries: {
      add: `${API_BASE_URL}/lists/:listId/items`,
      remove: `${API_BASE_URL}/lists/:listId/items/:itemId`,
      update: `${API_BASE_URL}/lists/:listId/items/:itemId`,
      move: `${API_BASE_URL}/lists/:listId/items/:itemId`,
    },
    sharing: {
      addContributor: `${API_BASE_URL}/share/:listid/:mail`,
      removeContributor: `${API_BASE_URL}/share/:listid/:mail`,
      checkEmail: `${API_BASE_URL}/share/:mail`,
    },
  },
  markets: {
    favourites: {
      get: `${API_BASE_URL}/markets/favourites`,
      add: `${API_BASE_URL}/markets/favourites/:marketId`,
      remove: `${API_BASE_URL}/markets/favourites/:marketId`,
    },
    search: `${API_BASE_URL}/markets`,
    zip: `/assets/mock/favourite-markets.json`,
    },
  products: {
    search: `${API_BASE_URL}/products/search`,
  },
};
