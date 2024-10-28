const Web3 = require('web3');
const fs = require('fs');
const chalk = require('chalk');
const { displayskw1 } = require('./diskw');

const CONTRACT_ADDRESS = "0xC5bf05cD32a14BFfb705Fb37a9d218895187376c";
const web3 = new Web3();
const privateKeys = fs.readFileSync('pvkey.txt', 'utf-8').split('\n').filter(Boolean);

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


async function javpayETH(numTransactions, amountETH, RPC_URL, network) {
    console.clear();
    displayskw1();
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


module.exports = { javpayETH };