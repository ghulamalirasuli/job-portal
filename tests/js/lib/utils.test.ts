import { describe, expect, it } from 'vitest';
import { cn, initials } from '@/lib/utils';

describe('cn()', () => {
    it('merges tailwind classes and deduplicates', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
        expect(cn('text-sm font-medium', false, 'text-base')).toBe(
            'font-medium text-base',
        );
    });
});

describe('initials()', () => {
    it.each([
        ['Anya Müller', 'AM'],
        ['Lucas', 'L'],
        ['', '?'],
        [null, '?'],
        [undefined, '?'],
        ['ann marie kowalski', 'AM'],
    ] as const)('returns %s -> %s', (input, expected) => {
        expect(initials(input)).toBe(expected);
    });
});
