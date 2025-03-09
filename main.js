const chalk = require('chalk');
const { displayskw, displayskw1 } = require('./skw/diskw');
const { javpayETH } = require('./skw/javETH');
const { ethbos, stepsisbigtits, javnosensorgrow } = require('./skw/jav');
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
                                     chalk.hex('#00CED1')('\n2: Otomatis Claim Semua Grow Setiap Jam') + 
                                     chalk.hex('#dda0dd')('\n3: Claim Garden/NFT') + 
                                     chalk.hex('#FFA500')('\n4: Eth Gratis dari Prabowo') + 
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
        await stepsisbigtits();

    } else if (action === '3') {
        await javnosensorgrow();

    } else if (action === '4') {
        await ethbos();
    } else {
        console.log(chalk.red('Pilihan tidak valid. Silakan pilih 1, 2, atau 3.'));
    }

    rl.close();
}


mainMenu();
