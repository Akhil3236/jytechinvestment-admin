
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grow,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    type: "info", // 'success', 'error', 'info'
    onConfirm: null,
  });

  const showAlert = useCallback((message, type = "info", onConfirm = null) => {
    setAlertState({ open: true, message, type, onConfirm });
  }, []);

  const handleClose = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
    if (alertState.onConfirm) alertState.onConfirm();
  };

  const getIcon = (type) => {
    const iconProps = { fontSize: "large" };
    switch (type) {
      case "success":
        return <CheckCircleIcon sx={{ color: "#4CAF50", ...iconProps }} />;
      case "error":
        return <ErrorIcon sx={{ color: "#F44336", ...iconProps }} />;
      case "info":
      default:
        return <InfoIcon sx={{ color: "#2196F3", ...iconProps }} />;
    }
  };

  const getTitle = (type) =>
    type === "success" ? "Success" : type === "error" ? "Error" : "Info";

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Dialog
        open={alertState.open}
        onClose={handleClose}
        TransitionComponent={Grow} // Smooth grow animation
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            boxShadow: 6,
            minWidth: 320,
          },
        }}
      >
        <DialogTitle>
          <Fade in={alertState.open} timeout={300}>
            <Box display="flex" alignItems="center" gap={2}>
              {getIcon(alertState.type)}
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {getTitle(alertState.type)}
              </Typography>
            </Box>
          </Fade>
        </DialogTitle>

        <DialogContent>
          <Fade in={alertState.open} timeout={400}>
            <Typography sx={{ mt: 1, fontSize: "1rem", lineHeight: 1.5 }}>
              {alertState.message}
            </Typography>
          </Fade>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "#fff",
              fontWeight: "bold",
              px: 4,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                background: "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);


