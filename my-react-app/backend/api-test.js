// Simple API test script
const axios = require('axios');

const API_URL = 'http://localhost:8081/api';

async function testAPI() {
  console.log('🚀 Testing Blood Donation API...\n');

  try {
    // 1. Test Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health:', health.data);

    // 2. Test Registration
    console.log('\n2️⃣ Testing User Registration...');
    const newUser = {
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      bloodGroup: 'A+',
      phone: '9876543210',
      city: 'Delhi'
    };

    const registerResponse = await axios.post(`${API_URL}/auth/signup`, newUser);
    console.log('✅ Registration successful!');
    console.log('   User:', registerResponse.data.user.firstName, registerResponse.data.user.lastName);
    console.log('   Email:', registerResponse.data.user.email);
    console.log('   Role:', registerResponse.data.user.role);
    console.log('   Token received:', registerResponse.data.token ? 'Yes' : 'No');

    // 3. Test Login
    console.log('\n3️⃣ Testing User Login...');
    const loginData = {
      email: 'john.doe@example.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${API_URL}/auth/signin`, loginData);
    console.log('✅ Login successful!');
    console.log('   Welcome:', loginResponse.data.user.firstName, loginResponse.data.user.lastName);
    console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');

    // 4. Test Profile Access
    console.log('\n4️⃣ Testing Profile Access...');
    const token = loginResponse.data.token;
    const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile access successful!');
    console.log('   User ID:', profileResponse.data.id);
    console.log('   Blood Group:', profileResponse.data.bloodGroup);
    console.log('   Created:', new Date(profileResponse.data.createdAt).toLocaleDateString());

    // 5. Test Register Another User
    console.log('\n5️⃣ Registering another user...');
    const user2 = {
      email: 'jane.smith@example.com',
      password: 'securepass',
      firstName: 'Jane',
      lastName: 'Smith',
      bloodGroup: 'B-',
      phone: '8765432109',
      city: 'Mumbai'
    };

    const register2Response = await axios.post(`${API_URL}/auth/signup`, user2);
    console.log('✅ Second user registered!');
    console.log('   User:', register2Response.data.user.firstName, register2Response.data.user.lastName);

    console.log('\n🎉 All tests passed! Registration and Login are working perfectly!');
    console.log('\n📊 Summary:');
    console.log('   - Health check: ✅');
    console.log('   - User registration: ✅');
    console.log('   - User login: ✅');
    console.log('   - Profile access: ✅');
    console.log('   - Multiple users: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAPI();
