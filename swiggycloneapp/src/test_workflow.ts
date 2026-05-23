import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';
let token = '';

async function testWorkflow() {
  try {
    console.log('--- Starting Workflow Test ---');

    // 1. Login
    const loginRes = await axios.post(`${BASE_URL}/user/login`, {
      email: 'test@example.com',
      password: 'password123',
    });
    token = loginRes.data.token;
    console.log('✅ Login Successful');

    // 2. Add City
    const cityRes = await axios.post(`${BASE_URL}/city/create`, { name: 'Mumbai' }, { headers: { Authorization: `Bearer ${token}` } });
    const cityId = cityRes.data._id;
    console.log('✅ City Created');

    // 3. Add Category
    const categoryRes = await axios.post(`${BASE_URL}/category/create`, { name: 'Italian', status: 'active' }, { headers: { Authorization: `Bearer ${token}` } });
    const categoryId = categoryRes.data._id;
    console.log('✅ Category Created');

    // 4. Add Restaurant
    const restRes = await axios.post(`${BASE_URL}/restaurant/create`, {
        name: 'Pizza Palace',
        address: '123 MG Road',
        city_id: cityId,
        category_id: categoryId,
        lat: 19.0760,
        lng: 72.8777
    }, { headers: { Authorization: `Bearer ${token}` } });
    const restaurantId = restRes.data._id;
    console.log('✅ Restaurant Created');

    // 5. Add Menu Item
    const itemRes = await axios.post(`${BASE_URL}/item/create`, {
        restaurant_id: restaurantId,
        category_id: categoryId,
        name: 'Margherita Pizza',
        description: 'Classic cheese pizza',
        price: 299,
        veg: true,
        status: true
    }, { headers: { Authorization: `Bearer ${token}` } });
    const itemId = itemRes.data._id;
    console.log('✅ Menu Item Created');

    // 6. Add Address
    const addrRes = await axios.post(`${BASE_URL}/address/create`, {
        title: 'Home',
        address: 'Bandra West',
        landmark: 'Near Bandra Station',
        house_no: '101',
        lat: 19.0596,
        lng: 72.8295
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('✅ Address Created');

    // 7. Place Order
    const orderRes = await axios.post(`${BASE_URL}/order/create`, {
        restaurant_id: restaurantId,
        items: [{ item_id: itemId, quantity: 1, price: 299 }],
        total: 299,
        address: 'Bandra West'
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('✅ Order Placed Successfully');

    console.log('--- All Tests Passed ---');
  } catch (error: any) {
    console.error('❌ Test Failed:', error);
  }
}

testWorkflow();
