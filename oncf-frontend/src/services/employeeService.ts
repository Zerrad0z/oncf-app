// src/api/employeeService.ts
import axios from 'axios';
import { Employee } from '../types';

export const getEmployees = () => {
  return axios.get<Employee[]>('/employees');
};

export const getEmployee = (id: number) => {
  return axios.get<Employee>(`/employees/${id}`);
};

export const createEmployee = (employee: Omit<Employee, 'id'>) => {
  return axios.post<Employee>('/employees', employee);
};

export const updateEmployee = (id: number, employee: Partial<Employee>) => {
  return axios.put<Employee>(`/employees/${id}`, employee);
};

export const deleteEmployee = (id: number) => {
  return axios.delete(`/employees/${id}`);
};

export const getEmployeesByRole = (role: string) => {
  return axios.get<Employee[]>(`/employees/role/${role}`);
};