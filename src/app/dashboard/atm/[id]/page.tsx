import { AtmDetail } from '@/components/atm-detail';
import { mockAtms } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default function AtmDetailPage({ params }: { params: { id: string } }) {
  const atm = mockAtms.find(a => a.id === params.id);

  if (!atm) {
    notFound();
  }

  return <AtmDetail atm={atm} />;
}
