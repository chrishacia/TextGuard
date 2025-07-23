import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import type { SpamRequestBody } from '../types/spam-api';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'instagram';

export interface SocialPostData extends SpamRequestBody { }

export interface SocialPostFormHandle {
    reset: () => void;
    focus: () => void;
}

interface Props {
    onSubmit: (data: SocialPostData) => Promise<void> | void;
    onCancel?: () => void;
}

const SocialPostForm = forwardRef<SocialPostFormHandle, Props>(
    ({ onSubmit, onCancel }, ref) => {
        const [text, setText] = useState('');
        const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        useImperativeHandle(ref, () => ({
            reset() {
                setText('');
                setPlatforms([]);
            },
            focus() {
                textareaRef.current?.focus();
            },
        }));

        const togglePlatform = (p: SocialPlatform) => {
            setPlatforms(prev =>
                prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
            );
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            await onSubmit({ text, platforms });
        };

        return (
            <form onSubmit={handleSubmit} className="mb-4">
                {/* icons row */}
                <div className="d-flex justify-content-end gap-2 mb-2">
                    {([
                        ['facebook', <FaFacebookF />],
                        ['twitter', <FaTwitter />],
                        ['linkedin', <FaLinkedinIn />],
                        ['instagram', <FaInstagram />],
                    ] as const).map(([p, icon]) => (
                        <button
                            key={p}
                            type="button"
                            className={`btn btn-sm ${platforms.includes(p) ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => togglePlatform(p)}
                            aria-pressed={platforms.includes(p)}
                            title={p}
                        >
                            {icon}
                        </button>
                    ))}
                </div>

                {/* textarea */}
                <div className="mb-2">
                    <textarea
                        ref={textareaRef}
                        className="form-control"
                        rows={4}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Type your post…"
                    />
                </div>

                {/* buttons */}
                <div className="d-flex justify-content-end gap-2">
                    {onCancel && (
                        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        );
    }
);

SocialPostForm.displayName = 'SocialPostForm';
export default SocialPostForm;
