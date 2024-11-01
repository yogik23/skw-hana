const chalk = require('chalk');
const { displayskw, displayskw1 } = require('./skw/diskw');
const { stepsisbigtits } = require('./skw/stepsisbigtits');
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

    const action = await askQuestion(chalk.hex('#32CD32')('\n\nApa yang ingin dilakukan?') + 
                                     chalk.hex('#1E90FF')('\n1: Melakukan Deposit') + 
                                     chalk.hex('#00CED1')('\n2: Melakukan Grow dan Garden') + 
                                     chalk.hex('#FFA500')('\n3: Otomatis Claim Grow Setiap Jam') + 
                                     chalk.hex('#32CD32')('\nPilih (1/2/3): '));

    if (action === '1') {
        const network = await askQuestion(chalk.hex('#32CD32')('\nPilih Network:') + 
                                          chalk.hex('#1E90FF')('\n1: BASE') + 
                                          chalk.hex('#00CED1')('\n2: ARBITRUM') + 
                                          chalk.hex('#32CD32')('\nPilih (1/2): '));
        let RPC_URL;
        let SKWT;
        if (network === '1') {
            RPC_URL = "https://mainnet.base.org";
            SKWT = "BASE";
        } else if (network === '2') {
            RPC_URL = "https://arb1.arbitrum.io/rpc";
            SKWT = "ARB";
        } else {
            console.log(chalk.red('Pilihan tidak valid. Silakan pilih 1 atau 2.'));
            rl.close();
            return;
        }

        const amount = await askQuestion(chalk.hex('#32CD32')('\nContoh : 0.000001') + 
                                         chalk.hex('#FFA500')('\nAmount deposit: '));
        const transactions = await askQuestion(chalk.hex('#32CD32')('\nBerapa kali Jumlah Transaksi yang ingin dilakukan: '));
        
        console.clear();
        displayskw1();
        await javpayETH(parseInt(transactions), parseFloat(amount), RPC_URL, network, SKWT);
        
    } else if (action === '2') {
        const subAction = await askQuestion(chalk.hex('#32CD32')('\nApa yang ingin dilakukan?') + 
                                            chalk.hex('#1E90FF')('\n1: Melakukan Grow') + 
                                            chalk.hex('#00CED1')('\n2: Melakukan Garden') + 
                                            chalk.hex('#FFA500')('\n3: Melakukan Grow dan Garden') + 
                                            chalk.hex('#32CD32')('\nPilih (1/2/3): '));

        if (subAction === '1') {
            for (const refreshToken of accessTokens) {
                console.clear();
                displayskw1();
                await javnosensorgrow(refreshToken);
            }
            console.log(chalk.hex('#00FF00')(`Semua Akun Selesai diProses by SKW`));
            process.exit();
        } else if (subAction === '2') {
            for (const refreshToken of accessTokens) {
                console.clear();
                displayskw1();
                await javnosensorgarden(refreshToken);
            }
            console.log(chalk.hex('#00FF00')(`Semua Akun Selesai diProses by SKW`));
            process.exit();
        } else if (subAction === '3') {
            for (const refreshToken of accessTokens) {
                console.clear();
                displayskw1();
                await javnosensor(refreshToken);
            }
            console.log(chalk.hex('#00FF00')(`Semua Akun Selesai diProses by SKW`));
            process.exit();
        } else {
            console.log(chalk.red('Pilihan tidak valid. Silakan pilih 1, 2, atau 3.'));
        }

    } else if (action === '3') {
        await stepsisbigtits();
    } else {
        console.log(chalk.red('Pilihan tidak valid. Silakan pilih 1, 2, atau 3.'));
    }

    rl.close();
}


mainMenu();
