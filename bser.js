import axios from 'axios';
import * as ItemWeapon from './json/ItemWeapon.json';
import * as ItemArmor from './json/ItemArmor.json';

export async function getdata(metaType) {
    const result = await axios.get(
        encodeURI(`https://open-api.bser.io/v1/data/${metaType}`),
        {
            headers: {
                accept: 'application/json',
                'x-api-key': process.env.API_KEY,
            },
        }
    );
    return result.data;
}

export async function getranktop(matchingTeamMode, seasonId) {
    const result = await axios.get(
        encodeURI(
            `https://open-api.bser.io/v1/rank/top/${seasonId}/${matchingTeamMode}`
        ),
        {
            headers: {
                accept: 'application/json',
                'x-api-key': process.env.API_KEY,
            },
        }
    );
    return result.data;
}

export async function getrankuser(matchingTeamMode, seasonId, userNum) {
    const result = await axios.get(
        encodeURI(
            `https://open-api.bser.io/v1/rank/${userNum}/${seasonId}/${matchingTeamMode}`
        ),
        {
            headers: {
                accept: 'application/json',
                'x-api-key': process.env.API_KEY,
            },
        }
    );
    return result.data;
}

export async function getusergames(
    userNum,
    seasonmmr,
    normalmmr,
    nextPosition
) {
    const url = nextPosition
        ? `https://open-api.bser.io/v1/user/games/${userNum}?next=${nextPosition}`
        : `https://open-api.bser.io/v1/user/games/${userNum}`;
    const result = await axios.get(encodeURI(url), {
        headers: {
            accept: 'application/json',
            'x-api-key': process.env.API_KEY,
        },
    });

    const { userGames, next } = result.data;
    let outcome = userGames.map((userGame, userGameIndex) => {
        const {
            skillOrderInfo,
            equipment,
            seasonId,
            matchingTeamMode,
            basicAttackDamageToPlayer,
            skillDamageToPlayer,
            damageToPlayer,
            serverName,
            gameRank,
            characterNum,
            playerKill,
            playerAssistant,
        } = userGame;
        let skill = [
            // ['0', 0], //d
            ['1', 1], //t
            ['2', 0], //q
            ['3', 0], //w
            ['4', 0], //e
            // ['5', 0], //r
        ];
        Object.values(skillOrderInfo).forEach((v) => {
            const skillKey = v.toString().split('')[4];
            if (
                skillKey === '1' ||
                skillKey === '2' ||
                skillKey === '3' ||
                skillKey === '4'
            ) {
                const whereKey = skill.findIndex((e) => e[0] === skillKey);
                skill[whereKey][1]++;
                if (skillKey === '1' && skill[whereKey][1] === 3) {
                    skill[whereKey][1] = 5;
                }
                skill.sort((a, b) => b[1] - a[1]);
            }
        });

        skill = skill.map((i) => i[0]);

        let modi_equi = [];
        const entriesEqui = Object.entries(equipment);
        const keyEqui = Object.keys(equipment);
        for (let i = 0; i < 6; i++) {
            if (keyEqui.includes(i.toString())) {
                const where = entriesEqui.find((e) => e[0] === i.toString());
                const workPosition = i === 0 ? ItemWeapon : ItemArmor;
                const item = workPosition.default.data.find(
                    (e) => e['code'] === where[1]
                );
                modi_equi.push({
                    group: ~~(item['code'] / 1000),
                    code: item['code'] % 1000,
                    itemGrade: item['itemGrade'],
                });
            } else {
                modi_equi.push({
                    group: -1,
                    code: -1,
                    itemGrade: -1,
                });
            }
        }

        let type, HMMmr;

        const workMmr = seasonId !== 0 ? seasonmmr : normalmmr;
        switch (matchingTeamMode) {
            case 1:
                type = '솔로';
                HMMmr = calcMmr(workMmr[0], userGames, userGameIndex, 1);
                break;
            case 2:
                type = '듀오';
                HMMmr = calcMmr(workMmr[1], userGames, userGameIndex, 2);
                break;
            case 3:
                type = '스쿼드';
                HMMmr = calcMmr(workMmr[2], userGames, userGameIndex, 3);
                break;
        }

        return {
            serverName,
            seasonId,
            type,
            gameRank,
            HMMmr,
            characterNum,
            playerKill,
            playerAssistant,
            basicAttackDamageToPlayer:
                basicAttackDamageToPlayer !== undefined
                    ? basicAttackDamageToPlayer
                    : '정보없음',
            skillDamageToPlayer:
                skillDamageToPlayer !== undefined
                    ? skillDamageToPlayer
                    : '정보없음',
            damageToPlayer,
            skill,
            equipment: modi_equi,
        };
    });
    outcome = [...outcome, next];
    return outcome;
}

function calcMmr(mmr, userGames, userGameIndex, matchingTeamMode) {
    const seasonId = userGames[userGameIndex]['seasonId'];
    const spliceUserGames = userGames.slice(0, userGameIndex);
    const key = spliceUserGames
        .slice()
        .reverse()
        .find(
            (i) =>
                i['matchingTeamMode'] === matchingTeamMode &&
                i['seasonId'] === seasonId
        );
    if (key === undefined) {
        return mmr - userGames[userGameIndex]['mmrBefore'];
    } else {
        if (key['mmrBefore'] - userGames[userGameIndex]['mmrBefore'] === 42) {
        }
        return key['mmrBefore'] - userGames[userGameIndex]['mmrBefore'];
    }
}

export async function getusernum(query) {
    const result = await axios.get(
        encodeURI(`https://open-api.bser.io/v1/user/nickname?query=${query}`),
        {
            headers: {
                accept: 'application/json',
                'x-api-key': process.env.API_KEY,
            },
        }
    );
    return result.data.user.userNum;
}

export async function getuserstats(seasonId, userNum) {
    const result = await axios.get(
        encodeURI(
            `https://open-api.bser.io/v1/user/stats/${userNum}/${seasonId}`
        ),
        {
            headers: {
                accept: 'application/json',
                'x-api-key': process.env.API_KEY,
            },
        }
    );

    let { userStats } = result.data;

    const type = ['솔로', '듀오', '스쿼드'];

    if (userStats) {
        if (userStats.length !== 3) {
            var matchingTeamMode = [1, 2, 3];
            userStats.forEach((v) => {
                matchingTeamMode.splice(
                    matchingTeamMode.indexOf(v[matchingTeamMode]),
                    1
                );
            });
            matchingTeamMode.forEach((v, i) => {
                userStats.push({
                    matchingTeamMode: v,
                    new: 1,
                });
            });
        }

        userStats.sort((a, b) => a['matchingTeamMode'] - b['matchingTeamMode']);

        userStats = userStats.map((v, i) =>
            v['new'] !== undefined
                ? {
                      type: type[i],
                      tier: [-1, 0],
                      mmr: -1,
                      top: -1,
                      charactersStat: -1,
                  }
                : {
                      type: type[i],
                      tier:
                          ~~(v['mmr'] / 400) > 7
                              ? [7, 1]
                              : [
                                    ~~(v['mmr'] / 400),
                                    4 - ~~((v['mmr'] % 400) / 100),
                                ],
                      mmr: v['mmr'],
                      top: ((v['rank'] / v['rankSize']) * 100).toFixed(2),
                      characterStats: v['characterStats'],
                  }
        );
        return userStats;
    } else {
        let userStatsAllNo = [];
        for (let i = 0; i < 3; i++) {
            userStatsAllNo[i] = {
                type: type[i],
                tier: [-1, 0],
                mmr: -1,
                top: -1,
                charactersStat: -1,
            };
        }
        return userStatsAllNo;
    }
}
