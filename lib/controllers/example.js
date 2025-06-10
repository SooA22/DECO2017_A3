export default class Controller {
    // Render template "example/welcome.html.tmpl" with message
    async recipes(ctx) {
        console.log('Loading recipes...');
        let recipes = [];
        await ctx.app.models.database.connection(async (connection) => {
            recipes = await ctx.app.models.recipes.listRecipes(connection);
        });
        // Now recipes is set
        console.log(`Loaded ${recipes.length} recipes`);
        ctx.stash.recipes = recipes;
        ctx.stash.title = 'Recipes List';
        await ctx.render({ view: 'example/recipes' });
    }
    async recipe(ctx) {
        const id = ctx.stash.id;
        let recipes = [];
        await ctx.app.models.database.connection(async (connection) => {
            recipes = await ctx.app.models.recipes.listRecipes(connection);
        });
        let recipe = recipes.find(r => r.recipe_id == id);
        console.log(`Recipe info: ${JSON.stringify(recipe, (_, v) => typeof v === 'bigint' ? v.toString() : v)}`);
        ctx.stash.recipe = recipe;
        await ctx.render({ view: 'example/recipe' });
    }
}