#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app';
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123'
};

// Test results tracking
let testsPassed = 0;
let testsFailed = 0;
let sessionCookie = null;

// Utility functions
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CRM-Test-Script/1.0',
        ...options.headers
      }
    };

    if (sessionCookie) {
      requestOptions.headers.Cookie = `session=${sessionCookie}`;
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            rawData: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            rawData: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test functions
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  // Test registration
  console.log('  Testing user registration...');
  const registerResponse = await makeRequest(`${BASE_URL}/api/register`, {
    method: 'POST',
    body: TEST_USER
  });
  
  if (registerResponse.status === 200 || registerResponse.status === 409) {
    console.log('  ✅ Registration endpoint working');
    testsPassed++;
  } else {
    console.log(`  ❌ Registration failed: ${registerResponse.status}`);
    testsFailed++;
  }

  // Test login
  console.log('  Testing user login...');
  const loginResponse = await makeRequest(`${BASE_URL}/api/login`, {
    method: 'POST',
    body: TEST_USER
  });
  
  if (loginResponse.status === 200) {
    console.log('  ✅ Login successful');
    // Extract session cookie
    const setCookie = loginResponse.headers['set-cookie'];
    if (setCookie) {
      sessionCookie = setCookie[0].split(';')[0].split('=')[1];
      console.log('  ✅ Session cookie captured');
    }
    testsPassed++;
  } else {
    console.log(`  ❌ Login failed: ${loginResponse.status}`);
    testsFailed++;
  }

  // Test /api/me endpoint
  console.log('  Testing user profile endpoint...');
  const meResponse = await makeRequest(`${BASE_URL}/api/me`);
  
  if (meResponse.status === 200 && meResponse.data) {
    console.log('  ✅ User profile endpoint working');
    console.log(`  📧 User email: ${meResponse.data.email}`);
    testsPassed++;
  } else {
    console.log(`  ❌ User profile failed: ${meResponse.status}`);
    testsFailed++;
  }
}

async function testCustomers() {
  console.log('\n👥 Testing Customer Management...');
  
  // Test getting customers
  console.log('  Testing get customers...');
  const getCustomersResponse = await makeRequest(`${BASE_URL}/api/customers`);
  
  if (getCustomersResponse.status === 200) {
    console.log('  ✅ Get customers endpoint working');
    console.log(`  📊 Found ${getCustomersResponse.data?.length || 0} customers`);
    testsPassed++;
  } else {
    console.log(`  ❌ Get customers failed: ${getCustomersResponse.status}`);
    testsFailed++;
  }

  // Test creating a customer
  console.log('  Testing create customer...');
  const newCustomer = {
    name: 'Test Customer',
    email: 'testcustomer@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Test Company Inc.',
    website: 'testcompany.com',
    status: 'active',
    value: 5000
  };
  
  const createCustomerResponse = await makeRequest(`${BASE_URL}/api/customers`, {
    method: 'POST',
    body: newCustomer
  });
  
  if (createCustomerResponse.status === 200) {
    console.log('  ✅ Create customer successful');
    console.log(`  🆔 Customer ID: ${createCustomerResponse.data?.id}`);
    testsPassed++;
    
    // Test updating the customer
    console.log('  Testing update customer...');
    const updateData = { value: 7500, status: 'pending' };
    const updateResponse = await makeRequest(`${BASE_URL}/api/customers/${createCustomerResponse.data.id}`, {
      method: 'PUT',
      body: updateData
    });
    
    if (updateResponse.status === 200) {
      console.log('  ✅ Update customer successful');
      testsPassed++;
    } else {
      console.log(`  ❌ Update customer failed: ${updateResponse.status}`);
      testsFailed++;
    }
    
    // Test deleting the customer
    console.log('  Testing delete customer...');
    const deleteResponse = await makeRequest(`${BASE_URL}/api/customers/${createCustomerResponse.data.id}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.status === 200) {
      console.log('  ✅ Delete customer successful');
      testsPassed++;
    } else {
      console.log(`  ❌ Delete customer failed: ${deleteResponse.status}`);
      testsFailed++;
    }
  } else {
    console.log(`  ❌ Create customer failed: ${createCustomerResponse.status}`);
    testsFailed++;
  }
}

async function testDeals() {
  console.log('\n💼 Testing Deal Management...');
  
  // Test getting deals
  console.log('  Testing get deals...');
  const getDealsResponse = await makeRequest(`${BASE_URL}/api/deals`);
  
  if (getDealsResponse.status === 200) {
    console.log('  ✅ Get deals endpoint working');
    console.log(`  📊 Found ${getDealsResponse.data?.length || 0} deals`);
    testsPassed++;
  } else {
    console.log(`  ❌ Get deals failed: ${getDealsResponse.status}`);
    testsFailed++;
  }

  // Test creating a deal
  console.log('  Testing create deal...');
  const newDeal = {
    title: 'Test Deal',
    description: 'This is a test deal for verification',
    value: 15000,
    status: 'prospecting',
    priority: 'medium',
    customerId: 'test-customer-id',
    customerName: 'Test Customer',
    customerCompany: 'Test Company',
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'website',
    tags: ['test', 'verification']
  };
  
  const createDealResponse = await makeRequest(`${BASE_URL}/api/deals`, {
    method: 'POST',
    body: newDeal
  });
  
  if (createDealResponse.status === 200) {
    console.log('  ✅ Create deal successful');
    console.log(`  🆔 Deal ID: ${createDealResponse.data?.id}`);
    testsPassed++;
    
    // Test updating the deal
    console.log('  Testing update deal...');
    const updateData = { value: 20000, status: 'qualification' };
    const updateResponse = await makeRequest(`${BASE_URL}/api/deals/${createDealResponse.data.id}`, {
      method: 'PUT',
      body: updateData
    });
    
    if (updateResponse.status === 200) {
      console.log('  ✅ Update deal successful');
      testsPassed++;
    } else {
      console.log(`  ❌ Update deal failed: ${updateResponse.status}`);
      testsFailed++;
    }
    
    // Test deleting the deal
    console.log('  Testing delete deal...');
    const deleteResponse = await makeRequest(`${BASE_URL}/api/deals/${createDealResponse.data.id}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.status === 200) {
      console.log('  ✅ Delete deal successful');
      testsPassed++;
    } else {
      console.log(`  ❌ Delete deal failed: ${deleteResponse.status}`);
      testsFailed++;
    }
  } else {
    console.log(`  ❌ Create deal failed: ${createDealResponse.status}`);
    testsFailed++;
  }
}

async function testPages() {
  console.log('\n🌐 Testing Page Accessibility...');
  
  const pages = [
    '/login',
    '/register', 
    '/dashboard',
    '/customers',
    '/deals',
    '/analytics',
    '/reports',
    '/messages',
    '/settings'
  ];
  
  for (const page of pages) {
    console.log(`  Testing ${page}...`);
    const response = await makeRequest(`${BASE_URL}${page}`);
    
    if (response.status === 200) {
      console.log(`  ✅ ${page} accessible`);
      testsPassed++;
    } else {
      console.log(`  ❌ ${page} failed: ${response.status}`);
      testsFailed++;
    }
  }
}

async function testLogout() {
  console.log('\n🚪 Testing Logout...');
  
  const logoutResponse = await makeRequest(`${BASE_URL}/api/logout`, {
    method: 'POST'
  });
  
  if (logoutResponse.status === 200) {
    console.log('  ✅ Logout successful');
    testsPassed++;
  } else {
    console.log(`  ❌ Logout failed: ${logoutResponse.status}`);
    testsFailed++;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🧪 Starting Comprehensive CRM Test Suite...');
  console.log(`📍 Testing URL: ${BASE_URL}`);
  console.log('=' .repeat(60));
  
  try {
    await testAuthentication();
    await testCustomers();
    await testDeals();
    await testPages();
    await testLogout();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' .repeat(60));
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsFailed}`);
    console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! CRM is fully functional!');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }
    
  } catch (error) {
    console.error('\n💥 Test suite crashed:', error.message);
    testsFailed++;
  }
}

// Run the tests
runAllTests(); 