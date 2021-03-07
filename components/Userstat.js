import React from 'react';
import styles from './Userstat.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const tier = [
    '아이언',
    '실버',
    '골드',
    '플레티넘',
    '다이아몬드',
    '데미갓',
    '이터니티',
];

const slider_settings = {
    arrows: false,
    dots: false,
    fade: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    lazyLoad: true,
};

function Userstat({ type, tier, mmr, top, characterstat }) {
    return (
        <div className={styles.root}>
            <p className={styles.type}>{type}</p>
            <div className={styles.stat}>
                <img
                    src={`/asset/tier/${tier[0]}.png`}
                    className={styles.tierimg}
                />
                {tier[0] !== -1 ? (
                    <div className={styles.statDetail}>
                        <div className={styles.mmrtopbox}>
                            <div className={styles.box}>
                                <p className={styles.title}>MMR</p>
                                <p className={styles.content}>{mmr}</p>
                            </div>
                            <div className={styles.box}>
                                <p className={styles.title}>상위</p>
                                <p className={styles.content}>대략 {top}</p>
                            </div>
                        </div>
                        <div className={styles.charactersStat}>
                            <Slider {...slider_settings}>
                                {characterstat.map((v, i) => (
                                    <div key={i}>
                                        <div className={styles.characterStat}>
                                            <img
                                                className={styles.characterImg}
                                                src={`/asset/halfillust/${v['characterCode']}.png`}
                                            />
                                            <div
                                                className={
                                                    styles.characterStatDetail
                                                }
                                            >
                                                <p>
                                                    {v['totalGames']}
                                                    <span> 게임</span>
                                                    <br />
                                                    <span>최대</span>{' '}
                                                    {v['maxKillings']}
                                                    <span>킬</span>
                                                    <br />
                                                    {v['wins']}{' '}
                                                    <span>우승</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}

export default Userstat;
