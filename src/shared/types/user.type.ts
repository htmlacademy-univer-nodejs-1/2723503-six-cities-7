export const USER_TYPES = ['regular', 'pro'] as const;

export type UserType = typeof USER_TYPES[number];

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserType;
};
