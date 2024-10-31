# HANAFUDA Autobot

## Fitur
- Auto Tx
- Auto Claim Grow dan Garden
- Auto Tx dan Grow Garden
- Send Notif ke Telegram

### [Link Hanafuda](https://hanafuda.hana.network)
Gunakan Code
```
Y9IJ72
```

### Step
**1. Clone Repo dan Masuk ke folder**
```
git clone https://github.com/yogik23/skw-hana.git && cd skw-hana
```
**2. Install Module `abaikan jika muncul eror yg penting sudah install`**
```
npm install
```
**3. Edit file `data.json` submit Privatekey dan Refresh token**
```
nano dataSKW.json
```
format `data.json`
```
[
    {
        "privateKey": "PrivateKey1",
        "accessToken": "RefreshToken1"
    },
    {
        "privateKey": "PrivateKey2",
        "accessToken": "RefreshToken2"
    }
]
```
**4. Jalankan Bot**
```
npm run start
```
**5. Jika ingin melakukan Otomatis Auto Tx dan Grow Garden `pilih 3 saat menjalankan npm run start`** \
**6. Buat file `.env` untuk Melakukan Otomatis**
```
cp env.contoh .env && nano.env
```
format .env
```
SEND_TELEGRAM_MESSAGE=true // ganti ke false untuk nonaktif telegram
TELEGRAM_BOT_TOKEN=TokenBOTdariBotFather // jika false jangan disi
TELEGRAM_CHAT_ID=UseridTelegram // jika false jangan disi
NUM_TRANSACTIONS=Jumlah Transaksi(3-10 cukup)
AMOUNT_ETH=deposit berapa(0.000001) cukup
RPC_URL=https://arb1.arbitrum.io/rpc
NETWORK=2
SKWT=2

Ganti ini Kalau Pakai Base
RPC_URL=https://mainnet.base.org
NETWORK=1
SKWT=1
```
contoh `.env`
```
SEND_TELEGRAM_MESSAGE=true
TELEGRAM_BOT_TOKEN=7543123403:AAHTBPzDhTlVy0W1rn48tY-T64a7B7TJRzs
TELEGRAM_CHAT_ID=1234567890
NUM_TRANSACTIONS=3
AMOUNT_ETH=0.0000001
RPC_URL=https://arb1.arbitrum.io/rpc
NETWORK=2
SKWT=2
```


**Cara mendapatkan reffreshtoken**

**1. buka web hanafuda \
2. Klik kanan inspect / ctrl shit + i \
3. Aplikasi \
4. Session storage \
5. Pilih `https://hanafuda.h...` \
6. stsTokenManager > refreshToken**

![ssw](https://github.com/user-attachments/assets/06bc88d2-470c-4409-abc2-602e83e814d8)

### BOT GRATIS JANGAN DIJUAL 

