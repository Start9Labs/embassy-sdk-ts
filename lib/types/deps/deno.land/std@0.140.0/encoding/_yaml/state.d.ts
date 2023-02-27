import type { SchemaDefinition } from "./schema.js";
export declare abstract class State {
    schema: SchemaDefinition;
    constructor(schema?: SchemaDefinition);
}
