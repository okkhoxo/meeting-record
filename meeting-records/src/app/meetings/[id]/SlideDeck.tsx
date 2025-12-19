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

    // slides 필드가 있으면 새 구조 사용, 없으면 기존 구조 사용
    const hasNewStructure = meeting.slides && meeting.slides.length > 0;
    const totalSlides = hasNewStructure ? meeting.slides!.length : 1;

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
                    <div className={styles.titleSlideIcon}>{icon}</div>
                    <h1 className={styles.titleSlideMain}>{slideData.title}</h1>
                    {slideData.subtitle && (
                        <p className={styles.titleSlideSubtitle}>{slideData.subtitle}</p>
                    )}
                    <div className={styles.titleSlideMeta}>
                        <div className={styles.metaItem}>
                            <Calendar size={24} />
                            <span>{meeting.date}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Users size={24} />
                            <span>{meeting.attendees.join(', ')}</span>
                        </div>
                    </div>
                    {slideData.sections && slideData.sections[0] && (
                        <div className={styles.titleSlideAgenda}>
                            <span className={styles.agendaLabel}>{slideData.sections[0].title}</span>
                            <div className={styles.agendaTags}>
                                {slideData.sections[0].items.map((item, i) => (
                                    <span key={i} className={styles.agendaTag}>{item}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // strategy 슬라이드에서 FOCUS/축소 구분
        const isStrategySlide = slideData.type === 'strategy';

        if (isStrategySlide && slideData.sections) {
            const focusSections = slideData.sections.filter(s => s.title.includes('FOCUS'));
            const otherSections = slideData.sections.filter(s => !s.title.includes('FOCUS'));

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
                    {slideData.title.includes('(https://') ? (
                        <>
                            {slideData.title.split(' (https://')[0]}
                            {' '}
                            <a
                                href={'https://' + slideData.title.split('(https://')[1].replace(')', '')}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '0.6em',
                                    color: color,
                                    textDecoration: 'underline',
                                    opacity: 0.7,
                                    marginLeft: '0.5rem'
                                }}
                            >
                                (링크)
                            </a>
                        </>
                    ) : slideData.title}
                </h2>
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

    // 기존 구조 fallback
    const renderOldSlide = () => {
        return (
            <div className={styles.slideContentCenter}>
                <h1 className={styles.coverTitle}>{meeting.title}</h1>
                <div className={styles.coverMeta}>
                    <div className={styles.metaItem}>
                        <Calendar size={28} />
                        <span>{meeting.date}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <Users size={28} />
                        <span>{meeting.attendees.join(', ')}</span>
                    </div>
                </div>
            </div>
        );
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
                        : renderOldSlide()
                    }
                </div>
            </div>

        </div>
    );
}
