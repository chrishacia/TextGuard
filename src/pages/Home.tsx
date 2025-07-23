import React, { useRef, useState } from 'react';
import SocialPostForm, { type SocialPostData, type SocialPostFormHandle } from '../components/SocialPostForm';
import { fetchSpamScore } from '../api/spam';
import Banner from '../components/Banner';
import HistoryList from '../components/HistoryList';
import { useHistory } from '../hooks/useHistory';
import { v4 as uuid } from 'uuid';

const Home: React.FC = () => {
    const [banner, setBanner] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);
    const { items, add, removeMany } = useHistory();
    const formRef = useRef<SocialPostFormHandle>(null);

    const handlePost = async (data: SocialPostData) => {
        const id = uuid();
        const timestamp = Date.now();

        const res = await fetchSpamScore({ text: data.text, platforms: data.platforms });

        if (res.ok) {
            const result = res.data;
            add({ id, text: data.text, platforms: result.platforms, result, timestamp });
            setBanner({
                type: result.isSpam ? 'danger' : 'success',
                msg: result.isSpam
                    ? `Flagged as spam (score ${result.score})`
                    : `Looks clean! (score ${result.score})`,
            });

            formRef.current?.reset();
            formRef.current?.focus();
        } else {
            add({ id, text: data.text, platforms: data.platforms, error: res.error, timestamp });
            setBanner({ type: 'danger', msg: `Failed: ${res.error}` });
        }
    };

    return (
        <div className="container py-4">
            <h1 className="mb-3">Welcome to TextGuard</h1>
            <p className="lead">
                Spam detection and prevention system. A simple demo &amp; prototype for educational purposes.
                <a href="https://github.com/chrishacia/TextGuard" rel="noopener noreferrer" target="_blank" title="TextGuard on GitHub.com">GitHub: TextGuard</a>
            </p>

            {banner && (
                <Banner
                    type={banner.type}
                    message={banner.msg}
                    onClose={() => setBanner(null)}
                />
            )}

            <SocialPostForm ref={formRef} onSubmit={handlePost} onCancel={() => setBanner(null)} />
            <HistoryList items={items} onDeleteSelected={removeMany} />
        </div>
    );
};

export default Home;
