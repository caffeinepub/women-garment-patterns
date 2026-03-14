import Map "mo:core/Map";
import Text "mo:core/Text";
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
    status : Text;
    notes : Text;
    createdAt : Int;
  };

  type OldActor = {
    garments : Map.Map<Text, GarmentType>;
  };

  type NewActor = {
    garments : Map.Map<Text, GarmentType>;
    customers : Map.Map<Text, Customer>;
    orders : Map.Map<Text, Order>;
  };

  public func run(old : OldActor) : NewActor {
    let newCustomers = Map.empty<Text, Customer>();
    let newOrders = Map.empty<Text, Order>();

    {
      garments = old.garments;
      customers = newCustomers;
      orders = newOrders;
    };
  };
};
