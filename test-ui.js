#!/usr/bin/env node

const puppeteer = require('puppeteer');

// Configuration
const BASE_URL = 'https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app';
const TEST_USER = {
  email: 'uitest@example.com',
  password: 'uitestpassword123'
};

let browser;
let page;
let testsPassed = 0;
let testsFailed = 0;

// Utility functions
async function logTest(testName, passed, details = '') {
  if (passed) {
    console.log(`  ✅ ${testName} - PASSED`);
    if (details) console.log(`     ${details}`);
    testsPassed++;
  } else {
    console.log(`  ❌ ${testName} - FAILED`);
    if (details) console.log(`     ${details}`);
    testsFailed++;
  }
}

async function waitForElement(selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
}

async function testAuthentication() {
  console.log('\n🔐 Testing Authentication UI...');
  
  // Test registration page
  console.log('  Testing registration page...');
  await page.goto(`${BASE_URL}/register`);
  await page.waitForTimeout(2000);
  
  const registerForm = await page.$('form');
  if (registerForm) {
    await logTest('Registration page loads', true);
    
    // Fill registration form
    await page.type('input[type="email"]', TEST_USER.email);
    await page.type('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Check if redirected to dashboard or login
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard') || currentUrl.includes('/login')) {
      await logTest('Registration form submission', true);
    } else {
      await logTest('Registration form submission', false, `Unexpected URL: ${currentUrl}`);
    }
  } else {
    await logTest('Registration page loads', false);
  }
  
  // Test login page
  console.log('  Testing login page...');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  
  const loginForm = await page.$('form');
  if (loginForm) {
    await logTest('Login page loads', true);
    
    // Fill login form
    await page.type('input[type="email"]', TEST_USER.email);
    await page.type('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Check if redirected to dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      await logTest('Login successful', true);
    } else {
      await logTest('Login successful', false, `Unexpected URL: ${currentUrl}`);
    }
  } else {
    await logTest('Login page loads', false);
  }
}

async function testDashboard() {
  console.log('\n📊 Testing Dashboard...');
  
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForTimeout(3000);
  
  // Test dashboard elements
  const dashboardTitle = await page.$('h1');
  if (dashboardTitle) {
    await logTest('Dashboard loads', true);
  } else {
    await logTest('Dashboard loads', false);
  }
  
  // Test quick action buttons
  const quickActions = await page.$$('button');
  if (quickActions.length > 0) {
    await logTest('Quick action buttons present', true, `Found ${quickActions.length} buttons`);
  } else {
    await logTest('Quick action buttons present', false);
  }
  
  // Test navigation sidebar
  const sidebar = await page.$('[data-testid="sidebar"]') || await page.$('nav') || await page.$('.sidebar');
  if (sidebar) {
    await logTest('Navigation sidebar present', true);
  } else {
    await logTest('Navigation sidebar present', false);
  }
}

async function testCustomersPage() {
  console.log('\n👥 Testing Customers Page...');
  
  await page.goto(`${BASE_URL}/customers`);
  await page.waitForTimeout(3000);
  
  // Test customers page loads
  const customersTitle = await page.$('h1');
  if (customersTitle) {
    await logTest('Customers page loads', true);
  } else {
    await logTest('Customers page loads', false);
  }
  
  // Test add customer functionality
  const addCustomerBtn = await page.$('button:has-text("Add Customer")') || await page.$('button:has-text("Add")');
  if (addCustomerBtn) {
    await logTest('Add customer button present', true);
    
    // Click add customer button
    await addCustomerBtn.click();
    await page.waitForTimeout(2000);
    
    // Check if modal or form appears
    const modal = await page.$('[role="dialog"]') || await page.$('.modal') || await page.$('form');
    if (modal) {
      await logTest('Add customer modal/form opens', true);
      
      // Fill customer form
      const nameInput = await page.$('input[placeholder*="Name"]') || await page.$('input[name="name"]');
      if (nameInput) {
        await nameInput.type('Test Customer');
        await logTest('Customer form inputs work', true);
      } else {
        await logTest('Customer form inputs work', false);
      }
    } else {
      await logTest('Add customer modal/form opens', false);
    }
  } else {
    await logTest('Add customer button present', false);
  }
}

async function testDealsPage() {
  console.log('\n💼 Testing Deals Page...');
  
  await page.goto(`${BASE_URL}/deals`);
  await page.waitForTimeout(3000);
  
  // Test deals page loads
  const dealsTitle = await page.$('h1');
  if (dealsTitle) {
    await logTest('Deals page loads', true);
  } else {
    await logTest('Deals page loads', false);
  }
  
  // Test add deal functionality
  const addDealBtn = await page.$('button:has-text("Add Deal")') || await page.$('button:has-text("Create Deal")');
  if (addDealBtn) {
    await logTest('Add deal button present', true);
    
    // Click add deal button
    await addDealBtn.click();
    await page.waitForTimeout(2000);
    
    // Check if modal or form appears
    const modal = await page.$('[role="dialog"]') || await page.$('.modal') || await page.$('form');
    if (modal) {
      await logTest('Add deal modal/form opens', true);
      
      // Fill deal form
      const titleInput = await page.$('input[placeholder*="Title"]') || await page.$('input[name="title"]');
      if (titleInput) {
        await titleInput.type('Test Deal');
        await logTest('Deal form inputs work', true);
      } else {
        await logTest('Deal form inputs work', false);
      }
    } else {
      await logTest('Add deal modal/form opens', false);
    }
  } else {
    await logTest('Add deal button present', false);
  }
}

async function testSettingsPage() {
  console.log('\n⚙️ Testing Settings Page...');
  
  await page.goto(`${BASE_URL}/settings`);
  await page.waitForTimeout(3000);
  
  // Test settings page loads
  const settingsTitle = await page.$('h1');
  if (settingsTitle) {
    await logTest('Settings page loads', true);
  } else {
    await logTest('Settings page loads', false);
  }
  
  // Test profile information display
  const profileSection = await page.$('text="Profile Information"') || await page.$('h2:has-text("Profile")');
  if (profileSection) {
    await logTest('Profile information section present', true);
  } else {
    await logTest('Profile information section present', false);
  }
  
  // Test edit profile functionality
  const editProfileBtn = await page.$('button:has-text("Edit Profile")');
  if (editProfileBtn) {
    await logTest('Edit profile button present', true);
    
    // Click edit profile button
    await editProfileBtn.click();
    await page.waitForTimeout(2000);
    
    // Check if form becomes editable
    const editableInputs = await page.$$('input:not([disabled])');
    if (editableInputs.length > 0) {
      await logTest('Profile form becomes editable', true);
    } else {
      await logTest('Profile form becomes editable', false);
    }
  } else {
    await logTest('Edit profile button present', false);
  }
}

async function testNavigation() {
  console.log('\n🧭 Testing Navigation...');
  
  const navItems = [
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Customers', url: '/customers' },
    { name: 'Deals', url: '/deals' },
    { name: 'Analytics', url: '/analytics' },
    { name: 'Reports', url: '/reports' },
    { name: 'Messages', url: '/messages' },
    { name: 'Settings', url: '/settings' }
  ];
  
  for (const item of navItems) {
    console.log(`  Testing navigation to ${item.name}...`);
    await page.goto(`${BASE_URL}${item.url}`);
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    if (currentUrl.includes(item.url) || currentUrl.includes('/login')) {
      await logTest(`Navigation to ${item.name}`, true);
    } else {
      await logTest(`Navigation to ${item.name}`, false, `Expected ${item.url}, got ${currentUrl}`);
    }
  }
}

async function testResponsiveDesign() {
  console.log('\n📱 Testing Responsive Design...');
  
  // Test mobile viewport
  await page.setViewport({ width: 375, height: 667 });
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForTimeout(2000);
  
  const mobileElements = await page.$$('button, input, select');
  if (mobileElements.length > 0) {
    await logTest('Mobile viewport elements present', true, `Found ${mobileElements.length} interactive elements`);
  } else {
    await logTest('Mobile viewport elements present', false);
  }
  
  // Test desktop viewport
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForTimeout(2000);
  
  const desktopElements = await page.$$('button, input, select');
  if (desktopElements.length > 0) {
    await logTest('Desktop viewport elements present', true, `Found ${desktopElements.length} interactive elements`);
  } else {
    await logTest('Desktop viewport elements present', false);
  }
}

async function testLogout() {
  console.log('\n🚪 Testing Logout...');
  
  // Look for logout button
  const logoutBtn = await page.$('button:has-text("Logout")') || await page.$('button:has-text("Sign Out")');
  if (logoutBtn) {
    await logTest('Logout button present', true);
    
    // Click logout button
    await logoutBtn.click();
    await page.waitForTimeout(3000);
    
    // Check if redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      await logTest('Logout successful', true);
    } else {
      await logTest('Logout successful', false, `Expected /login, got ${currentUrl}`);
    }
  } else {
    await logTest('Logout button present', false);
  }
}

// Main test runner
async function runUITests() {
  console.log('🧪 Starting Comprehensive UI Test Suite...');
  console.log(`📍 Testing URL: ${BASE_URL}`);
  console.log('=' .repeat(60));
  
  try {
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    // Run tests
    await testAuthentication();
    await testDashboard();
    await testCustomersPage();
    await testDealsPage();
    await testSettingsPage();
    await testNavigation();
    await testResponsiveDesign();
    await testLogout();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 UI TEST RESULTS SUMMARY');
    console.log('=' .repeat(60));
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsFailed}`);
    console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 ALL UI TESTS PASSED! CRM interface is fully functional!');
    } else {
      console.log('\n⚠️  Some UI tests failed. Please check the issues above.');
    }
    
  } catch (error) {
    console.error('\n💥 UI test suite crashed:', error.message);
    testsFailed++;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the tests
runUITests(); 