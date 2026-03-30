#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    symbol_short, Address, Env, String,
    log, panic_with_error,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum RelAIDError {
    NotInitialized         = 1,
    AlreadyInitialized     = 2,
    Unauthorized           = 3,
    AlreadyRegistered      = 4,
    BeneficiaryNotFound    = 5,
    GeotakNotSubmitted     = 6,
    GeotakNotVerified      = 7,
    InsufficientFunds      = 8,
    InvalidAmount          = 9,
    GeotakAlreadySubmitted = 10,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    EscrowBalance,
    Beneficiary(String),
    Geotag(String),
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Beneficiary {
    pub philsys_barangay_id: String,
    pub wallet: Address,
    pub geotag_submitted: bool,
    pub geotag_verified: bool,
    pub total_released: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Geotag {
    pub disaster_type: String,
    pub lat: i64,
    pub lng: i64,
}

#[contract]
pub struct RelAIDContract;

#[contractimpl]
impl RelAIDContract {

    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, RelAIDError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::EscrowBalance, &0_i128);
        log!(&env, "RelAID initialized — admin: {}", admin);
    }

    pub fn register_beneficiary(
        env: Env,
        caller: Address,
        philsys_barangay_id: String,
        wallet: Address,
    ) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        if env.storage().persistent().has(&DataKey::Beneficiary(philsys_barangay_id.clone())) {
            panic_with_error!(&env, RelAIDError::AlreadyRegistered);
        }

        let beneficiary = Beneficiary {
            philsys_barangay_id: philsys_barangay_id.clone(),
            wallet,
            geotag_submitted: false,
            geotag_verified: false,
            total_released: 0,
        };

        env.storage().persistent().set(
            &DataKey::Beneficiary(philsys_barangay_id.clone()),
            &beneficiary,
        );

        env.events().publish(
            (symbol_short!("register"),),
            philsys_barangay_id,
        );
    }

    pub fn deposit_funds(env: Env, caller: Address, amount: i128) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        if amount <= 0 {
            panic_with_error!(&env, RelAIDError::InvalidAmount);
        }

        let current: i128 = env
            .storage()
            .instance()
            .get(&DataKey::EscrowBalance)
            .unwrap_or(0);

        env.storage()
            .instance()
            .set(&DataKey::EscrowBalance, &(current + amount));

        env.events().publish((symbol_short!("deposit"),), amount);
        log!(&env, "Deposited {} stroops to escrow", amount);
    }

    pub fn submit_geotag(
        env: Env,
        caller: Address,
        philsys_barangay_id: String,
        disaster_type: String,
        lat: i64,
        lng: i64,
    ) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        let mut b = Self::get_beneficiary(&env, &philsys_barangay_id);

        if b.geotag_submitted {
            panic_with_error!(&env, RelAIDError::GeotakAlreadySubmitted);
        }

        let geotag = Geotag { disaster_type, lat, lng };
        env.storage().persistent().set(
            &DataKey::Geotag(philsys_barangay_id.clone()),
            &geotag,
        );

        b.geotag_submitted = true;
        env.storage().persistent().set(
            &DataKey::Beneficiary(philsys_barangay_id.clone()),
            &b,
        );

        env.events().publish(
            (symbol_short!("geotag"),),
            (philsys_barangay_id.clone(), lat, lng),
        );
        log!(&env, "Geotag submitted for {}", philsys_barangay_id);
    }

    pub fn verify_geotag(env: Env, caller: Address, philsys_barangay_id: String) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        let mut b = Self::get_beneficiary(&env, &philsys_barangay_id);

        if !b.geotag_submitted {
            panic_with_error!(&env, RelAIDError::GeotakNotSubmitted);
        }

        b.geotag_verified = true;
        env.storage().persistent().set(
            &DataKey::Beneficiary(philsys_barangay_id.clone()),
            &b,
        );

        env.events().publish(
            (symbol_short!("verified"),),
            philsys_barangay_id.clone(),
        );
        log!(&env, "Geotag verified for {} — tranche release unlocked", philsys_barangay_id);
    }

    pub fn release_tranche(
        env: Env,
        caller: Address,
        philsys_barangay_id: String,
        amount: i128,
    ) {
        caller.require_auth();
        Self::assert_admin(&env, &caller);

        if amount <= 0 {
            panic_with_error!(&env, RelAIDError::InvalidAmount);
        }

        let mut b = Self::get_beneficiary(&env, &philsys_barangay_id);

        if !b.geotag_verified {
            panic_with_error!(&env, RelAIDError::GeotakNotVerified);
        }

        let escrow: i128 = env
            .storage()
            .instance()
            .get(&DataKey::EscrowBalance)
            .unwrap_or(0);

        if escrow < amount {
            panic_with_error!(&env, RelAIDError::InsufficientFunds);
        }

        env.storage()
            .instance()
            .set(&DataKey::EscrowBalance, &(escrow - amount));

        b.total_released += amount;
        env.storage().persistent().set(
            &DataKey::Beneficiary(philsys_barangay_id.clone()),
            &b,
        );

        env.events().publish(
            (symbol_short!("release"),),
            (philsys_barangay_id.clone(), amount),
        );
        log!(&env, "Released {} stroops to {} wallet", amount, philsys_barangay_id);
    }

    pub fn verify_beneficiary(env: Env, philsys_barangay_id: String) -> Beneficiary {
        Self::get_beneficiary(&env, &philsys_barangay_id)
    }

    pub fn get_escrow_balance(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::EscrowBalance)
            .unwrap_or(0)
    }

    fn assert_admin(env: &Env, caller: &Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(env, RelAIDError::NotInitialized));
        if *caller != admin {
            panic_with_error!(env, RelAIDError::Unauthorized);
        }
    }

    fn get_beneficiary(env: &Env, philsys_barangay_id: &String) -> Beneficiary {
        env.storage()
            .persistent()
            .get(&DataKey::Beneficiary(philsys_barangay_id.clone()))
            .unwrap_or_else(|| panic_with_error!(env, RelAIDError::BeneficiaryNotFound))
    }
}

mod test;  // ← ONLY in lib.rs, never in test.rs