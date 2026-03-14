import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Migration "migration";

(with migration = Migration.run)
actor {
  type PatternPiece = {
    name : Text;
    instructions : Text;
    cutOnFold : Bool;
  };

  module PatternPiece {
    public func compare(piece1 : PatternPiece, piece2 : PatternPiece) : Order.Order {
      Text.compare(piece1.name, piece2.name);
    };
  };

  type GarmentType = {
    name : Text;
    description : Text;
    patternPieces : [PatternPiece];
  };

  module GarmentType {
    public func compareByName(garment1 : GarmentType, garment2 : GarmentType) : Order.Order {
      Text.compare(garment1.name, garment2.name);
    };
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

  // New types for Made-to-Order Queue
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

  var nextMadeToOrderId = 0;

  // New types for D2C Catalog
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

  var nextD2CProductId = 0;

  // New types for Subscriptions
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

  var nextSubscriptionPlanId = 0;
  var nextSubscriberId = 0;

  let garments = Map.empty<Text, GarmentType>();
  let customers = Map.empty<Text, Customer>();
  let orders = Map.empty<Text, Order>();

  let madeToOrderQueue = Map.empty<Nat, MadeToOrder>();
  let d2cCatalog = Map.empty<Nat, D2CProduct>();
  let subscriptionPlans = Map.empty<Nat, SubscriptionPlan>();
  let subscribers = Map.empty<Nat, Subscriber>();

  // Garment CRUD
  public shared ({ caller }) func createGarment(name : Text, description : Text, patternPieces : [PatternPiece]) : async () {
    if (garments.containsKey(name)) {
      Runtime.trap("Garment with this name already exists");
    };
    let garment : GarmentType = {
      name;
      description;
      patternPieces;
    };
    garments.add(name, garment);
  };

  public shared ({ caller }) func updateGarment(name : Text, newDescription : Text, newPatternPieces : [PatternPiece]) : async () {
    switch (garments.get(name)) {
      case (null) { Runtime.trap("Garment not found") };
      case (?_) {
        let updatedGarment : GarmentType = {
          name;
          description = newDescription;
          patternPieces = newPatternPieces;
        };
        garments.add(name, updatedGarment);
      };
    };
  };

  public shared ({ caller }) func deleteGarment(name : Text) : async () {
    switch (garments.get(name)) {
      case (null) { Runtime.trap("Garment not found") };
      case (?_) {
        garments.remove(name);
      };
    };
  };

  public query ({ caller }) func getGarment(name : Text) : async GarmentType {
    switch (garments.get(name)) {
      case (null) { Runtime.trap("Garment not found") };
      case (?garment) { garment };
    };
  };

  public query ({ caller }) func listGarments() : async [GarmentType] {
    garments.values().toArray().sort(GarmentType.compareByName);
  };

  // Pattern Calculation
  public query ({ caller }) func calculatePattern(garmentName : Text, measurements : Measurements) : async [(PatternPiece, Measurements)] {
    switch (garments.get(garmentName)) {
      case (null) { Runtime.trap("Garment not found") };
      case (?garment) {
        garment.patternPieces.values().toArray().sort().map(
          func(piece) { (piece, measurements) }
        );
      };
    };
  };

  // Customer Management
  public shared ({ caller }) func addCustomer(name : Text, phone : Text, bust : Float, waist : Float, hip : Float, length : Float) : async Text {
    let id = name.concat(" - ").concat(phone);
    let customer : Customer = {
      id;
      name;
      phone;
      bust;
      waist;
      hip;
      length;
      createdAt = Time.now();
    };
    customers.add(id, customer);
    id;
  };

  public shared ({ caller }) func updateCustomer(id : Text, name : Text, phone : Text, bust : Float, waist : Float, hip : Float, length : Float) : async Bool {
    switch (customers.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedCustomer : Customer = {
          id;
          name;
          phone;
          bust;
          waist;
          hip;
          length;
          createdAt = Time.now();
        };
        customers.add(id, updatedCustomer);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteCustomer(id : Text) : async Bool {
    switch (customers.get(id)) {
      case (null) { false };
      case (?_) {
        customers.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getCustomer(id : Text) : async ?Customer {
    customers.get(id);
  };

  public query ({ caller }) func listCustomers() : async [Customer] {
    customers.values().toArray();
  };

  // Order Management
  public shared ({ caller }) func createOrder(customerName : Text, garmentName : Text, bust : Float, waist : Float, hip : Float, length : Float, notes : Text) : async Text {
    let id = customerName.concat(" - ").concat(garmentName);
    let order : Order = {
      id;
      customerName;
      garmentName;
      bust;
      waist;
      hip;
      length;
      status = "Pending";
      notes;
      createdAt = Time.now();
    };
    orders.add(id, order);
    id;
  };

  public shared ({ caller }) func updateOrderStatus(id : Text, status : Text) : async Bool {
    switch (orders.get(id)) {
      case (null) { false };
      case (?order) {
        let updatedOrder : Order = {
          order with status
        };
        orders.add(id, updatedOrder);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteOrder(id : Text) : async Bool {
    switch (orders.get(id)) {
      case (null) { false };
      case (?_) {
        orders.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getOrder(id : Text) : async ?Order {
    orders.get(id);
  };

  public query ({ caller }) func listOrders() : async [Order] {
    orders.values().toArray();
  };

  public query ({ caller }) func listOrdersByStatus(status : Text) : async [Order] {
    orders.values().toArray().filter(
      func(order) { order.status == status }
    );
  };

  // Made-to-Order Queue CRUD
  public shared ({ caller }) func createMadeToOrder(customerName : Text, garmentName : Text, measurements : Measurements, priority : OrderPriority, deliveryDeadline : Text, notes : Text) : async Nat {
    let id = nextMadeToOrderId;
    nextMadeToOrderId += 1;

    let madeToOrder : MadeToOrder = {
      id;
      customerName;
      garmentName;
      measurements;
      priority;
      deliveryDeadline;
      productionStatus = #Queued;
      notes;
      createdAt = Time.now();
    };

    madeToOrderQueue.add(id, madeToOrder);
    id;
  };

  public shared ({ caller }) func updateProductionStatus(id : Nat, newStatus : ProductionStatus) : async Bool {
    switch (madeToOrderQueue.get(id)) {
      case (null) { false };
      case (?order) {
        let updatedOrder : MadeToOrder = {
          order with productionStatus = newStatus
        };
        madeToOrderQueue.add(id, updatedOrder);
        true;
      };
    };
  };

  public shared ({ caller }) func updateMadeToOrder(id : Nat, customerName : Text, garmentName : Text, measurements : Measurements, priority : OrderPriority, deliveryDeadline : Text, notes : Text) : async Bool {
    switch (madeToOrderQueue.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedOrder : MadeToOrder = {
          id;
          customerName;
          garmentName;
          measurements;
          priority;
          deliveryDeadline;
          productionStatus = #Queued;
          notes;
          createdAt = Time.now();
        };
        madeToOrderQueue.add(id, updatedOrder);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteMadeToOrder(id : Nat) : async Bool {
    switch (madeToOrderQueue.get(id)) {
      case (null) { false };
      case (?_) {
        madeToOrderQueue.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getMadeToOrder(id : Nat) : async ?MadeToOrder {
    madeToOrderQueue.get(id);
  };

  public query ({ caller }) func listMadeToOrder() : async [MadeToOrder] {
    madeToOrderQueue.values().toArray();
  };

  // D2C Catalog CRUD
  public shared ({ caller }) func createD2CProduct(name : Text, description : Text, price : Float, fabricType : Text, sizesAvailable : [Text], inStock : Bool) : async Nat {
    let id = nextD2CProductId;
    nextD2CProductId += 1;

    let product : D2CProduct = {
      id;
      name;
      description;
      price;
      fabricType;
      sizesAvailable;
      inStock;
      createdAt = Time.now();
    };

    d2cCatalog.add(id, product);
    id;
  };

  public shared ({ caller }) func updateD2CProduct(id : Nat, name : Text, description : Text, price : Float, fabricType : Text, sizesAvailable : [Text], inStock : Bool) : async Bool {
    switch (d2cCatalog.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedProduct : D2CProduct = {
          id;
          name;
          description;
          price;
          fabricType;
          sizesAvailable;
          inStock;
          createdAt = Time.now();
        };
        d2cCatalog.add(id, updatedProduct);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteD2CProduct(id : Nat) : async Bool {
    switch (d2cCatalog.get(id)) {
      case (null) { false };
      case (?_) {
        d2cCatalog.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getD2CProduct(id : Nat) : async ?D2CProduct {
    d2cCatalog.get(id);
  };

  public query ({ caller }) func listD2CProducts() : async [D2CProduct] {
    d2cCatalog.values().toArray();
  };

  // Subscription Plan CRUD
  public shared ({ caller }) func createSubscriptionPlan(name : Text, description : Text, price : Float, billingCycle : BillingCycle, includedServices : [Text]) : async Nat {
    let id = nextSubscriptionPlanId;
    nextSubscriptionPlanId += 1;

    let plan : SubscriptionPlan = {
      id;
      name;
      description;
      price;
      billingCycle;
      includedServices;
      isActive = true;
      createdAt = Time.now();
    };

    subscriptionPlans.add(id, plan);
    id;
  };

  public shared ({ caller }) func updateSubscriptionPlan(id : Nat, name : Text, description : Text, price : Float, billingCycle : BillingCycle, includedServices : [Text], isActive : Bool) : async Bool {
    switch (subscriptionPlans.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedPlan : SubscriptionPlan = {
          id;
          name;
          description;
          price;
          billingCycle;
          includedServices;
          isActive;
          createdAt = Time.now();
        };
        subscriptionPlans.add(id, updatedPlan);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteSubscriptionPlan(id : Nat) : async Bool {
    switch (subscriptionPlans.get(id)) {
      case (null) { false };
      case (?_) {
        subscriptionPlans.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getSubscriptionPlan(id : Nat) : async ?SubscriptionPlan {
    subscriptionPlans.get(id);
  };

  public query ({ caller }) func listSubscriptionPlans() : async [SubscriptionPlan] {
    subscriptionPlans.values().toArray();
  };

  // Subscriber CRUD
  public shared ({ caller }) func createSubscriber(name : Text, phone : Text, planId : Nat, planName : Text, startDate : Text) : async Nat {
    let id = nextSubscriberId;
    nextSubscriberId += 1;

    let subscriber : Subscriber = {
      id;
      name;
      phone;
      planId;
      planName;
      startDate;
      status = #Active;
      createdAt = Time.now();
    };

    subscribers.add(id, subscriber);
    id;
  };

  public shared ({ caller }) func updateSubscriber(id : Nat, name : Text, phone : Text, planId : Nat, planName : Text, startDate : Text, status : SubscriberStatus) : async Bool {
    switch (subscribers.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedSubscriber : Subscriber = {
          id;
          name;
          phone;
          planId;
          planName;
          startDate;
          status;
          createdAt = Time.now();
        };
        subscribers.add(id, updatedSubscriber);
        true;
      };
    };
  };

  public shared ({ caller }) func updateSubscriberStatus(id : Nat, newStatus : SubscriberStatus) : async Bool {
    switch (subscribers.get(id)) {
      case (null) { false };
      case (?subscriber) {
        let updatedSubscriber : Subscriber = {
          subscriber with status = newStatus
        };
        subscribers.add(id, updatedSubscriber);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteSubscriber(id : Nat) : async Bool {
    switch (subscribers.get(id)) {
      case (null) { false };
      case (?_) {
        subscribers.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getSubscriber(id : Nat) : async ?Subscriber {
    subscribers.get(id);
  };

  public query ({ caller }) func listSubscribers() : async [Subscriber] {
    subscribers.values().toArray();
  };
};
