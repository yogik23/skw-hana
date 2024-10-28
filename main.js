const axios = require('axios');
const Web3 = require('web3');
const fs = require('fs');
const chalk = require('chalk');
const displayskw = require('./displayskw');
const displayskw1 = require('./displayskw1');
const readline = require('readline');

const CONTRACT_ADDRESS = "0xC5bf05cD32a14BFfb705Fb37a9d218895187376c";
const API_URL = "https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql";
const web3 = new Web3();
const privateKeys = fs.readFileSync('pvkey.txt', 'utf-8').split('\n').filter(Boolean);
const accessTokens = fs.readFileSync('token.txt', 'utf-8').split('\n').filter(Boolean);

const contractABI = JSON.parse(`
[
    {
        "constant": false,
        "inputs": [],
        "name": "depositETH",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]
`);

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
                process.stdout.write(chalk.hex('#FFD700')(`⏳ Delay Sebelum Transaksi Berikutnya: ${countdown} detik\r`));
                countdown--;
            }
        }, 1000);
    });
}

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

    console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════════════╗"));
    console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
    console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
    console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
    console.log(chalk.hex('#1E90FF')(` ║🏺 Total Grow: ${grow}                                     `));
    console.log(chalk.hex('#00FFFF')(` ║🏮 Total Garden: ${garden}                                  `));
    console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════════════╝"));
    console.log();

    while (grow > 0) {
        console.log(chalk.hex('#dda0dd')(`🔄 Mencoba Claim Grow`));
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
        await new Promise(resolve => setTimeout(resolve, 2000));

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

    console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════════════╗"));
    console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
    console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
    console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
    console.log(chalk.hex('#1E90FF')(` ║🏺 Total Grow: ${grow}                                     `));
    console.log(chalk.hex('#00FFFF')(` ║🏮 Total Garden: ${garden}                                  `));
    console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════════════╝"));
    console.log();

    while (grow > 0) {
        console.log(chalk.hex('#dda0dd')(`🔄 Mencoba Claim Grow`));
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
        await new Promise(resolve => setTimeout(resolve, 2000));

        const commitQuery = {
            query: "mutation commitGrowAction { commitGrowAction }",
            operationName: "commitGrowAction"
        };
        await javhd(API_URL, 'POST', commitQuery);
    }
}


async function javnosensorgarden(refreshToken) {
    console.clear(); 
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

    console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════════════╗"));
    console.log(chalk.hex('#e0ffff')(` ║💀 Akun ${xnxx}                                         `));
    console.log(chalk.hex('#FFFF00')(` ║💰 POINTS: ${balance}                                     `));
    console.log(chalk.hex('#FFD700')(` ║⚱️ Total Deposit: ${deposit}                                 `));
    console.log(chalk.hex('#1E90FF')(` ║🏺 Total Grow: ${grow}                                     `));
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

async function javpayETH(numTransactions, amountETH, RPC_URL, network) {
    const amountWei = web3.utils.toWei(amountETH.toFixed(18), 'ether');
    const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
    const nonces = {};
    web3.setProvider(new Web3.providers.HttpProvider(RPC_URL)); // Set the new RPC URL


    for (const key of privateKeys) {
        const account = web3.eth.accounts.privateKeyToAccount(key);
        nonces[account.address] = await web3.eth.getTransactionCount(account.address);

        console.log();
        console.log(chalk.hex('#FF4500')(" ╔══════════════════════════════════════════════════════════════════╗"));
        console.log(chalk.hex('#32CD32')(` ║💀 Memproses Akun ${account.address}      `));
        console.log(chalk.hex('#FFFF00')(` ║⚖️ Jumlah Transaksi: ${numTransactions}                                            `));
        console.log(chalk.hex('#00FFFF')(` ║💰 Amount yang dideposit: ${amountETH} ETH                            `));
        console.log(chalk.hex('#FF4500')(" ╚══════════════════════════════════════════════════════════════════╝"));


        for (let i = 0; i < numTransactions; i++) {
            const fromAddress = account.address;
            const shortFromAddress = `${fromAddress.slice(0, 4)}...${fromAddress.slice(-4)}`;

            try {
                console.log(chalk.hex('#1E90FF')(`\n🔄 Melakukan Tx ke ${i + 1}`));
                const transaction = {
                    from: fromAddress,
                    to: CONTRACT_ADDRESS,
                    value: amountWei,
                    gas: 100000,
                    gasPrice: await web3.eth.getGasPrice(),
                    nonce: nonces[fromAddress],
                    data: contract.methods.depositETH().encodeABI()
                };

                const signedTx = await web3.eth.accounts.signTransaction(transaction, key);
                const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                
                // Pilih URL sesuai network
                const explorerUrl = network === '1' 
                    ? `https://basescan.org/tx/${txHash.transactionHash}`
                    : `https://arbiscan.io/tx/${txHash.transactionHash}`;
                
                console.log(chalk.hex('#00FF00')(`✅ Transaksi Berhasil`));
                console.log(chalk.hex('#00FFFF')(`🔗 Rincian transaksi: ${explorerUrl}`));
                
                nonces[fromAddress] += 1;
                await startCD(10)
                console.log();

            } catch (e) {
                if (e.message.includes('nonce too low')) {
                    console.log(`Nonce terlalu rendah untuk ${shortFromAddress}. Mengambil nonce terbaru...`);
                    nonces[fromAddress] = await web3.eth.getTransactionCount(fromAddress);
                } else {
                    console.log(`Error saat mengirim transaksi dari ${shortFromAddress}: ${e.message}`);
                }
            }
        }
        console.log(chalk.hex('#90ee90')(`Akun ${account.address} Selesai\n`));
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function mainMenu() {
    console.clear();
    displayskw();
    const action = await askQuestion(chalk.hex('#90ee90')('\n\nApa yang ingin dilakukan?\n1: Melakukan Deposit\n2: Melakukan Grow dan Garden\nPilih (1/2): '));

    if (action === '1') {
        const network = await askQuestion(chalk.hex('#90ee90')('\nPilih Network:\n1: BASE\n2: ARBITRUM\nPilih (1/2): '));
        let RPC_URL;
        if (network === '1') {
            RPC_URL = "https://mainnet.base.org";
        } else if (network === '2') {
            RPC_URL = "https://arb1.arbitrum.io/rpc";
        } else {
            console.log('Pilihan tidak valid. Silakan pilih 1 atau 2.');
            rl.close();
            return;
        }

        const amount = await askQuestion(chalk.hex('#90ee90')('\nContoh : 0.000001\nAmount deposit: '));
        const transactions = await askQuestion(chalk.hex('#90ee90')('\nBerapa kali Jumlah Transaksi yang ingin dilakukan: '));
        
        await javpayETH(parseInt(transactions), parseFloat(amount), RPC_URL, network);
        
    } else if (action === '2') {
        // Menambahkan pilihan untuk Grow, Garden, atau keduanya
        const subAction = await askQuestion(chalk.hex('#90ee90')('\nApa yang ingin dilakukan?\n1: Melakukan Grow\n2: Melakukan Garden\n3: Melakukan Grow dan Garden\nPilih (1/2/3): '));

        if (subAction === '1') {
            for (const refreshToken of accessTokens) {
                await javnosensorgrow(refreshToken);
                process.exit();
            }
        } else if (subAction === '2') {
            for (const refreshToken of accessTokens) {
                await javnosensorgarden(refreshToken);
                process.exit();
            }
        } else if (subAction === '3') {
            for (const refreshToken of accessTokens) {
                await javnosensor(refreshToken);
                process.exit();
            }
        } else {
            console.log('Pilihan tidak valid. Silakan pilih 1, 2, atau 3.');
        }
    } else {
        console.log('Pilihan tidak valid. Silakan pilih 1 atau 2.');
    }

    rl.close();
}

mainMenu();
