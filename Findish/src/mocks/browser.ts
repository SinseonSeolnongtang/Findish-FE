import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { restaurantHandlers } from './restaurantHandlers';
import { exploreHandlers } from './exploreHandlers';
import { cartHandlers } from './cartHandlers';
import { agentHandlers } from './agentHandlers';
import { myPageHandlers } from './myPageHandlers';

export const worker = setupWorker(...handlers, ...restaurantHandlers, ...exploreHandlers, ...cartHandlers, ...agentHandlers, ...myPageHandlers);
