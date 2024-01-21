export type User = {
  id: string;
  name: string;
  email: string;
  password_hashed: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string | undefined;
  text: string;
  date_created: Date; //string; // Should this be type Date
  date_modified: Date;
};

export type Tag = {
  id?: string;
  name: string;
  user_id?: string;
};

export type NoteWithTags = Note & {
  tags: string[];
};

export type NotesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type NoteForm = {
  id: string;
  user_id: string;
  title: string | undefined;
  text: string;
  tags: string[];
};

export type NoteFormState = {
  errors?: {
    title?: string[];
    text?: string[];
    tags?: string[];
  };
  message?: string | null;
};
