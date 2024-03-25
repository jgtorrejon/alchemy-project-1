const express = require("express");
const app = express();
const cors = require("cors");
const { verify } = require("./scripts/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03b93faebf0b4870c2e45317611227fd16c8156f055e0db0ccb8444307ffc97a22": 100, // Private key: 200145560d799227c44e4bf2da698613613ead22c6554eb66f20ed3f12be4c29
  "0324953eaa76ea153c0651df161422d3ec173e51e0443cc967e8186b75dd32bfc9": 50, // Private key: 43851765516ef9b6659ddfea826d9d05f29d4ed1bb85a9d667e9c674ed8f0b0b
  "0262b161c2caeec9af3dc39500d7e165055d456486b8eced822b95444046d7640e": 75, // Private key: e24891c571e5b5cfe10076241e4afefdeb4470c497a2e7d35e589b2361e9b478
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  if (verify(signature, "transfer", sender)) {
    res.status(400).send({ message: "You are not the owner of the account." });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
