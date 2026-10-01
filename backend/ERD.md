```mermaid
erDiagram

        UserRole {
            user user
admin admin
        }
    
  "users" {
    String id "🗝️"
    String supabase_id 
    String email 
    String display_name "❓"
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
  

  "timezone_preset_items" {
    String id "🗝️"
    String preset_id 
    String timezone_identifier 
    String display_label "❓"
    Int position 
    DateTime start_time "❓"
    DateTime end_time "❓"
    DateTime created_at 
    }
  

  "health_checks" {
    Int id "🗝️"
    DateTime created_at 
    }
  

  "meeting_polls" {
    String id "🗝️"
    String title 
    String timezones 
    Int duration_minutes 
    DateTime created_at 
    DateTime expires_at 
    String user_id "❓"
    }
  

  "poll_options" {
    String id "🗝️"
    String poll_id 
    DateTime starts_at 
    Int position 
    }
  

  "poll_votes" {
    String id "🗝️"
    String option_id 
    String voter_name 
    DateTime created_at 
    }
  
    "users" |o--|| "UserRole" : "enum:role"
    "timezone_presets" }o--|| users : "user"
    "timezone_preset_items" }o--|| timezone_presets : "preset"
    "meeting_polls" }o--|o users : "user"
    "poll_options" }o--|| meeting_polls : "poll"
    "poll_votes" }o--|| poll_options : "option"
```
