# Timezone Harmony - ER Diagram

```mermaid
erDiagram
    USERS ||--o{ TIMEZONE_PRESET : "has many"
    USERS ||--o{ BUSINESS_HOURS : "has many"
    TIMEZONE_PRESETS ||--o{ PRESET_TIMEZONE : "has many"

    USERS {
        uuid id "PK"
        string email "UK"
        string password_hash "Nullable"
        string display_name "Nullable"
        string google_id "UK, Nullable"
    }

    TIMEZONE_PRESETS {
        uuid id "PK"
        string user_id
        string name
        string description "Nullable"
        boolean is_favorite "Default: false"
    }

    PRESET_TIMEZONES {
        uuid id "PK"
        string preset_id
        string timezone_identifier
        string display_label "Nullable"
        number position "Default: 0"
    }

    BUSINESS_HOURS {
        uuid id "PK"
        string user_id
        string timezone_identifier
        number day_of_week
        string start_time
        string end_time
        boolean is_active "Default: true"
    }

```

## Auto-generated from TypeORM Entities

This diagram is automatically generated from TypeORM entity files.

**To update:** Run `npm run generate:erd`

## View Instructions

### In VS Code:
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file
3. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows)

### Online:
- Visit https://mermaid.live and paste the mermaid code above

Generated at: 2026-01-23T03:35:45.437Z
