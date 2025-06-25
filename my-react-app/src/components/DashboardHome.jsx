import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import {
  Bloodtype,
  Event,
  Warning,
  ChevronRight
} from '@mui/icons-material';

function DashboardHome() {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Blood Requests Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Blood Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No active blood requests
                </Typography>
              </Box>
              <Bloodtype color="error" />
            </Box>
            <Typography variant="h3" sx={{ my: 2 }}>
              0
            </Typography>
            <Button
              variant="text"
              color="primary"
              endIcon={<ChevronRight />}
              sx={{ textTransform: 'none', p: 0 }}
            >
              View all requests
            </Button>
          </Paper>
        </Grid>

        {/* Donation Drives Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Donation Drives
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No upcoming drives
                </Typography>
              </Box>
              <Event color="primary" />
            </Box>
            <Typography variant="h3" sx={{ my: 2 }}>
              0
            </Typography>
            <Button
              variant="text"
              color="primary"
              endIcon={<ChevronRight />}
              sx={{ textTransform: 'none', p: 0 }}
            >
              View all drives
            </Button>
          </Paper>
        </Grid>

        {/* Emergency Requests Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Emergency Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No emergency requests
                </Typography>
              </Box>
              <Warning color="error" />
            </Box>
            <Typography variant="h3" sx={{ my: 2 }}>
              0
            </Typography>
            <Button
              variant="text"
              color="primary"
              endIcon={<ChevronRight />}
              sx={{ textTransform: 'none', p: 0 }}
            >
              View emergencies
            </Button>
          </Paper>
        </Grid>

        {/* Recent Blood Requests Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Recent Blood Requests</Typography>
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ textTransform: 'none', borderRadius: 1 }}
              >
                Create Request
              </Button>
            </Box>
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No recent blood requests
            </Typography>
          </Paper>
        </Grid>

        {/* Upcoming Donation Drives Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Upcoming Donation Drives</Typography>
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ textTransform: 'none', borderRadius: 1 }}
              >
                Create Drive
              </Button>
            </Box>
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No upcoming donation drives
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardHome;