export type MockUser = {
  name: string;
  email: string;
  avatarUrl: string;
  password: string;
};

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  previewImages: string[];
  photos: string[];
  users: MockUser[];
};
