import { meetings } from '@/data/meetings';
import SlideDeck from './SlideDeck';
import SlideDeckV2 from './SlideDeckV2';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return meetings.map((meeting) => ({
        id: meeting.id,
    }));
}

// V2 디자인 적용 기준일 (이 날짜 이후 회의는 V2 사용)
const V2_START_DATE = '2025-12-29';

export default async function MeetingDetail({ params }: PageProps) {
    const { id } = await params;
    const meeting = meetings.find((m) => m.id === id);

    if (!meeting) {
        notFound();
    }

    // 2025-12-29 이후 회의는 V2 디자인 사용
    const useV2 = meeting.id >= V2_START_DATE;

    return useV2 ? <SlideDeckV2 meeting={meeting} /> : <SlideDeck meeting={meeting} />;
}
