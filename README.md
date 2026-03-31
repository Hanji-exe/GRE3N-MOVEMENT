# GUARD3N  🌱
## Join the GRE3N Movement*

A Web3 eco-platform that lets any Filipino fund real trees, track them on a live Map, grow a virtual plant companion, and redeem GR3EN tokens into real-world vouchers — all powered by Stellar and Soroban smart contracts.

---

## Overview

GUARD3N lets any Filipino convert ₱50 into GR3EN tokens on Stellar, assign them to a real tree in a barangay park on a live GeoMap, earn bonuses for verified photo milestones, and redeem tokens into real-world vouchers — with every step recorded transparently on a Soroban smart contract.

---

## Problem

Meet Ate Teresa, 34. Quezon City.

She wakes up at 5:30am, commutes 2 hours in 38°C heat, works 9 hours, commutes back. By the time she gets home, the air feels thick and not just with pollution, but with helplessness.

She scrolls past climate news. She cares. She actually cares deeply. But what can she do? She's not rich. She's not an activist. She's just one person trying to survive the month on ₱22,000.

The barangay park two blocks away has three trees left. The rest were cut for a parking lot. Her kids can't play outside anymore — the heat is dangerous, the air is bad, and the nearest "green space" is a potted plant in SM.

She donates nothing and not because she doesn't want to, but because no one ever made it feel possible, visible, or worth it.

The real problem isn't apathy. It's invisibility.

**Filipinos care about the environment**, but the systems around them make individual action feel pointless, untraceable, and unrewarding.

---

## Solution

GUARD3N makes Ate Teresa a Guardian.
For a minimum of ₱1 , she funds a real Narra tree at Quezon Memorial Circle. She earns GR3EN tokens. She watches the barangay dashboard. She gets notified when her tree is verified on the Stellar blockchain. She shares her virtual tree card on Facebook .

Next month she does it again. And again. Until she has a collection of 12 trees across 4 parks in Metro Manila — all traceable, all real, all hers virtually.

GUARD3N doesn't ask Filipinos to sacrifice. It asks them to invest — in their city, their air, and themselves.

---

## Stellar Features Used

| Feature | Purpose |
|---|---|
| Soroban Smart Contracts | Manages tree-funding pools, milestones, rewards, and voucher redemption |
| XLM / USDC Transfers | On-ramp ₱ → tokens, handle business sponsorship payments, simulate voucher payouts |
| Custom Tokens (GR3EN) | In-app currency for funding, milestones, and cosmetic unlocks |
| Trustlines | User wallets opt-in to hold and spend GR3EN tokens |

---

##  Project Features (MVP — First Simple MVP Crucial Core)

| # | Feature | What It Does |
|---|---|---|
| 1 | **Wallet Connect** | Mock Freighter wallet connects user to Stellar Testnet |
| 2 | **Live Park GeoMap** | Leaflet map shows all registered barangay parks with funding status, crowd levels, and ratings |
| 3 | **Donate Screen** | User selects a park, chooses GR3EN amount, and submits donation recorded on Soroban |
| 4 | **GR3EN Token Rewards** | 1 GR3EN earned per ₱50 donated — tracked in user profile |
| 5 | **Tree Collection** | Every 50 GR3EN donated = 1 virtual tree owned, with species, park, and date |
| 6 | **Barangay Dashboard** | Leaderboard of top barangays by trees planted + PH national milestones |
| 7 | **Milestone Verification** | Barangay submits geotagged photo proof → admin verifies on-chain → rewards released |
| 8 | **Profile + Top Up** | Guardian profile with wallet ID, GR3EN balance, tree collection, and QR identity |
| 9 | **Share My Tree** | Users share their owned tree as a card on social media |

---

##  Smart-Contract-Style Logic (Win-Win System)

Everyone wins:

People win:

Ate Teresa donates ₱, earns GR3EN tokens, owns a virtual tree, and gets bragging rights on social media. Every peso she gives comes back to her in value — emotional and social.

Planet wins:
Every GR3EN token is backed by a real tree in a real park. Barangay officials submit geotagged photo proof. Admins verify on-chain. No greenwashing. No ghost trees. Just verified, growing, trackable urban forests recorded permanently on Stellar.

---

##  Target Users

- **Filipino donors of all ages** (students, workers, OFW families, professionals, retirees) who can afford small, regular donations (e.g., ₱50–₱200 per tree) and want their contributions visible, trackable, and rewarding.  
- **Barangay members and LGUs** managing parks, open land, or disaster‑recovery green spaces in **Metro Manila, Cebu, Davao, and provincial towns**, who need transparent, community‑driven funding.  
- **Local businesses** (sari‑sari stores, cafés, fitness centers, small restaurants) in **urban and semi‑urban areas** that want low‑cost “green” branding and loyal customers without big marketing budgets.  
- **OFW families** sending money back home, who want to fund a tree in their hometown and watch it grow via photo updates instead of only sending cash that disappears into bills.


---

## 🛠 Prerequisites

- Node.js v18+
- npm or yarn
- [Freighter Wallet](https://freighter.app) browser extension (optional for testnet)
- Stellar Testnet account with XLM funded via [Friendbot](https://friendbot.stellar.org)

---

##  Project Structure
```
RELAID/
├── guard3n-frontend/                
│   ├── app/
│   │   ├── page.jsx                  
│   │   ├── layout.jsx               
│   │   ├── globals.css               
│   │   ├── dashboard.jsx            
│   │   └── profile.jsx 
│   │           
│   ├── components/
│   │   ├── WalletConnect.jsx        
│   │   ├── MapView.jsx              
│   │   └── TreeCard.jsx    
│   │      
│   ├── public/                      
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── postcss.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── src/                             
│   ├── lib.rs                       
│   └── test.rs                      
│               
├── test_snapshots/
├── target/                          
├── Cargo.toml                     
├── Cargo.lock
├── .gitignore
└── README.md      
```

---

##  Screens

| Screen | Description |
|---|---|
| **Landing** | GUARD3N splash with Stellar badge, tree illustration, and wallet connect CTA |
| **Home Dashboard** | GR3EN token balance, mini chart, stats (trees, parks, minted), recent activity feed |
| **Park Map** | Live Leaflet map of Metro Manila parks with custom markers, search, crowd levels, reviews, and donate button |
| **Donate** | Park selector with funding progress bars, GR3EN amount picker, on-chain donation flow |
| **Barangay Board** | Top 5 barangays ranked by trees planted + PH national milestone stats |
| **Profile** | Guardian wallet card, QR identity, GR3EN balance, tree collection grid, top-up flow |

---

##  Smart Contract

- **Network:** Stellar Testnet
- **Contract ID:** `CCOV3JXJEYMIFVUMUXGF462MCFGYWMW6REDJPNCUSLXFXM4HWXP4PT6E`
- **SDK:** Soroban SDK 22.0.0 (Rust)
- **CLI:** Stellar CLI v25.2.0

### Contract Functions

| Function | Description |
|---|---|
| `initialize` | Deploy contract with admin address |
| `register_park` | Admin registers a new park with funding goal |
| `donate` | User donates to a park, earns GR3EN tokens |
| `submit_milestone` | Barangay submits geotagged photo proof |
| `verify_milestone` | Admin verifies milestone, unlocks rewards |
| `release_rewards` | Admin releases GR3EN to verified donors |
| `get_park_info` | Read park funding + milestone status |
| `get_donor_info` | Read donor token balance and trees funded |
| `get_treasury_balance` | Read total treasury balance |

---

##  Why This Wins

- **Real impact** — every donation funds a real, trackable tree in a real barangay park
- **Transparent on-chain** — Soroban smart contracts make every peso and milestone verifiable
- **Fun and social** — virtual tree collection + share cards drive organic growth
- **Filipino-first** — designed for ₱ micro-donations, not crypto whales

---

##  Future Recommendations

- Freighter wallet full integration (replace mock)
- Real GR3EN token issuance on Stellar Mainnet
- Shopee / TikTok / GCash voucher redemption via token burn
- Virtual plant growth companion (levels up as trees are verified)
- LGU dashboard for barangay captains to manage their park
- OFW remittance-to-tree pipeline via USDC on Stellar

---

##  License

MIT License — Built with 🌱 for the Philippines and the planet.

---

##  Built For

**Stellar Hackathon** — *Build on Stellar: Smart Contract Track*

> "Fund a tree. Earn a token. Save the planet. Join the GRE3N Movements."