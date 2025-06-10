import { DuckDBConnection } from "@duckdb/node-api";
export interface Recipe {
    recipe_id: number;
    title: string;
    ingredients: string[];
    steps: string[];
    time: string;
    category: string;
    difficulty: string;
    tags: string[];
    created_at?: string;
}
export declare class Recipes {
    private recipes;
    constructor();
    private loadInitialRecipes;
    init(connection: DuckDBConnection): Promise<void>;
    /**
     * Load recipes from a JSON file and insert them into the DuckDB database.
     * @param connection DuckDBConnection instance
     * @param jsonPath Path to the JSON file
     */
    loadRecipesFromJson(connection: DuckDBConnection, jsonPath: string): Promise<void>;
    listRecipes(connection: DuckDBConnection): Promise<Recipe[]>;
    all(): Recipe[];
    findById(id: number): Recipe | undefined;
}
