```mermaid
erDiagram

        UserRole {
            user user
admin admin
        }
    
  "users" {
    String id "🗝️"
    String email 
    String password_hash "❓"
    String display_name "❓"
    String google_id "❓"
    UserRole role 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "timezone_presets" {
    String id "🗝️"
    String user_id 
    String name 
    String description "❓"
    Boolean is_favorite 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "preset_timezones" {
    String id "🗝️"
    String preset_id 
    String timezone_identifier 
    String display_label "❓"
    Int position 
    String start_time "❓"
    String end_time "❓"
    DateTime created_at 
    }
  
    "users" |o--|| "UserRole" : "enum:role"
    "timezone_presets" }o--|| users : "user"
    "preset_timezones" }o--|| timezone_presets : "preset"
```
