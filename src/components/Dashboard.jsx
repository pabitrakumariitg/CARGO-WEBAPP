import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { Shipments } from "../store/Shipment.api.js";
import {
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import AddShip from "./AddShip.jsx";
import CloseIcon from "@mui/icons-material/Close";

// Styled cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Dashboard = () => {
  const { shipments, isShipmentsLoading, getAllShipments } =
    useStore(Shipments);

  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllShipments(); // Fetch shipments when component mounts
  }, [getAllShipments]);

  const handleRowClick = (shipment) => {
    navigate(`/track/${shipment.shipmentId}`);
  };

  if (isShipmentsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Click on a shipment to track it</Typography>
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            sx={{ mr: 1 }}
          >
            Sort
          </Button>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Shipment
          </Button>
        </Box>
      </Box>

      {(!shipments || shipments.length === 0) ? (
        <Typography align="center" variant="h6" sx={{ mt: 4 }}>
          No shipments found
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="shipment table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Shipment ID</StyledTableCell>
                <StyledTableCell>Container ID</StyledTableCell>
                <StyledTableCell>Current Location</StyledTableCell>
                <StyledTableCell>ETA</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.map((row) => (
                <StyledTableRow
                  key={row.id || row.shipmentId}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    "&:active": { backgroundColor: "#b3e5fc" },
                  }}
                >
                  <StyledTableCell>{row.shipmentId}</StyledTableCell>
                  <StyledTableCell>{row.containerId}</StyledTableCell>
                  <StyledTableCell>
                    {row.currentLocation?.location || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>{row.eta || "N/A"}</StyledTableCell>
                  <StyledTableCell>{row.status}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Shipment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Add Shipment
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddShip onClose={() => setOpenDialog(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
