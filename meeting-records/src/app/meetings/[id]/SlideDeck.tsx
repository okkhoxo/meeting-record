'use client';

import { useState, useEffect, useCallback } from 'react';
import { MeetingRecord, PriorityItem } from '@/data/meetings';
import styles from './page.module.css';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import MarketingPriorityBoard, { loadSavedBoardItems, loadBoardDirty, priorityMeta } from './MarketingPriorityBoard';

interface SavedBoard {
    title: string;
    accent: string;
    items: PriorityItem[];
}

interface SlideDeckProps {
    meeting: MeetingRecord;
}

const slideIcons: Record<string, string> = {
    'quote': '💬',
    'title': '📋',
    'achievements': '✅',
    'organization': '👥',
    'operations': '⚙️',
    'financial': '💰',
    'strategy': '🚀',
    'vision': '🎯',
    'timeline': '📅',
    'kpi': '📊',
    'comparison': '📈',
    'deadline': '⏰',
    'summary': '✅',
    'intro': '🏢',
    'business': '📊',
    'orgchart': '👥',
    'agenda': '📝'
};

const slideColors: Record<string, string> = {
    'quote': '#F59E0B',
    'title': '#3B82F6',
    'achievements': '#10B981',
    'organization': '#8B5CF6',
    'operations': '#F59E0B',
    'financial': '#EF4444',
    'strategy': '#06B6D4',
    'vision': '#EC4899',
    'timeline': '#8B5CF6',
    'kpi': '#10B981',
    'comparison': '#3B82F6',
    'deadline': '#EF4444',
    'summary': '#10B981',
    'intro': '#8B5CF6',
    'business': '#06B6D4',
    'orgchart': '#3B82F6',
    'agenda': '#F59E0B'
};

const statusColors: Record<string, string> = {
    'success': '#10B981',
    'warning': '#F59E0B',
    'danger': '#EF4444',
    'info': '#3B82F6'
};

const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
    'critical': { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', border: '#EF4444' },
    'high': { bg: 'rgba(245, 158, 11, 0.2)', text: '#F59E0B', border: '#F59E0B' },
    'medium': { bg: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6', border: '#3B82F6' }
};


export default function SlideDeck({ meeting }: SlideDeckProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    // 저장(commit)된 우선순위 보드 → 마지막에 '한눈에 보기' 요약 페이지로 추가됨
    const [savedBoards, setSavedBoards] = useState<Record<string, SavedBoard>>({});
    // 보드별 미저장 수정 여부 (요약 페이지의 stale 경고용)
    const [dirtyBoards, setDirtyBoards] = useState<Record<string, boolean>>({});

    // slides 필드가 있으면 새 구조 사용, 없으면 기존 구조로 슬라이드 생성
    const hasNewStructure = meeting.slides && meeting.slides.length > 0;

    // priorityBoard 슬라이드 목록 (요약 페이지 생성 기준)
    const boardSlides = (meeting.slides || []).filter(s => s.type === 'priorityBoard' && s.boardId);

    // 마운트 시: 이전에 저장한 보드를 localStorage에서 복원해 요약 페이지를 되살림
    useEffect(() => {
        const restored: Record<string, SavedBoard> = {};
        const restoredDirty: Record<string, boolean> = {};
        boardSlides.forEach(s => {
            const saved = loadSavedBoardItems(s.boardId!);
            if (saved) restored[s.boardId!] = { title: s.title, accent: s.boardAccent || '#10B981', items: saved };
            if (loadBoardDirty(s.boardId!)) restoredDirty[s.boardId!] = true;
        });
        if (Object.keys(restored).length > 0) setSavedBoards(restored);
        if (Object.keys(restoredDirty).length > 0) setDirtyBoards(restoredDirty);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meeting.id]);

    // 보드 저장 시: 요약 페이지 추가/갱신 후 해당 페이지로 이동
    const handleBoardSaved = useCallback((boardId: string, items: PriorityItem[]) => {
        const slide = (meeting.slides || []).find(s => s.boardId === boardId);
        const entry: SavedBoard = {
            title: slide?.title || '마케팅 우선순위',
            accent: slide?.boardAccent || '#10B981',
            items,
        };
        setSavedBoards(prev => ({ ...prev, [boardId]: entry }));
        setDirtyBoards(prev => ({ ...prev, [boardId]: false }));

        // 새로 추가될 요약 슬라이드의 인덱스 계산 후 이동
        const allBoardSlides = (meeting.slides || []).filter(s => s.type === 'priorityBoard' && s.boardId);
        const savedSet = new Set(Object.keys(savedBoards));
        savedSet.add(boardId);
        const orderedSaved = allBoardSlides.filter(s => savedSet.has(s.boardId!));
        const pos = orderedSaved.findIndex(s => s.boardId === boardId);
        const baseCount = meeting.slides ? meeting.slides.length : 0;
        if (pos >= 0) setCurrentSlide(baseCount + pos);
    }, [meeting.slides, savedBoards]);

    // 보드 초기화 시: 해당 요약 페이지 제거
    const handleBoardReset = useCallback((boardId: string) => {
        setSavedBoards(prev => {
            if (!prev[boardId]) return prev;
            const next = { ...prev };
            delete next[boardId];
            return next;
        });
        setDirtyBoards(prev => {
            const next = { ...prev };
            delete next[boardId];
            return next;
        });
    }, []);

    // 보드의 미저장 수정 여부 통지 → 요약 페이지 stale 경고
    const handleBoardDirtyChange = useCallback((boardId: string, dirty: boolean) => {
        setDirtyBoards(prev => (prev[boardId] === dirty ? prev : { ...prev, [boardId]: dirty }));
    }, []);

    // 저장된 보드 → 요약 페이지 목록 (보드 등장 순서대로)
    const summaryBoards = boardSlides
        .filter(s => savedBoards[s.boardId!])
        .map(s => ({ boardId: s.boardId!, stale: !!dirtyBoards[s.boardId!], ...savedBoards[s.boardId!] }));

    // 기존 구조일 때 슬라이드 개수 계산: 타이틀 + agendaItems + specialNotes + achievements + businessUpdates
    const getOldStructureSlideCount = () => {
        let count = 1; // 타이틀 슬라이드
        if (meeting.agendaItems && meeting.agendaItems.length > 0) count++;
        if (meeting.specialNotes && meeting.specialNotes.length > 0) count++;
        if (meeting.achievements && meeting.achievements.length > 0) count++;
        if (meeting.businessUpdates && meeting.businessUpdates.length > 0) count++;
        return count;
    };

    const baseSlideCount = hasNewStructure ? meeting.slides!.length : getOldStructureSlideCount();
    const totalSlides = baseSlideCount + summaryBoards.length;

    // 요약 페이지 제거 등으로 슬라이드 수가 줄면 현재 위치를 범위 안으로 보정
    useEffect(() => {
        if (currentSlide > totalSlides - 1) setCurrentSlide(Math.max(0, totalSlides - 1));
    }, [totalSlides, currentSlide]);

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 보드 편집 폼(input/textarea/select) 포커스 중에는 슬라이드 네비게이션을 비활성화
            const t = e.target as HTMLElement | null;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    const renderNewSlide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const icon = slideIcons[slideData.type] || '📄';
        const color = slideColors[slideData.type] || '#3B82F6';

        // 🎛️ 인터랙티브 마케팅 우선순위 보드
        if (slideData.type === 'priorityBoard' && slideData.boardId) {
            return (
                <MarketingPriorityBoard
                    key={slideData.boardId}
                    boardId={slideData.boardId}
                    accent={slideData.boardAccent || '#10B981'}
                    title={slideData.title}
                    subtitle={slideData.subtitle}
                    index={index}
                    initialItems={slideData.priorityItems || []}
                    onSaved={handleBoardSaved}
                    onReset={handleBoardReset}
                    onDirtyChange={handleBoardDirtyChange}
                />
            );
        }

        if (slideData.type === 'title') {
            return (
                <div className={styles.slideContentCenter}>
                    <h1 className={styles.titleSlideMain}>{slideData.title}</h1>
                    {slideData.subtitle && (
                        <p className={styles.titleSlideSubtitle}>{slideData.subtitle}</p>
                    )}
                </div>
            );
        }

        // 💬 Quote 슬라이드 - 감정/메시지 전달용
        if (slideData.type === 'quote') {
            const gradientColors: Record<string, string> = {
                'danger': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                'warning': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                'success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                'info': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            };
            const quoteStatus = slideData.sections?.[0]?.status || 'info';
            const gradient = gradientColors[quoteStatus] || gradientColors['info'];
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '4rem 8rem',
                    position: 'relative',
                    overflow: 'hidden',
                    textAlign: 'center'
                }}>
                    {/* 배경 글로우 */}
                    <div style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${quoteStatus === 'danger' ? 'rgba(239,68,68,0.08)' : quoteStatus === 'warning' ? 'rgba(245,158,11,0.08)' : quoteStatus === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)'} 0%, transparent 70%)`,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0
                    }} />

                    {/* 메인 타이틀 (큰 글씨) */}
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        background: gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '2rem',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.3,
                        zIndex: 1,
                        maxWidth: '900px'
                    }}
                    dangerouslySetInnerHTML={{ __html: slideData.title }}
                    />

                    {/* 서브타이틀 */}
                    {slideData.subtitle && (
                        <p style={{
                            fontSize: '1.5rem',
                            color: '#888',
                            fontWeight: 300,
                            letterSpacing: '0.02em',
                            marginBottom: '2.5rem',
                            lineHeight: 1.6,
                            maxWidth: '700px',
                            zIndex: 1
                        }}
                        dangerouslySetInnerHTML={{ __html: slideData.subtitle }}
                        />
                    )}

                    {/* 구분선 */}
                    <div style={{
                        width: '80px',
                        height: '4px',
                        background: gradient,
                        borderRadius: '2px',
                        marginBottom: '2.5rem',
                        zIndex: 1
                    }} />

                    {/* 하단 아이템들 */}
                    {slideData.sections?.[0]?.items && (
                        <div style={{ zIndex: 1, maxWidth: '700px' }}>
                            {slideData.sections[0].items.map((item, iIdx) => (
                                <p key={iIdx} style={{
                                    fontSize: '1.2rem',
                                    color: '#aaa',
                                    lineHeight: 1.8,
                                    marginBottom: '0.5rem'
                                }}
                                dangerouslySetInnerHTML={{ __html: item }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // 🆕 Intro 슬라이드 - 회사 소개용 임팩트 있는 디자인
        if (slideData.type === 'intro') {
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '4rem',
                    padding: '0 4rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* 왼쪽: 텍스트 영역 */}
                    <div style={{
                        flex: 1,
                        textAlign: 'left',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {/* 배경 그라데이션 원 */}
                        <div style={{
                            position: 'absolute',
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0) 70%)',
                            top: '50%',
                            left: '0',
                            transform: 'translateY(-50%)',
                            zIndex: -1
                        }} />

                        {/* 메인 타이틀 */}
                        <h1 style={{
                            fontSize: '4.5rem',
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em'
                        }}>
                            {slideData.title}
                        </h1>

                        {/* 서브타이틀 */}
                        {slideData.subtitle && (
                            <p style={{
                                fontSize: '1.8rem',
                                color: '#888',
                                fontWeight: 300,
                                letterSpacing: '0.05em',
                                marginBottom: '1.5rem'
                            }}>
                                {slideData.subtitle}
                            </p>
                        )}

                        {/* 장식 라인 */}
                        <div style={{
                            width: '100px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                            borderRadius: '2px'
                        }} />
                    </div>

                    {/* 오른쪽: 이미지 + 자막 영역 */}
                    {slideData.image && (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative'
                        }}>
                            {/* 이미지 */}
                            <div style={{
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                                border: '2px solid #333',
                                position: 'relative'
                            }}>
                                <img
                                    src={slideData.image}
                                    alt="intro"
                                    style={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                                {/* 자막 오버레이 */}
                                {slideData.caption && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                                        padding: '2rem 1.5rem 1.5rem',
                                    }}>
                                        <p style={{
                                            color: '#fff',
                                            fontSize: '1.2rem',
                                            fontWeight: 500,
                                            margin: 0,
                                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }}>
                                            {slideData.caption}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // 🆕 Business 슬라이드 - 사업 영역 카드형 디자인
        if (slideData.type === 'business' && slideData.businessAreas) {
            return (
                <div className={styles.slideContent}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>{slideData.title}</h2>
                    {slideData.subtitle && (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '3rem' }}>
                            {slideData.subtitle}
                        </p>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${slideData.businessAreas.length}, 1fr)`,
                        gap: '2rem',
                        padding: '0 2rem'
                    }}>
                        {slideData.businessAreas.map((area, aIdx) => (
                            <div key={aIdx} style={{
                                background: `linear-gradient(135deg, ${area.color}15 0%, ${area.color}05 100%)`,
                                border: `2px solid ${area.color}40`,
                                borderRadius: '24px',
                                padding: '2.5rem',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* 아이콘 배경 */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    fontSize: '8rem',
                                    opacity: 0.1
                                }}>{area.icon}</div>

                                {/* 헤더 */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <span style={{
                                        fontSize: '2.5rem',
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: `${area.color}20`,
                                        borderRadius: '16px'
                                    }}>{area.icon}</span>
                                    <h3 style={{
                                        fontSize: '1.8rem',
                                        fontWeight: 700,
                                        color: area.color
                                    }}>{area.name}</h3>
                                </div>

                                {/* 아이템 리스트 */}
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {area.items.map((item, iIdx) => (
                                        <li key={iIdx} style={{
                                            padding: '0.8rem 0',
                                            borderBottom: iIdx < area.items.length - 1 ? '1px solid #333' : 'none',
                                            color: '#ccc',
                                            fontSize: '1.15rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem'
                                        }}>
                                            <span style={{ color: area.color, fontSize: '0.8rem' }}>●</span>
                                            <span dangerouslySetInnerHTML={{ __html: item }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* 플로우 다이어그램 */}
                    {slideData.flowDiagram && (
                        <div style={{
                            marginTop: '3rem',
                            padding: '2rem',
                            background: 'linear-gradient(135deg, #ffffff08 0%, #ffffff02 100%)',
                            borderRadius: '20px',
                            border: '1px solid #333'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '2rem'
                            }}>
                                {/* 왼쪽 박스 */}
                                <div style={{
                                    background: `linear-gradient(135deg, ${slideData.flowDiagram.left.color}20 0%, ${slideData.flowDiagram.left.color}10 100%)`,
                                    border: `2px solid ${slideData.flowDiagram.left.color}`,
                                    borderRadius: '16px',
                                    padding: '1.5rem 2rem',
                                    minWidth: '200px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                                        {slideData.flowDiagram.left.title}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: slideData.flowDiagram.left.color, marginBottom: '1rem' }}>
                                        {slideData.flowDiagram.left.subtitle}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {slideData.flowDiagram.left.items.map((item, i) => (
                                            <div key={i} style={{ fontSize: '0.85rem', color: '#aaa' }}dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </div>
                                </div>

                                {/* 화살표 */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: '#10B981',
                                        padding: '0.5rem 1rem',
                                        background: '#10B98120',
                                        borderRadius: '20px'
                                    }}>
                                        {slideData.flowDiagram.arrow}
                                    </div>
                                    <div style={{
                                        fontSize: '2rem',
                                        color: '#10B981'
                                    }}>→</div>
                                </div>

                                {/* 오른쪽 박스 */}
                                <div style={{
                                    background: `linear-gradient(135deg, ${slideData.flowDiagram.right.color}20 0%, ${slideData.flowDiagram.right.color}10 100%)`,
                                    border: `2px solid ${slideData.flowDiagram.right.color}`,
                                    borderRadius: '16px',
                                    padding: '1.5rem 2rem',
                                    minWidth: '200px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                                        {slideData.flowDiagram.right.title}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: slideData.flowDiagram.right.color, marginBottom: '1rem' }}>
                                        {slideData.flowDiagram.right.subtitle}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {slideData.flowDiagram.right.items.map((item, i) => (
                                            <div key={i} style={{ fontSize: '0.85rem', color: '#aaa' }}dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // 🆕 OrgChart 슬라이드 - 조직도 도식화
        if (slideData.type === 'orgchart' && slideData.orgChart) {
            return (
                <div className={styles.slideContent}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>{slideData.title}</h2>
                    {slideData.subtitle && (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
                            {slideData.subtitle}
                        </p>
                    )}

                    {/* 임원진 (한 줄) */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        {slideData.orgChart.map((person, pIdx) => (
                            <div key={pIdx} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                {/* 임원 카드 */}
                                <div style={{
                                    background: `linear-gradient(135deg, ${person.color}20 0%, ${person.color}10 100%)`,
                                    border: `2px solid ${person.color}`,
                                    borderRadius: '20px',
                                    padding: '1.5rem 2rem',
                                    minWidth: '180px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    boxShadow: `0 8px 32px ${person.color}30`
                                }}>
                                    {/* 이름 */}
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 800,
                                        color: '#fff',
                                        marginBottom: '0.5rem'
                                    }}>{person.name}</div>

                                    {/* 역할 */}
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: person.color,
                                        fontWeight: 500,
                                        lineHeight: 1.4
                                    }}>{person.role}</div>
                                </div>

                                {/* 하위 멤버가 있으면 연결선 + 멤버 표시 */}
                                {person.members && person.members.length > 0 && (
                                    <>
                                        {/* 연결선 */}
                                        <div style={{
                                            width: '2px',
                                            height: '24px',
                                            background: `linear-gradient(180deg, ${person.color}, ${person.color}50)`
                                        }} />

                                        {/* 하위 멤버들 */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.8rem',
                                            flexWrap: 'wrap',
                                            justifyContent: 'center'
                                        }}>
                                            {person.members.map((member, mIdx) => (
                                                <div key={mIdx} style={{
                                                    background: `linear-gradient(135deg, ${person.color}20 0%, ${person.color}10 100%)`,
                                                    border: `2px solid ${person.color}`,
                                                    borderRadius: '20px',
                                                    padding: '1.5rem 2rem',
                                                    minWidth: '180px',
                                                    textAlign: 'center',
                                                    boxShadow: `0 8px 32px ${person.color}30`
                                                }}>
                                                    {/* 멤버 이름 */}
                                                    <div style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: 800,
                                                        color: '#fff',
                                                        marginBottom: member.role ? '0.5rem' : 0
                                                    }}>
                                                        {member.name}
                                                    </div>
                                                    {/* 멤버 역할 */}
                                                    {member.role && (
                                                        <div style={{
                                                            fontSize: '0.85rem',
                                                            color: person.color,
                                                            fontWeight: 500,
                                                            lineHeight: 1.4
                                                        }}>
                                                            {member.role}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // 🆕 TreeChart 슬라이드 - 가족 관계도 스타일 트리 구조
        if (slideData.treeChart) {
            const tree = slideData.treeChart;
            return (
                <div className={styles.slideContent}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>{slideData.title}</h2>
                    {slideData.subtitle && (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>
                            {slideData.subtitle}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                        {/* 루트 노드 */}
                        <div style={{
                            background: `linear-gradient(135deg, ${tree.root.color}30 0%, ${tree.root.color}15 100%)`,
                            border: `2px solid ${tree.root.color}`,
                            borderRadius: '20px',
                            padding: '1rem 2.5rem',
                            textAlign: 'center',
                            boxShadow: `0 8px 32px ${tree.root.color}40`,
                            position: 'relative'
                        }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{tree.root.name}</div>
                            {tree.root.subtitle && (
                                <div style={{ fontSize: '0.85rem', color: tree.root.color, marginTop: '0.3rem' }}>{tree.root.subtitle}</div>
                            )}
                        </div>

                        {/* 루트 → 1차 연결선 (세로) */}
                        <div style={{ width: '2px', height: '24px', background: `linear-gradient(180deg, ${tree.root.color}, #444)` }} />

                        {/* 1차 가로 연결선 */}
                        <div style={{
                            width: '85%',
                            height: '2px',
                            background: 'linear-gradient(90deg, #444 0%, #888 50%, #444 100%)'
                        }} />

                        {/* 1차 자식 */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1.5rem',
                            width: '95%'
                        }}>
                            {tree.children.map((child, cIdx) => (
                                <div key={cIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                    {/* 세로 연결선 */}
                                    <div style={{ width: '2px', height: '24px', background: `linear-gradient(180deg, #888, ${child.color})` }} />

                                    {/* 1차 자식 카드 */}
                                    <div style={{
                                        background: `linear-gradient(135deg, ${child.color}25 0%, ${child.color}10 100%)`,
                                        border: `2px solid ${child.color}`,
                                        borderRadius: '14px',
                                        padding: '0.6rem 1.5rem',
                                        textAlign: 'center',
                                        boxShadow: `0 4px 20px ${child.color}30`
                                    }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{child.name}</div>
                                    </div>

                                    {/* 2차 자식이 있으면 */}
                                    {child.children.length > 0 && (
                                        <>
                                            {/* 세로 연결선 */}
                                            <div style={{ width: '2px', height: '16px', background: `linear-gradient(180deg, ${child.color}, ${child.color}60)` }} />

                                            {/* 2차 가로 연결선 (자식이 2개 이상일 때) */}
                                            {child.children.length > 1 && (
                                                <div style={{
                                                    width: '90%',
                                                    height: '2px',
                                                    background: `linear-gradient(90deg, ${child.color}40 0%, ${child.color} 50%, ${child.color}40 100%)`
                                                }} />
                                            )}

                                            {/* 2차 자식들 */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                width: '100%'
                                            }}>
                                                {child.children.map((leaf, lIdx) => (
                                                    <div key={lIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                                        {/* 세로 연결선 */}
                                                        <div style={{ width: '2px', height: '12px', background: `${child.color}60` }} />

                                                        {/* 2차 자식 카드 */}
                                                        <div style={{
                                                            background: `linear-gradient(135deg, ${child.color}15 0%, ${child.color}05 100%)`,
                                                            border: `1px solid ${child.color}60`,
                                                            borderRadius: '10px',
                                                            padding: '0.6rem 0.8rem',
                                                            textAlign: 'left',
                                                            width: '100%'
                                                        }}>
                                                            <div style={{
                                                                fontSize: '0.85rem',
                                                                fontWeight: 700,
                                                                color: child.color,
                                                                marginBottom: '0.4rem',
                                                                textAlign: 'center',
                                                                whiteSpace: 'nowrap'
                                                            }}>{leaf.name}</div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                                {leaf.items.map((item, iIdx) => (
                                                                    <div key={iIdx} style={{
                                                                        fontSize: '0.7rem',
                                                                        color: '#aaa',
                                                                        paddingLeft: '0.7rem',
                                                                        position: 'relative',
                                                                        lineHeight: 1.4,
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis'
                                                                    }}>
                                                                        <span style={{ position: 'absolute', left: 0, color: child.color }}>·</span>
                                                                        <span dangerouslySetInnerHTML={{ __html: item }} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* sections (경고 등) */}
                    {slideData.sections && slideData.sections.map((section, sIdx) => (
                        <div key={sIdx} style={{
                            marginTop: '2rem',
                            padding: '1rem 1.5rem',
                            background: section.status ? `${statusColors[section.status]}15` : '#ffffff08',
                            borderRadius: '12px',
                            border: `1px solid ${section.status ? statusColors[section.status] + '40' : '#333'}`
                        }}>
                            {section.title && <div style={{ fontWeight: 700, color: section.status ? statusColors[section.status] : '#fff', marginBottom: '0.5rem' }}>{section.title}</div>}
                            {section.items.map((item, iIdx) => (
                                <div key={iIdx} style={{ fontSize: '0.9rem', color: '#aaa', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </div>
                    ))}
                </div>
            );
        }

        // 🆕 Operations with MeetingFlow - 회의 진행 방식
        if (slideData.type === 'operations' && slideData.meetingFlow) {
            return (
                <div className={styles.slideContent}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>{slideData.title}</h2>
                    {slideData.subtitle && (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '3rem' }}>
                            {slideData.subtitle}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '3rem', padding: '0 2rem' }}>
                        {/* 기본 규칙 */}
                        <div style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #F59E0B15 0%, #F59E0B05 100%)',
                            border: '2px solid #F59E0B40',
                            borderRadius: '24px',
                            padding: '2rem'
                        }}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#F59E0B',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem'
                            }}>
                                <span style={{
                                    width: '40px',
                                    height: '40px',
                                    background: '#F59E0B20',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>⏰</span>
                                기본 규칙
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {slideData.meetingFlow.rules.map((rule, rIdx) => (
                                    <div key={rIdx} style={{
                                        background: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: '12px',
                                        padding: '0.8rem 1.2rem',
                                        fontSize: '1.1rem',
                                        color: '#fff',
                                        fontWeight: 500
                                    }}>
                                        {rule}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 진행 순서 */}
                        <div style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #3B82F615 0%, #3B82F605 100%)',
                            border: '2px solid #3B82F640',
                            borderRadius: '24px',
                            padding: '2rem'
                        }}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#3B82F6',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem'
                            }}>
                                <span style={{
                                    width: '40px',
                                    height: '40px',
                                    background: '#3B82F620',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>📝</span>
                                진행 순서
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {slideData.meetingFlow.steps.map((step, sIdx) => (
                                    <div key={sIdx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            color: '#fff',
                                            flexShrink: 0
                                        }}>
                                            {sIdx + 1}
                                        </div>
                                        <div style={{
                                            fontSize: '1.15rem',
                                            color: '#fff',
                                            fontWeight: 500
                                        }}>
                                            {step}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // 🆕 Strategy with Goals - 목표 카드형
        if (slideData.type === 'strategy' && slideData.goals) {
            return (
                <div className={styles.slideContent}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>{slideData.title}</h2>
                    {slideData.subtitle && (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '3rem' }}>
                            {slideData.subtitle}
                        </p>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${slideData.goals.length}, 1fr)`,
                        gap: '2rem',
                        padding: '0 2rem'
                    }}>
                        {slideData.goals.map((goal, gIdx) => (
                            <div key={gIdx} style={{
                                background: goal.highlight
                                    ? `linear-gradient(135deg, ${goal.color}25 0%, ${goal.color}10 100%)`
                                    : `linear-gradient(135deg, ${goal.color}15 0%, ${goal.color}05 100%)`,
                                border: `2px solid ${goal.color}${goal.highlight ? '' : '40'}`,
                                borderRadius: '24px',
                                padding: '2.5rem',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: goal.highlight ? `0 12px 40px ${goal.color}30` : 'none'
                            }}>
                                {/* 배경 아이콘 */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    fontSize: '6rem',
                                    opacity: 0.1
                                }}>{goal.icon}</div>

                                {/* 헤더 */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <span style={{
                                        fontSize: '2rem',
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: `${goal.color}20`,
                                        borderRadius: '16px'
                                    }}>{goal.icon}</span>
                                    <h3 style={{
                                        fontSize: '1.6rem',
                                        fontWeight: 700,
                                        color: goal.color
                                    }}>{goal.title}</h3>
                                </div>

                                {/* 아이템 리스트 */}
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {goal.items.map((item, iIdx) => (
                                        <li key={iIdx} style={{
                                            padding: '0.7rem 0',
                                            borderBottom: iIdx < goal.items.length - 1 ? '1px solid #333' : 'none',
                                            color: '#ccc',
                                            fontSize: '1.1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem'
                                        }}>
                                            <span style={{ color: goal.color, fontSize: '1.2rem' }}>→</span>
                                            <span dangerouslySetInnerHTML={{ __html: item }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // strategy 슬라이드에서 FOCUS/축소 구분
        const isStrategySlide = slideData.type === 'strategy';

        // FOCUS/축소 섹션이 있는 strategy 슬라이드만 특별 처리 (linkUrl이 없는 경우에만)
        if (isStrategySlide && slideData.sections && !slideData.linkUrl) {
            const focusSections = slideData.sections.filter(s => s.title.includes('FOCUS'));
            const otherSections = slideData.sections.filter(s => !s.title.includes('FOCUS'));

            // FOCUS 섹션이 있을 때만 특별 레이아웃 사용
            if (focusSections.length > 0) {
                return (
                    <div className={styles.slideContent}>
                        <div className={styles.newSlideHeader}>
                            <div className={styles.slideHeaderLeft}>
                                <span className={styles.slideIcon} style={{ background: `${color}20`, color: color }}>{icon}</span>
                                <span className={styles.slideNumber} style={{ color: color }}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                        <h2 className={styles.newSlideTitle} style={{ color: color }}>{slideData.title}</h2>

                    {/* FOCUS 섹션 - 한 줄에 크게 */}
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                        {focusSections.map((section, sIdx) => (
                            <div key={sIdx} className={styles.sectionCard} style={{
                                flex: 1,
                                borderTopColor: '#10B981',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                                border: '2px solid rgba(16, 185, 129, 0.4)',
                                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
                            }}>
                                <h3 className={styles.sectionTitle} style={{ color: '#10B981', fontSize: '1.8rem' }}>{section.title}</h3>
                                <ul className={styles.sectionList}>
                                    {section.items.map((item, iIdx) => (
                                        <li key={iIdx} style={{ '--accent-color': '#10B981', fontSize: '1.3rem' } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                        {/* 유지/축소 섹션 - 한 줄에 작게 */}
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {otherSections.map((section, sIdx) => {
                                const isReduced = section.title.includes('축소');
                                return (
                                    <div key={sIdx} className={styles.sectionCard} style={{
                                        flex: 1,
                                        borderTopColor: isReduced ? '#666' : '#F59E0B',
                                        background: isReduced ? '#0a0a0a' : '#111',
                                        opacity: isReduced ? 0.5 : 0.8,
                                        padding: '1.2rem'
                                    }}>
                                        <h3 className={styles.sectionTitle} style={{
                                            color: isReduced ? '#666' : '#F59E0B',
                                            fontSize: '1.1rem',
                                            marginBottom: '0.8rem'
                                        }}>{section.title}</h3>
                                        <ul className={styles.sectionList} style={{ fontSize: '0.9rem' }}>
                                            {section.items.map((item, iIdx) => (
                                                <li key={iIdx} style={{
                                                    '--accent-color': isReduced ? '#666' : '#F59E0B',
                                                    fontSize: '1rem',
                                                    padding: '0.4rem 0'
                                                } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: item }} />
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }
        }

        // KPI 슬라이드
        if (slideData.type === 'kpi' && slideData.kpis) {
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: `${color}20`, color: color }}>{icon}</span>
                            <span className={styles.slideNumber} style={{ color: color }}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: color }}>{slideData.title}</h2>
                    {slideData.subtitle && <p style={{ color: '#888', fontSize: '1.3rem', marginBottom: '1.5rem' }}>{slideData.subtitle}</p>}

                    {/* KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(slideData.kpis.length, 4)}, 1fr)`, gap: '1rem', marginBottom: '2rem' }}>
                        {slideData.kpis.map((kpi, kIdx) => (
                            <div key={kIdx} style={{
                                background: `linear-gradient(135deg, ${statusColors[kpi.status]}15 0%, ${statusColors[kpi.status]}05 100%)`,
                                border: `2px solid ${statusColors[kpi.status]}40`,
                                borderRadius: '16px',
                                padding: '1.2rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{kpi.label}</div>
                                <div style={{ color: statusColors[kpi.status], fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>{kpi.value}</div>
                                {kpi.target && <div style={{ color: '#666', fontSize: '0.8rem' }}>{kpi.target}</div>}
                            </div>
                        ))}
                    </div>

                    {/* Sections */}
                    {slideData.sections && (
                        <div className={styles.sectionsGrid}>
                            {slideData.sections.map((section, sIdx) => (
                                <div key={sIdx} className={styles.sectionCard} style={{ borderTopColor: color }}>
                                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                                    <ul className={styles.sectionList}>
                                        {section.items.map((item, iIdx) => {
                                            const isUrl = item.startsWith('http://') || item.startsWith('https://');
                                            return (
                                                <li key={iIdx} style={{ '--accent-color': color } as React.CSSProperties}>
                                                    {isUrl ? (
                                                        <a href={item} target="_blank" rel="noopener noreferrer" style={{
                                                            color: color,
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            wordBreak: 'break-all'
                                                        }}>
                                                            {item}
                                                        </a>
                                                    ) : (
                                                        <span dangerouslySetInnerHTML={{ __html: item }} />
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Comparison 슬라이드 (테이블)
        if (slideData.type === 'comparison' && slideData.comparison) {
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: `${color}20`, color: color }}>{icon}</span>
                            <span className={styles.slideNumber} style={{ color: color }}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: color }}>{slideData.title}</h2>
                    {slideData.subtitle && <p style={{ color: '#888', fontSize: '1.3rem', marginBottom: '1.5rem' }}>{slideData.subtitle}</p>}

                    {/* Table */}
                    <div style={{
                        background: '#111',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #333',
                        marginBottom: '2rem'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: `${color}20` }}>
                                    {slideData.comparison.headers.map((header, hIdx) => (
                                        <th key={hIdx} style={{
                                            padding: '1rem 1.5rem',
                                            textAlign: 'left',
                                            color: color,
                                            fontWeight: 700,
                                            fontSize: '1.2rem',
                                            borderBottom: `2px solid ${color}`
                                        }}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {slideData.comparison.rows.map((row, rIdx) => (
                                    <tr key={rIdx} style={{ borderBottom: '1px solid #222' }}>
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} style={{
                                                padding: '1rem 1.5rem',
                                                color: cIdx === 0 ? '#fff' : '#aaa',
                                                fontWeight: cIdx === 0 ? 600 : 400,
                                                fontSize: '1.1rem'
                                            }}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Sections */}
                    {slideData.sections && (
                        <div className={styles.sectionsGrid}>
                            {slideData.sections.map((section, sIdx) => (
                                <div key={sIdx} className={styles.sectionCard} style={{ borderTopColor: color }}>
                                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                                    <ul className={styles.sectionList}>
                                        {section.items.map((item, iIdx) => (
                                            <li key={iIdx} style={{ '--accent-color': color } as React.CSSProperties}dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Deadline 슬라이드
        if (slideData.type === 'deadline' && slideData.deadlines) {
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: `${color}20`, color: color }}>{icon}</span>
                            <span className={styles.slideNumber} style={{ color: color }}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: color }}>{slideData.title}</h2>
                    {slideData.subtitle && <p style={{ color: '#888', fontSize: '1.3rem', marginBottom: '1.5rem' }}>{slideData.subtitle}</p>}

                    {/* Deadline Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {slideData.deadlines.map((deadline, dIdx) => (
                            <div key={dIdx} style={{
                                background: priorityColors[deadline.priority].bg,
                                border: `2px solid ${priorityColors[deadline.priority].border}`,
                                borderRadius: '12px',
                                padding: '1.2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.3rem' }}>{deadline.task}</div>
                                    <div style={{ color: '#888', fontSize: '0.95rem' }}>담당: {deadline.assignee}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        color: priorityColors[deadline.priority].text,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        marginBottom: '0.3rem'
                                    }}>{deadline.date}</div>
                                    <span style={{
                                        background: priorityColors[deadline.priority].text,
                                        color: '#000',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>{deadline.priority}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Optional Image */}
                    {slideData.image && (
                        <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={slideData.image} alt={slideData.caption || ''} style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
                            {slideData.caption && (
                                <div style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', color: '#aaa', fontSize: '0.95rem', textAlign: 'center' }}>
                                    {slideData.caption}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sections */}
                    {slideData.sections && (
                        <div className={styles.sectionsGrid}>
                            {slideData.sections.map((section, sIdx) => (
                                <div key={sIdx} className={styles.sectionCard} style={{ borderTopColor: color }}>
                                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                                    <ul className={styles.sectionList}>
                                        {section.items.map((item, iIdx) => (
                                            <li key={iIdx} style={{ '--accent-color': color } as React.CSSProperties}dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Timeline 슬라이드
        if (slideData.type === 'timeline' && slideData.timeline) {
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: `${color}20`, color: color }}>{icon}</span>
                            <span className={styles.slideNumber} style={{ color: color }}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: color }}>{slideData.title}</h2>
                    {slideData.subtitle && <p style={{ color: '#888', fontSize: '1.3rem', marginBottom: '2rem' }}>{slideData.subtitle}</p>}

                    {/* Timeline */}
                    <div style={{ position: 'relative', paddingTop: '3rem' }}>
                        {/* Timeline line - 상단 고정 */}
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '10%',
                            right: '10%',
                            height: '4px',
                            background: 'linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6, #EC4899)',
                            borderRadius: '2px',
                            zIndex: 0
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', gap: '1rem' }}>
                            {slideData.timeline.map((item, tIdx) => (
                                <div key={tIdx} style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    {/* Node - 상단에 위치 */}
                                    <div style={{
                                        width: item.status === 'current' ? '28px' : '18px',
                                        height: item.status === 'current' ? '28px' : '18px',
                                        borderRadius: '50%',
                                        background: item.status === 'completed' ? '#10B981' : item.status === 'current' ? '#8B5CF6' : '#444',
                                        border: item.status === 'current' ? '4px solid #8B5CF680' : '3px solid #222',
                                        marginBottom: '1.5rem',
                                        boxShadow: item.status === 'current' ? '0 0 20px #8B5CF6' : 'none',
                                        zIndex: 1,
                                        position: 'absolute',
                                        top: '-40px'
                                    }} />

                                    {/* Content */}
                                    <div style={{
                                        background: item.status === 'current' ? 'linear-gradient(135deg, #8B5CF620 0%, #8B5CF610 100%)' : '#111',
                                        border: item.status === 'current' ? '2px solid #8B5CF6' : '1px solid #333',
                                        borderRadius: '12px',
                                        padding: '1.5rem 1rem',
                                        width: '100%',
                                        minHeight: '140px'
                                    }}>
                                        <div style={{
                                            color: item.status === 'current' ? '#8B5CF6' : '#666',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            marginBottom: '0.5rem'
                                        }}>{item.date}</div>
                                        <div style={{
                                            color: '#fff',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            marginBottom: '0.5rem',
                                            whiteSpace: 'nowrap'
                                        }}>{item.title}</div>
                                        <div style={{ color: '#888', fontSize: '0.8rem', lineHeight: 1.6 }}>{item.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // Summary 슬라이드
        if (slideData.type === 'summary' && slideData.sections) {
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: `${color}20`, color: color }}>{icon}</span>
                            <span className={styles.slideNumber} style={{ color: color }}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: color }}>{slideData.title}</h2>
                    {slideData.subtitle && <p style={{ color: '#888', fontSize: '1.3rem', marginBottom: '1.5rem' }}>{slideData.subtitle}</p>}

                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${slideData.sections.length}, 1fr)`, gap: '1.5rem' }}>
                        {slideData.sections.map((section, sIdx) => {
                            const sectionColor = section.status ? statusColors[section.status] : color;
                            return (
                                <div key={sIdx} style={{
                                    background: `linear-gradient(135deg, ${sectionColor}15 0%, ${sectionColor}05 100%)`,
                                    border: `2px solid ${sectionColor}40`,
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    borderTop: `4px solid ${sectionColor}`
                                }}>
                                    <h3 style={{ color: sectionColor, fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>{section.title}</h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {section.items.map((item, iIdx) => (
                                            <li key={iIdx} style={{
                                                color: '#ccc',
                                                fontSize: '1.1rem',
                                                padding: '0.6rem 0',
                                                borderBottom: '1px solid #333',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '0.5rem'
                                            }}>
                                                <span style={{ color: sectionColor }}>→</span> <span dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        // 🆕 Agenda 슬라이드 - 논의 안건용
        if (slideData.type === 'agenda' && slideData.sections) {
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: `${color}20`, color: color }}>{icon}</span>
                            <span className={styles.slideNumber} style={{ color: color }}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: color }}>{slideData.title}</h2>
                    {slideData.subtitle && <p style={{ color: '#888', fontSize: '1.3rem', marginBottom: '1.5rem' }}>{slideData.subtitle}</p>}

                    {/* 이미지가 있으면 표시 (단일 또는 복수) */}
                    {slideData.images && slideData.images.length > 0 && (
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            {slideData.images.map((img: { src: string; caption?: string }, imgIdx: number) => (
                                <div key={imgIdx} style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <img src={img.src} alt={img.caption || ''} style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block', background: '#0a0a0a' }} />
                                    {img.caption && (
                                        <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.05)', color: '#aaa', fontSize: '0.85rem', textAlign: 'center' }}>
                                            {img.caption}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {slideData.image && !slideData.images && (
                        <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={slideData.image} alt={slideData.caption || ''} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block', background: '#0a0a0a' }} />
                            {slideData.caption && (
                                <div style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', color: '#aaa', fontSize: '0.95rem', textAlign: 'center' }}>
                                    {slideData.caption}
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {slideData.sections.map((section, sIdx) => {
                            const sectionColor = section.status ? statusColors[section.status] : color;
                            return (
                                <div key={sIdx} style={{
                                    background: `linear-gradient(135deg, ${sectionColor}15 0%, ${sectionColor}05 100%)`,
                                    border: `2px solid ${sectionColor}40`,
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    borderLeft: `4px solid ${sectionColor}`
                                }}>
                                    <h3 style={{ color: sectionColor, fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>{section.title}</h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {section.items.map((item, iIdx) => (
                                            <li key={iIdx} style={{
                                                color: '#ccc',
                                                fontSize: '1.1rem',
                                                padding: '0.6rem 0',
                                                borderBottom: iIdx < section.items.length - 1 ? '1px solid #333' : 'none',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '0.5rem'
                                            }}>
                                                <span style={{ color: sectionColor, flexShrink: 0 }}>→</span>
                                                <span style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        // Default 슬라이드 (기존 + 향상된 스타일)
        return (
            <div className={styles.slideContent}>
                <div className={styles.newSlideHeader}>
                    <div className={styles.slideHeaderLeft}>
                        <span className={styles.slideIcon} style={{ background: `${color}20`, color: color }}>{icon}</span>
                        <span className={styles.slideNumber} style={{ color: color }}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                </div>
                <h2 className={styles.newSlideTitle} style={{ color: color }}>
                    {slideData.title}
                </h2>
                {slideData.linkUrl && (
                    <a
                        href={slideData.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            marginBottom: '1rem',
                            background: color,
                            color: '#000',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        ↗ 자세히 보기
                    </a>
                )}
                {slideData.subtitle && (
                    <p style={{
                        color: '#888',
                        fontSize: '1.3rem',
                        marginBottom: '1.5rem'
                    }}>
                        {slideData.subtitle}
                    </p>
                )}

                {/* KPI가 있으면 먼저 표시 */}
                {slideData.kpis && slideData.kpis.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${slideData.kpis.length}, 1fr)`, gap: '1.5rem', marginBottom: '2rem' }}>
                        {slideData.kpis.map((kpi, kIdx) => (
                            <div key={kIdx} style={{
                                background: `linear-gradient(135deg, ${statusColors[kpi.status]}15 0%, ${statusColors[kpi.status]}05 100%)`,
                                border: `2px solid ${statusColors[kpi.status]}40`,
                                borderRadius: '16px',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ color: '#888', fontSize: '1rem', marginBottom: '0.5rem' }}>{kpi.label}</div>
                                <div style={{ color: statusColors[kpi.status], fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{kpi.value}</div>
                                {kpi.target && <div style={{ color: '#666', fontSize: '0.9rem' }}>{kpi.target}</div>}
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.sectionsGrid}>
                    {slideData.sections?.map((section, sIdx) => {
                        const sectionColor = section.status ? statusColors[section.status] : color;
                        const isHighlight = section.highlight;
                        return (
                            <div key={sIdx} className={styles.sectionCard} style={{
                                borderTopColor: sectionColor,
                                background: isHighlight ? `linear-gradient(135deg, ${sectionColor}15 0%, ${sectionColor}05 100%)` : '#111',
                                border: isHighlight ? `2px solid ${sectionColor}40` : '1px solid #222'
                            }}>
                                <h3 className={styles.sectionTitle} style={{ color: isHighlight ? sectionColor : '#fff' }}>{section.title}</h3>
                                <ul className={styles.sectionList}>
                                    {section.items.map((item, iIdx) => {
                                        const isUrl = item.startsWith('http://') || item.startsWith('https://');
                                        return (
                                            <li key={iIdx} style={{ '--accent-color': sectionColor } as React.CSSProperties}>
                                                {isUrl ? (
                                                    <a href={item} target="_blank" rel="noopener noreferrer" style={{
                                                        color: sectionColor,
                                                        textDecoration: 'underline',
                                                        cursor: 'pointer',
                                                        wordBreak: 'break-all'
                                                    }}>
                                                        {item}
                                                    </a>
                                                ) : <span dangerouslySetInnerHTML={{ __html: item }} />}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // 기존 구조의 슬라이드 순서 정의
    const getOldSlideOrder = () => {
        const slides: { type: string; data: unknown }[] = [];
        slides.push({ type: 'title', data: null });
        if (meeting.agendaItems && meeting.agendaItems.length > 0) {
            slides.push({ type: 'agenda', data: meeting.agendaItems });
        }
        if (meeting.achievements && meeting.achievements.length > 0) {
            slides.push({ type: 'achievements', data: meeting.achievements });
        }
        if (meeting.specialNotes && meeting.specialNotes.length > 0) {
            slides.push({ type: 'specialNotes', data: meeting.specialNotes });
        }
        if (meeting.businessUpdates && meeting.businessUpdates.length > 0) {
            slides.push({ type: 'businessUpdates', data: meeting.businessUpdates });
        }
        return slides;
    };

    // 기존 구조 슬라이드 렌더링
    const renderOldSlide = (slideIndex: number) => {
        const slideOrder = getOldSlideOrder();
        const currentSlideData = slideOrder[slideIndex];

        if (!currentSlideData) return null;

        // 타이틀 슬라이드
        if (currentSlideData.type === 'title') {
            return (
                <div className={styles.slideContentCenter}>
                    <h1 className={styles.coverTitle}>{meeting.title}</h1>
                    {meeting.subtitle && (
                        <p className={styles.titleSlideSubtitle}>{meeting.subtitle}</p>
                    )}
                </div>
            );
        }

        // 안건 슬라이드
        if (currentSlideData.type === 'agenda') {
            const items = currentSlideData.data as typeof meeting.agendaItems;
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: '#3B82F620', color: '#3B82F6' }}>📋</span>
                            <span className={styles.slideNumber} style={{ color: '#3B82F6' }}>
                                {String(slideIndex + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: '#3B82F6' }}>회의 안건</h2>
                    <div className={styles.sectionsGrid}>
                        <div className={styles.sectionCard} style={{ borderTopColor: '#3B82F6', gridColumn: '1 / -1' }}>
                            <ul className={styles.sectionList}>
                                {items.map((item, idx) => (
                                    <li key={idx} style={{ '--accent-color': '#3B82F6' } as React.CSSProperties}>
                                        <strong>{item.content}</strong>
                                        {item.details && <p style={{ margin: '0.5rem 0 0', opacity: 0.8, fontSize: '0.95em' }}>{item.details}</p>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }

        // 성과 슬라이드
        if (currentSlideData.type === 'achievements') {
            const items = currentSlideData.data as typeof meeting.achievements;
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: '#10B98120', color: '#10B981' }}>✅</span>
                            <span className={styles.slideNumber} style={{ color: '#10B981' }}>
                                {String(slideIndex + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: '#10B981' }}>주요 성과</h2>
                    <div className={styles.sectionsGrid}>
                        {items?.map((achievement, idx) => (
                            <div key={idx} className={styles.sectionCard} style={{ borderTopColor: '#10B981' }}>
                                <h3 className={styles.sectionTitle}>{achievement.title}</h3>
                                <ul className={styles.sectionList}>
                                    {achievement.content.map((item, iIdx) => (
                                        <li key={iIdx} style={{ '--accent-color': '#10B981' } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // 특이사항 슬라이드
        if (currentSlideData.type === 'specialNotes') {
            const items = currentSlideData.data as typeof meeting.specialNotes;
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: '#F59E0B20', color: '#F59E0B' }}>📌</span>
                            <span className={styles.slideNumber} style={{ color: '#F59E0B' }}>
                                {String(slideIndex + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: '#F59E0B' }}>특이사항</h2>
                    <div className={styles.sectionsGrid}>
                        {items?.map((note, idx) => (
                            <div key={idx} className={styles.sectionCard} style={{ borderTopColor: '#F59E0B' }}>
                                <h3 className={styles.sectionTitle}>{note.title}</h3>
                                <ul className={styles.sectionList}>
                                    {note.content.map((item, iIdx) => (
                                        <li key={iIdx} style={{ '--accent-color': '#F59E0B' } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // 영업 업데이트 슬라이드
        if (currentSlideData.type === 'businessUpdates') {
            const items = currentSlideData.data as typeof meeting.businessUpdates;
            return (
                <div className={styles.slideContent}>
                    <div className={styles.newSlideHeader}>
                        <div className={styles.slideHeaderLeft}>
                            <span className={styles.slideIcon} style={{ background: '#8B5CF620', color: '#8B5CF6' }}>💼</span>
                            <span className={styles.slideNumber} style={{ color: '#8B5CF6' }}>
                                {String(slideIndex + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <h2 className={styles.newSlideTitle} style={{ color: '#8B5CF6' }}>영업 업데이트</h2>
                    <div className={styles.sectionsGrid}>
                        {items?.map((update, idx) => (
                            <div key={idx} className={styles.sectionCard} style={{ borderTopColor: '#8B5CF6' }}>
                                <h3 className={styles.sectionTitle}>{update.title}</h3>
                                <p style={{ color: '#ccc', lineHeight: 1.6 }}>{update.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };

    // ✅ 저장된 우선순위 보드 → '한눈에 보기' 요약 페이지
    const renderBoardSummary = (board: { boardId: string; title: string; accent: string; items: PriorityItem[]; stale?: boolean }, index: number) => {
        const accent = board.accent;
        const active = board.items.filter(i => i.status === 'active');
        const hold = board.items.filter(i => i.status === 'hold');
        return (
            <div className={styles.slideContent}>
                <div className={styles.newSlideHeader}>
                    <div className={styles.slideHeaderLeft}>
                        <span className={styles.slideIcon} style={{ background: `${accent}20`, color: accent }}>✅</span>
                        <span className={styles.slideNumber} style={{ color: accent }}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    {board.stale
                        ? <span className={styles.mpbLiveBadge} style={{ borderColor: '#F59E0B88', color: '#F59E0B' }}>⚠ 보드에 미저장 수정 있음</span>
                        : <span className={styles.mpbLiveBadge} style={{ borderColor: `${accent}55`, color: accent }}>저장본 · 한눈에 보기</span>}
                </div>
                <h2 className={styles.newSlideTitle} style={{ color: accent }}>{board.title} — 우선순위 확정</h2>
                <p style={{ color: '#888', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
                    저장 시점의 우선순위 · 마감일 스냅샷 — 보드에서 수정 후 다시 저장하면 갱신됩니다
                </p>

                <div className={styles.mpbSummaryGrid}>
                    {active.map((it, i) => {
                        const pm = priorityMeta(it.priority);
                        return (
                            <div key={it.id} className={styles.mpbSummaryRow} style={{ borderLeftColor: pm.color }}>
                                <span className={styles.mpbSummaryNum} style={{ background: `${accent}22`, color: accent }}>{i + 1}</span>
                                <div className={styles.mpbSummaryMain}>
                                    <div className={styles.mpbSummaryTitle}>
                                        {it.title}
                                        <span className={styles.mpbBadge} style={{ background: `${pm.color}22`, color: pm.color, borderColor: `${pm.color}66` }}>{pm.label}</span>
                                        {it.channel && <span className={styles.mpbTag}>{it.channel}</span>}
                                    </div>
                                    {it.desc && <div className={styles.mpbSummaryDesc}>{it.desc}</div>}
                                </div>
                                <div className={styles.mpbSummaryMeta}>
                                    {it.assignee && <span>👤 {it.assignee}</span>}
                                    <span style={{ color: accent, fontWeight: 700 }}>⏰ {it.deadline || '미정'}</span>
                                </div>
                            </div>
                        );
                    })}
                    {active.length === 0 && <div className={styles.mpbEmpty}>진행중 실행안이 없습니다.</div>}
                </div>

                {hold.length > 0 && (
                    <>
                        <div className={styles.mpbSectionLabel}>⏸ 보류 ({hold.length})</div>
                        <div className={styles.mpbSummaryHoldList}>
                            {hold.map(it => (
                                <span key={it.id} className={styles.mpbHoldChip}>{it.title}{it.deadline ? ` · ${it.deadline}` : ''}</span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    // 특정 회의(임팩트 발표용)는 Paperlogy 테마를 입혀 글씨를 크게·울림 있게
    const PAPERLOGY_MEETINGS = ['2026-06-20', '2026-06-20-marketing'];
    const isPaperlogy = PAPERLOGY_MEETINGS.includes(meeting.id);

    return (
        <div className={`${styles.deckContainer} ${isPaperlogy ? styles.paperlogyTheme : ''}`}>
            <div className={styles.controls}>
                <Link href="/" className={styles.backButton}>
                    <ArrowLeft size={20} /> 목록
                </Link>
                <div className={styles.slideCounter}>
                    {currentSlide + 1} / {totalSlides}
                </div>
            </div>

            <div className={styles.slideViewport}>
                <div className={styles.slide} key={currentSlide}>
                    {currentSlide >= baseSlideCount
                        ? (summaryBoards[currentSlide - baseSlideCount]
                            ? renderBoardSummary(summaryBoards[currentSlide - baseSlideCount], currentSlide)
                            : null)
                        : hasNewStructure
                            ? renderNewSlide(meeting.slides![currentSlide], currentSlide)
                            : renderOldSlide(currentSlide)
                    }
                </div>
            </div>

            {/* 네비게이션 버튼 */}
            {totalSlides > 1 && (
                <div className={styles.navigation}>
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className={styles.navButton}
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === totalSlides - 1}
                        className={styles.navButton}
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            )}
        </div>
    );
}
