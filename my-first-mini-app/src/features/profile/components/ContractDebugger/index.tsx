'use client';

import { getAllExperiencesAddresses } from '@/lib/contractUtils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ContractDebugger() {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testContract = async () => {
    setLoading(true);
    setDebugInfo('Testing contract...\n');

    try {
      // Test: Call getAllExperiences
      try {
        setDebugInfo((prev) => prev + `Calling getAllExperiences...\n`);
        const addresses = await getAllExperiencesAddresses();
        setDebugInfo(
          (prev) =>
            prev +
            `✓ getAllExperiences call successful\nAddresses returned: ${addresses.length}\n${JSON.stringify(addresses, null, 2)}\n`
        );
      } catch (err) {
        setDebugInfo(
          (prev) =>
            prev + `✗ getAllExperiences call failed:\n${JSON.stringify(err, null, 2)}\n`
        );
      }
    } catch (error) {
      setDebugInfo((prev) => prev + `Error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-surface-container rounded-lg">
      <h2 className="font-h3 text-on-surface mb-4">Contract Debugger</h2>
      <Button
        variant="primary"
        onClick={testContract}
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Testing...' : 'Test Contract'}
      </Button>
      <pre className="bg-surface-container-lowest p-4 rounded text-xs overflow-auto max-h-96 border border-outline-variant">
        {debugInfo || 'Click "Test Contract" to start debugging...'}
      </pre>
    </div>
  );
}
