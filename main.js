const chalk = require('chalk');
const { displayskw } = require('./skw/diskw');
const { javpayETH } = require('./skw/javETH');
const { accessTokens, javnosensor, javnosensorgarden, javnosensorgrow } = require('./skw/jav');
const readline = require('readline');


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
