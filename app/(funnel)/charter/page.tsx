import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CharterEnquiry } from './charter-enquiry';

export const metadata: Metadata = {
  title: 'Private Charter',
  description:
    'Take one of our four boats entirely to yourselves, on your dates, with a route we draw together. Four questions to start, and a real quote within one working day.',
};

export default function CharterPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CharterEnquiry />
    </Suspense>
  );
}
