import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalLoading(isOpen) {
  const [open, setOpen] = React.useState(true);
  if (isOpen) {
    setOpen(true);
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={setTimeout(() => setOpen(false), 1500)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
