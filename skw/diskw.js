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
  console.log(chalk.hex('#1E90FF')('3. Jangan Jual Bot ini'));
  console.log(chalk.hex('#1E90FF')('4. Jangan Dijual'));
}

const welcomeskw1 = chalk.hex('#8A2BE2')(`
   ███████╗██╗  ██╗██╗    ██╗
   ██╔════╝██║ ██╔╝██║    ██║
   ███████╗█████╔╝ ██║ █╗ ██║
   ╚════██║██╔═██╗ ██║███╗██║
   ███████║██║  ██╗╚███╔███╔╝
   ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ 
`);

function displayskw1() {
  console.log(welcomeskw1);
  console.log(chalk.hex('#1E90FF')(`Fitur Autobot by SKW AIRDROP HUNTER`));
  console.log(chalk.hex('#1E90FF')('AUTOBOT GRATIS JANGAN DIJUAL'));
}

module.exports = { displayskw1, displayskw };

