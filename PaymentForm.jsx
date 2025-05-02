import { useState } from 'react';

function App() {
  const [amount, setAmount] = useState('');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');

  const handlePay = async () => {
    try {
      const res = await fetch('https://scan4food.com/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, mobile, name }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment failed.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Pay with PhonePe</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePay();
          }}
        >
          <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Pay with PhonePe
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
