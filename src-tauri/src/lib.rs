use std::{fs::create_dir_all, sync::Mutex};

use rusqlite::Connection;
use serde::{ser::SerializeStruct, Serialize, Serializer};
use tauri::Manager;

struct DatabaseInner {
  conn: Connection,
}
type Database = Mutex<DatabaseInner>;

struct Message {
  channel: String,
  time_sent: i64,
  content: String,
}

impl Serialize for Message {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
      S: Serializer,
  {
      let mut s = serializer.serialize_struct("Message", 3)?;
      s.serialize_field("content", &self.content)?;
      s.serialize_field("channel", &self.channel)?;
      s.serialize_field("timeSent", &self.time_sent)?;
      s.end()
  }
}

#[tauri::command]
fn test_command(message: String) {
  println!("Message received: \"{}\" ", message);
}

#[tauri::command]
fn write_command(channel: String, time_sent: i64, content: String, db: tauri::State<Database>) {
  println!("message written to channel {}: \"{}\" ", channel, content);
  
  let db = db.lock().unwrap();
  db.conn.execute(
    "insert into messages (channel, time_sent, content) values (?1, ?2, ?3)", 
    &[&channel, &time_sent.to_string(), &content]
  ).unwrap();
}

#[tauri::command]
fn history_command(channel: String, db: tauri::State<Database>) -> Vec<Message> {
  println!("requesting channel history of {}", channel);
  
  let db = db.lock().unwrap();
  let mut stmt = db.conn.prepare(
    "select channel, time_sent, content from messages where channel = ?1"
  ).unwrap();

  let messages = stmt.query_map(&[&channel], |row| {
    Ok(Message {
      channel: row.get(0)?,
      time_sent: row.get(1)?,
      content: row.get(2)?,
    })
  }).unwrap();

  messages.map(|r| r.unwrap()).collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      test_command, 
      write_command,
      history_command
    ])
    .setup(|app| {
      let data_path = app.path().app_data_dir()?.join("diligence");

      create_dir_all(&data_path)?;

      let db = DatabaseInner {
        conn: Connection::open(data_path.join("notes.db"))?,
      };

      db.conn.execute(
        "create table if not exists messages (
          id integer primary key autoincrement,
          channel integer not null,
          time_sent integer not null,
          content text not null
        )",
        ()
      )?;

      app.manage(Mutex::new(db));

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
