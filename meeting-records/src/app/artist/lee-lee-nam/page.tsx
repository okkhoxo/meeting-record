'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LeeLeeNamPage() {
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
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>이이남 (Lee Lee Nam)</h1>
            <p style={{ fontSize: '1.4rem', color: '#888', marginBottom: '3rem' }}>
                한국 미디어아트의 거장 | 움직이는 명화
            </p>

            {/* 타임라인 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#8B5CF6', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📅</span> 일대기 타임라인
                </h2>
                <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '3px solid #8B5CF6' }}>
                    {[
                        { year: '1969', event: '전남 담양 출생' },
                        { year: '1992', event: '조선대학교 미술대학 조소과 졸업' },
                        { year: '2000', event: '찰흙 애니메이션으로 영상 작업 시작' },
                        { year: '2004', event: '연세대학교 영상대학원 졸업' },
                        { year: '2006', event: '미디어아트 본격 시작, "움직이는 명화" 탄생' },
                        { year: '2008', event: '삼성전자 전속작가 계약 (5년, 모니터 250대 협찬)' },
                        { year: '2010', event: 'G20 서울정상회의 선정작가 - 갤럭시탭에 작품 탑재' },
                        { year: '2011', event: '애플 앱스토어 세계 최초 미디어아트 앱 출시' },
                        { year: '2014', event: '반기문 UN사무총장 집무실 작품 전시' },
                        { year: '2015', event: '광주 유니버시아드 미술총감독' },
                        { year: '2015', event: '국립아시아문화전당 개막식 미디어아트 감독' },
                        { year: '2017', event: '세계수영선수권대회 폐막식 미디어아트 감독' },
                        { year: '2020', event: '광주 양림동 "이이남 스튜디오" 개관' },
                        { year: '2021', event: '앤어워드 디지털콘텐츠 분야 그랑프리 수상' },
                        { year: '2024', event: '파리 올림픽 미디어아트 참여' },
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
                                background: '#8B5CF6',
                                borderRadius: '50%'
                            }} />
                            <span style={{
                                color: '#8B5CF6',
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
                        { title: '디지털 병풍', desc: '전통 병풍에 디지털 영상을 입힌 대표작. 고전 서화가 현대 기술로 살아 움직인다.', color: '#EC4899' },
                        { title: '묵죽도', desc: '대나무 그림이 바람에 흔들리는 동양화의 디지털 재해석' },
                        { title: '고흐, 별이 빛나는 밤에', desc: '반 고흐의 명화를 움직이는 영상으로 재탄생. 조선대 중앙도서관 기증' },
                        { title: '꿈속의 광주', desc: '5·18 민주항쟁을 몽환적으로 재현한 이머시브 미디어아트' },
                        { title: '기운생동(氣韻生動)', desc: '2024 영등포 미디어아트 페스티벌 출품작' },
                        { title: '산수극장', desc: 'ACC 개관 10주년 기념 전시 - 고향 산수를 디지털로 재현' },
                    ].map((work, idx) => (
                        <div key={idx} style={{
                            background: '#111',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #222',
                            borderTop: `4px solid ${work.color || '#8B5CF6'}`
                        }}>
                            <h3 style={{ color: work.color || '#8B5CF6', marginBottom: '0.8rem', fontSize: '1.3rem' }}>{work.title}</h3>
                            <p style={{ color: '#999', lineHeight: 1.6 }}>{work.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 비즈니스 모델 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#10B981', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>💰</span> 비즈니스 모델
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <h3 style={{ color: '#10B981', marginBottom: '1rem' }}>🏢 기업 협찬/전속</h3>
                        <ul style={{ color: '#ccc', lineHeight: 2 }}>
                            <li>삼성전자 전속작가 (5년)</li>
                            <li>모니터 250대 협찬</li>
                            <li>애플 앱스토어 협업</li>
                        </ul>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <h3 style={{ color: '#3B82F6', marginBottom: '1rem' }}>🏛️ 공공 커미션</h3>
                        <ul style={{ color: '#ccc', lineHeight: 2 }}>
                            <li>G20 정상회의</li>
                            <li>유니버시아드 미술총감독</li>
                            <li>세계수영선수권대회</li>
                            <li>올림픽 미디어아트</li>
                        </ul>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(236,72,153,0.3)' }}>
                        <h3 style={{ color: '#EC4899', marginBottom: '1rem' }}>🖼️ 자체 공간</h3>
                        <ul style={{ color: '#ccc', lineHeight: 2 }}>
                            <li>이이남 스튜디오 (광주)</li>
                            <li>카페 + 전시공간 + 작업실</li>
                            <li>작품 판매 및 체험</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 핵심 인사이트 */}
            <section style={{
                background: 'linear-gradient(135deg, #8B5CF620, #EC489920)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid #8B5CF640'
            }}>
                <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>💡 네안데르가 배울 점</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {[
                        '대기업 협찬으로 기술력/인프라 확보',
                        '국가 행사로 인지도 급상승',
                        '"움직이는 명화" 하나로 브랜딩 성공',
                        '자체 공간으로 수익 다각화'
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
                            <span style={{ color: '#8B5CF6', fontSize: '1.5rem' }}>→</span>
                            {point}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
