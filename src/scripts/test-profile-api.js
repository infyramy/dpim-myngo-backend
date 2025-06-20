const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001';

// You'll need to replace this with an actual access token from a logged-in user
const ACCESS_TOKEN = 'your-access-token-here';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${ACCESS_TOKEN}`
};

async function testGetProfile() {
  console.log('🧪 Testing GET /api/profile...');
  
  try {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers
    });
    
    const data = await response.json();
    console.log('✅ GET Profile Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ GET Profile Error:', error.message);
  }
}

async function testUpdateProfile() {
  console.log('🧪 Testing PUT /api/profile...');
  
  const updateData = {
    fullname: 'Updated Name',
    mobile_number: '012-345-6789',
    city: 'Kuala Lumpur',
    state: 'kuala_lumpur'
  };
  
  try {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    console.log('✅ PUT Profile Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ PUT Profile Error:', error.message);
  }
}

async function testUpdateNotifications() {
  console.log('🧪 Testing PUT /api/profile/notifications...');
  
  const notificationData = {
    email_notifications: true,
    sms_notifications: false
  };
  
  try {
    const response = await fetch(`${API_BASE}/profile/notifications`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(notificationData)
    });
    
    const data = await response.json();
    console.log('✅ PUT Notifications Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ PUT Notifications Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Profile API Tests...\n');
  
  if (ACCESS_TOKEN === 'your-access-token-here') {
    console.log('❌ Please update the ACCESS_TOKEN variable with a real token');
    return;
  }
  
  await testGetProfile();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testUpdateProfile();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testUpdateNotifications();
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testGetProfile,
  testUpdateProfile,
  testUpdateNotifications,
  runTests
}; 