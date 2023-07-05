

// faas/function.ts

export type IFunction = {}

// faas/function_impl.ts

export class Function implements IFunction {}

// faas/index.ts

export { IFunction } from './function'
export { Function } from './function_impl'

// main.ts

import { Function, IFunction } from './faas'
