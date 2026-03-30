# RelAID 🇵🇭

> Transparent, Soroban-powered disaster relief — XLM tranches released only when disaster-zone geotags are verified on-chain.

**Stellar Philippines UniTour | Rise In Bootcamp Submission**

---

## Problem

A DSWD field officer in Cagayan de Oro cannot release NDRRMC emergency cash-transfer funds to 300+ Typhoon Kristine flood survivors in Barangay Bonbon without 3–7 days of manual ID verification, cash couriers, and zero public auditability — while families go without food and shelter because money sits frozen in a government bank account waiting for paperwork.

## Solution

RelAID uses a Soroban smart contract to:
1. Pre-register beneficiaries using their **PhilSys Barangay ID** (RA 11055) mapped to a Stellar wallet
2. Lock relief funds in **transparent on-chain escrow**
3. Automatically release XLM tranches **only after dual-officer geotag verification**
4. Log every disbursement publicly for **COA auditors and donors in real time**

---

## Stellar Features Used

| Feature | How Used |
|---|---|
| Soroban smart contracts | Escrow, PhilSys registry, geotag-gated tranche release, on-chain events |
| XLM transfers | Direct wallet payouts to verified disaster victims (in stroops) |
| Trustlines | Beneficiary wallets trust the relief asset before receiving funds |
| On-chain events | Every register/deposit/geotag/release is indexed for COA auditors |

---

## Repository Structure

```
relaid/
├── src/
│   ├── lib.rs       ← Soroban smart contract
│   └── test.rs      ← 5 unit tests
├── Cargo.toml
├── Cargo.lock       ← Committed for reproducible testnet deploys
├── .gitignore
└── README.md
```

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Rust | stable | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| wasm32 target | — | `rustup target add wasm32-unknown-unknown` |
| Stellar CLI | v21.0.0+ | `cargo install --locked stellar-cli --features opt` |

---

## Run Tests

```bash
cargo test
```

Expected output:
```
running 5 tests
test tests::test_full_geotag_gated_disbursement .............. ok
test tests::test_release_blocked_without_geotag_verification .. ok
test tests::test_storage_state_after_registration_and_geotag .. ok
test tests::test_duplicate_registration_rejected .............. ok
test tests::test_release_blocked_on_insufficient_balance ...... ok

test result: ok. 5 passed; 0 failed
```

---

## Build

```bash
cargo build --target wasm32-unknown-unknown --release
```

Confirm WASM exists:
```bash
ls target/wasm32-unknown-unknown/release/*.wasm
```

---

## Deploy to Testnet

```bash
# 1. Generate identity (first time only)
stellar keys generate --global my-key --network testnet
stellar keys address my-key

# 2. Fund testnet account
stellar keys fund my-key --network testnet

# 3. Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/relaid.wasm \
  --source my-key \
  --network testnet
```

Verify at: `https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>`

---

## Sample CLI Invocations

### Initialize
```bash
stellar contract invoke --id <CONTRACT_ID> --source my-key --network testnet \
  -- initialize --admin <YOUR_PUBLIC_KEY>
```

### Register beneficiary
```bash
stellar contract invoke --id <CONTRACT_ID> --source my-key --network testnet \
  -- register_beneficiary \
  --caller <YOUR_PUBLIC_KEY> \
  --philsys_barangay_id "PHSYS-CDO-BRG-001" \
  --wallet <VICTIM_WALLET>
```

### Deposit 500 XLM (5,000,000,000 stroops)
```bash
stellar contract invoke --id <CONTRACT_ID> --source my-key --network testnet \
  -- deposit_funds \
  --caller <YOUR_PUBLIC_KEY> \
  --amount 5000000000
```

### Submit geotag (Officer 1)
```bash
stellar contract invoke --id <CONTRACT_ID> --source my-key --network testnet \
  -- submit_geotag \
  --caller <YOUR_PUBLIC_KEY> \
  --philsys_barangay_id "PHSYS-CDO-BRG-001" \
  --disaster_type "typhoon" \
  --lat 8480000 \
  --lng 124650000
```

### Verify geotag (Officer 2)
```bash
stellar contract invoke --id <CONTRACT_ID> --source my-key --network testnet \
  -- verify_geotag \
  --caller <YOUR_PUBLIC_KEY> \
  --philsys_barangay_id "PHSYS-CDO-BRG-001"
```

### Release 100 XLM tranche
```bash
stellar contract invoke --id <CONTRACT_ID> --source my-key --network testnet \
  -- release_tranche \
  --caller <YOUR_PUBLIC_KEY> \
  --philsys_barangay_id "PHSYS-CDO-BRG-001" \
  --amount 1000000000
```

### Check escrow balance
```bash
stellar contract invoke --id <CONTRACT_ID> --source my-key --network testnet \
  -- get_escrow_balance
```

---

## Real Philippines Context

| Element | Reference |
|---|---|
| Identity | PhilSys National ID — Republic Act 11055 |
| Disaster agency | NDRRMC |
| Social welfare | DSWD — AICS cash transfer program |
| Audit body | COA (Commission on Audit) |
| Real disaster | Typhoon Kristine (2024), Barangay Bonbon, CDO |
| Local anchor | Coins.ph / Vibrant (Stellar SEA) |

---

## License

MIT — Copyright (c) 2026 RelAID Contributors