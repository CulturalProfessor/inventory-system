export interface Column<T> {
  id: keyof T;
  label: string;
  format?: (value: string | number, row: T) => React.ReactNode;
}

export interface Product {
  _id: string;
  store: number;
  dept: number;
  size: number;
  type: number;
  date: string;
}

export interface ProductToPredict extends Product {
  isholiday: number;
  week: number;
  year: number;
}

export interface User {
  username: string;
  id?: string;
  image?: string;
  email?: string;
}

export interface CustomError {
  message: string;
  status?: number;
  data?: unknown;
}
