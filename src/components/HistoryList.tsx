import React, { useMemo, useState, type JSX } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import type { HistoryItem } from '../types/history';
import type { SocialPlatform } from './SocialPostForm';

type Filter = 'all' | 'spam' | 'ham';

interface Props {
    items: HistoryItem[];
    onDeleteSelected: (ids: string[]) => void;
}

const platformIcons: Record<SocialPlatform, JSX.Element> = {
    facebook: <FaFacebookF />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedinIn />,
    instagram: <FaInstagram />,
};

const truncate = (txt: string, max = 40) =>
    txt.length > max ? `${txt.slice(0, max - 1)}…` : txt;

const HistoryList: React.FC<Props> = ({ items, onDeleteSelected }) => {
    const [filter, setFilter] = useState<Filter>('all');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState<Record<string, boolean>>({});

    const filtered = useMemo(() => {
        if (filter === 'all') return items;
        return items.filter(i =>
            filter === 'spam' ? i.result?.isSpam : !(i.result?.isSpam)
        );
    }, [items, filter]);

    const visibleIds = filtered.map(i => i.id);
    const anySelected = visibleIds.some(id => selected[id]);

    const toggleExpand = (id: string) =>
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const toggleSelect = (id: string) =>
        setSelected(prev => ({ ...prev, [id]: !prev[id] }));

    const selectAll = (value: boolean) => {
        const next: Record<string, boolean> = { ...selected };
        visibleIds.forEach(id => (next[id] = value));
        setSelected(next);
    };

    const deleteSelected = () => {
        const ids = visibleIds.filter(id => selected[id]);
        onDeleteSelected(ids);
        setSelected(prev => {
            const copy = { ...prev };
            ids.forEach(id => delete copy[id]);
            return copy;
        });
    };

    return (
        <section className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h5 mb-0">History</h2>

                <div className="d-flex align-items-center gap-3">
                    <select
                        className="form-select form-select-sm w-auto"
                        value={filter}
                        onChange={e => setFilter(e.target.value as Filter)}
                        aria-label="Filter history"
                    >
                        <option value="all">All</option>
                        <option value="spam">Spam</option>
                        <option value="ham">Not Spam</option>
                    </select>

                    {filtered.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-link btn-sm text-decoration-none"
                            onClick={() =>
                                selectAll(!visibleIds.every(id => selected[id]))
                            }
                        >
                            {visibleIds.every(id => selected[id]) ? 'Deselect all' : 'Select all'}
                        </button>
                    )}

                    {anySelected && (
                        <button
                            type="button"
                            className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                            onClick={deleteSelected}
                        >
                            <FaTrash /> Delete
                        </button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-muted mb-0">No history to show.</p>
            ) : (
                <div className="list-group">
                    {filtered.map(item => {
                        const isSpam = item.result?.isSpam ?? false;
                        const open = !!expanded[item.id];
                        return (
                            <div key={item.id} className="list-group-item p-0">
                                <div
                                    className="d-flex align-items-center px-3 py-2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleExpand(item.id)}
                                >
                                    {/* checkbox */}
                                    <div className="me-2" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={!!selected[item.id]}
                                            onChange={() => toggleSelect(item.id)}
                                            aria-label="select row"
                                        />
                                    </div>

                                    {/* date/time */}
                                    <div className="text-muted small me-3" style={{ width: '9rem' }}>
                                        {new Date(item.timestamp).toLocaleString()}
                                    </div>

                                    {/* truncated text */}
                                    <div className="flex-grow-1 text-truncate me-3" title={item.text}>
                                        {truncate(item.text, 60)}
                                    </div>

                                    {/* platforms */}
                                    <div className="me-3 d-flex gap-1">
                                        {item.platforms.map(p => (
                                            <span key={p} aria-label={p}>
                                                {platformIcons[p]}
                                            </span>
                                        ))}
                                    </div>

                                    {/* status icon */}
                                    <div className="ms-auto">
                                        {item.error ? (
                                            <FaTimesCircle className="text-danger" title="error" />
                                        ) : isSpam ? (
                                            <FaTimesCircle className="text-danger" title="spam" />
                                        ) : (
                                            <FaCheckCircle className="text-success" title="not spam" />
                                        )}
                                    </div>
                                </div>

                                {open && (
                                    <div className="px-3 py-2 border-top bg-light small">
                                        {item.error && (
                                            <p className="text-danger mb-1"><strong>Error:</strong> {item.error}</p>
                                        )}
                                        {item.result && (
                                            <>
                                                <p className="mb-1"><strong>Score:</strong> {item.result.score}</p>
                                                <p className="mb-1"><strong>Status:</strong> {isSpam ? 'Spam' : 'Not spam'}</p>
                                            </>
                                        )}
                                        <pre className="mb-0 bg-white p-2 border rounded">{item.text}</pre>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default HistoryList;
