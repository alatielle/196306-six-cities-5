export type MockServerData = {
  titles: string[];
  descriptions: string[];
  previewImages: string[];
  roomImages: string[];
  users: string[];
  emails: string[];
  avatars: string[];
  cities: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
};
