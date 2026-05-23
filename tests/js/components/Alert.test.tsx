import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from '@/Components/ui/Alert';

describe('<Alert />', () => {
    it('renders a title and message with role=alert', () => {
        render(
            <Alert tone="success" title="Saved">
                Your changes are stored.
            </Alert>,
        );

        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Saved');
        expect(alert).toHaveTextContent('Your changes are stored.');
    });

    it('uses error tone classes when tone="error"', () => {
        render(<Alert tone="error" title="Oops" />);
        const alert = screen.getByRole('alert');
        expect(alert.className).toContain('red');
    });
});
