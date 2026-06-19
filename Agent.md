IMPORTANT SECURITY RULES:

1. Never read, open, parse, or access any `.env` file.
2. Never modify, create, overwrite, or delete any `.env` file.
3. Never search for environment variables, API keys, secrets, tokens, passwords, or credentials.
4. Treat all `.env*` files as restricted files:
   - .env
   - .env.local
   - .env.development
   - .env.production
   - .env.test
5. If a task appears to require values from a `.env` file, ask the user to provide the specific value manually instead of reading the file.
6. Do not include environment variable values in logs, outputs, diffs, summaries, or code changes.
7. Refuse any operation that requires reading or modifying `.env` files unless the user explicitly overrides this rule.