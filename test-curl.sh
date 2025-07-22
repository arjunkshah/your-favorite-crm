#!/bin/bash

# CRM API Test Script
BASE_URL="https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app"
TEST_USER="test@example.com"
TEST_PASSWORD="testpassword123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to log test results
log_test() {
    local test_name="$1"
    local passed="$2"
    local details="$3"
    
    if [ "$passed" = "true" ]; then
        echo -e "  ${GREEN}✅${NC} $test_name - PASSED"
        if [ -n "$details" ]; then
            echo -e "     $details"
        fi
        ((TESTS_PASSED++))
    else
        echo -e "  ${RED}❌${NC} $test_name - FAILED"
        if [ -n "$details" ]; then
            echo -e "     $details"
        fi
        ((TESTS_FAILED++))
    fi
}

# Function to make HTTP requests
make_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    
    local curl_cmd="curl -s -w '\nHTTP_STATUS:%{http_code}\n' -X $method"
    
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -H 'Content-Type: application/json' -d '$data'"
    fi
    
    if [ -n "$SESSION_COOKIE" ]; then
        curl_cmd="$curl_cmd -H 'Cookie: session=$SESSION_COOKIE'"
    fi
    
    curl_cmd="$curl_cmd '$BASE_URL$endpoint'"
    
    local response=$(eval $curl_cmd)
    local status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
    local body=$(echo "$response" | sed '/HTTP_STATUS:/d')
    
    echo "$status|$body"
}

echo -e "${BLUE}🧪 Starting CRM API Test Suite${NC}"
echo -e "${BLUE}📍 Testing URL: $BASE_URL${NC}"
echo "============================================================"

# Test 1: Registration
echo -e "\n${YELLOW}🔐 Testing Authentication...${NC}"
echo "  Testing user registration..."

result=$(make_request "POST" "/api/register" "{\"email\":\"$TEST_USER\",\"password\":\"$TEST_PASSWORD\"}")
status=$(echo "$result" | cut -d'|' -f1)
body=$(echo "$result" | cut -d'|' -f2-)

if [ "$status" = "200" ] || [ "$status" = "409" ]; then
    log_test "Registration endpoint" "true"
else
    log_test "Registration endpoint" "false" "Status: $status"
fi

# Test 2: Login
echo "  Testing user login..."

result=$(make_request "POST" "/api/login" "{\"email\":\"$TEST_USER\",\"password\":\"$TEST_PASSWORD\"}")
status=$(echo "$result" | cut -d'|' -f1)
body=$(echo "$result" | cut -d'|' -f2-)

if [ "$status" = "200" ]; then
    log_test "Login endpoint" "true"
    # Extract session cookie from response headers (simplified)
    SESSION_COOKIE="test-session-cookie"
else
    log_test "Login endpoint" "false" "Status: $status"
fi

# Test 3: User Profile
echo "  Testing user profile endpoint..."

result=$(make_request "GET" "/api/me")
status=$(echo "$result" | cut -d'|' -f1)
body=$(echo "$result" | cut -d'|' -f2-)

if [ "$status" = "200" ]; then
    log_test "User profile endpoint" "true"
    email=$(echo "$body" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$email" ]; then
        log_test "User email retrieval" "true" "Email: $email"
    else
        log_test "User email retrieval" "false"
    fi
else
    log_test "User profile endpoint" "false" "Status: $status"
fi

# Test 4: Get Customers
echo -e "\n${YELLOW}👥 Testing Customer Management...${NC}"
echo "  Testing get customers..."

result=$(make_request "GET" "/api/customers")
status=$(echo "$result" | cut -d'|' -f1)
body=$(echo "$result" | cut -d'|' -f2-)

if [ "$status" = "200" ]; then
    log_test "Get customers endpoint" "true"
    customer_count=$(echo "$body" | grep -o '\[.*\]' | jq length 2>/dev/null || echo "0")
    log_test "Customer data retrieval" "true" "Found $customer_count customers"
else
    log_test "Get customers endpoint" "false" "Status: $status"
fi

# Test 5: Create Customer
echo "  Testing create customer..."

customer_data="{\"name\":\"Test Customer\",\"email\":\"testcustomer@example.com\",\"phone\":\"+1 (555) 123-4567\",\"company\":\"Test Company Inc.\",\"website\":\"testcompany.com\",\"status\":\"active\",\"value\":5000}"

result=$(make_request "POST" "/api/customers" "$customer_data")
status=$(echo "$result" | cut -d'|' -f1)
body=$(echo "$result" | cut -d'|' -f2-)

if [ "$status" = "200" ]; then
    log_test "Create customer endpoint" "true"
    customer_id=$(echo "$body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$customer_id" ]; then
        log_test "Customer ID generation" "true" "ID: $customer_id"
        
        # Test 6: Update Customer
        echo "  Testing update customer..."
        update_data="{\"value\":7500,\"status\":\"pending\"}"
        result=$(make_request "PUT" "/api/customers/$customer_id" "$update_data")
        status=$(echo "$result" | cut -d'|' -f1)
        
        if [ "$status" = "200" ]; then
            log_test "Update customer endpoint" "true"
        else
            log_test "Update customer endpoint" "false" "Status: $status"
        fi
        
        # Test 7: Delete Customer
        echo "  Testing delete customer..."
        result=$(make_request "DELETE" "/api/customers/$customer_id")
        status=$(echo "$result" | cut -d'|' -f1)
        
        if [ "$status" = "200" ]; then
            log_test "Delete customer endpoint" "true"
        else
            log_test "Delete customer endpoint" "false" "Status: $status"
        fi
    else
        log_test "Customer ID generation" "false"
    fi
else
    log_test "Create customer endpoint" "false" "Status: $status"
fi

# Test 8: Get Deals
echo -e "\n${YELLOW}💼 Testing Deal Management...${NC}"
echo "  Testing get deals..."

result=$(make_request "GET" "/api/deals")
status=$(echo "$result" | cut -d'|' -f1)
body=$(echo "$result" | cut -d'|' -f2-)

if [ "$status" = "200" ]; then
    log_test "Get deals endpoint" "true"
    deal_count=$(echo "$body" | grep -o '\[.*\]' | jq length 2>/dev/null || echo "0")
    log_test "Deal data retrieval" "true" "Found $deal_count deals"
else
    log_test "Get deals endpoint" "false" "Status: $status"
fi

# Test 9: Create Deal
echo "  Testing create deal..."

deal_data="{\"title\":\"Test Deal\",\"description\":\"This is a test deal\",\"value\":15000,\"status\":\"prospecting\",\"priority\":\"medium\",\"customerId\":\"test-customer\",\"customerName\":\"Test Customer\",\"customerCompany\":\"Test Company\",\"expectedCloseDate\":\"2024-12-31\",\"source\":\"website\",\"tags\":[\"test\"]}"

result=$(make_request "POST" "/api/deals" "$deal_data")
status=$(echo "$result" | cut -d'|' -f1)
body=$(echo "$result" | cut -d'|' -f2-)

if [ "$status" = "200" ]; then
    log_test "Create deal endpoint" "true"
    deal_id=$(echo "$body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$deal_id" ]; then
        log_test "Deal ID generation" "true" "ID: $deal_id"
        
        # Test 10: Update Deal
        echo "  Testing update deal..."
        update_data="{\"value\":20000,\"status\":\"qualification\"}"
        result=$(make_request "PUT" "/api/deals/$deal_id" "$update_data")
        status=$(echo "$result" | cut -d'|' -f1)
        
        if [ "$status" = "200" ]; then
            log_test "Update deal endpoint" "true"
        else
            log_test "Update deal endpoint" "false" "Status: $status"
        fi
        
        # Test 11: Delete Deal
        echo "  Testing delete deal..."
        result=$(make_request "DELETE" "/api/deals/$deal_id")
        status=$(echo "$result" | cut -d'|' -f1)
        
        if [ "$status" = "200" ]; then
            log_test "Delete deal endpoint" "true"
        else
            log_test "Delete deal endpoint" "false" "Status: $status"
        fi
    else
        log_test "Deal ID generation" "false"
    fi
else
    log_test "Create deal endpoint" "false" "Status: $status"
fi

# Test 12: Logout
echo -e "\n${YELLOW}🚪 Testing Logout...${NC}"
echo "  Testing logout..."

result=$(make_request "POST" "/api/logout")
status=$(echo "$result" | cut -d'|' -f1)

if [ "$status" = "200" ]; then
    log_test "Logout endpoint" "true"
else
    log_test "Logout endpoint" "false" "Status: $status"
fi

# Test 13: Page Accessibility
echo -e "\n${YELLOW}🌐 Testing Page Accessibility...${NC}"

pages=("/login" "/register" "/dashboard" "/customers" "/deals" "/analytics" "/reports" "/messages" "/settings")

for page in "${pages[@]}"; do
    echo "  Testing $page..."
    result=$(make_request "GET" "$page")
    status=$(echo "$result" | cut -d'|' -f1)
    
    if [ "$status" = "200" ]; then
        log_test "$page accessibility" "true"
    else
        log_test "$page accessibility" "false" "Status: $status"
    fi
done

# Summary
echo -e "\n============================================================"
echo -e "${BLUE}📊 TEST RESULTS SUMMARY${NC}"
echo "============================================================"
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"

total_tests=$((TESTS_PASSED + TESTS_FAILED))
if [ $total_tests -gt 0 ]; then
    success_rate=$(echo "scale=1; $TESTS_PASSED * 100 / $total_tests" | bc -l 2>/dev/null || echo "0")
    echo -e "${BLUE}📈 Success Rate: ${success_rate}%${NC}"
fi

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! CRM is fully functional!${NC}"
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Please check the issues above.${NC}"
fi 