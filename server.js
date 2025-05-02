// server.js
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const port = 5000;

const merchantId = 'M22QAGCQDPIYO';
const clientId = 'SU2504301612178277942740';
const clientSecret = 'ea83e50a-87bb-49f4-85d2-626fee9a1977';
const redirectUrl = 'https://scan4food.com/success';

app.post('/pay', (req, res) => {
  const { amount, mobile, name } = req.body;

  const payload = {
    merchantId,
    transactionId: `TXN_${Date.now()}`,
    merchantUserId: name,
    amount: amount * 100, // in paise
    redirectUrl,
    redirectMode: 'POST',
    callbackUrl: redirectUrl,
    mobileNumber: mobile,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const saltKey = clientSecret;
  const saltIndex = 1;

  const dataToSign = base64Payload + "/pg/v1/pay" + saltKey;
  const checksum = crypto.createHash('sha256').update(dataToSign).digest('hex') + "###" + saltIndex;

  fetch('https://api.phonepe.com/apis/hermes/pg/v1/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': merchantId,
    },
    body: JSON.stringify({
      request: base64Payload,
    }),
  })
    .then(resp => resp.json())
    .then(data => {
      if (data.success) {
        const redirect = data.data.instrumentResponse.redirectInfo.url;
        res.json({ url: redirect });
      } else {
        res.status(500).json({ error: 'Payment failed', details: data });
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
