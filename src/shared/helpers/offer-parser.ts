import {
  AMENITIES,
  Amenity,
  CITIES,
  CityName,
  HOUSING_TYPES,
  HousingType,
  Offer,
  USER_TYPES,
  UserType,
} from '../types/index.js';

const LIST_SEPARATOR = ';';
const OFFER_COLUMNS_COUNT = 21;

function assertOneOf<T extends string>(allowed: readonly T[], value: string, field: string): T {
  if (!(allowed as readonly string[]).includes(value)) {
    throw new Error(`Invalid ${field}: "${value}". Expected one of: ${allowed.join(', ')}`);
  }

  return value as T;
}

function toNumber(value: string, field: string): number {
  const parsed = Number.parseFloat(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid ${field}: "${value}" is not a number`);
  }

  return parsed;
}

function toList(value: string): string[] {
  return value.split(LIST_SEPARATOR).map((item) => item.trim()).filter(Boolean);
}

export function parseOffer(columns: string[]): Offer {
  if (columns.length !== OFFER_COLUMNS_COUNT) {
    throw new Error(`Expected ${OFFER_COLUMNS_COUNT} columns, got ${columns.length}`);
  }

  const [
    title, description, postDate, city, previewImage, photos,
    isPremium, isFavorite, rating, housingType, roomsCount, guestsCount, price, amenities,
    authorName, authorEmail, authorAvatar, authorPassword, authorType,
    latitude, longitude,
  ] = columns;

  return {
    title,
    description,
    postDate: new Date(postDate),
    city: assertOneOf<CityName>(CITIES, city, 'city'),
    previewImage,
    photos: toList(photos),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: toNumber(rating, 'rating'),
    housingType: assertOneOf<HousingType>(HOUSING_TYPES, housingType, 'housing type'),
    roomsCount: toNumber(roomsCount, 'rooms count'),
    guestsCount: toNumber(guestsCount, 'guests count'),
    price: toNumber(price, 'price'),
    amenities: toList(amenities).map((item) => assertOneOf<Amenity>(AMENITIES, item, 'amenity')),
    author: {
      name: authorName,
      email: authorEmail,
      avatarUrl: authorAvatar || undefined,
      password: authorPassword,
      type: assertOneOf<UserType>(USER_TYPES, authorType, 'user type'),
    },
    commentsCount: 0,
    coordinates: {
      latitude: toNumber(latitude, 'latitude'),
      longitude: toNumber(longitude, 'longitude'),
    },
  };
}
