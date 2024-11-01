const { accessTokens, javnosensorgrow, ahKimochi } = require('./jav');
const { displayskw2 } = require('./diskw');
const chalk = require('chalk');
const axios = require('axios');
require('dotenv').config();

async function sendToTelegram(totalAkun, totalBalance) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const date = new Date().toLocaleDateString('id-ID');
  const message = `🚀 *HanaFuda Report ${date}*\n\n` +
                  `╔════════════════════════════╗\n` +
                  `    ➤ *Total Akun	:* ${totalAkun}\n` +
                  `    ➤ *Total Balance	:* ${totalBalance}\n` +
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
    console.clear();
    displayskw2();
    console.log();

    try {
        for (const refreshToken of accessTokens) {
            await javnosensorgrow(refreshToken);
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

async function stepsisbigtits() {
  console.clear();
  const intervalTime = (1 * 60 * 60 * 1000);
  let countdown;

  const runBot = async () => {
    await skandal(); 
    startCountdown(); 
  };

  const startCountdown = () => {
    if (countdown) {
      clearInterval(countdown);
    }

    let timeLeft = intervalTime / 1000; 

    countdown = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(countdown); 
        console.log(chalk.hex('#DC143C')('❌ Waktu habis, menjalankan bot kembali...\n')); 
      } else {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(chalk.hex('#8A2BE2')(`⏳ Cooldown Pengulangan: ${timeLeft} detik`));
        timeLeft--;
      }
    }, 1000);
  };

  await runBot();

  setInterval(runBot, intervalTime);
}

module.exports = { stepsisbigtits };
