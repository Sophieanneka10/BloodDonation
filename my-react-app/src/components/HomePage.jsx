import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import {
  BloodtypeOutlined,
  CalendarMonth,
  Chat,
} from '@mui/icons-material';

function HomePage() {
  const navigate = useNavigate();
  const features = [
    {
      title: 'Blood Requests',
      description: 'Create and manage blood donation requests for yourself',
      icon: <BloodtypeOutlined sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Donation Drives',
      description: 'Find and participate in blood donation drives organized in your area',
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Messaging',
      description: 'Communicate directly with donors or recipients through our secure messaging system',
      icon: <Chat sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box component="main">
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h2" component="h1" gutterBottom>
                Donate Blood,
                <br />
                Save Lives
              </Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>
                Your donation can make a difference. Join our community of donors and help those in need.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent={{ xs: 'center', sm: 'flex-start' }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Become a Donor
                </Button>
                <Button variant="outlined" color="secondary" size="large">
                  Request Blood
                </Button>
              </Stack>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <BloodtypeOutlined sx={{ fontSize: 200, opacity: 0.9 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Our Features
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Our platform offers a comprehensive set of features designed to connect blood donors with those in need efficiently and effectively.
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
                elevation={2}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;
