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
  Paper,
  useTheme,
} from "@mui/material";
import { Column } from "../utils/commonTypes";

interface PaginatedTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowsPerPageOptions?: number[];
}

function PaginatedTable<T>({
  columns,
  data,
  rowsPerPageOptions = [10, 25],
}: PaginatedTableProps<T>) {
  const theme = useTheme(); // Use the theme to access palette modes
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
    <Box sx={{ width: "100%", maxWidth: 1000, margin: "0 auto", mt: 3 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.background.paper,
        }}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[900]
                          : "#f5f5f5",
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.common.white
                          : theme.palette.text.primary,
                      borderBottom: `2px solid ${
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[800]
                          : "#e0e0e0"
                      }`,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      hover
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? theme.palette.grey[800]
                            : "#f9f9f9",
                        "&:nth-of-type(odd)": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[900]
                              : "#f9f9f9",
                        },
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.action.hover
                              : "#e0f7fa",
                        },
                        color: theme.palette.text.primary,
                      }}
                    >
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {column.format
                            ? column.format(
                                row[column.id] as string | number,
                                row
                              )
                            : (row[column.id] as React.ReactNode)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No data available.
                  </TableCell>
                </TableRow>
              )}
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
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 16px",
            marginTop: "8px",
            color: theme.palette.text.primary,
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : theme.palette.background.paper,
          }}
        />
      </Paper>
    </Box>
  );
}

export default PaginatedTable;
