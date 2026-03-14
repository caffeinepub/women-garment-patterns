import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GarmentType {
    patternPieces: Array<PatternPiece>;
    name: string;
    description: string;
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
export interface backendInterface {
    addCustomer(name: string, phone: string, bust: number, waist: number, hip: number, length: number): Promise<string>;
    calculatePattern(garmentName: string, measurements: Measurements): Promise<Array<[PatternPiece, Measurements]>>;
    createGarment(name: string, description: string, patternPieces: Array<PatternPiece>): Promise<void>;
    createOrder(customerName: string, garmentName: string, bust: number, waist: number, hip: number, length: number, notes: string): Promise<string>;
    deleteCustomer(id: string): Promise<boolean>;
    deleteGarment(name: string): Promise<void>;
    deleteOrder(id: string): Promise<boolean>;
    getCustomer(id: string): Promise<Customer | null>;
    getGarment(name: string): Promise<GarmentType>;
    getOrder(id: string): Promise<Order | null>;
    listCustomers(): Promise<Array<Customer>>;
    listGarments(): Promise<Array<GarmentType>>;
    listOrders(): Promise<Array<Order>>;
    listOrdersByStatus(status: string): Promise<Array<Order>>;
    updateCustomer(id: string, name: string, phone: string, bust: number, waist: number, hip: number, length: number): Promise<boolean>;
    updateGarment(name: string, newDescription: string, newPatternPieces: Array<PatternPiece>): Promise<void>;
    updateOrderStatus(id: string, status: string): Promise<boolean>;
}
