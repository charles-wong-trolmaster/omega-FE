"use client";

import { useAppDispatch, useAppSelector } from "@/Redux/store";
import { closeErrorDialog } from "@/Redux/features/error/errorDialogSlice";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const ErrorDialog = () => {
  const dispatch = useAppDispatch();
  const { isOpen, message } = useAppSelector((state) => state.errorDialog);

  const handleClose = () => {
    dispatch(closeErrorDialog());
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
