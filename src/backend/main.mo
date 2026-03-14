import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
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

  let garments = Map.empty<Text, GarmentType>();
  let customers = Map.empty<Text, Customer>();
  let orders = Map.empty<Text, Order>();

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
};
