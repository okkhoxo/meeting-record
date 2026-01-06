'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefikAnadolPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#000',
            color: '#fff',
            padding: '2rem'
        }}>
            <Link href="/meetings/2026-01-09" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#888',
                marginBottom: '2rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)'
            }}>
                <ArrowLeft size={20} /> 돌아가기
            </Link>

            <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>Refik Anadol</h1>
            <p style={{ fontSize: '1.4rem', color: '#888', marginBottom: '3rem' }}>
                AI 아트의 선구자 | Machine Hallucinations | Data Sculpture
            </p>

            {/* 프로필 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#06B6D4', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>👤</span> 프로필
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                        { label: '출생', value: '1985년, 터키 이스탄불' },
                        { label: '거주지', value: 'LA, 미국' },
                        { label: '스튜디오', value: 'Refik Anadol Studio (2014~)' },
                        { label: '연 매출', value: '$3.8M+' },
                        { label: 'NFT 기부', value: '$10M+' },
                        { label: 'TIME100', value: '2025 선정' },
                    ].map((item, idx) => (
                        <div key={idx} style={{
                            background: '#111',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid #222'
                        }}>
                            <div style={{ color: '#06B6D4', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{item.label}</div>
                            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{item.value}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 타임라인 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#3B82F6', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📅</span> 커리어 타임라인
                </h2>
                <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '3px solid #3B82F6' }}>
                    {[
                        { year: '1985', event: '터키 이스탄불 출생' },
                        { year: '2009', event: 'Istanbul Bilgi University 사진영상학과 졸업' },
                        { year: '2014', event: 'UCLA Design Media Arts 석사 / Refik Anadol Studio 설립' },
                        { year: '2016', event: 'Google Artists & Machine Intelligence 레지던시' },
                        { year: '2018', event: 'WDCH Dreams - LA 필하모닉 100주년 커미션' },
                        { year: '2020', event: 'NFT 첫 출시 (코로나 락다운 기간)' },
                        { year: '2021', event: 'MoMA 소장 작품 선정' },
                        { year: '2022', event: 'Casa Batllo NFT $1.38M 크리스티 경매' },
                        { year: '2023', event: 'Machine Hallucinations: Sphere (라스베이거스) - 세계 최대 AI 아트워크' },
                        { year: '2023', event: 'Winds of Yawanawá NFT $3M 기부' },
                        { year: '2024', event: 'Large Nature Model (LNM) 공개 - 다보스 세계경제포럼' },
                        { year: '2024', event: 'Serpentine Galleries 전시 - 47일간 66,000명 관람' },
                        { year: '2025', event: 'TIME100 선정 / 메시 콜라보 (크리스티 전시)' },
                        { year: '2025', event: '구겐하임 빌바오 개인전 (3월~10월)' },
                        { year: '2026', event: 'DATALAND 뮤지엄 오픈 예정 (LA Grand)' },
                    ].map((item, idx) => (
                        <div key={idx} style={{
                            marginBottom: '1.5rem',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: '-2.65rem',
                                width: '12px',
                                height: '12px',
                                background: '#3B82F6',
                                borderRadius: '50%'
                            }} />
                            <span style={{
                                color: '#3B82F6',
                                fontWeight: 700,
                                marginRight: '1rem',
                                fontFamily: 'monospace'
                            }}>{item.year}</span>
                            <span style={{ color: '#ccc' }}>{item.event}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 대표작품 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#EC4899', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🎨</span> 대표 작품
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'Machine Hallucinations 시리즈', desc: 'AI가 수백만 개의 이미지를 학습해 만들어내는 몽환적 데이터 조각', color: '#EC4899' },
                        { title: 'WDCH Dreams', desc: 'LA 필하모닉 100주년 기념. 월트 디즈니 콘서트홀 외벽 전체에 42개 프로젝터로 투사', color: '#3B82F6' },
                        { title: 'Machine Hallucinations: Sphere', desc: '라스베이거스 스피어. 제작 당시 세계 최대 규모 AI 아트워크 (4개월 상설)', color: '#06B6D4' },
                        { title: 'Large Nature Model (LNM)', desc: '자연만을 위한 생성형 AI 모델. 자연사박물관, 스미소니언 데이터 학습', color: '#10B981' },
                        { title: 'Unsupervised', desc: 'MoMA 소장작. 200년간의 미술사 데이터를 AI로 재해석', color: '#F59E0B' },
                        { title: 'Echoes of the Earth', desc: 'Serpentine Galleries 전시. 열대우림과 해저 풍경을 LNM으로 생성', color: '#8B5CF6' },
                    ].map((work, idx) => (
                        <div key={idx} style={{
                            background: '#111',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #222',
                            borderTop: `4px solid ${work.color}`
                        }}>
                            <h3 style={{ color: work.color, marginBottom: '0.8rem', fontSize: '1.3rem' }}>{work.title}</h3>
                            <p style={{ color: '#999', lineHeight: 1.6 }}>{work.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 비즈니스 모델 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#10B981', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>💰</span> 비즈니스 모델 (수익 구조)
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(6,182,212,0.3)' }}>
                        <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>🖼️ NFT 판매</h3>
                        <ul style={{ color: '#ccc', lineHeight: 2 }}>
                            <li>총 $10M+ 수익 (자선 기부)</li>
                            <li>11,000+ 토큰 발행</li>
                            <li>Casa Batllo: $1.38M</li>
                            <li>Yawanawá: $3M (아마존 보존)</li>
                        </ul>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <h3 style={{ color: '#3B82F6', marginBottom: '1rem' }}>🏢 기업 커미션</h3>
                        <ul style={{ color: '#ccc', lineHeight: 2 }}>
                            <li>Google (AI 연구)</li>
                            <li>NASA/JPL (우주 데이터)</li>
                            <li>LA 필하모닉</li>
                            <li>라스베이거스 Sphere</li>
                            <li>Intuit Dome (영구 설치)</li>
                        </ul>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(236,72,153,0.3)' }}>
                        <h3 style={{ color: '#EC4899', marginBottom: '1rem' }}>🎭 전시</h3>
                        <ul style={{ color: '#ccc', lineHeight: 2 }}>
                            <li>순회 전시 (70개 도시, 6대륙)</li>
                            <li>상설 전시 (두바이 미래박물관)</li>
                            <li>기관 소장 (MoMA, 퐁피두)</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* DATALAND */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#F59E0B', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🏛️</span> DATALAND - 세계 최초 AI 아트 뮤지엄
                </h2>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '2px solid rgba(245,158,11,0.4)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <div style={{ color: '#F59E0B', marginBottom: '0.5rem' }}>오픈 예정</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>2026년 봄</div>
                        </div>
                        <div>
                            <div style={{ color: '#F59E0B', marginBottom: '0.5rem' }}>위치</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>LA Grand (게리 설계)</div>
                        </div>
                        <div>
                            <div style={{ color: '#F59E0B', marginBottom: '0.5rem' }}>규모</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>20,000 sqft</div>
                        </div>
                        <div>
                            <div style={{ color: '#F59E0B', marginBottom: '0.5rem' }}>개발비</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$1B (전체 단지)</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                        <p style={{ color: '#ccc', lineHeight: 1.8 }}>
                            "LA는 DATALAND를 런칭하기에 완벽한 도시입니다. 예술, 음악, 영화, 건축에서 항상 미래를 바라보는 도시...
                            인간의 상상력과 기계 지능을 융합해 뮤지엄이 무엇이 될 수 있는지 새로운 패러다임을 개발할 것입니다."
                            <span style={{ color: '#F59E0B' }}> - Refik Anadol</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* 협업 파트너 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#8B5CF6', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🤝</span> 주요 협업 파트너
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {['Google', 'NASA/JPL', 'MoMA', 'Centre Pompidou', 'Serpentine Galleries', 'LA Philharmonic',
                      'Christie\'s', 'MSG Sphere', 'Natural History Museum', 'Smithsonian', 'Guggenheim Bilbao',
                      'Museum of the Future Dubai', 'Lionel Messi', 'UNICEF'].map((partner, idx) => (
                        <div key={idx} style={{
                            background: '#111',
                            padding: '0.8rem 1.2rem',
                            borderRadius: '20px',
                            border: '1px solid #333',
                            color: '#ccc',
                            fontSize: '0.95rem'
                        }}>
                            {partner}
                        </div>
                    ))}
                </div>
            </section>

            {/* 핵심 인사이트 */}
            <section style={{
                background: 'linear-gradient(135deg, #06B6D420, #3B82F620)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid #06B6D440'
            }}>
                <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>💡 네안데르가 배울 점</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[
                        'AI를 "도구"가 아닌 "메인 테마"로 삼음',
                        'NFT를 수익원이자 기부 채널로 활용',
                        '빅테크(Google)와 문화기관 동시 협업',
                        '10년 커미션 후 자체 뮤지엄 설립',
                        'Machine Hallucinations 하나로 글로벌 브랜딩'
                    ].map((point, idx) => (
                        <div key={idx} style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem'
                        }}>
                            <span style={{ color: '#06B6D4', fontSize: '1.5rem' }}>→</span>
                            {point}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
