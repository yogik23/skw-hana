const Web3 = require('web3');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

const data = fs.readFileSync('dataSKW.json', 'utf-8');
const credentials = JSON.parse(data);
const privateKeys = credentials.map(cred => cred.privateKey);
const CONTRACT_ADDRESS = "0xC5bf05cD32a14BFfb705Fb37a9d218895187376c";
const web3 = new Web3();

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

async function getETHPrice() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        return response.data.ethereum.usd;
    } catch (error) {
        console.error('Error mendapatkan harga ETH:', error);
        return null;
    }
}

async function javpayETH(numTransactions, amountETH, RPC_URL, network, SKWT) {
    const ethPrice = await getETHPrice();
    const amountWei = web3.utils.toWei(amountETH.toFixed(18), 'ether');
    const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
    const nonces = {};
    web3.setProvider(new Web3.providers.HttpProvider(RPC_URL));

    const gasPrice = await web3.eth.getGasPrice();
    const GAS_LIMIT = 300000;
    const MAX_PRIORITY_FEE_PER_GAS = web3.utils.toWei('0.05', 'gwei');
    const MAX_FEE_PER_GAS = web3.utils.toWei('0.1', 'gwei');

    for (const key of privateKeys) {
        const account = web3.eth.accounts.privateKeyToAccount(key);
        nonces[account.address] = await web3.eth.getTransactionCount(account.address);
        
        let balanceWei;
        try {
            balanceWei = await web3.eth.getBalance(account.address);
        } catch (error) {
            console.log(`Error saat mendapatkan saldo untuk ${account.address}: ${error.message}`);
            continue;
        }

        const balanceETH = web3.utils.fromWei(balanceWei, 'ether');
        const ETHUSD = (balanceETH * ethPrice).toFixed(4);
        const depoUSD = (amountETH * ethPrice).toFixed(4);

        console.log();
        console.log(chalk.hex('#FFA500')(" ╔══════════════════════════════════════════════════════════════════╗"));
        console.log(chalk.hex('#32CD32')(` ║💀 Memproses Akun ${account.address}      `));
        console.log(chalk.hex('#FFD700')(` ║💰 Saldo ETH ${SKWT} :  ${balanceETH} ($${ETHUSD})     `));
        console.log(chalk.hex('#1E90FF')(` ║⚖️ Jumlah Transaksi: ${numTransactions}                                            `));
        console.log(chalk.hex('#FF1493')(` ║💸 Amount yang dideposit: ${amountETH} ETH ($${depoUSD})                           `));
        console.log(chalk.hex('#FFA500')(" ╚══════════════════════════════════════════════════════════════════╝"));

        for (let i = 0; i < numTransactions; i++) {
            const fromAddress = account.address;
            const shortFromAddress = `${fromAddress.slice(0, 4)}...${fromAddress.slice(-4)}`;

            const totalCost = parseFloat(amountWei) + (parseFloat(MAX_FEE_PER_GAS) * GAS_LIMIT);

            if (balanceWei < totalCost) {
                console.log(`Saldo tidak cukup untuk melakukan transaksi dari ${fromAddress}. Diperlukan: ${web3.utils.fromWei(totalCost.toString(), 'ether')} ETH`);
                break;
            }

            try {
                console.log(chalk.hex('#1E90FF')(`\n🔄 Melakukan Tx ke ${i + 1}`));
                const transaction = {
                    from: fromAddress,
                    to: CONTRACT_ADDRESS,
                    value: amountWei,
                    gas: GAS_LIMIT,
                    maxFeePerGas: MAX_FEE_PER_GAS,
                    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
                    nonce: nonces[fromAddress],
                    data: contract.methods.depositETH().encodeABI()
                };

                const signedTx = await web3.eth.accounts.signTransaction(transaction, key);
                const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                const receipt = await web3.eth.getTransactionReceipt(txHash.transactionHash);
                const totalCostInETH = (receipt.gasUsed * gasPrice) / 1e18;
                const gasCostUSD = (totalCostInETH * ethPrice).toFixed(4);


                const explorerUrl = network === '1' 
                    ? `https://basescan.org/tx/${txHash.transactionHash}`
                    : `https://arbiscan.io/tx/${txHash.transactionHash}`;
                
                console.log(chalk.hex('#00FF00')(`✅ Transaksi Berhasil`));
                console.log(chalk.hex('#00FFFF')(`🔗 Rincian transaksi: ${explorerUrl}`));
                console.log(chalk.hex('#FFB6C1')(`🧯 Gas yang digunakan: ${totalCostInETH.toFixed(7)} ETH ($${gasCostUSD})`));
                
                nonces[fromAddress] += 1;
                await startCD(10);
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
