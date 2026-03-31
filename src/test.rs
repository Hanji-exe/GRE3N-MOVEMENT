#[cfg(test)]
mod tests {
    use crate::{Guard3nContract, Guard3nContractClient};
    use soroban_sdk::{
        testutils::Address as _,
        Address, Env, String,
    };

    fn setup() -> (Env, Guard3nContractClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(Guard3nContract, ());
        let client = Guard3nContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        (env, client, admin)
    }

    // Test 1 — Happy path: full donation → milestone → verify → reward loop
    #[test]
    fn test_full_donation_to_reward_flow() {
        let (env, client, admin) = setup();

        let park_id = String::from_str(&env, "QC-MEMORIAL-001");
        let park_name = String::from_str(&env, "Quezon Memorial Circle");
        let funding_goal: i128 = 5_000_000_000;

        // Register park
        client.register_park(&admin, &park_id, &park_name, &funding_goal);

        // Donor donates enough to meet threshold
        let donor = Address::generate(&env);
        client.donate(&donor, &park_id, &funding_goal);

        // Verify treasury updated
        assert_eq!(client.get_treasury_balance(), funding_goal);

        // Barangay submits milestone photo proof
        client.submit_milestone(
            &admin,
            &park_id,
            &String::from_str(&env, "sha256-abc123photohash"),
            &14_676_000_i64,
            &121_043_000_i64,
            &String::from_str(&env, "Narra"),
        );

        // Admin verifies milestone with tree count
        client.verify_milestone(&admin, &park_id, &10_u32);

        // Check park state
        let park = client.get_park_info(&park_id);
        assert!(park.milestone_verified);
        assert_eq!(park.tree_count, 10);

        // Release rewards to donor
        let reward: i128 = 1_000_000_000;
        client.release_rewards(&admin, &park_id, &donor, &reward);

        // Verify donor received tokens
        let donor_info = client.get_donor_info(&donor);
        assert!(donor_info.tokens_earned > 0);

        // Verify treasury deducted
        assert_eq!(client.get_treasury_balance(), funding_goal - reward);
    }

    // Test 2 — Edge case: release rewards blocked if milestone not verified
    #[test]
    #[should_panic]
    fn test_reward_blocked_without_milestone_verification() {
        let (env, client, admin) = setup();

        let park_id = String::from_str(&env, "QC-MEMORIAL-002");
        let funding_goal: i128 = 5_000_000_000;
        client.register_park(
            &admin,
            &park_id,
            &String::from_str(&env, "Ninoy Aquino Parks"),
            &funding_goal,
        );

        let donor = Address::generate(&env);
        client.donate(&donor, &park_id, &funding_goal);

        client.submit_milestone(
            &admin,
            &park_id,
            &String::from_str(&env, "sha256-xyz789"),
            &14_676_000_i64,
            &121_043_000_i64,
            &String::from_str(&env, "Molave"),
        );

        // Skip verify_milestone — should panic here
        client.release_rewards(&admin, &park_id, &donor, &1_000_000_000_i128);
    }

    // Test 3 — State verification: storage reflects correct state after each step
    #[test]
    fn test_storage_state_after_each_step() {
        let (env, client, admin) = setup();

        let park_id = String::from_str(&env, "QC-MEMORIAL-003");
        let funding_goal: i128 = 3_000_000_000;
        client.register_park(
            &admin,
            &park_id,
            &String::from_str(&env, "La Mesa Eco Park"),
            &funding_goal,
        );

        // Initial state — nothing donated yet
        let park = client.get_park_info(&park_id);
        assert_eq!(park.current_funding, 0);
        assert!(!park.milestone_submitted);
        assert!(!park.milestone_verified);
        assert_eq!(park.tree_count, 0);

        // After donation
        let donor = Address::generate(&env);
        client.donate(&donor, &park_id, &funding_goal);
        let park2 = client.get_park_info(&park_id);
        assert_eq!(park2.current_funding, funding_goal);

        // After milestone submission
        client.submit_milestone(
            &admin,
            &park_id,
            &String::from_str(&env, "sha256-state-check"),
            &14_676_000_i64,
            &121_043_000_i64,
            &String::from_str(&env, "Dao"),
        );
        let park3 = client.get_park_info(&park_id);
        assert!(park3.milestone_submitted);
        assert!(!park3.milestone_verified);

        // After milestone verification
        client.verify_milestone(&admin, &park_id, &15_u32);
        let park4 = client.get_park_info(&park_id);
        assert!(park4.milestone_verified);
        assert_eq!(park4.tree_count, 15);
    }

    // Test 4 — Duplicate park registration rejected
    #[test]
    #[should_panic]
    fn test_duplicate_park_registration_rejected() {
        let (env, client, admin) = setup();

        let park_id = String::from_str(&env, "QC-MEMORIAL-004");
        let name = String::from_str(&env, "People's Park");
        client.register_park(&admin, &park_id, &name, &1_000_000_000_i128);
        // Second registration with same ID must panic
        client.register_park(&admin, &park_id, &name, &1_000_000_000_i128);
    }

    // Test 5 — Milestone submission blocked if funding threshold not met
    #[test]
    #[should_panic]
    fn test_milestone_blocked_if_threshold_not_met() {
        let (env, client, admin) = setup();

        let park_id = String::from_str(&env, "QC-MEMORIAL-005");
        client.register_park(
            &admin,
            &park_id,
            &String::from_str(&env, "Ynares Park"),
            &5_000_000_000_i128,
        );

        // Donate less than the goal
        let donor = Address::generate(&env);
        client.donate(&donor, &park_id, &100_000_000_i128);

        // Submit milestone before threshold met — must panic
        client.submit_milestone(
            &admin,
            &park_id,
            &String::from_str(&env, "sha256-early"),
            &14_676_000_i64,
            &121_043_000_i64,
            &String::from_str(&env, "Narra"),
        );
    }
}