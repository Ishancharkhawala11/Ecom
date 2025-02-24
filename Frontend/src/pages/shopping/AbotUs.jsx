import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl text-center">
        <img
          src="https://via.placeholder.com/800x400"
          alt="About Us"
          className="w-full rounded-2xl shadow-lg mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
        <p className="text-gray-600 text-lg mb-4">
          Welcome to our e-commerce store! We are dedicated to bringing you the best shopping experience with
          a wide variety of high-quality products. Our mission is to offer customers an effortless and enjoyable
          shopping journey with top-notch customer service and unbeatable prices.
        </p>
        <p className="text-gray-600 text-lg mb-4">
          Founded with a passion for excellence, we carefully curate each item to ensure it meets our quality
          standards. Whether you're looking for the latest trends, essential everyday items, or exclusive deals,
          we've got you covered.
        </p>
        <p className="text-gray-600 text-lg mb-4">
          Our commitment to innovation and customer satisfaction drives us to constantly improve our services.
          We believe in transparency, trust, and building lasting relationships with our customers.
        </p>
        <p className="text-gray-600 text-lg mb-4">
          Thank you for choosing us as your preferred shopping destination. We look forward to serving you and
          making your shopping experience exceptional!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
