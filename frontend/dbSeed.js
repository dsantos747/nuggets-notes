require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

async function seedUsers(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hashed VARCHAR(255) NOT NULL
    );
    `;
    console.log(`Created "users" table`);

    const id = uuidv4();
    const name = 'John Doe';
    const email = process.env.TEST_EMAIL;
    const hashedPassword = await bcrypt.hash(process.env.TEST_PASSWORD, 10);
    await sql`
    INSERT INTO users (id, name, email, password_hashed)
    VALUES (${id}, ${name},${email},${hashedPassword})
    ON CONFLICT (id) DO NOTHING
    `;
    console.log(`Added user ${name} with id ${id}`);
    return id;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedNotes(sql, defaultUserId) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`CREATE TABLE IF NOT EXISTS notes (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
        user_id UUID NOT NULL,
        title VARCHAR(255),
        text TEXT NOT NULL,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    `;
    console.log(`Created "notes" table`);

    const note_id = uuidv4();
    const user_id = defaultUserId;
    const title = 'Test note';
    const text = 'This is a test note created purely for testing purposes. It adds nothing of value.';
    await sql`
    INSERT INTO notes (id, user_id, title, text)
    VALUES (${note_id},${user_id},${title},${text})
    ON CONFLICT (id) DO NOTHING
    `;
    console.log(`Added note with id: ${note_id}`);
    return note_id;
  } catch (error) {
    console.error('Error seeding notes:', error);
    throw error;
  }
}

async function seedTags(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`CREATE TABLE IF NOT EXISTS tags (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) UNIQUE
    );
    `;
    console.log(`Created "tags" table`);

    const tag_id = uuidv4();
    const name = 'Test Tag';
    await sql`
    INSERT INTO tags (id, name)
    VALUES (${tag_id},${name})
    ON CONFLICT (id) DO NOTHING
    `;
    console.log(`Seeded tag ${name}`);

    return tag_id;
  } catch (error) {
    console.error('Error seeding tags:', error);
    throw error;
  }
}

async function seedNoteTags(sql, note_id, tag_id) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`CREATE TABLE IF NOT EXISTS notes_tags (
        note_id UUID,
        tag_id UUID,
        PRIMARY KEY (note_id, tag_id),
        FOREIGN KEY (note_id) REFERENCES notes(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
    );
    `;
    console.log(`Created "notes_tags" table`);

    await sql`
    INSERT INTO notes_tags (note_id, tag_id)
    VALUES (${note_id},${tag_id})
    `;
    console.log(`Seeded notes_tags Table`);
    return 'Seeded successfully';
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable could not be resolved.');
  }

  const sql = postgres(databaseUrl, { ssl: 'require' });

  try {
    await sql`DROP TABLE IF EXISTS notes_tags`;
    await sql`DROP TABLE IF EXISTS tags`;
    await sql`DROP TABLE IF EXISTS notes`;
    await sql`DROP TABLE IF EXISTS users`;

    const defaultUserId = await seedUsers(sql);
    const defaultNoteId = await seedNotes(sql, defaultUserId);
    const defaultTagId = await seedTags(sql);
    await seedNoteTags(sql, defaultNoteId, defaultTagId);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err);
});
