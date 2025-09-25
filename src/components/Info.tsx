'use client';

import React from 'react';

const Info: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-800 text-white flex flex-col p-6 rounded-lg shadow-lg">
      {/* Header Section with User's Info */}
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          AB
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">Abrorbek</h2>
          <p className="text-sm text-gray-400">@kaOo9</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <p className="font-semibold text-sm text-gray-300">Mobile:</p>
          <span className="ml-2 text-sm text-gray-500">+998 90 840 03 85</span>
        </div>
        <div className="flex items-center">
          <p className="font-semibold text-sm text-gray-300">GitHub:</p>
          <a href="https://github.com/Abrorbek-on" className="ml-2 text-sm text-indigo-400 hover:text-indigo-600">
            https://github.com/Abrorbek-on
          </a>
        </div>
      </div>

      {/* Shared Links and Files */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <span className="font-semibold">1 Video</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">8 Files</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <div className="flex items-center">
            <span className="font-semibold">16 Shared Links</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">3 Groups in Common</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <button className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">
          Block User
        </button>
      </div>
    </div>
  );
};

export default Info;
