// login.test.ts
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import LoginPage from './+page.svelte';

// Declare all mocks at the top using vi.hoisted
const { mockGoto, mockMutateAsync, mockSearchParams } = vi.hoisted(() => ({
	mockGoto: vi.fn(),
	mockMutateAsync: vi.fn(),
	mockSearchParams: new URLSearchParams(),
}));

vi.mock('$app/navigation', () => ({ goto: mockGoto }));
vi.mock('$app/paths', () => ({ resolve: (_path: string) => _path }));
vi.mock('$app/state', () => ({
	page: {
		get url() {
			return { searchParams: mockSearchParams };
		},
	},
}));
vi.mock('$indexcards', () => ({
	createAuthLogin: () => ({ mutateAsync: mockMutateAsync }),
}));

describe('Login page redirect', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSearchParams.delete('redirect');
	});

	it('redirects to / when no redirect param is set', async () => {
		mockMutateAsync.mockResolvedValueOnce({status: 200});
		render(LoginPage);

		await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
		await userEvent.type(screen.getByLabelText(/password/i), 'password123');
		await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

		await waitFor(() => {
			expect(mockGoto).toHaveBeenCalledWith('/', expect.any(Object));
		});
	});

	it('redirects to the redirect param after login', async () => {
		mockMutateAsync.mockResolvedValueOnce({status: 200});
		mockSearchParams.set('redirect', '/dashboard');
		render(LoginPage);

		await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
		await userEvent.type(screen.getByLabelText(/password/i), 'password123');
		await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

		await waitFor(() => {
			expect(mockGoto).toHaveBeenCalledWith('/dashboard', expect.any(Object));
		});
	});

	it('uses redirect param captured before the async mutation resolves', async () => {
		// Simulate the param disappearing mid-flight (the bug you fixed)
		mockMutateAsync.mockImplementationOnce(async () => {
			mockSearchParams.delete('redirect'); // param gone by the time login resolves
			return {status: 200};
		});
		mockSearchParams.set('redirect', '/protected');
		render(LoginPage);

		await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
		await userEvent.type(screen.getByLabelText(/password/i), 'password123');
		await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

		await waitFor(() => {
			// Should still redirect to /protected, not /
			expect(mockGoto).toHaveBeenCalledWith('/protected', expect.any(Object));
		});
	});

	it('shows an error and does not redirect on failed login', async () => {
		mockMutateAsync.mockRejectedValueOnce({
			title: 'Unauthorized',
			detail: 'Invalid credentials',
			status: 401,
		});
		render(LoginPage);

		await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
		await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
		await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

		await waitFor(() => {
			expect(screen.getByText('Unauthorized')).toBeInTheDocument();
			expect(mockGoto).not.toHaveBeenCalled();
		});
	});
});