import React, { useEffect, useState } from 'react';
import * as bser from '../../bser';
import { useRouter } from 'next/router';
import styles from './[user].module.css';
import Userstat from '../../components/Userstat';
import GameHistory from '../../components/GameHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faIgloo } from '@fortawesome/free-solid-svg-icons';

function user({ stat, _games, next }) {
    const router = useRouter();
    const { user } = router.query;
    const [Games, setGames] = useState([]);
    const [ViewType, setViewType] = useState(0);
    const [ViewDetailType, setViewDetailType] = useState(0);
    const [Loading, setLoading] = useState(0);
    const ViewTypeString = ['전체', '일반', '랭크'];
    const ViewDetailTypeString = ['전체', '솔로', '듀오', '스쿼드'];

    useEffect(() => {
        setGames([...Games, ..._games]);
        setLoading(1);
    }, [_games]);

    const scroll = ({ target }) => {
        if (
            target.offsetHeight + target.scrollTop >= target.scrollHeight &&
            next !== -1
        ) {
            replaceNext();
        }
    };

    const UserNameInput = () => {
        return (
            <input
                type="text"
                className={styles.search}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        setGames([]);
                        router.push({
                            pathname: '/user/[user]',
                            query: {
                                user: e.target.value,
                            },
                        });
                        setLoading(0);
                    }
                }}
                placeholder="닉네임"
            />
        );
    };

    const lengthCheck = () => {
        const gamesFilter = Games.filter(
            (v) =>
                (ViewType === 0 ? true : v['seasonId'] === ViewType - 1) &&
                (ViewDetailType === 0
                    ? true
                    : v['type'] === ViewDetailTypeString[ViewDetailType])
        );
        if (gamesFilter.length < 5) {
            replaceNext();
        }
        return gamesFilter;
    };

    const replaceNext = () => {
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    next,
                },
            },
            router.asPath
        );
    };

    return Loading === 0 ? (
        <div className={styles.background}>
            <div className={styles.userstat}>
                <div className={styles.username}>
                    <h1>{user}</h1>
                </div>
                <Userstat tier={[-1]} />
                <Userstat tier={[-1]} />
                <Userstat tier={[-1]} />
            </div>
            <div className={styles.history}>
                <div className={styles.options}>
                    <UserNameInput />
                </div>
                <div className={styles.histories}>
                    <div>
                        <p className={styles.loading}>
                            <FontAwesomeIcon
                                icon={faCircleNotch}
                                spin
                                color="white"
                            />
                            {' 로딩중'}
                        </p>
                    </div>
                </div>
                <a href="/License" className={styles.license}>
                    License
                </a>
            </div>
        </div>
    ) : (
        <div className={styles.background}>
            <div className={styles.userstat}>
                <div className={styles.username}>
                    <h1>{user}</h1>
                </div>
                {stat.map((v, i) => (
                    <Userstat
                        type={v['type']}
                        tier={v['tier']}
                        mmr={v['mmr']}
                        top={`${v['top']}%`}
                        characterstat={v['characterStats']}
                        key={i}
                    />
                ))}
            </div>
            <div className={styles.history}>
                <div className={styles.options}>
                    <p
                        onClick={() => {
                            ViewType < 2
                                ? setViewType(ViewType + 1)
                                : setViewType(0);
                        }}
                        className={styles.ViewType}
                    >
                        {ViewTypeString[ViewType]}
                    </p>
                    {ViewDetailTypeString.map((v, i) => (
                        <p
                            onClick={() => {
                                setViewDetailType(i);
                            }}
                            className={styles.ViewDetailType}
                            style={{
                                color:
                                    ViewDetailType === i ? 'white' : '#838383',
                                fontSize: ViewDetailType === i ? '3vh' : '2vh',
                            }}
                            key={i}
                        >
                            {v}
                        </p>
                    ))}
                    <UserNameInput />
                </div>
                <div className={styles.histories}>
                    <div onScroll={scroll}>
                        {lengthCheck().map((v, i) => (
                            <GameHistory {...v} key={i} />
                        ))}
                        {lengthCheck().length < 5 ? (
                            <p className={styles.loading}>
                                <FontAwesomeIcon
                                    icon={faCircleNotch}
                                    spin
                                    color="white"
                                />
                                {' 로딩중'}
                            </p>
                        ) : undefined}
                    </div>
                </div>
                <a href="/License" className={styles.license}>
                    License
                </a>
            </div>
        </div>
    );
}

let userName = undefined;
let usernum = undefined;
let normalstat = undefined;
let stat = undefined;

export async function getServerSideProps(context) {
    const { user, next } = context.query;
    if (userName !== user) {
        usernum = undefined;
        normalstat = undefined;
        stat = undefined;
        userName = undefined;
    }
    if (userName === undefined) userName = user;
    if (usernum === undefined) usernum = await bser.getusernum(user);
    if (normalstat === undefined)
        normalstat = await bser.getuserstats(0, usernum);
    if (stat === undefined) stat = await bser.getuserstats(1, usernum);
    const gamesWnext = await bser.getusergames(
        usernum,
        [stat[0]['mmr'], stat[1]['mmr'], stat[2]['mmr']],
        [normalstat[0]['mmr'], normalstat[1]['mmr'], normalstat[2]['mmr']],
        next
    );
    const games = gamesWnext.slice(0, gamesWnext.length - 1);
    return {
        props: {
            stat: [...stat],
            _games: [...games],
            next:
                gamesWnext.length !== 10
                    ? gamesWnext[gamesWnext.length - 1]
                    : -1,
        },
    };
}

export default user;
