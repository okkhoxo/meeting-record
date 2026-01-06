'use client';

import { useState, useEffect, useCallback } from 'react';
import { MeetingRecord } from '@/data/meetings';
import styles from './page.module.css';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

interface SlideDeckProps {
    meeting: MeetingRecord;
}

const slideIcons: Record<string, string> = {
    'title': '📋',
    'achievements': '✅',
    'organization': '👥',
    'operations': '⚙️',
    'financial': '💰',
    'strategy': '🚀',
    'vision': '🎯'
};

const slideColors: Record<string, string> = {
    'title': '#3B82F6',
    'achievements': '#10B981',
    'organization': '#8B5CF6',
    'operations': '#F59E0B',
    'financial': '#EF4444',
    'strategy': '#06B6D4',
    'vision': '#EC4899'
};


export default function SlideDeck({ meeting }: SlideDeckProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // slides 필드가 있으면 새 구조 사용, 없으면 기존 구조로 슬라이드 생성
    const hasNewStructure = meeting.slides && meeting.slides.length > 0;

    // 기존 구조일 때 슬라이드 개수 계산: 타이틀 + agendaItems + specialNotes + achievements + businessUpdates
    const getOldStructureSlideCount = () => {
        let count = 1; // 타이틀 슬라이드
        if (meeting.agendaItems && meeting.agendaItems.length > 0) count++;
        if (meeting.specialNotes && meeting.specialNotes.length > 0) count++;
        if (meeting.achievements && meeting.achievements.length > 0) count++;
        if (meeting.businessUpdates && meeting.businessUpdates.length > 0) count++;
        return count;
    };

    const totalSlides = hasNewStructure ? meeting.slides!.length : getOldStructureSlideCount();

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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
                                        <li key={iIdx} style={{ '--accent-color': '#10B981', fontSize: '1.3rem' } as React.CSSProperties}>
                                            {item}
                                        </li>
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
                                                } as React.CSSProperties}>
                                                    {item}
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
        }

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
                <div className={styles.sectionsGrid}>
                    {slideData.sections?.map((section, sIdx) => (
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
                                            ) : item}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
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
                                        <li key={iIdx} style={{ '--accent-color': '#10B981' } as React.CSSProperties}>
                                            {item}
                                        </li>
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
                                        <li key={iIdx} style={{ '--accent-color': '#F59E0B' } as React.CSSProperties}>
                                            {item}
                                        </li>
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

    return (
        <div className={styles.deckContainer}>
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
                    {hasNewStructure
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
