export const DUMMYJSON_BASE_URL = 'https://dummyjson.com';
export const PRODUCTS_LIMIT = 30;
export const REVALIDATE_SECONDS = 300;
export const SHUFFLE_COUNT = 10;

// Admin dashboard endpoints
export const DUMMYJSON_USERS_URL = `${DUMMYJSON_BASE_URL}/users?limit=10&select=firstName,lastName,email,image,role`;
export const DUMMYJSON_POSTS_URL = `${DUMMYJSON_BASE_URL}/posts?limit=5`;
export const DUMMYJSON_QUOTES_URL = `${DUMMYJSON_BASE_URL}/quotes?limit=3`;
export const DUMMYJSON_TODOS_URL = `${DUMMYJSON_BASE_URL}/todos?limit=8`;
