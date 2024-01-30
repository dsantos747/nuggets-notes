import { expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Modal from '../app/ui/modal';

vi.mock('next/font/google', () => ({
  Inter: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
  Caprasimo: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}));

test('open modal, close with button and outside click', () => {
  render(
    <Modal modalContentComponent={<div></div>}>
      <div>open</div>
    </Modal>
  );
  expect(screen.queryByTestId('modalWindow')).toBeNull();
  fireEvent.click(screen.getByTestId('openModalButton'));
  expect(screen.getByTestId('modalWindow')).toBeDefined();
  fireEvent.click(screen.getByTestId('closeModalButton'));
  expect(screen.queryByText('content')).toBeNull();

  fireEvent.click(screen.getByTestId('openModalButton'));
  expect(screen.getByTestId('modalWindow')).toBeDefined();
  fireEvent.click(screen.getByTestId('openModalButton'));
  expect(screen.queryByText('content')).toBeNull();
});
