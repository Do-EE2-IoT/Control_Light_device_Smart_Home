export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;

const server_domain = "http://localhost:3005/v1/api"

export const server_api = {
  auth: {
    signup: `${server_domain}/access/user/signup`,
    login: `${server_domain}/access/user/login`
  },
  user: {
    getUserData: `${server_domain}/user/me/info`,
  }
} as const