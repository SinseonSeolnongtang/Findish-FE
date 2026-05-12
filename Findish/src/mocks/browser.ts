import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { restaurantHandlers } from './restaurantHandlers';

export const worker = setupWorker(...handlers, ...restaurantHandlers);
