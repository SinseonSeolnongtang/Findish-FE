import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { restaurantHandlers } from './restaurantHandlers';
import { exploreHandlers } from './exploreHandlers';

export const worker = setupWorker(...handlers, ...restaurantHandlers, ...exploreHandlers);
