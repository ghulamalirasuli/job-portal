import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: Props) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value || '',
        editorProps: {
            attributes: {
                class:
                    'prose prose-sm max-w-none min-h-[120px] px-3 py-2 focus:outline-none dark:prose-invert',
            },
        },
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
    }, [editor, value]);

    return (
        <div
            className={cn(
                'overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800',
                className,
            )}
        >
            <div className="flex flex-wrap gap-1 border-b border-default bg-slate-50 px-2 py-1.5 dark:bg-slate-900/50">
                <ToolbarButton
                    active={editor?.isActive('bold')}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    label="B"
                />
                <ToolbarButton
                    active={editor?.isActive('italic')}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    label="I"
                />
                <ToolbarButton
                    active={editor?.isActive('bulletList')}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    label="• List"
                />
            </div>
            <EditorContent editor={editor} />
            {!value && placeholder ? (
                <p className="pointer-events-none -mt-16 px-3 text-sm text-muted">{placeholder}</p>
            ) : null}
        </div>
    );
}

function ToolbarButton({
    active,
    onClick,
    label,
}: {
    active?: boolean;
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'rounded px-2 py-1 text-xs font-medium',
                active
                    ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
        >
            {label}
        </button>
    );
}
