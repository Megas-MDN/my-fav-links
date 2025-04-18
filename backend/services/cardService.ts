
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CardCreateDTO {
  title: string;
  urls: { value: string }[];
  imageUrl?: string;
}

export interface CardUpdateDTO {
  title?: string;
  imageUrl?: string;
}

export interface UrlCreateDTO {
  value: string;
}

// Get all cards with pagination
export const getCards = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const cards = await prisma.card.findMany({
    include: {
      urls: true,
    },
    orderBy: {
      order: 'asc',
    },
    skip,
    take: limit,
  });

  return cards;
};

// Get a specific card by ID
export const getCardById = async (id: string) => {
  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      urls: true,
    },
  });

  if (!card) {
    throw new Error(`Card with ID ${id} not found`);
  }

  return card;
};

// Create a new card
export const createCard = async (data: CardCreateDTO) => {
  // Get the highest order value to place the new card at the end
  const highestOrder = await prisma.card.findFirst({
    orderBy: {
      order: 'desc',
    },
    select: {
      order: true,
    },
  });

  const order = highestOrder ? highestOrder.order + 1 : 1;

  const card = await prisma.card.create({
    data: {
      title: data.title,
      imageUrl: data.imageUrl,
      order,
      urls: {
        create: data.urls,
      },
    },
    include: {
      urls: true,
    },
  });

  return card;
};

// Update a card
export const updateCard = async (id: string, data: CardUpdateDTO) => {
  // First check if the card exists
  await getCardById(id);

  const card = await prisma.card.update({
    where: { id },
    data,
    include: {
      urls: true,
    },
  });

  return card;
};

// Mark a card as viewed
export const markCardAsViewed = async (id: string) => {
  // Get the highest order value to place this card at the end
  const highestOrder = await prisma.card.findFirst({
    orderBy: {
      order: 'desc',
    },
    select: {
      order: true,
    },
  });

  const newOrder = highestOrder ? highestOrder.order + 1 : 1;

  const card = await prisma.card.update({
    where: { id },
    data: {
      lastViewed: new Date(),
      order: newOrder,
    },
    include: {
      urls: true,
    },
  });

  return card;
};

// Delete a card
export const deleteCard = async (id: string) => {
  // First check if the card exists
  await getCardById(id);

  await prisma.card.delete({
    where: { id },
  });
};

// Add a URL to a card
export const addUrlToCard = async (cardId: string, data: UrlCreateDTO) => {
  // First check if the card exists
  await getCardById(cardId);

  const url = await prisma.url.create({
    data: {
      ...data,
      cardId,
    },
  });

  return url;
};

// Delete a URL from a card
export const deleteUrlFromCard = async (cardId: string, urlId: string) => {
  const url = await prisma.url.findUnique({
    where: { id: urlId },
  });

  if (!url || url.cardId !== cardId) {
    throw new Error(`URL with ID ${urlId} not found in card ${cardId}`);
  }

  await prisma.url.delete({
    where: { id: urlId },
  });
};
