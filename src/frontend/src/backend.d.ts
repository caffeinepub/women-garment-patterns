import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MadeToOrder {
    id: bigint;
    customerName: string;
    deliveryDeadline: string;
    createdAt: bigint;
    garmentName: string;
    measurements: Measurements;
    productionStatus: ProductionStatus;
    notes: string;
    priority: OrderPriority;
}
export interface GarmentType {
    patternPieces: Array<PatternPiece>;
    name: string;
    description: string;
}
export interface D2CProduct {
    id: bigint;
    inStock: boolean;
    fabricType: string;
    name: string;
    createdAt: bigint;
    description: string;
    sizesAvailable: Array<string>;
    price: number;
}
export interface Customer {
    id: string;
    hip: number;
    bust: number;
    name: string;
    createdAt: bigint;
    length: number;
    phone: string;
    waist: number;
}
export interface SubscriptionPlan {
    id: bigint;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    billingCycle: BillingCycle;
    price: number;
    includedServices: Array<string>;
}
export interface Subscriber {
    id: bigint;
    status: SubscriberStatus;
    planId: bigint;
    name: string;
    createdAt: bigint;
    phone: string;
    planName: string;
    startDate: string;
}
export interface PatternPiece {
    name: string;
    instructions: string;
    cutOnFold: boolean;
}
export interface Order {
    id: string;
    hip: number;
    customerName: string;
    status: string;
    bust: number;
    createdAt: bigint;
    garmentName: string;
    length: number;
    notes: string;
    waist: number;
}
export interface Measurements {
    hip: number;
    bust: number;
    length: number;
    waist: number;
}
export enum BillingCycle {
    Quarterly = "Quarterly",
    Monthly = "Monthly",
    Yearly = "Yearly"
}
export enum OrderPriority {
    Low = "Low",
    High = "High",
    Normal = "Normal"
}
export enum ProductionStatus {
    Queued = "Queued",
    Stitching = "Stitching",
    QualityCheck = "QualityCheck",
    Ready = "Ready",
    Cutting = "Cutting"
}
export enum SubscriberStatus {
    Paused = "Paused",
    Active = "Active",
    Cancelled = "Cancelled"
}
export interface backendInterface {
    addCustomer(name: string, phone: string, bust: number, waist: number, hip: number, length: number): Promise<string>;
    calculatePattern(garmentName: string, measurements: Measurements): Promise<Array<[PatternPiece, Measurements]>>;
    createD2CProduct(name: string, description: string, price: number, fabricType: string, sizesAvailable: Array<string>, inStock: boolean): Promise<bigint>;
    createGarment(name: string, description: string, patternPieces: Array<PatternPiece>): Promise<void>;
    createMadeToOrder(customerName: string, garmentName: string, measurements: Measurements, priority: OrderPriority, deliveryDeadline: string, notes: string): Promise<bigint>;
    createOrder(customerName: string, garmentName: string, bust: number, waist: number, hip: number, length: number, notes: string): Promise<string>;
    createSubscriber(name: string, phone: string, planId: bigint, planName: string, startDate: string): Promise<bigint>;
    createSubscriptionPlan(name: string, description: string, price: number, billingCycle: BillingCycle, includedServices: Array<string>): Promise<bigint>;
    deleteCustomer(id: string): Promise<boolean>;
    deleteD2CProduct(id: bigint): Promise<boolean>;
    deleteGarment(name: string): Promise<void>;
    deleteMadeToOrder(id: bigint): Promise<boolean>;
    deleteOrder(id: string): Promise<boolean>;
    deleteSubscriber(id: bigint): Promise<boolean>;
    deleteSubscriptionPlan(id: bigint): Promise<boolean>;
    getCustomer(id: string): Promise<Customer | null>;
    getD2CProduct(id: bigint): Promise<D2CProduct | null>;
    getGarment(name: string): Promise<GarmentType>;
    getMadeToOrder(id: bigint): Promise<MadeToOrder | null>;
    getOrder(id: string): Promise<Order | null>;
    getSubscriber(id: bigint): Promise<Subscriber | null>;
    getSubscriptionPlan(id: bigint): Promise<SubscriptionPlan | null>;
    listCustomers(): Promise<Array<Customer>>;
    listD2CProducts(): Promise<Array<D2CProduct>>;
    listGarments(): Promise<Array<GarmentType>>;
    listMadeToOrder(): Promise<Array<MadeToOrder>>;
    listOrders(): Promise<Array<Order>>;
    listOrdersByStatus(status: string): Promise<Array<Order>>;
    listSubscribers(): Promise<Array<Subscriber>>;
    listSubscriptionPlans(): Promise<Array<SubscriptionPlan>>;
    updateCustomer(id: string, name: string, phone: string, bust: number, waist: number, hip: number, length: number): Promise<boolean>;
    updateD2CProduct(id: bigint, name: string, description: string, price: number, fabricType: string, sizesAvailable: Array<string>, inStock: boolean): Promise<boolean>;
    updateGarment(name: string, newDescription: string, newPatternPieces: Array<PatternPiece>): Promise<void>;
    updateMadeToOrder(id: bigint, customerName: string, garmentName: string, measurements: Measurements, priority: OrderPriority, deliveryDeadline: string, notes: string): Promise<boolean>;
    updateOrderStatus(id: string, status: string): Promise<boolean>;
    updateProductionStatus(id: bigint, newStatus: ProductionStatus): Promise<boolean>;
    updateSubscriber(id: bigint, name: string, phone: string, planId: bigint, planName: string, startDate: string, status: SubscriberStatus): Promise<boolean>;
    updateSubscriberStatus(id: bigint, newStatus: SubscriberStatus): Promise<boolean>;
    updateSubscriptionPlan(id: bigint, name: string, description: string, price: number, billingCycle: BillingCycle, includedServices: Array<string>, isActive: boolean): Promise<boolean>;
}
