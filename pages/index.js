import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import styles from './index.module.css';

export default function Home() {
    const router = useRouter();
    const [Loading, setLoading] = useState(false);
    return (
        <div className={styles.background}>
            <Head>
                <title>BSER-ELIZA</title>
            </Head>
            <div className={styles.content}>
                <img className={styles.logo} src={`/asset/logo_white.png`} />
                {Loading ? (
                    <p className={styles.loading}>
                        <FontAwesomeIcon
                            icon={faCircleNotch}
                            spin
                            color="white"
                        />
                        {' 로딩중'}
                    </p>
                ) : (
                    <input
                        type="text"
                        className={styles.search}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                router.push({
                                    pathname: '/user/[user]',
                                    query: {
                                        user: e.target.value,
                                    },
                                });
                                setLoading(true);
                            }
                        }}
                        placeholder="닉네임"
                    />
                )}
                <a href="/License" className={styles.license}>
                    License
                </a>
            </div>
        </div>
    );
}
