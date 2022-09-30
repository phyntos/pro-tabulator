import { createContext } from 'react';

export type ColorType = 'indigo' | 'blue';

const ColorContext = createContext<ColorType>('blue');

export default ColorContext;
