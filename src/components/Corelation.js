import { HvCard, HvCardContent, HvTypography } from '@hitachivantara/uikit-react-core'
import { Box } from '@mui/material'
import React from 'react'

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



// Styled components for Material-UI table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#000", // Black header
      color: "#fff", // White text
      fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: "#000", // Black text for values
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#f7f7f7", // Light gray background for odd rows
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#ffffff", // White background for even rows
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  
 

const Corelation = () => {
  return (
    <Box>
        <HvCard bgcolor='white' style={{borderRadius: "0px",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}} statusColor="red"> 
            <HvCardContent>
                <HvTypography variant="title3">Intensity Chart</HvTypography>
                <TableContainer component={Paper} elevation={0} style={{ width: "100%", overflowX: "auto" }} >
                <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                  <TableBody>
                    
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          Example Text
                        </StyledTableCell>
                        <StyledTableCell align="right">Example Text</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          Example Text
                        </StyledTableCell>
                        <StyledTableCell align="right">Example Text</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          Example Text
                        </StyledTableCell>
                        <StyledTableCell align="right">Example Text</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          Example Text
                        </StyledTableCell>
                        <StyledTableCell align="right">Example Text</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          Example Text
                        </StyledTableCell>
                        <StyledTableCell align="right">Example Text</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          Example Text
                        </StyledTableCell>
                        <StyledTableCell align="right">Example Text</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          Example Text
                        </StyledTableCell>
                        <StyledTableCell align="right">Example Text</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          Example Text
                        </StyledTableCell>
                        <StyledTableCell align="right">Example Text</StyledTableCell>
                      </StyledTableRow>
            
                  </TableBody>
                </Table>
              </TableContainer>
                
            </HvCardContent>
        </HvCard>
    </Box>
  )
}

export default Corelation