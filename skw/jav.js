const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
const { displayskw1 } = require('./diskw');

const accessTokens = fs.readFileSync('token.txt', 'utf-8').split('\n').filter(Boolean);
const API_URL = "https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql";

const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
};

async function javhd(url, method, payloadData) {
    const response = await axios({
        method,
        url,
        headers,
        data: payloadData
    });
    return response.data;
}

async function javthresome(refreshToken) {
    const apiKey = "AIzaSyDipzN0VRfTPnMGhQ5PSzO27Cxm3DohJGY";
    const response = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, 
        `grant_type=refresh_token&refresh_token=${refreshToken}`, 
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data.access_token;
}

async function javnosensor(refreshToken) {
    console.clear();
    displayskw1();
    console.log(chalk.hex('#e0ffff')(`\n\nMencoba Login Mendapatkan DATA Tunggu Sebentar!`));
    const newAccessToken = await javthresome(refreshToken);
    headers['Authorization'] = `Bearer ${newAccessToken}`;

    const infoQuery = {
        query: "query CurrentUser { currentUser { id sub name iconPath depositCount totalPoint evmAddress { userId address } inviter { id name } } }",
        operationName: "CurrentUser"
    };
    const info = await javhd(API_URL, 'POST', infoQuery);

    let balance = info.data.currentUser.totalPoint;
    let deposit = info.data.currentUser.depositCount;
    let xnxx = info.data.currentUser.evmAddress.address;

    const profileQuery = {
        query: "query GetGardenForCurrentUser { getGardenForCurrentUser { id inviteCode gardenDepositCount gardenStatus { id activeEpoch growActionCount gardenRewardActionCount } gardenMilestoneRewardInfo { id gardenDepositCountWhenLastCalculated lastAcquiredAt createdAt } gardenMembers { id sub name iconPath depositCount } } }",
        operationName: "GetGardenForCurrentUser"
    };
    const profile = await javhd(API_URL, 'POST', profileQuery);

    let grow = profile.data.getGardenForCurrentUser.gardenStatus.growActionCount;
    let garden = profile.data.getGardenForCurrentUser.gardenStatus.gardenRewardActionCount;

    console.clear();
    displayskw1();
    console.log(`\n`);
    console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════════════╗"));
    console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
    console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
    console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
    console.log(chalk.hex('#1E90FF')(` ║🏺 Total Grow: ${grow}                                     `));
    console.log(chalk.hex('#00FFFF')(` ║🏮 Total Garden: ${garden}                                  `));
    console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════════════╝"));
    console.log();

    while (grow > 0) {
        console.log(chalk.hex('#dda0dd')(`🔄 Mencoba Mengklaim Grow`));
        await new Promise(resolve => setTimeout(resolve, 2000));
        const actionQuery = {
            query: "mutation issueGrowAction { issueGrowAction }",
            operationName: "issueGrowAction"
        };
        const mine = await javhd(API_URL, 'POST', actionQuery);
        const reward = mine.data.issueGrowAction;
        balance += reward;
        grow -= 1;

        console.log(chalk.hex('#00FF00')(`✅ Berhasil Mendapatkan ${reward} Point`));
        console.log(chalk.hex('#FFD700')(`💰 Total Point: ${balance}`));
        console.log(chalk.hex('#006400')(`🏺 Grow Tersisa: ${grow}\n`));

        const commitQuery = {
            query: "mutation commitGrowAction { commitGrowAction }",
            operationName: "commitGrowAction"
        };
        await javhd(API_URL, 'POST', commitQuery);
    }

    while (garden >= 10) {
        const gardenActionQuery = {
            query: "mutation executeGardenRewardAction($limit: Int!) { executeGardenRewardAction(limit: $limit) { data { cardId group } isNew } }",
            variables: { limit: 10 },
            operationName: "executeGardenRewardAction"
        };
        const mineGarden = await javhd(API_URL, 'POST', gardenActionQuery);
        const cardIds = mineGarden.data.executeGardenRewardAction.data.map(item => item.cardId);
        console.log(`Opened Garden: ${cardIds}`);
        garden -= 10;
    }
}

async function javnosensorgrow(refreshToken) {
    console.clear();
    displayskw1();
    console.log(chalk.hex('#e0ffff')(`\n\nMencoba Login Mendapatkan DATA Tunggu Sebentar!`));
    const newAccessToken = await javthresome(refreshToken);
    headers['Authorization'] = `Bearer ${newAccessToken}`;

    const infoQuery = {
        query: "query CurrentUser { currentUser { id sub name iconPath depositCount totalPoint evmAddress { userId address } inviter { id name } } }",
        operationName: "CurrentUser"
    };
    const info = await javhd(API_URL, 'POST', infoQuery);

    let balance = info.data.currentUser.totalPoint;
    let deposit = info.data.currentUser.depositCount;
    let xnxx = info.data.currentUser.evmAddress.address;

    const profileQuery = {
        query: "query GetGardenForCurrentUser { getGardenForCurrentUser { id inviteCode gardenDepositCount gardenStatus { id activeEpoch growActionCount gardenRewardActionCount } gardenMilestoneRewardInfo { id gardenDepositCountWhenLastCalculated lastAcquiredAt createdAt } gardenMembers { id sub name iconPath depositCount } } }",
        operationName: "GetGardenForCurrentUser"
    };
    const profile = await javhd(API_URL, 'POST', profileQuery);

    let grow = profile.data.getGardenForCurrentUser.gardenStatus.growActionCount;

    console.clear();
    displayskw1();
    console.log(`\n`);
    console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════════════╗"));
    console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
    console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
    console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
    console.log(chalk.hex('#1E90FF')(` ║🏺 Total Grow: ${grow}                                     `));
    console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════════════╝"));
    console.log();

    while (grow > 0) {
        console.log(chalk.hex('#dda0dd')(`🔄 Mencoba Mengklaim Grow`));
        await new Promise(resolve => setTimeout(resolve, 2000));
        const actionQuery = {
            query: "mutation issueGrowAction { issueGrowAction }",
            operationName: "issueGrowAction"
        };
        const mine = await javhd(API_URL, 'POST', actionQuery);
        const reward = mine.data.issueGrowAction;
        balance += reward;
        grow -= 1;

        console.log(chalk.hex('#00FF00')(`✅ Berhasil Mendapatkan ${reward} Point`));
        console.log(chalk.hex('#FFD700')(`💰 Total Point: ${balance}`));
        console.log(chalk.hex('#006400')(`🏺 Grow Tersisa: ${grow}\n`));

        const commitQuery = {
            query: "mutation commitGrowAction { commitGrowAction }",
            operationName: "commitGrowAction"
        };
        await javhd(API_URL, 'POST', commitQuery);
    }
}


async function javnosensorgarden(refreshToken) {
    console.clear();
    displayskw1();
    console.log(chalk.hex('#e0ffff')(`\n\nMencoba Login Mendapatkan DATA Tunggu Sebentar!`));
    const newAccessToken = await javthresome(refreshToken);
    headers['Authorization'] = `Bearer ${newAccessToken}`;

    const infoQuery = {
        query: "query CurrentUser { currentUser { id sub name iconPath depositCount totalPoint evmAddress { userId address } inviter { id name } } }",
        operationName: "CurrentUser"
    };
    const info = await javhd(API_URL, 'POST', infoQuery);

    let balance = info.data.currentUser.totalPoint;
    let deposit = info.data.currentUser.depositCount;
    let xnxx = info.data.currentUser.evmAddress.address;

    const profileQuery = {
        query: "query GetGardenForCurrentUser { getGardenForCurrentUser { id inviteCode gardenDepositCount gardenStatus { id activeEpoch growActionCount gardenRewardActionCount } gardenMilestoneRewardInfo { id gardenDepositCountWhenLastCalculated lastAcquiredAt createdAt } gardenMembers { id sub name iconPath depositCount } } }",
        operationName: "GetGardenForCurrentUser"
    };
    const profile = await javhd(API_URL, 'POST', profileQuery);

    let garden = profile.data.getGardenForCurrentUser.gardenStatus.gardenRewardActionCount;

    console.clear();
    displayskw1();
    console.log(`\n`);
    console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════════════╗"));
    console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
    console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
    console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
    console.log(chalk.hex('#00FFFF')(` ║🏮 Total Garden: ${garden}                                  `));
    console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════════════╝"));
    console.log();

    while (garden >= 10) {
        const gardenActionQuery = {
            query: "mutation executeGardenRewardAction($limit: Int!) { executeGardenRewardAction(limit: $limit) { data { cardId group } isNew } }",
            variables: { limit: 10 },
            operationName: "executeGardenRewardAction"
        };
        const mineGarden = await javhd(API_URL, 'POST', gardenActionQuery);
        const cardIds = mineGarden.data.executeGardenRewardAction.data.map(item => item.cardId);
        console.log(`Opened Garden: ${cardIds}`);
        garden -= 10;
    }
}

module.exports = {
    accessTokens,
    javnosensor,
    javnosensorgrow,
    javnosensorgarden
};
