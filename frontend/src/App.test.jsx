import { render, screen } from '@testing-library/react';
import ChatPage from './pages/ChatPage';

beforeAll(() => {
  Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: jest.fn(),
  });
});

test('displays the AI Chat heading', () => {
  render(<ChatPage />);
  const heading = screen.getByRole('heading', { name: /AI Chat/i });
  expect(heading).toBeInTheDocument();
});
