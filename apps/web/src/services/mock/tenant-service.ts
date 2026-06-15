import type { Tenant } from "@/lib/types";
import type { TenantService } from "../types";
import { MOCK_TENANTS } from "./seed-data";

export class MockTenantService implements TenantService {
  async getTenants(): Promise<Tenant[]> {
    return [...MOCK_TENANTS];
  }

  async getTenantById(tenantId: string): Promise<Tenant | null> {
    return MOCK_TENANTS.find((t) => t.id === tenantId) ?? null;
  }
}
