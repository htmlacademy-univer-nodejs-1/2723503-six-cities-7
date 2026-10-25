import {
  getRandomBoolean,
  getRandomFloat,
  getRandomInt,
  getRandomItem,
  getRandomItems,
} from '../../helpers/random.js';
import {
  AMENITIES,
  CITIES,
  CITY_COORDINATES,
  HOUSING_TYPES,
  MockServerData,
  USER_TYPES,
} from '../../types/index.js';

const PHOTOS_COUNT = 6;
const LIST_SEPARATOR = ';';
const MAX_POST_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_COORDINATE_OFFSET = 0.05;
const COORDINATE_DIGITS = 6;

const Rating = { Min: 1, Max: 5 } as const;
const Rooms = { Min: 1, Max: 8 } as const;
const Guests = { Min: 1, Max: 10 } as const;
const Price = { Min: 100, Max: 100_000 } as const;

export class TsvOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const city = getRandomItem(CITIES);
    const center = CITY_COORDINATES[city];
    const author = getRandomItem(this.mockData.users);
    const postDate = new Date(Date.now() - getRandomInt(0, MAX_POST_AGE_MS));

    return [
      getRandomItem(this.mockData.titles),
      getRandomItem(this.mockData.descriptions),
      postDate.toISOString(),
      city,
      getRandomItem(this.mockData.previewImages),
      getRandomItems(this.mockData.photos, PHOTOS_COUNT).join(LIST_SEPARATOR),
      getRandomBoolean(),
      getRandomBoolean(),
      getRandomFloat(Rating.Min, Rating.Max),
      getRandomItem(HOUSING_TYPES),
      getRandomInt(Rooms.Min, Rooms.Max),
      getRandomInt(Guests.Min, Guests.Max),
      getRandomInt(Price.Min, Price.Max),
      getRandomItems(AMENITIES).join(LIST_SEPARATOR),
      author.name,
      author.email,
      author.avatarUrl,
      author.password,
      getRandomItem(USER_TYPES),
      getRandomFloat(center.latitude - MAX_COORDINATE_OFFSET, center.latitude + MAX_COORDINATE_OFFSET, COORDINATE_DIGITS),
      getRandomFloat(center.longitude - MAX_COORDINATE_OFFSET, center.longitude + MAX_COORDINATE_OFFSET, COORDINATE_DIGITS),
    ].join('\t');
  }
}
