const chalk = require('chalk');

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

module.exports = displayskw1;
