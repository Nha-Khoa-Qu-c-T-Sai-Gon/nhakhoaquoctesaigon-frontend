# Centralized Type Definitions (`src/types/`)

This directory houses the core data models and TypeScript definitions representing Strapi API responses and normalized frontend structures.

## 🎯 Code Style & Architecture Rules

1. **Do Not Duplicate Models**: Always reuse existing domain definitions (e.g. `User`, `Media`, `Block`, `ContactMethod`, `AIChatConfig`, etc.) rather than declaring local, ad-hoc, or duplicate interfaces in page or component files.
2. **Utilize Utility Types**: If you need a subset or a slight variation of a defined type, use built-in TypeScript utility types rather than rewriting the fields:
   - Use `Pick<Type, Keys>` to construct a type by picking specific keys.
   - Use `Omit<Type, Keys>` to construct a type by omitting specific keys.
   - Use `Partial<Type>` to make all fields optional.
3. **Strict Primitives Requirement**: Ensure all numeric, text, and date variables strictly use their true primitives (e.g. `age: number` instead of string, `price: number`). Loose mappings like using string types for numerical indices/counters are prohibited to avoid formatting bugs.

## 📁 File Structure

- [strapi.ts](file:///Users/hoabui/Desktop/dental-app-v2/dental-frontend/src/types/strapi.ts): Main source of truth defining backend-originated structures and normalized application-wide schemas.
