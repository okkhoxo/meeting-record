'use client';

import { useState, useEffect, useCallback } from 'react';
import { MeetingRecord } from '@/data/meetings';
import styles from './v2.module.css';
import { ArrowLeft, Calendar, Users, ChevronRight, ArrowRight, HelpCircle, Target, Lightbulb, Youtube, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface SlideDeckV2Props {
    meeting: MeetingRecord;
}

const slideTypeLabels: Record<string, string> = {
    'title': '표지',
    'achievements': '성과',
    'organization': '조직',
    'operations': '운영',
    'financial': '재무',
    'strategy': '전략',
    'vision': '비전'
};

export default function SlideDeckV2({ meeting }: SlideDeckV2Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const hasSlides = meeting.slides && meeting.slides.length > 0;
    const totalSlides = hasSlides ? meeting.slides!.length : 1;

    const nextSlide = useCallback(() => {
        if (currentSlide < totalSlides - 1) {
            setDirection('next');
            setCurrentSlide(prev => prev + 1);
        }
    }, [currentSlide, totalSlides]);

    const prevSlide = useCallback(() => {
        if (currentSlide > 0) {
            setDirection('prev');
            setCurrentSlide(prev => prev - 1);
        }
    }, [currentSlide]);

    const goToSlide = useCallback((index: number) => {
        setDirection(index > currentSlide ? 'next' : 'prev');
        setCurrentSlide(index);
    }, [currentSlide]);

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

    const renderTitleSlide = (slideData: NonNullable<MeetingRecord['slides']>[number]) => {
        return (
            <div className={styles.titleSlide}>
                <div className={styles.titleContent}>
                    <span className={styles.dateTag}>{meeting.date}</span>
                    <h1 className={styles.mainTitle}>{slideData.title}</h1>
                    {slideData.subtitle && (
                        <p className={styles.subtitle}>{slideData.subtitle}</p>
                    )}
                    <div className={styles.attendeeList}>
                        <Users size={18} />
                        <span>{meeting.attendees.join(' · ')}</span>
                    </div>
                </div>
                <div className={styles.titleDecor}>
                    <div className={styles.decorLine} />
                    <div className={styles.decorDot} />
                </div>
            </div>
        );
    };

    // 3페이지: 문제 제기 (SPOT 정체성 + IP) - 대비 구조
    const renderQuestionSlide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.diagramContainer}>
                    {/* 선화의 말 */}
                    <p className={styles.contextNote}>
                        선화의 말을 듣고 생각이 들었습니다. "주희가 없는데 SPOT을 딜레이 시킬거야? 어떻게 할거야?"
                    </p>

                    {/* 중앙 핵심 질문 */}
                    <div className={styles.centerQuestion}>
                        <span>우리는 진짜 체험형 AI 콘텐츠 기획사인가?</span>
                    </div>

                    {/* 양쪽 대비 박스 */}
                    <div className={styles.compareBoxes}>
                        <div className={styles.compareBox} style={{ borderColor: '#EF4444' }}>
                            <div className={styles.compareHeader} style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                <span className={styles.compareLabel} style={{ color: '#EF4444' }}>SPOT</span>
                            </div>
                            <div className={styles.compareContent}>
                                <p>콜라보 제품 / 굿즈</p>
                                <div className={styles.questionMark}>
                                    <span>체험형 AI와 관련 있는가?</span>
                                </div>
                                <div className={styles.arrow}>
                                    <ArrowRight size={20} />
                                </div>
                                <p className={styles.decision}>축소 / 전환 / 폐지?</p>
                            </div>
                        </div>

                        <div className={styles.compareBox} style={{ borderColor: '#3B82F6' }}>
                            <div className={styles.compareHeader} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                <span className={styles.compareLabel} style={{ color: '#3B82F6' }}>우리만의 IP</span>
                            </div>
                            <div className={styles.compareContent}>
                                <p>인바운드 영업 = 남의 것</p>
                                <div className={styles.questionMark}>
                                    <span>우리 것은 무엇인가?</span>
                                </div>
                                <div className={styles.arrow}>
                                    <ArrowRight size={20} />
                                </div>
                                <p className={styles.decision}>자체 IP / 세계관 필요</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 조직 역할 정의 슬라이드
    const renderOrgSlide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.orgContainer}>
                    {/* 임원진 */}
                    <div className={styles.orgLevel}>
                        <div className={styles.orgLevelHeader}>임원진</div>
                        <div className={styles.orgCards}>
                            <div className={styles.orgCard} style={{ borderColor: '#EF4444' }}>
                                <span className={styles.orgRole}>CEO</span>
                                <span className={styles.orgName}>유재영</span>
                                <span className={styles.orgDesc}>영업, 영업팀 관리(네안데르 랩), 인사, 스케줄링, 인력배치</span>
                            </div>
                            <div className={styles.orgCard} style={{ borderColor: '#3B82F6' }}>
                                <span className={styles.orgRole}>CFO</span>
                                <span className={styles.orgName}>이동주</span>
                                <span className={styles.orgDesc}>재무/회계, 제품 생산 관리</span>
                            </div>
                            <div className={styles.orgCard} style={{ borderColor: '#F59E0B' }}>
                                <span className={styles.orgRole}>CMO</span>
                                <span className={styles.orgName}>유선화</span>
                                <span className={styles.orgDesc}>브랜딩/마케팅, 생일이벤트, 네안데르 랩 마케팅(유튜브) 총괄</span>
                            </div>
                            <div className={styles.orgCard} style={{ borderColor: '#10B981' }}>
                                <span className={styles.orgRole}>CTO</span>
                                <span className={styles.orgName}>김주연</span>
                                <span className={styles.orgDesc}>개발, 신사업 아이디어, 정부지원사업 관리</span>
                            </div>
                        </div>
                    </div>

                    {/* 사원 */}
                    <div className={styles.orgLevel}>
                        <div className={styles.orgLevelHeader}>사원</div>
                        <div className={styles.orgCards}>
                            <div className={styles.orgCard} style={{ borderColor: '#8B5CF6' }}>
                                <span className={styles.orgName}>류다혜</span>
                                <span className={styles.orgDesc}>생일 이벤트 담당, 미디어아트 제작</span>
                            </div>
                            <div className={styles.orgCard} style={{ borderColor: '#EC4899' }}>
                                <span className={styles.orgName}>김주희</span>
                                <span className={styles.orgDesc}>영업팀 - 제안서 작성, 프로젝트 매니저(PM), 매장 관리</span>
                            </div>
                        </div>
                    </div>

                    {/* 추가 고용 예정 */}
                    <div className={styles.orgLevel}>
                        <div className={styles.orgLevelHeader} style={{ opacity: 0.7 }}>추가 고용 예정</div>
                        <div className={styles.orgCards}>
                            <div className={styles.orgCard} style={{ borderColor: '#666', opacity: 0.8 }}>
                                <span className={styles.orgName}>김정연</span>
                                <span className={styles.orgDesc}>유튜브 컨텐츠 제작</span>
                            </div>
                            <div className={styles.orgCard} style={{ borderColor: '#666', opacity: 0.8 }}>
                                <span className={styles.orgName}>김제연</span>
                                <span className={styles.orgDesc}>프리랜서 - 외주개발, 시제품 제작</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 네안데르 목표 슬라이드
    const renderGoalSlide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.goalContainer}>
                    {/* 질문 영역 */}
                    <div className={styles.goalQuestions}>
                        <div className={styles.goalQuestion}>내년 목표는 유튜브 하기인가?</div>
                        <div className={styles.goalQuestion}>네안데르 랩의 목표는 무엇인가?</div>
                        <div className={styles.goalQuestion}>체험형 AI 콘텐츠로 뭘 할 건가?</div>
                    </div>

                    <div className={styles.flowArrow}>
                        <ArrowRight size={32} />
                    </div>

                    {/* 유재영의 의견 */}
                    <div className={styles.goalAnswer}>
                        <div className={styles.goalAnswerHeader}>유재영의 의견</div>
                        <div className={styles.goalAnswerItems}>
                            <div className={styles.goalAnswerItem}>
                                <span className={styles.goalLabel}>네안데르</span>
                                <span className={styles.goalValue}>체험형 AI 콘텐츠 기획사</span>
                            </div>
                            <div className={styles.goalAnswerItem}>
                                <span className={styles.goalLabel}>네안데르 랩</span>
                                <span className={styles.goalValue}>IP를 키우는 콘텐츠 채널</span>
                            </div>
                            <div className={styles.goalAnswerItem}>
                                <span className={styles.goalLabel}>핵심</span>
                                <span className={styles.goalValue}>유튜브는 수단, IP/팬덤이 목표</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 네안데르 랩 2026 목표 슬라이드
    const renderLabGoalSlide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.labGoalContainer}>
                    {/* 수익창출 조건 */}
                    <div className={styles.labGoalBox}>
                        <div className={styles.labGoalHeader}>
                            <Youtube size={24} />
                            <span>유튜브 수익창출 조건</span>
                        </div>
                        <div className={styles.labGoalMetrics}>
                            <div className={styles.labGoalMetric}>
                                <span className={styles.metricValue}>1,000</span>
                                <span className={styles.metricLabel}>구독자</span>
                            </div>
                            <span className={styles.metricPlus}>+</span>
                            <div className={styles.labGoalMetric}>
                                <span className={styles.metricValue}>4,000</span>
                                <span className={styles.metricLabel}>시청시간</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.flowArrow}>
                        <TrendingUp size={32} />
                    </div>

                    {/* 2026 목표 */}
                    <div className={styles.labGoalBox} style={{ borderColor: '#10B981' }}>
                        <div className={styles.labGoalHeader} style={{ color: '#10B981' }}>
                            <Target size={24} />
                            <span>2026 목표</span>
                        </div>
                        <div className={styles.labGoalTargets}>
                            <div className={styles.labGoalTarget}>
                                <span className={styles.targetNum}>1차</span>
                                <span>수익창출 조건 달성</span>
                            </div>
                            <div className={styles.labGoalTarget}>
                                <span className={styles.targetNum}>구독자</span>
                                <span>1,000 → 5,000명</span>
                            </div>
                            <div className={styles.labGoalTarget}>
                                <span className={styles.targetNum}>시스템</span>
                                <span>정기 업로드 체계 구축</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 긱블 벤치마킹 슬라이드 1/3 (회사 개요)
    const renderGeekble1Slide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.benchmarkContainer}>
                    {/* 회사 개요 */}
                    <div className={styles.benchmarkSection}>
                        <div className={styles.benchmarkHeader} style={{ borderColor: '#3B82F6' }}>
                            <span>회사 개요</span>
                        </div>
                        <div className={styles.benchmarkContent}>
                            <div className={styles.benchmarkItem}>
                                <span className={styles.benchmarkLabel}>법인명</span>
                                <span className={styles.benchmarkValue}>주식회사 긱블 (Geekble)</span>
                            </div>
                            <div className={styles.benchmarkItem}>
                                <span className={styles.benchmarkLabel}>설립일</span>
                                <span className={styles.benchmarkValue}>2016년 12월 28일</span>
                            </div>
                            <div className={styles.benchmarkItem}>
                                <span className={styles.benchmarkLabel}>창업자</span>
                                <span className={styles.benchmarkValue}>박찬후 (차누) - 포스텍 컴공</span>
                            </div>
                            <div className={styles.benchmarkItem}>
                                <span className={styles.benchmarkLabel}>슬로건</span>
                                <span className={styles.benchmarkValue}>&apos;괴짜는 무엇이든 할 수 있다&apos;</span>
                            </div>
                            <div className={styles.benchmarkHighlight}>
                                2018 포브스 아시아 30 Under 30 선정
                            </div>
                        </div>
                    </div>

                    {/* 채널 현황 */}
                    <div className={styles.benchmarkSection}>
                        <div className={styles.benchmarkHeader} style={{ borderColor: '#EF4444' }}>
                            <Youtube size={20} />
                            <span>채널 현황 (2025.01)</span>
                        </div>
                        <div className={styles.benchmarkChannels}>
                            <div className={styles.channelCard} style={{ borderColor: '#EF4444' }}>
                                <span className={styles.channelName}>긱블 메인</span>
                                <span className={styles.channelStat}>120만 구독자</span>
                                <span className={styles.channelViews}>6.8억 조회</span>
                            </div>
                            <div className={styles.channelCard} style={{ borderColor: '#F59E0B' }}>
                                <span className={styles.channelName}>긱블랩</span>
                                <span className={styles.channelStat}>2.6만</span>
                            </div>
                            <div className={styles.channelCard} style={{ borderColor: '#10B981' }}>
                                <span className={styles.channelName}>짧은긱블</span>
                                <span className={styles.channelStat}>7.4천</span>
                            </div>
                            <div className={styles.channelCard} style={{ borderColor: '#8B5CF6' }}>
                                <span className={styles.channelName}>문과vs이과</span>
                                <span className={styles.channelStat}>3.7만</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 긱블 벤치마킹 슬라이드 2/3 (투자 및 재무)
    const renderGeekble2Slide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.benchmarkContainer}>
                    {/* 투자 히스토리 */}
                    <div className={styles.benchmarkSection}>
                        <div className={styles.benchmarkHeader} style={{ borderColor: '#10B981' }}>
                            <TrendingUp size={20} />
                            <span>투자 유치 히스토리</span>
                        </div>
                        <div className={styles.investmentTimeline}>
                            <div className={styles.investmentItem}>
                                <span className={styles.investYear}>2016.10</span>
                                <span className={styles.investRound}>Seed</span>
                                <span className={styles.investAmount}>비공개</span>
                            </div>
                            <div className={styles.investmentItem}>
                                <span className={styles.investYear}>2017.11</span>
                                <span className={styles.investRound}>Pre-A</span>
                                <span className={styles.investAmount}>8억원</span>
                            </div>
                            <div className={styles.investmentItem}>
                                <span className={styles.investYear}>2020.12</span>
                                <span className={styles.investRound}>Series A</span>
                                <span className={styles.investAmount}>20억원</span>
                            </div>
                            <div className={styles.investmentItem}>
                                <span className={styles.investYear}>2022.12</span>
                                <span className={styles.investRound}>Series A</span>
                                <span className={styles.investAmount}>50억원</span>
                            </div>
                            <div className={styles.investmentTotal}>
                                총 누적 투자: <strong>약 78억원</strong>
                            </div>
                        </div>
                    </div>

                    {/* 재무 현황 */}
                    <div className={styles.benchmarkSection}>
                        <div className={styles.benchmarkHeader} style={{ borderColor: '#10B981' }}>
                            <span>재무 현황</span>
                        </div>
                        <div className={styles.financialContent}>
                            <div className={styles.financialRow}>
                                <span className={styles.financialYear}>2022년</span>
                                <div className={styles.financialData}>
                                    <span className={styles.revenue}>매출 11억</span>
                                    <span className={styles.loss}>영업손실 -21억</span>
                                </div>
                            </div>
                            <div className={styles.financialRow}>
                                <span className={styles.financialYear}>2023년</span>
                                <div className={styles.financialData}>
                                    <span className={styles.loss}>영업손실 -20억</span>
                                </div>
                            </div>
                            <div className={styles.financialSuccess}>
                                <strong>2024년 4Q: 현금흐름 기준 흑자전환 달성</strong><br/>
                                구조조정 후 콘텐츠 다각화로 체질 개선
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 긱블 벤치마킹 슬라이드 3/3 (구조조정 및 시사점)
    const renderGeekble3Slide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.benchmarkContainer}>
                    {/* 구조조정 */}
                    <div className={styles.benchmarkSection}>
                        <div className={styles.benchmarkHeader} style={{ borderColor: '#F59E0B' }}>
                            <span>2024년 대규모 구조조정</span>
                        </div>
                        <div className={styles.restructuringContent}>
                            <div className={styles.restructuringFlow}>
                                <div className={styles.restructureBefore}>
                                    <span className={styles.restructureLabel}>구조조정 전</span>
                                    <span className={styles.restructureNum}>36명</span>
                                </div>
                                <ArrowRight size={24} className={styles.restructureArrow} />
                                <div className={styles.restructureAfter}>
                                    <span className={styles.restructureLabel}>구조조정 후</span>
                                    <span className={styles.restructureNum}>14명</span>
                                </div>
                            </div>
                            <div className={styles.restructureDetail}>
                                <div>본부 4명 + 미디어 5명 + 에듀 5명</div>
                                <div>커머스/비즈니스 사업부 해체</div>
                            </div>
                        </div>
                    </div>

                    {/* 시사점 */}
                    <div className={styles.benchmarkSection}>
                        <div className={styles.benchmarkHeader} style={{ borderColor: '#8B5CF6' }}>
                            <Lightbulb size={20} />
                            <span>교훈 및 시사점</span>
                        </div>
                        <div className={styles.lessonsContent}>
                            <div className={styles.lessonItem}>유튜브 수익만으로는 지속 불가 (광고 수익 변동성)</div>
                            <div className={styles.lessonItem}>사업 다각화 시 핵심 역량 집중 필요</div>
                            <div className={styles.lessonItem}>인력 확장 속도 조절 중요</div>
                            <div className={styles.lessonItem}>투자금 소진 후 구조조정 불가피</div>
                            <div className={styles.lessonHighlight}>
                                비즈니스 모델: 콘텐츠 + 키트판매 + 교육사업
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 뿌디 슬라이드 (이미지 포함)
    const renderPpudiSlide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.ppudiContainer}>
                    {/* 이미지 영역 */}
                    <div className={styles.ppudiImageSection}>
                        <div className={styles.ppudiImageBox}>
                            <img
                                src="/images/ppudi-sample.png"
                                alt="뿌디 샘플 이미지"
                                className={styles.ppudiImage}
                            />
                            <div className={styles.ppudiImageLabel}>현재 뿌디 결과물</div>
                        </div>
                    </div>

                    {/* 내용 영역 */}
                    <div className={styles.ppudiContentSection}>
                        <div className={styles.ppudiBox}>
                            <div className={styles.ppudiBoxHeader} style={{ borderColor: '#F59E0B' }}>
                                <span>퀄리티 개선 방안</span>
                            </div>
                            <div className={styles.ppudiItems}>
                                <div className={styles.ppudiItem}>모양을 우리 스타일로 변환 (주연이 방식)</div>
                                <div className={styles.ppudiItem}>디테일한 후보정 작업 추가</div>
                                <div className={styles.ppudiItem}>일관된 아트 스타일 적용</div>
                                <div className={styles.ppudiItem}>배경/소품 퀄리티 향상</div>
                            </div>
                        </div>

                        <div className={styles.ppudiBox}>
                            <div className={styles.ppudiBoxHeader} style={{ borderColor: '#8B5CF6' }}>
                                <HelpCircle size={18} />
                                <span>논의 사항</span>
                            </div>
                            <div className={styles.ppudiQuestions}>
                                <div className={styles.ppudiQuestion}>현재 퀄리티로 충분한가?</div>
                                <div className={styles.ppudiQuestion}>어떤 스타일이 우리다운가?</div>
                                <div className={styles.ppudiQuestion}>개선에 필요한 리소스는?</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 4페이지: 방향성 (정의 + 나아갈 방향) - 플로우 구조
    const renderDirectionSlide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((index + 1) / totalSlides) * 100}%` }} />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>{slideData.title}</h2>

                <div className={styles.flowContainer}>
                    {/* 정의 섹션 */}
                    <div className={styles.flowSection}>
                        <div className={styles.flowHeader}>
                            <Lightbulb size={24} />
                            <span>체험형 AI 콘텐츠란?</span>
                        </div>
                        <div className={styles.flowCards}>
                            <div className={styles.flowCard}>정의가 필요하다</div>
                            <div className={styles.flowCard}>좋은 콘텐츠란 무엇인가?</div>
                            <div className={styles.flowCard}>왜 만들어야 하는가?</div>
                        </div>
                    </div>

                    <div className={styles.flowArrow}>
                        <ArrowRight size={32} />
                    </div>

                    {/* 목표 섹션 */}
                    <div className={styles.flowSection}>
                        <div className={styles.flowHeader}>
                            <Target size={24} />
                            <span>나아갈 방향</span>
                        </div>
                        <div className={styles.targetBox}>
                            <div className={styles.targetItem}>
                                <span className={styles.targetLabel}>벤치마크</span>
                                <span className={styles.targetValue}>빠더너스 / 긱블</span>
                            </div>
                            <div className={styles.targetDivider} />
                            <div className={styles.targetItem}>
                                <span className={styles.targetLabel}>핵심 전략</span>
                                <span className={styles.targetValue}>우리만의 IP 확보</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContentSlide = (slideData: NonNullable<MeetingRecord['slides']>[number], index: number) => {
        const typeLabel = slideTypeLabels[slideData.type] || slideData.type;

        return (
            <div className={styles.contentSlide}>
                <div className={styles.slideHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.typeLabel}>{typeLabel}</span>
                        <span className={styles.slideIndex}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${((index + 1) / totalSlides) * 100}%` }}
                        />
                    </div>
                </div>

                <h2 className={styles.slideTitle}>
                    {slideData.title}
                    {slideData.pdfUrl && (
                        <a
                            href={slideData.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.pdfLink}
                        >
                            PDF
                        </a>
                    )}
                </h2>

                <div className={styles.sectionsContainer}>
                    {slideData.sections?.map((section, sIdx) => (
                        <div
                            key={sIdx}
                            className={styles.section}
                            style={{ animationDelay: `${sIdx * 0.1}s` }}
                        >
                            <h3 className={styles.sectionTitle}>{section.title}</h3>
                            <ul className={styles.sectionItems}>
                                {section.items.map((item, iIdx) => {
                                    const isUrl = item.startsWith('http://') || item.startsWith('https://');
                                    return (
                                        <li
                                            key={iIdx}
                                            style={{ animationDelay: `${(sIdx * 0.1) + (iIdx * 0.05)}s` }}
                                        >
                                            <ChevronRight size={16} className={styles.itemIcon} />
                                            {isUrl ? (
                                                <a href={item} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                                                    {item}
                                                </a>
                                            ) : (
                                                <span>{item}</span>
                                            )}
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

    const renderSlide = () => {
        if (!hasSlides) {
            return renderTitleSlide({ type: 'title', title: meeting.title, subtitle: meeting.subtitle });
        }

        const slideData = meeting.slides![currentSlide];
        if (slideData.type === 'title') {
            return renderTitleSlide(slideData);
        }

        // 조직 역할 정의 슬라이드
        if (slideData.title === '조직 역할 정의') {
            return renderOrgSlide(slideData, currentSlide);
        }

        // 네안데르 목표 슬라이드
        if (slideData.title === '네안데르의 목표는 무엇인가?') {
            return renderGoalSlide(slideData, currentSlide);
        }

        // 네안데르 랩 2026 목표 슬라이드
        if (slideData.title === '네안데르 랩 2026 목표') {
            return renderLabGoalSlide(slideData, currentSlide);
        }

        // 특별 도식화 슬라이드 (3페이지: 다시 생각해봤으면 하는 점)
        if (slideData.title === '다시 생각해봤으면 하는 점') {
            return renderQuestionSlide(slideData, currentSlide);
        }

        // 특별 도식화 슬라이드 (4페이지: 다시 생각해봤으면 하는 점 (2))
        if (slideData.title === '다시 생각해봤으면 하는 점 (2)') {
            return renderDirectionSlide(slideData, currentSlide);
        }

        // 긱블 벤치마킹 슬라이드
        if (slideData.title === '벤치마킹: 긱블 (1/3)') {
            return renderGeekble1Slide(slideData, currentSlide);
        }
        if (slideData.title === '벤치마킹: 긱블 (2/3)') {
            return renderGeekble2Slide(slideData, currentSlide);
        }
        if (slideData.title === '벤치마킹: 긱블 (3/3)') {
            return renderGeekble3Slide(slideData, currentSlide);
        }

        // 뿌디 슬라이드
        if (slideData.title === '뿌디, 이대로 괜찮은가?') {
            return renderPpudiSlide(slideData, currentSlide);
        }

        return renderContentSlide(slideData, currentSlide);
    };

    return (
        <div className={styles.container}>
            {/* Top Bar */}
            <header className={styles.topBar}>
                <Link href="/" className={styles.backBtn}>
                    <ArrowLeft size={18} />
                    <span>목록</span>
                </Link>
                <div className={styles.slideNav}>
                    {hasSlides && meeting.slides!.map((slide, idx) => (
                        <button
                            key={idx}
                            className={`${styles.navDot} ${idx === currentSlide ? styles.active : ''}`}
                            onClick={() => goToSlide(idx)}
                            title={slide.title}
                        />
                    ))}
                </div>
                <div className={styles.counter}>
                    {currentSlide + 1} / {totalSlides}
                </div>
            </header>

            {/* Main Slide Area */}
            <main className={styles.slideArea}>
                <div
                    className={`${styles.slide} ${direction === 'next' ? styles.slideNext : styles.slidePrev}`}
                    key={currentSlide}
                >
                    {renderSlide()}
                </div>
            </main>

            {/* Bottom Navigation */}
            <footer className={styles.bottomNav}>
                <button
                    className={styles.navArrow}
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                >
                    <ArrowLeft size={24} />
                </button>
                <div className={styles.slideInfo}>
                    {hasSlides && meeting.slides![currentSlide].type !== 'title' && (
                        <span className={styles.currentType}>
                            {slideTypeLabels[meeting.slides![currentSlide].type]}
                        </span>
                    )}
                </div>
                <button
                    className={styles.navArrow}
                    onClick={nextSlide}
                    disabled={currentSlide === totalSlides - 1}
                >
                    <ArrowLeft size={24} style={{ transform: 'rotate(180deg)' }} />
                </button>
            </footer>
        </div>
    );
}
