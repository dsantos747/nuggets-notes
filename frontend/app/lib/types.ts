export type User = {
  id: string;
  name: string;
  email: string;
  password_hashed: string;
};

// export type Customer = {
//   id: string;
//   name: string;
//   email: string;
//   image_url: string;
// };

export type Note = {
  id: string;
  user_id: string;
  title: string | null;
  text: string;
  date_created: Date; //string; // Should this be type Date
  date_modified: Date;
};

export type NoteWithTags = Note & {
  tags: string[];
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
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

// export type CustomersTableType = {
//   id: string;
//   name: string;
//   email: string;
//   image_url: string;
//   total_invoices: number;
//   total_pending: number;
//   total_paid: number;
// };

// export type FormattedCustomersTable = {
//   id: string;
//   name: string;
//   email: string;
//   image_url: string;
//   total_invoices: number;
//   total_pending: string;
//   total_paid: string;
// };

// export type CustomerField = {
//   id: string;
//   name: string;
// };

export type NoteForm = {
  id: string;
  user_id: string;
  title: string | null;
  text: string;
  tags: string[];
};

// export type CustomerForm = {
//   id: string;
//   name: string;
//   email: string;
//   image_url: string | '/customers/emil-kowalski.png';
// };

export type NoteFormState = {
  errors?: {
    title?: string[];
    text?: string[];
    tags?: string[];
  };
  message?: string | null;
};

// export type CustomerFormState = {
//   errors?: {
//     name?: string[];
//     email?: string[];
//     imageUrl?: string[];
//   };
//   message?: string | null;
// };

// export type LoginFormData = {
//   email: string;
//   password: string;
// };

// export interface SignUpFormData {
//   name: string;
//   email: string;
//   password: string;
// }
