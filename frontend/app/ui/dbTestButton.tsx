'use client';

import postgres from 'postgres';
import { DbTest } from '../lib/actions';
import { useFormState } from 'react-dom';

export default async function TestButton() {
  const [errorMessage, dispatch] = useFormState(DbTest, undefined);

  return (
    <form action={dispatch}>
      <button className='bg-blue-400 p-12' type='submit'>
        Click me to test the database
      </button>
    </form>
  );
}
