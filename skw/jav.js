const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
require('dotenv').config();
const { displayskw1 } = require('./diskw');

const data = fs.readFileSync('dataSKW.json', 'utf-8');
const credentials = JSON.parse(data);
const accessTokens = credentials.map(cred => cred.accessToken);
const API_URL = "https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql";

const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
};

async function javhd(url, method, payloadData) {
    const config = {
        method,
        url,
        headers,
        data: payloadData
    };

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (attempt === 2) {
                throw error;
            }
            console.log(`Retrying... (${attempt + 1}/3)`);
        }
    }
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
    console.log(chalk.hex('#e0ffff')(`\n\nMencoba Login dan mendapatkan DATA Tunggu Sebentar!`));

    try {
        const newAccessToken = await javthresome(refreshToken);
        headers['Authorization'] = `Bearer ${newAccessToken}`;
    } catch (error) {
        console.error(chalk.hex('#FF4500')(`Error saat mendapatkan token: ${error.message}`));
        return;
    }

    const infoQuery = {
        query: "query CurrentUser { currentUser { id sub name iconPath depositCount totalPoint evmAddress { userId address } inviter { id name } } }",
        operationName: "CurrentUser"
    };

    let info;
    try {
        info = await javhd(API_URL, 'POST', infoQuery);
    } catch (error) {
        console.error(chalk.hex('#FF4500')(`Error saat mendapatkan informasi pengguna: ${error.message}`));
        return;
    }

    let balance = info.data.currentUser.totalPoint;
    let deposit = info.data.currentUser.depositCount;
    let xnxx = info.data.currentUser.evmAddress.address;

    const profileQuery = {
        query: "query GetGardenForCurrentUser { getGardenForCurrentUser { id inviteCode gardenDepositCount gardenStatus { id activeEpoch growActionCount gardenRewardActionCount } gardenMilestoneRewardInfo { id gardenDepositCountWhenLastCalculated lastAcquiredAt createdAt } gardenMembers { id sub name iconPath depositCount } } }",
        operationName: "GetGardenForCurrentUser"
    };

    let profile;
    try {
        profile = await javhd(API_URL, 'POST', profileQuery);
    } catch (error) {
        console.error(chalk.hex('#FF4500')(`Error saat mendapatkan profil pengguna: ${error.message}`));
        return;
    }

    let grow = profile.data.getGardenForCurrentUser.gardenStatus.growActionCount;
    let garden = profile.data.getGardenForCurrentUser.gardenStatus.gardenRewardActionCount;

    console.log(`\n`);
    console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════╗"));
    console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
    console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
    console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
    console.log(chalk.hex('#1E90FF')(` ║🏺 Total Grow: ${grow}                                     `));
    console.log(chalk.hex('#00FFFF')(` ║🏮 Total Garden: ${garden}                                  `));
    console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════╝"));
    console.log();

    while (grow > 0) {
        console.log(chalk.hex('#dda0dd')(`🔄 Mencoba Mengklaim Grow`));
        await new Promise(resolve => setTimeout(resolve, 2000));

        const actionQuery = {
            query: "mutation issueGrowAction { issueGrowAction }",
            operationName: "issueGrowAction"
        };

        let mine;
        try {
            mine = await javhd(API_URL, 'POST', actionQuery);
        } catch (error) {
            console.error(chalk.hex('#FF4500')(`Error saat melakukan klaim Grow: ${error.message}`));
            break;
        }

        const reward = mine.data.issueGrowAction;
        balance += reward;
        grow -= 1;

        console.log(chalk.hex('#00FF00')(`✅ Berhasil Mendapatkan ${reward} Point`));
        console.log(chalk.hex('#FFD700')(`💰 Total Point: ${balance}`));
        console.log(chalk.hex('#e0ffff')(`🏺 Grow Tersisa: ${grow}`));

        const commitQuery = {
            query: "mutation commitGrowAction { commitGrowAction }",
            operationName: "commitGrowAction"
        };
        console.log(chalk.hex('#FF4500')(`⏳ Menunggu Proses berikutnya...\n`));
        await javhd(API_URL, 'POST', commitQuery);
    }

    while (garden >= 10) {
        const gardenActionQuery = {
            query: "mutation executeGardenRewardAction($limit: Int!) { executeGardenRewardAction(limit: $limit) { data { cardId group } isNew } }",
            variables: { limit: 10 },
            operationName: "executeGardenRewardAction"
        };
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(chalk.hex('#dda0dd')(`🔄 Melakukan Draw Garden/Hanafuda`));

        let mineGarden;
        try {
            mineGarden = await javhd(API_URL, 'POST', gardenActionQuery);
        } catch (error) {
            console.error(chalk.hex('#FF4500')(`Error saat melakukan Draw Garden: ${error.message}`));
            break;
        }

        if (Array.isArray(mineGarden.data.executeGardenRewardAction)) {
            const cardIds = mineGarden.data.executeGardenRewardAction.map(item => item.data.cardId);
            console.log(chalk.hex('#00FF00')(`🧧 Berhasil Mendapatkan: ${cardIds}`));
            console.log(chalk.hex('#FF4500')(`⏳ Menunggu Proses berikutnya...\n`));
        } else {
            console.log("executeGardenRewardAction is not an array.");
        }
        garden -= 10;
    }
}

async function javnosensorgrow(refreshToken) {
    while (true) { 
        console.log(chalk.hex('#e0ffff')(`\n\nMencoba Login dan mendapatkan DATA Tunggu Sebentar!`));
        let newAccessToken;

        try {
            newAccessToken = await javthresome(refreshToken);
            headers['Authorization'] = `Bearer ${newAccessToken}`;
        } catch (error) {
            console.error(chalk.red(`❌ Gagal mendapatkan token akses: ${error.message}`));
            continue;
        }

        const infoQuery = {
            query: "query CurrentUser { currentUser { id sub name iconPath depositCount totalPoint evmAddress { userId address } inviter { id name } } }",
            operationName: "CurrentUser"
        };

        let info;
        try {
            info = await javhd(API_URL, 'POST', infoQuery);
        } catch (error) {
            console.error(chalk.red(`❌ Gagal mendapatkan informasi pengguna: ${error.message}`));
            continue;
        }

        let balance = info.data.currentUser.totalPoint;
        let deposit = info.data.currentUser.depositCount;
        let xnxx = info.data.currentUser.evmAddress.address;

        const profileQuery = {
            query: "query GetGardenForCurrentUser { getGardenForCurrentUser { id inviteCode gardenDepositCount gardenStatus { id activeEpoch growActionCount gardenRewardActionCount } gardenMilestoneRewardInfo { id gardenDepositCountWhenLastCalculated lastAcquiredAt createdAt } gardenMembers { id sub name iconPath depositCount } } }",
            operationName: "GetGardenForCurrentUser"
        };

        let profile;
        try {
            profile = await javhd(API_URL, 'POST', profileQuery);
        } catch (error) {
            console.error(chalk.red(`❌ Gagal mendapatkan data kebun: ${error.message}`));
            continue;
        }

        let grow = profile.data.getGardenForCurrentUser.gardenStatus.growActionCount;

        console.log(`\n`);
        console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════╗"));
        console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
        console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
        console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
        console.log(chalk.hex('#1E90FF')(` ║🏺 Total Grow: ${grow}                                     `));
        console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════╝"));
        console.log();

        let hasClaimedGrow = false; // Menandai apakah klaim berhasil

        while (grow > 0) {
            console.log(chalk.hex('#dda0dd')(`🔄 Mencoba Mengklaim Grow`));
            const actionQuery = {
                query: "mutation issueGrowAction { issueGrowAction }",
                operationName: "issueGrowAction"
            };

            let mine;
            try {
                mine = await javhd(API_URL, 'POST', actionQuery);
            } catch (error) {
                console.error(chalk.red(`❌ Gagal mengklaim grow: ${error.message}`));
                break;
            }

            const reward = mine.data.issueGrowAction;
            balance += reward;
            grow -= 1;
            hasClaimedGrow = true;

            console.log(chalk.hex('#00FF00')(`✅ Berhasil Mendapatkan ${reward} Point`));
            console.log(chalk.hex('#FFD700')(`💰 Total Point: ${balance}`));
            console.log(chalk.hex('#e0ffff')(`🏺 Grow Tersisa: ${grow}`));

            const commitQuery = {
                query: "mutation commitGrowAction { commitGrowAction }",
                operationName: "commitGrowAction"
            };

            console.log(chalk.hex('#FF4500')(`⏳ Menunggu Proses berikutnya...\n`));
            try {
                await javhd(API_URL, 'POST', commitQuery);
            } catch (error) {
                console.error(chalk.red(`❌ Gagal melakukan komit grow: ${error.message}`));
                break;
            }
        }

        if (hasClaimedGrow) {
            await skandal();
        }

        break;
    }
}

async function javnosensorgarden(refreshToken) {
    console.log(chalk.hex('#e0ffff')(`\n\nMencoba Login dan Mendapatkan DATA Tunggu Sebentar!`));
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

    console.log(`\n`);
    console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════╗"));
    console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
    console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
    console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
    console.log(chalk.hex('#00FFFF')(` ║🏮 Total Garden: ${garden}                                  `));
    console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════╝"));
    console.log();

    while (garden >= 10) {
        const gardenActionQuery = {
            query: "mutation executeGardenRewardAction($limit: Int!) { executeGardenRewardAction(limit: $limit) { data { cardId group } isNew } }",
            variables: { limit: 10 },
            operationName: "executeGardenRewardAction"
        };
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(chalk.hex('#dda0dd')(`🔄 Melakukan Draw Garden/Hanafuda`));
        const mineGarden = await javhd(API_URL, 'POST', gardenActionQuery);
        if (Array.isArray(mineGarden.data.executeGardenRewardAction)) {
            const cardIds = mineGarden.data.executeGardenRewardAction.map(item => item.data.cardId);
            console.log(chalk.hex('#00FF00')(`🧧 Berhasil Mendapatkan: ${cardIds}`));
            console.log(chalk.hex('#FF4500')(`⏳ Menunggu Proses berikutnya...\n`));
        } else {
            console.log("executeGardenRewardAction is not an array.");
        }
        garden -= 10;
    }
}

async function ahKimochi(refreshToken) {
    try {
        const newAccessToken = await javthresome(refreshToken);
        headers['Authorization'] = `Bearer ${newAccessToken}`;
    } catch (error) {
        console.error(chalk.hex('#FF4500')(`Error saat mendapatkan token: ${error.message}`));
        return null;
    }

    const infoQuery = {
        query: "query CurrentUser { currentUser { totalPoint } }",
        operationName: "CurrentUser"
    };

    let info;
    try {
        info = await javhd(API_URL, 'POST', infoQuery);
    } catch (error) {
        console.error(chalk.hex('#FF4500')(`Error saat mendapatkan informasi pengguna: ${error.message}`));
        return null;
    }

    return { kimochi: info.data.currentUser.totalPoint };
}

async function sendToTelegram(totalAkun, totalBalance) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const date = new Date().toLocaleDateString('id-ID');
  const message = `🚀 *HanaFuda Report ${date}*\n\n` +
                  `╔════════════════════════════╗\n` +
                  `    ➤ *Total Akun	:* ${totalAkun}\n` +
                  `    ➤ *Total Balance	:* ${totalBalance.toLocaleString()}\n` +
                  `╠════════════════════════════╣\n` +
                  `         ✧✧✧ *SKW Airdrop Hunter* ✧✧✧\n` +
                  `╚════════════════════════════╝\n`;

  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'MarkdownV2',
    });
    console.log(chalk.green('Pesan berhasil dikirim ke Telegram.'));
  } catch (error) {
    console.error('Error saat mengirim pesan ke Telegram:', error);
  }
}

async function skandal() {
    console.log();
    let totalBalance = 0;
    let totalAkun = 0;

    try {
        for (const refreshToken of accessTokens) {
            const accountInfo = await ahKimochi(refreshToken);
            if (accountInfo) {
                totalBalance += accountInfo.kimochi;
                totalAkun += 1;
            } else {
                console.log(chalk.hex('#FF4500')(`Tidak dapat memperbarui total point untuk akun dengan token: ${refreshToken}`));
            }
        }

        console.log(chalk.hex('#FFD700')("╔═══════════════════════════════════════════════════════════════╗"));
        console.log(chalk.hex('#FFA500')(`🤖  ➤ Total Semua Akun         : ${totalAkun}`));
        console.log(chalk.hex('#FFD700')(`💰 ➤ Total Semua Point       : ${totalBalance}`));
        console.log(chalk.hex('#8A2BE2')("╠═══════════════════════════════════════════════════════════════╣"));
        console.log(chalk.hex('#87CEFA')(`         🌟  ✧✧✧   SKW Airdrop Hunter   ✧✧✧`));
        console.log(chalk.hex('#8A2BE2')("╠═══════════════════════════════════════════════════════════════╣"));
        console.log(chalk.hex('#32CD32')(`✅  Proses semua akun selesai. Menunggu delay sebelum mengulang`));
        console.log(chalk.hex('#FFD700')("╚═══════════════════════════════════════════════════════════════╝"));
      
        const sendTelegramMessage = process.env.SEND_TELEGRAM_MESSAGE === 'true';
        if (sendTelegramMessage) {
            await sendToTelegram(totalAkun, totalBalance);
        }
    } catch (error) {
        console.error(chalk.hex('#FF4500')(`❌ Error saat memulai bot: ${error.message}`));
    }
}

async function startCD(seconds) {
    return new Promise((resolve) => {
        let countdown = seconds;

        const countdownInterval = setInterval(() => {
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                resolve();
            } else {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(chalk.hex('#FFD700')(`⏳ Delay Sebelum Claim Berikutnya: ${countdown} detik\r`));
                countdown--;
            }
        }, 1000);
    });
}

async function stepsisbigtits() {
    console.clear();
    displayskw1();

    while (true) {
        try {
            for (const refreshToken of accessTokens) {
                await javnosensorgrow(refreshToken);
            }
            await startCD(60);
        } catch (error) {
            console.error(chalk.hex('#FF4500')(`❌ Error saat memulai bot: ${error.message}`));
        }
    }
}

module.exports = {
    ahKimochi,
    accessTokens,
    javnosensor,
    javnosensorgrow,
    stepsisbigtits,
    javnosensorgarden
};
