import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const DeleteConfirmModal = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteHandler: () => Promise<void>;
}) => {
  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Confirm
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to cancel register?
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="error"
            onClick={async () => {
              props.deleteHandler();
              props.setOpen(false);
            }}
          >
            Yes,Cancel
          </Button>
          <Button
            sx={{ mt: 2, ml: 2 }}
            variant="contained"
            color="primary"
            onClick={() => {
              props.setOpen(false);
            }}
          >
            No,Keep
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
