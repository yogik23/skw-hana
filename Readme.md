# HANAFUDA Autobot

## Fitur
- Auto Tx
- Auto Claim Grow dan Garden
- Auto Claim Grow Setiap 1 Jam
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
**5. Skip Step Seterusnya Jika tidak ingin mengirim notif ke telegram** \
**6. Buat file `.env`**
```
cp env.contoh .env && nano.env
```
format .env
```
SEND_TELEGRAM_MESSAGE=true
TELEGRAM_BOT_TOKEN=TokenBOTdariBotFather
TELEGRAM_CHAT_ID=UseridTelegram
```
contoh `.env`
```
SEND_TELEGRAM_MESSAGE=true
TELEGRAM_BOT_TOKEN=7543123403:AAHTBPzDhTlVy0W1rn48tY-T64a7B7TJRzs
TELEGRAM_CHAT_ID=1234567890
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

