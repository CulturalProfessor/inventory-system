import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { Link } from "react-router-dom"; // Import Link

interface Column<T> {
  id: keyof T; // Key in the data object
  label: string; // Column label
  format?: (value: unknown) => string; // Optional format function
}

interface PaginatedTableProps<T> {
  columns: Column<T>[]; // Columns definition
  data: T[]; // Data to display
  rowsPerPageOptions?: number[]; // Pagination options
  getLink: (row: T) => string; // Function to generate link for each row
}

function PaginatedTable<T>({
  columns,
  data,
  rowsPerPageOptions = [ 10, 25],
  getLink,
}: PaginatedTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index} hover>
                  <Link
                    to={getLink(row)}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "contents",
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id as string}>
                        {column.format
                          ? (column.format(row[column.id]) as React.ReactNode)
                          : (row[column.id] as React.ReactNode)}
                      </TableCell>
                    ))}
                  </Link>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

export default PaginatedTable;
