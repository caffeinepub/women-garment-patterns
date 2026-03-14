import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Define only variables that need to be dropped
  type OldActor = {
    nextD2CProductId : Nat;
    nextMadeToOrderId : Nat;
    nextSubscriberId : Nat;
    nextSubscriptionPlanId : Nat;
  };

  // Define new actor without dropped variables
  type NewActor = {};

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    {};
  };
};
