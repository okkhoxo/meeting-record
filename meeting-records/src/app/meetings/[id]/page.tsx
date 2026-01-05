import { meetings } from '@/data/meetings';
import SlideDeck from './SlideDeck';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return meetings.map((meeting) => ({
        id: meeting.id,
    }));
}

export default async function MeetingDetail({ params }: PageProps) {
    const { id } = await params;
    const meeting = meetings.find((m) => m.id === id);

    if (!meeting) {
        notFound();
    }

    return <SlideDeck meeting={meeting} />;
}
