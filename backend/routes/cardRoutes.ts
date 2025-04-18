
import { Router } from 'express';
import * as CardController from '../controllers/cardController';
import { validate, cardCreateSchema, cardUpdateSchema, urlCreateSchema } from '../middlewares/validator';

const router = Router();

// Get all cards with pagination
router.get('/', CardController.getCards);

// Get a specific card by ID
router.get('/:id', CardController.getCardById);

// Create a new card
router.post('/', validate(cardCreateSchema), CardController.createCard);

// Update a card
router.put('/:id', validate(cardUpdateSchema), CardController.updateCard);

// Mark a card as viewed
router.patch('/:id/viewed', CardController.markCardAsViewed);

// Delete a card
router.delete('/:id', CardController.deleteCard);

// Add a URL to a card
router.post('/:id/urls', validate(urlCreateSchema), CardController.addUrlToCard);

// Delete a URL from a card
router.delete('/:id/urls/:urlId', CardController.deleteUrlFromCard);

export default router;
