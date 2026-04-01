import type { Employee } from "@/lib/types";
import type { EmployeeService } from "../types";
import { MOCK_EMPLOYEES } from "./seed-data";

export class MockEmployeeService implements EmployeeService {
  async getEmployeesByTenant(tenantId: string): Promise<Employee[]> {
    return MOCK_EMPLOYEES.filter((e) => e.tenantId === tenantId);
  }
}
