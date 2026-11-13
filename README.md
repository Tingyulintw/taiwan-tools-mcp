# Taiwan Tools MCP

A small, free MCP server with Taiwan-focused utility tools for AI assistants.

## Tools

| Tool | What it does |
|------|--------------|
| `validate_business_id` | Checks whether a Taiwan Unified Business Number (統一編號, 8 digits) has a valid format and check digit. |
| `roc_to_gregorian` | Converts a 民國 date (e.g. `115-11-13`) to a Gregorian date. |
| `gregorian_to_roc` | Converts a Gregorian date (e.g. `2026-11-13`) to a 民國 date. |

Note: `validate_business_id` only verifies the check digit. It does not confirm that a company actually exists.

## Run locally

```bash
npm install
npm run build
npm start   # http://localhost:8080/mcp
```

## License

MIT
