import React from 'react';
import CMSUserList from '../components/CMSUserList';

const CMSUserManagement = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <CMSUserList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSUserManagement;
