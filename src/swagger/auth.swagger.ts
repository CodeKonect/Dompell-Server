export const signinResponse = {
  status: 200,
  message: 'Signin successful',
  data: {
    token: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODYNGYzg5MTk4MzA5N2U5NGMyNzY4NiIsImVtYWlsIjoiZXhhbXBsZUBkb20uY29',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY0Zjk4OTAxYjMwOTdlOTRjMjc2ODYiLCJlbWFpbCI6InJlc2l3MzMxMjlAb2ZhY2VyLmNvbSIsImlhdCI6MTc1MTQ0Nzk0NiwiaXNzIjoiYXV0aC1zZXJ2aWNSIsImV4cCI6MTc1MTQ0NTE0Nn0',
    },
    user: {
      id: '6864f9891a83097e94c27686',
      name: 'Kanan Stark',
      email: 'resiw33129@ofacer.com',
      role: 'LEANER',
    },
  },
};

export const signinBadRequest = {
  message: [
    'email - Please provide a valid email address',
    'invalidCredentials - Invalid email or password',
    'emailNotVerified - Please verify your account before you can login',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const registerResponse = {
  status: 201,
  message:
    'Signup Successful, please check your email to complete registration.',
  data: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODYNGYzg5MTk4MzA5N2U5NGMyNzY4NiIsImVtYWlsIjoiZXhhbXBsZUBkb20uY29',
  },
};

export const registerBadRequest = {
  message: [
    'name - Name must contain only letters and single spaces between words, no numbers or special characters allowed',
    'email - Please provide a valid email address',
    'password - Password must be at least 8 characters long',
    'password - Password cannot exceed 50 characters',
    'password - Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    'confirmPassword - Passwords do not match',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const resetBadRequest = {
  message: [
    'newPassword - Password must be at least 8 characters long',
    'newPassword - Password cannot exceed 50 characters',
    'newPassword - Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    'confirmPassword - Passwords do not match',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const userExists = {
  message: 'User already exist',
  error: 'Conflict',
  statusCode: 409,
};
