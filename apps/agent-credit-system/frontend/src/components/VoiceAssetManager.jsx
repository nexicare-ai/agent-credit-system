import React, { useState } from 'react';
import { clinicService } from '../services/api';

const VoiceAssetManager = ({
  assetType,
  clinicId,
  className = '',
  checkButtonText,
  uploadButtonText,
  assetFoundText,
  assetNotFoundText
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [assetCheckResult, setAssetCheckResult] = useState(null);

  // Helper function to get asset type specific text
  const getAssetTypeText = (type) => {
    switch (type) {
      case 'greeting_voice':
        return 'Greeting';
      case 'voice_mail_voice':
        return 'Voice Mail';
      case 'voice_mail_anonymous_voice':
        return 'Anonymous Voice Mail';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const handleCheckAsset = async () => {
    try {
      setIsChecking(true);
      setAssetCheckResult(null);
      const result = await clinicService.checkVoiceAsset(clinicId, assetType);
      setAssetCheckResult(result);
    } catch (err) {
      console.error(`Error checking ${assetType} asset:`, err);
      setAssetCheckResult({ exists: false, error: err.message });
    } finally {
      setIsChecking(false);
    }
  };

  const handleUploadAsset = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setUploadError('Please select an audio file');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const result = await clinicService.uploadVoiceAsset(clinicId, assetType, file);

      if (result.success) {
        // Refresh the asset check
        await handleCheckAsset();
      } else {
        setUploadError(result.error || 'Failed to upload asset');
      }
    } catch (err) {
      console.error(`Error uploading ${assetType} asset:`, err);
      setUploadError(err.message || 'Failed to upload asset');
    } finally {
      setIsUploading(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const displayText = {
    checkButton: checkButtonText || `Check ${getAssetTypeText(assetType)} Asset`,
    uploadButton: uploadButtonText || 'Upload Asset',
    assetFound: assetFoundText || `${getAssetTypeText(assetType)} recording found`,
    assetNotFound: assetNotFoundText || `${getAssetTypeText(assetType)} recording not found`
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex-shrink-0 space-x-2">
        <button
          type="button"
          onClick={handleCheckAsset}
          disabled={isChecking}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-1"
        >
          {isChecking ? (
            <span>Checking...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{displayText.checkButton}</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <div className="p-2 rounded text-sm bg-red-50 text-red-700">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{uploadError}</span>
          </div>
        </div>
      )}

      {assetCheckResult && (
        <div className={`p-2 rounded text-sm ${assetCheckResult.exists ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {assetCheckResult.exists ? (
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{displayText.assetFound}</span>
              <a
                href={assetCheckResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline ml-2"
              >
                Listen
              </a>
              <label className="ml-2 px-2 py-0.5 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer inline-flex items-center space-x-1 text-xs">
                <input
                  id={`${assetType}-asset-replace`}
                  type="file"
                  accept="audio/*"
                  onChange={handleUploadAsset}
                  disabled={isUploading}
                  className="hidden"
                />
                {isUploading ? (
                  <span>Replacing...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Replace</span>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>
                {assetCheckResult.error ? (
                  <>
                    {assetCheckResult.error}
                    <button
                      onClick={() => document.getElementById(`${assetType}-asset-upload`).click()}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Try uploading again
                    </button>
                  </>
                ) : (
                  <>
                    <span>{displayText.assetNotFound}</span>
                    <label className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer inline-flex items-center space-x-1">
                      <input
                        id={`${assetType}-asset-upload`}
                        type="file"
                        accept="audio/*"
                        onChange={handleUploadAsset}
                        disabled={isUploading}
                        className="hidden"
                      />
                      {isUploading ? (
                        <span>Uploading...</span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>{displayText.uploadButton}</span>
                        </>
                      )}
                    </label>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceAssetManager;
