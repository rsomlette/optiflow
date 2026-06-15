"use client";

import { NativeSelect } from "@/components/ui/native-select";
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
    <NativeSelect
      value={value}
      onChange={(e) => {
        if (e.target.value) onChange(e.target.value);
      }}
      disabled={disabled}
      placeholder="Assign employee"
      options={employees.map((e) => ({
        value: e.id,
        label: e.name,
      }))}
    />
  );
}
