import type {
  Order,
  CreateOrderInput,
  OrderStage,
  Employee,
  Tenant,
  PrescriptionData,
} from "@/lib/types";

export interface OrderService {
  getOrdersByTenant(tenantId: string): Promise<Order[]>;
  getOrderById(tenantId: string, orderId: string): Promise<Order | null>;
  createOrder(tenantId: string, input: CreateOrderInput): Promise<Order>;
  moveOrder(
    tenantId: string,
    orderId: string,
    newStage: OrderStage
  ): Promise<Order>;
  assignEmployee(
    tenantId: string,
    orderId: string,
    employeeId: string
  ): Promise<Order>;
  archiveOrder(tenantId: string, orderId: string): Promise<Order>;
  matchOrderByQuery(tenantId: string, query: string): Promise<Order[]>;
}

export interface EmployeeService {
  getEmployeesByTenant(tenantId: string): Promise<Employee[]>;
}

export interface TenantService {
  getTenants(): Promise<Tenant[]>;
  getTenantById(tenantId: string): Promise<Tenant | null>;
}

export interface OcrService {
  parsePrescriptionImage(imageDataUri: string): Promise<PrescriptionData>;
}
