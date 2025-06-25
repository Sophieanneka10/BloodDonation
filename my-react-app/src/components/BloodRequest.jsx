import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
} from '@mui/material';

function BloodRequest() {
  const genderOptions = ['Male', 'Female'];
  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Container maxWidth="md">
      <Paper
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          Create Blood Request
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patient Name"
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                variant="outlined"
                size="small"
                defaultValue=""
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Blood Type"
                variant="outlined"
                size="small"
                defaultValue=""
              >
                {bloodTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hospital / Clinic"
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                variant="outlined"
                size="small"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Submit Request
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default BloodRequest;
;