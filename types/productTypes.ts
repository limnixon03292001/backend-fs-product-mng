import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { productTable } from "../model/schema.js";

export type NewProduct = InferInsertModel<typeof productTable>;
export type updateProduct = Partial<InferSelectModel<typeof productTable>>;
