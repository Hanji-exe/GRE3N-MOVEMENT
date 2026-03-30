#[cfg(test)]
mod tests {
    use crate::{RelAIDContract, RelAIDContractClient};
    use soroban_sdk::{
        testutils::Address as _,
        Address, Env, String,
    };

    fn setup() -> (Env, RelAIDContractClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(RelAIDContract, ());
        let client = RelAIDContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        (env, client, admin)
    }

    #[test]
    fn test_full_geotag_gated_disbursement() {
        let (env, client, admin) = setup();

        let id     = String::from_str(&env, "PHSYS-CDO-BRG-001");
        let victim = Address::generate(&env);
        client.register_beneficiary(&admin, &id, &victim);

        let deposit: i128 = 5_000_000_000;
        client.deposit_funds(&admin, &deposit);
        assert_eq!(client.get_escrow_balance(), deposit);

        client.submit_geotag(
            &admin, &id,
            &String::from_str(&env, "typhoon"),
            &8_480_000_i64, &124_650_000_i64,
        );
        client.verify_geotag(&admin, &id);

        let tranche: i128 = 1_000_000_000;
        client.release_tranche(&admin, &id, &tranche);

        assert_eq!(client.get_escrow_balance(), deposit - tranche);
        let b = client.verify_beneficiary(&id);
        assert_eq!(b.total_released, tranche);
        assert!(b.geotag_verified);
    }

    #[test]
    #[should_panic]
    fn test_release_blocked_without_geotag_verification() {
        let (env, client, admin) = setup();

        let id     = String::from_str(&env, "PHSYS-CDO-BRG-002");
        let victim = Address::generate(&env);
        client.register_beneficiary(&admin, &id, &victim);
        client.deposit_funds(&admin, &5_000_000_000_i128);
        client.submit_geotag(
            &admin, &id,
            &String::from_str(&env, "flood"),
            &8_480_000_i64, &124_650_000_i64,
        );
        client.release_tranche(&admin, &id, &1_000_000_000_i128);
    }

    #[test]
    fn test_storage_state_after_registration_and_geotag() {
        let (env, client, admin) = setup();

        let id     = String::from_str(&env, "PHSYS-CDO-BRG-003");
        let victim = Address::generate(&env);
        client.register_beneficiary(&admin, &id, &victim);

        let b = client.verify_beneficiary(&id);
        assert!(!b.geotag_submitted);
        assert!(!b.geotag_verified);
        assert_eq!(b.total_released, 0);

        client.deposit_funds(&admin, &3_000_000_000_i128);
        client.submit_geotag(
            &admin, &id,
            &String::from_str(&env, "typhoon"),
            &8_480_000_i64, &124_650_000_i64,
        );

        let b2 = client.verify_beneficiary(&id);
        assert!(b2.geotag_submitted);
        assert!(!b2.geotag_verified);

        client.verify_geotag(&admin, &id);
        let b3 = client.verify_beneficiary(&id);
        assert!(b3.geotag_submitted);
        assert!(b3.geotag_verified);
        assert_eq!(b3.total_released, 0);

        let tranche: i128 = 500_000_000;
        client.release_tranche(&admin, &id, &tranche);
        let b4 = client.verify_beneficiary(&id);
        assert_eq!(b4.total_released, tranche);
        assert_eq!(client.get_escrow_balance(), 3_000_000_000 - tranche);
    }

    #[test]
    #[should_panic]
    fn test_duplicate_registration_rejected() {
        let (env, client, admin) = setup();

        let id      = String::from_str(&env, "PHSYS-CDO-BRG-004");
        let victim1 = Address::generate(&env);
        let victim2 = Address::generate(&env);
        client.register_beneficiary(&admin, &id, &victim1);
        client.register_beneficiary(&admin, &id, &victim2);
    }

    #[test]
    #[should_panic]
    fn test_release_blocked_on_insufficient_balance() {
        let (env, client, admin) = setup();

        let id     = String::from_str(&env, "PHSYS-CDO-BRG-005");
        let victim = Address::generate(&env);
        client.register_beneficiary(&admin, &id, &victim);
        client.deposit_funds(&admin, &100_000_000_i128);
        client.submit_geotag(
            &admin, &id,
            &String::from_str(&env, "earthquake"),
            &8_480_000_i64, &124_650_000_i64,
        );
        client.verify_geotag(&admin, &id);
        client.release_tranche(&admin, &id, &5_000_000_000_i128);
    }
}