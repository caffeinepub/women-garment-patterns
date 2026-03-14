import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BillingCycle,
  Customer,
  GarmentType,
  Measurements,
  Order,
  OrderPriority,
  PatternPiece,
  ProductionStatus,
  SubscriberStatus,
} from "../backend.d";
import { useActor } from "./useActor";

export function useListGarments() {
  const { actor, isFetching } = useActor();
  return useQuery<GarmentType[]>({
    queryKey: ["garments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGarments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCalculatePattern(
  garmentName: string,
  measurements: Measurements | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[PatternPiece, Measurements]>>({
    queryKey: ["pattern", garmentName, measurements],
    queryFn: async () => {
      if (!actor || !measurements) return [];
      return actor.calculatePattern(garmentName, measurements);
    },
    enabled: !!actor && !isFetching && !!measurements && !!garmentName,
  });
}

export function useCreateGarment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      patternPieces,
    }: {
      name: string;
      description: string;
      patternPieces: PatternPiece[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createGarment(name, description, patternPieces);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["garments"] }),
  });
}

export function useUpdateGarment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      patternPieces,
    }: {
      name: string;
      description: string;
      patternPieces: PatternPiece[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateGarment(name, description, patternPieces);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["garments"] }),
  });
}

export function useDeleteGarment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteGarment(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["garments"] }),
  });
}

// ── Customers ───────────────────────────────────────────────────────────────

export function useListCustomers() {
  const { actor, isFetching } = useActor();
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCustomer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: {
      name: string;
      phone: string;
      bust: number;
      waist: number;
      hip: number;
      length: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addCustomer(
        c.name,
        c.phone,
        c.bust,
        c.waist,
        c.hip,
        c.length,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useUpdateCustomer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: {
      id: string;
      name: string;
      phone: string;
      bust: number;
      waist: number;
      hip: number;
      length: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCustomer(
        c.id,
        c.name,
        c.phone,
        c.bust,
        c.waist,
        c.hip,
        c.length,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useDeleteCustomer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteCustomer(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

// ── Orders ───────────────────────────────────────────────────────────────────

export function useListOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (o: {
      customerName: string;
      garmentName: string;
      bust: number;
      waist: number;
      hip: number;
      length: number;
      notes: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createOrder(
        o.customerName,
        o.garmentName,
        o.bust,
        o.waist,
        o.hip,
        o.length,
        o.notes,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useDeleteOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteOrder(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

// ── Made-to-Order ────────────────────────────────────────────────────────────

export function useListMadeToOrder() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["mto"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMadeToOrder();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMadeToOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (o: {
      customerName: string;
      garmentName: string;
      measurements: Measurements;
      priority: OrderPriority;
      deliveryDeadline: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createMadeToOrder(
        o.customerName,
        o.garmentName,
        o.measurements,
        o.priority,
        o.deliveryDeadline,
        o.notes,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mto"] }),
  });
}

export function useUpdateProductionStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: bigint;
      newStatus: ProductionStatus;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProductionStatus(id, newStatus);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mto"] }),
  });
}

export function useDeleteMadeToOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteMadeToOrder(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mto"] }),
  });
}

// ── D2C Catalog ──────────────────────────────────────────────────────────────

export function useListD2CProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["d2c"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listD2CProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateD2CProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      name: string;
      description: string;
      price: number;
      fabricType: string;
      sizesAvailable: string[];
      inStock: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createD2CProduct(
        p.name,
        p.description,
        p.price,
        p.fabricType,
        p.sizesAvailable,
        p.inStock,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["d2c"] }),
  });
}

export function useUpdateD2CProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: bigint;
      name: string;
      description: string;
      price: number;
      fabricType: string;
      sizesAvailable: string[];
      inStock: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateD2CProduct(
        p.id,
        p.name,
        p.description,
        p.price,
        p.fabricType,
        p.sizesAvailable,
        p.inStock,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["d2c"] }),
  });
}

export function useDeleteD2CProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteD2CProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["d2c"] }),
  });
}

// ── Subscription Plans ───────────────────────────────────────────────────────

export function useListSubscriptionPlans() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubscriptionPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSubscriptionPlan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      name: string;
      description: string;
      price: number;
      billingCycle: BillingCycle;
      includedServices: string[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createSubscriptionPlan(
        p.name,
        p.description,
        p.price,
        p.billingCycle,
        p.includedServices,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });
}

export function useUpdateSubscriptionPlan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: bigint;
      name: string;
      description: string;
      price: number;
      billingCycle: BillingCycle;
      includedServices: string[];
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSubscriptionPlan(
        p.id,
        p.name,
        p.description,
        p.price,
        p.billingCycle,
        p.includedServices,
        p.isActive,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });
}

export function useDeleteSubscriptionPlan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSubscriptionPlan(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });
}

// ── Subscribers ──────────────────────────────────────────────────────────────

export function useListSubscribers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubscribers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSubscriber() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: {
      name: string;
      phone: string;
      planId: bigint;
      planName: string;
      startDate: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createSubscriber(
        s.name,
        s.phone,
        s.planId,
        s.planName,
        s.startDate,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscribers"] }),
  });
}

export function useUpdateSubscriberStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: bigint;
      newStatus: SubscriberStatus;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSubscriberStatus(id, newStatus);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscribers"] }),
  });
}

export function useDeleteSubscriber() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSubscriber(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscribers"] }),
  });
}
