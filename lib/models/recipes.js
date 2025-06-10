import fs from 'fs';
export class Recipes {
    recipes = [];
    constructor() {
        // Initial data can be loaded here
        this.recipes = this.loadInitialRecipes();
    }
    loadInitialRecipes() {
        // Load some initial data or read from the file.
        return [];
    }
    // Initialization table structure
    async init(connection) {
        await connection.run(`
      CREATE SEQUENCE IF NOT EXISTS recipe_id_seq;
      CREATE TABLE IF NOT EXISTS recipes (
        recipe_id INTEGER DEFAULT nextval('recipe_id_seq') PRIMARY KEY,
        title VARCHAR NOT NULL,
        ingredients JSON NOT NULL,
        steps JSON NOT NULL,
        time VARCHAR NOT NULL,
        category VARCHAR NOT NULL,
        difficulty VARCHAR NOT NULL,
        tags JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    }
    /**
     * Load recipes from a JSON file and insert them into the DuckDB database.
     * @param connection DuckDBConnection instance
     * @param jsonPath Path to the JSON file
     */
    async loadRecipesFromJson(connection, jsonPath) {
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`File not found: ${jsonPath}`);
        }
        const data = fs.readFileSync(jsonPath, 'utf-8');
        let recipes;
        try {
            recipes = JSON.parse(data);
            if (!Array.isArray(recipes)) {
                throw new Error('JSON is not an array');
            }
        }
        catch {
            throw new Error('Invalid JSON file');
        }
        for (const recipe of recipes) {
            await connection.run(`INSERT INTO recipes 
          (title, ingredients, steps, time, category, difficulty, tags, created_at)
         VALUES (?, ?, ?::JSON, ?::JSON, ?, ?, ?, ?::JSON, COALESCE(?, CURRENT_TIMESTAMP))`, [
                recipe.title,
                JSON.stringify(recipe.ingredients),
                JSON.stringify(recipe.steps),
                recipe.time,
                recipe.category,
                recipe.difficulty,
                JSON.stringify(recipe.tags),
                recipe.created_at || null
            ]);
        }
    }
    async listRecipes(connection) {
        const result = await connection.runAndReadAll(`
      SELECT 
        recipe_id, 
        title, 
        ingredients, 
        steps, 
        time, 
        category, 
        difficulty, 
        tags, 
        created_at 
      FROM recipes
    `);
        console.log(`Found ${result.getRows().length} recipes in the database.`);
        return result.getRows().map(row => {
            // Unpack in column order
            const [recipe_id, title, ingredients, steps, time, category, difficulty, tags, created_at] = row;
            return {
                recipe_id: typeof recipe_id === 'bigint' ? Number(recipe_id) : recipe_id,
                title: title,
                ingredients: JSON.parse(ingredients),
                steps: JSON.parse(steps),
                time: time,
                category: category,
                difficulty: difficulty,
                tags: JSON.parse(tags),
                created_at: created_at
            };
        });
    }
    all() {
        return this.recipes;
    }
    findById(id) {
        return this.recipes.find(r => r.recipe_id === id);
    }

    async getRecipeById(conn, id) {
        return await conn.get(
          `SELECT * FROM recipes WHERE recipe_id = ?`, [id]
        );
      }
}


//# sourceMappingURL=recipes.js.map