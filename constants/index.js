const ROUTES = {
  HOME: '/',
  USER: '/user',
  HABIT: '/habit',
  LOGIN: '/login',
  LOGOUT: '/logout',
  LIKE: '/like',
  IMAGE: '/image',
  FOLLOW: '/follow',
  FOLLOWING: '/following',
  ALL: '/all',
  PUSH_TOKENS: '/pushTokens',
  SIGNUP: '/signup'
};

const MESSAGE = {
  HABIT_REGISTERED_SUCCESS: 'habit registered successfully',
  HABIT_PATCHED_SUCCESS: 'habit patched successfully',
  HABIT_DELETED_SUCCESS: 'habit deleted successfully',
  LIKE_PATCHED_SUCCESS: 'habit liked successfully',
  CANT_FIND_HABIT: 'can not find habit',
  CANT_FIND_USER: 'can not find user',
  CANT_FIND_EMAIL: 'can not find email',
  INVALID_PASSWORD: 'invalid password',
  ALREADY_EXISTING_USER: 'already existing user',
  USER_SIGNEDUP_SUCCESS: 'user signedup successfully',
  MONGODB_CONNECT_SUCCESS: 'mongodb connected successfully',
  MONGODB_CONNECT_ERROR: 'error on connecting to mongodb',
  INTERNAL_SERVER_ERROR: 'Internal server error'
};

module.exports = { ROUTES, MESSAGE };
