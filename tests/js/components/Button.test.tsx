import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/Components/ui/Button';

describe('<Button />', () => {
    it('renders children and is enabled by default', () => {
        render(<Button>Click me</Button>);
        const btn = screen.getByRole('button', { name: /click me/i });
        expect(btn).toBeInTheDocument();
        expect(btn).not.toBeDisabled();
    });

    it('is disabled while loading', () => {
        render(<Button isLoading>Submitting</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
