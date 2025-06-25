import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';

function CreateDonationDriveForm({ onCancel }) {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Create Donation Drive
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField fullWidth label="Drive Title" defaultValue="e.g., Community Blood Drive" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Organized by" defaultValue="Organization or individual name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            type="time"
            label="Start Time"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            type="time"
            label="End Time"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Venue Name" defaultValue="e.g., Community Center" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Address" defaultValue="Street address" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="City" defaultValue="City name" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Blood Types Needed</Typography>
          <FormGroup row>
            {bloodTypes.map(type => (
              <FormControlLabel key={type} control={<Checkbox />} label={type} />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox />} label="Urgent need for specific blood type" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={4} label="Description" placeholder="Provide details about the donation drive" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={4} label="Additional Information" placeholder="Any additional information for donors" />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          <Button variant="contained" color="error">Create Donation Drive</Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function DonationDrives() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (showCreateForm) {
    return <CreateDonationDriveForm onCancel={() => setShowCreateForm(false)} />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Donation Drives
        </Typography>
        <Button variant="contained" color="error" onClick={() => setShowCreateForm(true)}>
          + New Drive
        </Button>
      </Box>

      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Upcoming Donation Drives
      </Typography>

      <Paper
        sx={{
          p: 8,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          No Donation Drives
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          There are no upcoming donation drives at the moment.
        </Typography>
        <Button variant="contained" onClick={() => setShowCreateForm(true)}>Create Drive</Button>
      </Paper>
    </Container>
  );
}

export default DonationDrives; 