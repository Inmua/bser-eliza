import React from 'react';
import styles from './GameHistory.module.css';

const skillString = ['D', 'T', 'Q', 'W', 'E', 'R'];

function GameHistory({
    serverName,
    seasonId,
    type,
    gameRank,
    HMMmr,
    characterNum,
    playerKill,
    playerAssistant,
    basicAttackDamageToPlayer,
    skillDamageToPlayer,
    damageToPlayer,
    skill,
    equipment,
}) {
    return (
        <div className={styles.GameHistory}>
            <img
                className={styles.characterImg}
                src={`/asset/halfillust/${characterNum}.png`}
            />
            <div
                style={{ color: fontColor(gameRank) }}
                className={styles.detail}
            >
                <div>
                    <p className={styles.typeServer}>
                        {seasonId === 0 ? '일반' : '랭크'} {type}
                        <span>{serverName.toUpperCase()}</span>
                    </p>
                </div>
                <div className={styles.subDetail}>
                    <p className={styles.gameRank}>{gameRank}등</p>
                    <p className={styles.killAssistantMmr}>
                        {playerKill} 킬 {playerAssistant} 도움
                        <br />
                        MMR {convertInttoString(HMMmr)}
                    </p>
                </div>
            </div>
            <div className={styles.skills}>
                {skill.map((v, i) => (
                    <div className={styles.skill} key={i}>
                        <p>{skillString[v]}</p>
                        <img src={`/asset/skill/${characterNum}/${v}.png`} />
                    </div>
                ))}
            </div>
            <div className={styles.items}>
                {equipment.map((v, i) =>
                    v['group'] !== -1 ? (
                        <img
                            src={`/asset/item/${v['group']}/${v['code']}.png`}
                            key={i}
                        />
                    ) : (
                        <div key={i} />
                    )
                )}
            </div>
            <div className={styles.damage}>
                <p>
                    <span>기공 </span>
                    {basicAttackDamageToPlayer}
                    <br /> <span>스공 </span>
                    {skillDamageToPlayer} <br /> <span>총합 </span>
                    {damageToPlayer}
                    <span> 피해</span>
                </p>
            </div>
        </div>
    );
}

function fontColor(rank) {
    if (rank === 1) {
        return '#ffd86d';
    } else if (rank === 2) {
        return '#ffeab0';
    } else {
        return 'white';
    }
}

function convertInttoString(i) {
    let result = i;
    if (result > 0) {
        result = `+${i}`;
    } else {
        result = `${result}`;
    }
    return result;
}

export default GameHistory;
