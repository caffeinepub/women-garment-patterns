import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type PatternPiece = {
    name : Text;
    instructions : Text;
    cutOnFold : Bool;
  };

  type GarmentType = {
    name : Text;
    description : Text;
    patternPieces : [PatternPiece];
  };

  type Measurements = {
    bust : Float;
    waist : Float;
    hip : Float;
    length : Float;
  };

  type Customer = {
    id : Text;
    name : Text;
    phone : Text;
    bust : Float;
    waist : Float;
    hip : Float;
    length : Float;
    createdAt : Int;
  };

  type Order = {
    id : Text;
    customerName : Text;
    garmentName : Text;
    bust : Float;
    waist : Float;
    hip : Float;
    length : Float;
    status : Text; // "Pending", "In Progress", "Completed", "Delivered"
    notes : Text;
    createdAt : Int;
  };

  type ProductionStatus = {
    #Queued;
    #Cutting;
    #Stitching;
    #QualityCheck;
    #Ready;
  };

  type OrderPriority = {
    #High;
    #Normal;
    #Low;
  };

  type MadeToOrder = {
    id : Nat;
    customerName : Text;
    garmentName : Text;
    measurements : Measurements;
    priority : OrderPriority;
    deliveryDeadline : Text;
    productionStatus : ProductionStatus;
    notes : Text;
    createdAt : Int;
  };

  type D2CProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    fabricType : Text;
    sizesAvailable : [Text];
    inStock : Bool;
    createdAt : Int;
  };

  type BillingCycle = {
    #Monthly;
    #Quarterly;
    #Yearly;
  };

  type SubscriptionPlan = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    billingCycle : BillingCycle;
    includedServices : [Text];
    isActive : Bool;
    createdAt : Int;
  };

  type SubscriberStatus = {
    #Active;
    #Paused;
    #Cancelled;
  };

  type Subscriber = {
    id : Nat;
    name : Text;
    phone : Text;
    planId : Nat;
    planName : Text;
    startDate : Text;
    status : SubscriberStatus;
    createdAt : Int;
  };

  type NewActor = {
    garments : Map.Map<Text, GarmentType>;
    customers : Map.Map<Text, Customer>;
    orders : Map.Map<Text, Order>;
    madeToOrderQueue : Map.Map<Nat, MadeToOrder>;
    d2cCatalog : Map.Map<Nat, D2CProduct>;
    subscriptionPlans : Map.Map<Nat, SubscriptionPlan>;
    subscribers : Map.Map<Nat, Subscriber>;
    nextMadeToOrderId : Nat;
    nextD2CProductId : Nat;
    nextSubscriptionPlanId : Nat;
    nextSubscriberId : Nat;
  };

  type OldActor = {
    garments : Map.Map<Text, GarmentType>;
    customers : Map.Map<Text, Customer>;
    orders : Map.Map<Text, Order>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      madeToOrderQueue = Map.empty<Nat, MadeToOrder>();
      d2cCatalog = Map.empty<Nat, D2CProduct>();
      subscriptionPlans = Map.empty<Nat, SubscriptionPlan>();
      subscribers = Map.empty<Nat, Subscriber>();
      nextMadeToOrderId = 0;
      nextD2CProductId = 0;
      nextSubscriptionPlanId = 0;
      nextSubscriberId = 0;
    };
  };
};
