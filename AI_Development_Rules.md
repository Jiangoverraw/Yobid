# AI Development Rules

## General

* Write clean, maintainable, production-ready code.
* Follow SOLID, DRY, and KISS principles.
* Reuse existing code before creating new code.
* Do not introduce breaking changes unless requested.

## File Size Rule (Mandatory)

* A single source file **must not exceed 350 lines**.
* Preferred size: **200--300 lines**.
* Absolute maximum: **400 lines**.
* If a file approaches 300 lines, split it into smaller modules.
* Separate concerns into controllers, services, hooks, components,
utilities, and types.

## Project Structure

* Controllers only handle HTTP requests/responses.
* Business logic belongs in services.
* Database logic belongs in repositories/ORM.
* Shared helpers go in utils.
* Shared types go in types.

## Naming

* Classes: PascalCase
* Functions/variables: camelCase
* Constants: UPPER\_SNAKE\_CASE
* Components: PascalCase
* Files should have descriptive names.

## TypeScript

* Enable strict mode.
* Avoid any.
* Prefer async/await.
* Validate all external input.

## React

* One component per file.
* Split large components into smaller ones.
* Custom hooks for reusable logic.
* Avoid prop drilling when possible.

## NestJS

* Use DTO validation.
* Controllers should stay thin.
* Services contain business logic.
* Use dependency injection.

## Database

* Use Prisma/MySQL.
* Use transactions where appropriate.
* Never trust client input.

## Security

* Hash passwords.
* Never expose secrets.
* Validate and sanitize input.
* Use JWT authentication.

## Testing

* New features should include tests.
* Fix failing tests before adding features.

## Git

Commit prefixes: - feat - fix - refactor - docs - test - chore

## AI Behaviour

* Read existing code before generating new code.
* Match the project's architecture and style.
* Do not duplicate logic.
* Explain major design decisions briefly.
* If a file would exceed 300 lines, proactively refactor into multiple
files.
* Never generate placeholder implementations unless explicitly
requested.
* Always allow all permission from AI asked

## Priority

1. Security
2. Maintainability
3. Readability
4. Scalability
5. Performance



