'use server';

import { z } from 'zod';
// import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { InvoiceFormState, CustomerFormState, LoginFormData, SignUpFormData } from '@/app/lib/types';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { error } from 'console';

const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter a valid customer name.',
  }),
  email: z.string({
    invalid_type_error: 'Please enter a valid email.',
  }),
  imageUrl: z.string({
    invalid_type_error: 'Please enter a valid image url.',
  }),
});

const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });
const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

const CreateCustomer = CustomerFormSchema.omit({ id: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable could not be resolved.');
}

const sql = postgres(databaseUrl, { ssl: 'require' });

export async function createInvoice(prevState: InvoiceFormState, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  //   try {
  //     await sql`
  //   INSERT INTO invoices (customer_id, amount, status, date)
  //   VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  //   `;
  //   } catch (error) {
  //     return { message: 'Database Error: Failed to Create Invoice' };
  //   }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: InvoiceFormState, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  //   try {
  //     await sql`
  //     UPDATE invoices
  //     SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
  //     WHERE id = ${id}
  //   `;
  //   } catch (error) {
  //     return { message: 'Database Error: Failed to Update Invoice' };
  //   }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');
  //   try {
  //     await sql`DELETE FROM invoices WHERE id = ${id}`;
  //     revalidatePath('/dashboard/invoices');
  //     return { message: 'Deleted Invoice' };
  //   } catch (error) {
  //     return { message: 'Database Error: Failed to Delete Invoice' };
  //   }
}

export async function createCustomer(prevState: CustomerFormState, formData: FormData) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: '/customers/emil-kowalski.png', //formData.get('imageUrl'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer',
    };
  }
  const { name, email, imageUrl } = validatedFields.data;
  //   try {
  //     await sql`
  //   INSERT INTO customers (name, email, image_url)
  //   VALUES (${name}, ${email}, ${imageUrl})
  //   `;
  //   } catch (error) {
  //     return { message: 'Database Error: Failed to Create Customer' };
  //   }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function updateCustomer(id: string, prevState: CustomerFormState, formData: FormData) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: '/customers/emil-kowalski.png', //formData.get('imageUrl'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
    };
  }

  const { name, email, imageUrl } = validatedFields.data;
  //   try {
  //     await sql`
  //     UPDATE customers
  //     SET name = ${name}, email = ${email}, image_url = ${imageUrl}
  //     WHERE id = ${id}
  //   `;
  //   } catch (error) {
  //     return { message: 'Database Error: Failed to Update Customer' };
  //   }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  // throw new Error('Failed to Delete Customer');
  //   try {
  //     await sql`DELETE FROM invoices WHERE customer_id = ${id}`; /////////// NEED TO DELETE ALL ASSOCIATED INVOICES
  //     await sql`DELETE FROM customers WHERE id = ${id}`;
  //     revalidatePath('/dashboard/customers');
  //     return { message: 'Deleted Customer' };
  //   } catch (error) {
  //     return { message: 'Database Error: Failed to Delete Customer' };
  //   }
}

// export async function authenticate(prevState: string | undefined, formData: FormData) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'Something went wrong.';
//       }
//     }
//     throw error;
//   }
// }
export async function authenticate(email: string, password: string) {
  try {
    await signIn('credentials', { email, password });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function login(prevState: string | undefined, formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  if (!email || !password) {
    throw new Error('Invalid Form data');
  }
  await authenticate(email, password);
  // const authenticationError = await authenticate(email, password);

  // if (authenticationError) {
  //   console.log(authenticationError);
  //   if (authenticationError instanceof AuthError) {
  //     switch (authenticationError.type) {
  //       case 'CredentialsSignin':
  //         return 'Invalid credentials.';
  //       default:
  //         return 'Something went wrong.';
  //     }
  //   }
  //   return 'Failed to log in.';
  // }
}

// try {
// const { email, password } = formData;

// } catch (error) {
// if (error instanceof AuthError) {
//   switch (error.type) {
//     case 'CredentialsSignin':
//       return 'Invalid credentials.';
//     default:
//       return 'Something went wrong.';
//   }
// }
// console.log(error);
// return 'Failed to log in.'; // This one is getting triggered
// }

export async function signUp(prevState: string | undefined, formData: FormData) {
  try {
    // const { name, email, password } = formData;
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!name || !email || !password) {
      throw new Error('Invalid Form data');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return 'User with this email already exists. Try logging in.';
    }
    await sql`INSERT INTO users(name, email, password_hashed) VALUES (${name}, ${email}, ${hashedPassword})`;

    await authenticate(email, password);
  } catch (error) {
    return 'Sign-up error: Failed to create account.';
  }
}
