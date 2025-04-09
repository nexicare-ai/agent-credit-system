/**
 * Environment configuration for the application
 * Each environment has a name, URL, and optional description
 */

export const environments = [
  {
    id: 'staging',
    name: 'Staging',
    url: 'https://dashboard-staging.nexicare.ai',
    description: 'Staging environment for pre-production testing'
  },
  {
    id: 'demo',
    name: 'Demo',
    url: 'https://dashboard-demo.nexicare.ai',
    description: 'Demo environment for public use'
  },
  {
    id: 'prod',
    name: 'Production',
    url: 'https://dashboard.nexicare.ai',
    description: 'Production environment'
  }
];

/**
 * Get the current environment based on the URL
 * @returns {Object} The current environment object
 */
export const getCurrentEnvironment = () => {
  const currentUrl = window.location.origin;
  return environments.find(env => env.url === currentUrl) || environments[0];
};

/**
 * Switch to a different environment
 * @param {string} envId - The ID of the environment to switch to
 */
export const switchEnvironment = (envId) => {
  const env = environments.find(e => e.id === envId);
  if (env) {
    window.location.href = env.url + window.location.pathname;
  }
}; 