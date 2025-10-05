import React from 'react'
import {
  Table,
  TableProps,
  TableHead,
  TableHeadProps,
  TableBody,
  TableBodyProps,
  TableRow,
  TableRowProps,
  TableCell,
  TableCellProps,
  TableContainer,
  TableContainerProps,
  Paper,
  PaperProps,
  TablePagination,
  TablePaginationProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { borderRadius, shadows } from '../tokens'

// Styled Table with consistent design
const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '12px 16px',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: theme.palette.grey[50],
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  '& .MuiTableBody-root .MuiTableRow-root': {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child .MuiTableCell-root': {
      borderBottom: 'none',
    },
  },
}))

// Styled Table Container
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: borderRadius.lg,
  boxShadow: shadows.md,
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[100],
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
  },
}))

// Data Table Component
export interface DataTableProps extends Omit<TableProps, 'component'> {
  columns: Array<{
    id: string
    label: string
    minWidth?: number
    align?: 'left' | 'center' | 'right'
    format?: (value: any) => React.ReactNode
  }>
  rows: Array<Record<string, any>>
  loading?: boolean
  emptyMessage?: string
  stickyHeader?: boolean
  size?: 'small' | 'medium'
  hover?: boolean
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  loading = false,
  emptyMessage = 'No data available',
  stickyHeader = false,
  size = 'medium',
  hover = true,
  sx,
  ...props
}) => {
  return (
    <StyledTableContainer>
      <StyledTable
        stickyHeader={stickyHeader}
        size={size}
        sx={{
          '& .MuiTableBody-root .MuiTableRow-root': {
            '&:hover': hover ? undefined : 'none',
          },
          ...sx,
        }}
        {...props}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  const value = row[column.id]
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value) : value}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  )
}

// Table Pagination Component
export interface TablePaginationProps extends Omit<TablePaginationProps, 'component'> {
  page: number
  rowsPerPage: number
  totalRows: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  rowsPerPageOptions?: number[]
  showFirstButton?: boolean
  showLastButton?: boolean
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  showFirstButton = true,
  showLastButton = true,
  ...props
}) => {
  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange(newPage)
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10))
  }

  return (
    <TablePagination
      component="div"
      count={totalRows}
      page={page}
      onPageChange={handlePageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      showFirstButton={showFirstButton}
      showLastButton={showLastButton}
      {...props}
    />
  )
}

// Export all table components
export {
  Table as BaseTable,
  TableHead as BaseTableHead,
  TableBody as BaseTableBody,
  TableRow as BaseTableRow,
  TableCell as BaseTableCell,
  TableContainer as BaseTableContainer,
  Paper as BasePaper,
}
