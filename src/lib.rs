#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    symbol_short, Address, Env, String,
    log, panic_with_error,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Guard3nError {
    NotInitialized          = 1,
    AlreadyInitialized      = 2,
    Unauthorized            = 3,
    ParkAlreadyRegistered   = 4,
    ParkNotFound            = 5,
    MilestoneNotSubmitted   = 6,
    MilestoneNotVerified    = 7,
    InsufficientFunds       = 8,
    InvalidAmount           = 9,
    MilestoneAlreadySubmitted = 10,
    ThresholdNotMet         = 11,
    DonorNotFound           = 12,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TreasuryBalance,
    Park(String),
    Donor(Address),
    Milestone(String),
}

// Represents a real park or urban green area
#[contracttype]
#[derive(Clone, Debug)]
pub struct Park {
    pub park_id: String,          // e.g. "QC-MEMORIAL-001"
    pub name: String,             // e.g. "Quezon Memorial Circle"
    pub funding_goal: i128,       // target amount in stroops
    pub current_funding: i128,    // total donated so far
    pub tree_count: u32,          // verified trees planted
    pub milestone_submitted: bool,
    pub milestone_verified: bool,
    pub total_released: i128,
}

// Represents a donor's contribution record
#[contracttype]
#[derive(Clone, Debug)]
pub struct Donor {
    pub wallet: Address,
    pub total_donated: i128,
    pub tokens_earned: i128,
    pub trees_funded: u32,
}

// Photo proof of planting submitted by barangay
#[contracttype]
#[derive(Clone, Debug)]
pub struct Milestone {
    pub photo_hash: String,   // hash of the geotagged photo proof
    pub lat: i64,
    pub lng: i64,
    pub tree_species: String,
}

#[contract]
pub struct Guard3nContract;

#[contractimpl]
impl Guard3nContract {

    // Initialize the contract with an admin address
    // Called once on deployment — sets admin and zeroes treasury
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, Guard3nError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TreasuryBalance, &0_i128);
        log!(&env, "GUARD3N initialized — admin: {}", admin);
    }

    // Admin registers a new park with a funding goal
    // Parks must be registered before anyone can donate to them
    pub fn register_park(
        env: Env,
        caller: Address,
        park_id: String,
        name: String,
        funding_goal: i128,
    ) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        if env.storage().persistent().has(&DataKey::Park(park_id.clone())) {
            panic_with_error!(&env, Guard3nError::ParkAlreadyRegistered);
        }

        if funding_goal <= 0 {
            panic_with_error!(&env, Guard3nError::InvalidAmount);
        }

        let park = Park {
            park_id: park_id.clone(),
            name,
            funding_goal,
            current_funding: 0,
            tree_count: 0,
            milestone_submitted: false,
            milestone_verified: false,
            total_released: 0,
        };

        env.storage().persistent().set(
            &DataKey::Park(park_id.clone()),
            &park,
        );

        env.events().publish(
            (symbol_short!("park_reg"),),
            park_id,
        );
    }

    // Any user donates to a specific park
    // Mints GR3EN tokens proportional to donation
    // 1 stroop donated = 1 GR3EN token earned
    pub fn donate(
        env: Env,
        caller: Address,
        park_id: String,
        amount: i128,
    ) {
        caller.require_auth();

        if amount <= 0 {
            panic_with_error!(&env, Guard3nError::InvalidAmount);
        }

        // Update park funding
        let mut park = Self::get_park(&env, &park_id);
        park.current_funding += amount;

        // Update treasury
        let treasury: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TreasuryBalance)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TreasuryBalance, &(treasury + amount));

        // Update or create donor record
        let mut donor = env
            .storage()
            .persistent()
            .get(&DataKey::Donor(caller.clone()))
            .unwrap_or(Donor {
                wallet: caller.clone(),
                total_donated: 0,
                tokens_earned: 0,
                trees_funded: 0,
            });

        donor.total_donated += amount;
        donor.tokens_earned += amount; // 1:1 token ratio at MVP
        donor.trees_funded += 1;

        env.storage().persistent().set(
            &DataKey::Donor(caller.clone()),
            &donor,
        );

        env.storage().persistent().set(
            &DataKey::Park(park_id.clone()),
            &park,
        );

        env.events().publish(
            (symbol_short!("donate"),),
            (park_id.clone(), caller, amount),
        );

        log!(&env, "Donation of {} stroops to park {}", amount, park_id);
    }

    // Barangay submits photo proof of planting with GPS coordinates
    // Only admin-authorized barangay addresses can call this
    pub fn submit_milestone(
        env: Env,
        caller: Address,
        park_id: String,
        photo_hash: String,
        lat: i64,
        lng: i64,
        tree_species: String,
    ) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        let mut park = Self::get_park(&env, &park_id);

        if park.milestone_submitted {
            panic_with_error!(&env, Guard3nError::MilestoneAlreadySubmitted);
        }

        // Check funding threshold is met before allowing milestone
        if park.current_funding < park.funding_goal {
            panic_with_error!(&env, Guard3nError::ThresholdNotMet);
        }

        let milestone = Milestone {
            photo_hash,
            lat,
            lng,
            tree_species,
        };

        env.storage().persistent().set(
            &DataKey::Milestone(park_id.clone()),
            &milestone,
        );

        park.milestone_submitted = true;
        env.storage().persistent().set(
            &DataKey::Park(park_id.clone()),
            &park,
        );

        env.events().publish(
            (symbol_short!("milestone"),),
            (park_id.clone(), lat, lng),
        );

        log!(&env, "Milestone submitted for park {}", park_id);
    }

    // Admin verifies the submitted photo milestone
    // Unlocks reward token release to donors
    pub fn verify_milestone(
        env: Env,
        caller: Address,
        park_id: String,
        tree_count: u32,
    ) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        let mut park = Self::get_park(&env, &park_id);

        if !park.milestone_submitted {
            panic_with_error!(&env, Guard3nError::MilestoneNotSubmitted);
        }

        park.milestone_verified = true;
        park.tree_count = tree_count;

        env.storage().persistent().set(
            &DataKey::Park(park_id.clone()),
            &park,
        );

        env.events().publish(
            (symbol_short!("verified"),),
            (park_id.clone(), tree_count),
        );

        log!(&env, "Milestone verified for park {} — {} trees confirmed", park_id, tree_count);
    }

    // Admin releases reward tokens to a donor after milestone is verified
    // This simulates the on-chain reward distribution
    pub fn release_rewards(
        env: Env,
        caller: Address,
        park_id: String,
        donor_wallet: Address,
        reward_amount: i128,
    ) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        if reward_amount <= 0 {
            panic_with_error!(&env, Guard3nError::InvalidAmount);
        }

        let park = Self::get_park(&env, &park_id);

        if !park.milestone_verified {
            panic_with_error!(&env, Guard3nError::MilestoneNotVerified);
        }

        let treasury: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TreasuryBalance)
            .unwrap_or(0);

        if treasury < reward_amount {
            panic_with_error!(&env, Guard3nError::InsufficientFunds);
        }

        // Deduct from treasury
        env.storage()
            .instance()
            .set(&DataKey::TreasuryBalance, &(treasury - reward_amount));

        // Update donor reward record
        let mut donor: Donor = env
            .storage()
            .persistent()
            .get(&DataKey::Donor(donor_wallet.clone()))
            .unwrap_or_else(|| panic_with_error!(&env, Guard3nError::DonorNotFound));

        donor.tokens_earned += reward_amount;

        env.storage().persistent().set(
            &DataKey::Donor(donor_wallet.clone()),
            &donor,
        );

        env.events().publish(
            (symbol_short!("reward"),),
            (park_id, donor_wallet, reward_amount),
        );
    }

    // Read-only: get park details
    pub fn get_park_info(env: Env, park_id: String) -> Park {
        Self::get_park(&env, &park_id)
    }

    // Read-only: get donor details
    pub fn get_donor_info(env: Env, donor_wallet: Address) -> Donor {
        env.storage()
            .persistent()
            .get(&DataKey::Donor(donor_wallet))
            .unwrap_or_else(|| panic_with_error!(&env, Guard3nError::DonorNotFound))
    }

    // Read-only: get treasury balance
    pub fn get_treasury_balance(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TreasuryBalance)
            .unwrap_or(0)
    }

    // Internal: assert caller is admin
    fn assert_admin(env: &Env, caller: &Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(env, Guard3nError::NotInitialized));
        if *caller != admin {
            panic_with_error!(env, Guard3nError::Unauthorized);
        }
    }

    // Internal: get park or panic
    fn get_park(env: &Env, park_id: &String) -> Park {
        env.storage()
            .persistent()
            .get(&DataKey::Park(park_id.clone()))
            .unwrap_or_else(|| panic_with_error!(env, Guard3nError::ParkNotFound))
    }
}

mod test;