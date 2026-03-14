import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Customer,
  GarmentType,
  Measurements,
  Order,
  PatternPiece,
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
