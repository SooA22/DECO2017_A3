import type { MojoContext } from '@mojojs/core';
export default class Controller {
    recipes(ctx: MojoContext): Promise<void>;
    recipe(ctx: MojoContext): Promise<void>;
}
