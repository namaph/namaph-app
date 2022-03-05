import { createContext } from 'react';
import { AppState } from './model';

export const AppStateContext = createContext(AppState.Disconnected);

