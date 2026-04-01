"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeeStore } from "@/stores/employee-store";

interface EmployeeSelectProps {
  value: string;
  onChange: (employeeId: string) => void;
  disabled?: boolean;
}

export function EmployeeSelect({
  value,
  onChange,
  disabled,
}: EmployeeSelectProps) {
  const employees = useEmployeeStore((s) => s.employees);

  return (
    <Select value={value} onValueChange={(v) => { if (v) onChange(v); }} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Assign employee" />
      </SelectTrigger>
      <SelectContent>
        {employees.map((e) => (
          <SelectItem key={e.id} value={e.id}>
            {e.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
