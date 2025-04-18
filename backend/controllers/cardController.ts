
import { Request, Response, NextFunction } from 'express';
import * as CardService from '../services/cardService';

// Get all cards with pagination
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const cards = await CardService.getCards(page, limit);
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

// Get a specific card by ID
export const getCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const card = await CardService.getCardById(id);
    res.json(card);
  } catch (error) {
    next(error);
  }
};

// Create a new card
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await CardService.createCard(req.body);
    res.status(201).json(card);
  } catch (error) {
    next(error);
  }
};

// Update a card
export const updateCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const card = await CardService.updateCard(id, req.body);
    res.json(card);
  } catch (error) {
    next(error);
  }
};

// Mark a card as viewed
export const markCardAsViewed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const card = await CardService.markCardAsViewed(id);
    res.json(card);
  } catch (error) {
    next(error);
  }
};

// Delete a card
export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await CardService.deleteCard(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// Add a URL to a card
export const addUrlToCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: cardId } = req.params;
    const url = await CardService.addUrlToCard(cardId, req.body);
    res.status(201).json(url);
  } catch (error) {
    next(error);
  }
};

// Delete a URL from a card
export const deleteUrlFromCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: cardId, urlId } = req.params;
    await CardService.deleteUrlFromCard(cardId, urlId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
