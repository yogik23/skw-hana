const chalk = require('chalk');

const welcomeskw = chalk.hex('#8A2BE2')(`
   ███████╗██╗  ██╗██╗    ██╗
   ██╔════╝██║ ██╔╝██║    ██║
   ███████╗█████╔╝ ██║ █╗ ██║
   ╚════██║██╔═██╗ ██║███╗██║
   ███████║██║  ██╗╚███╔███╔╝
   ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ 
                          
`);

function displayskw() {
  console.log(welcomeskw);
  console.log(chalk.hex('#1E90FF')(`Fitur Autobot by SKW AIRDROP HUNTER`));
  console.log(chalk.hex('#1E90FF')('1. Auto Send Tx/Deposit'));
  console.log(chalk.hex('#1E90FF')('2. Claim Grow dan Garden'));
  console.log(chalk.hex('#1E90FF')('3. Otomatis mengulang Autobot dijam 7 Pagi'));
  console.log(chalk.hex('#1E90FF')('4. Pantau Status melalui Telegram'));
}

module.exports = displayskw;
