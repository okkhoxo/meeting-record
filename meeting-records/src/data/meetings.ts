export interface MeetingRecord {
    id: string;
    date: string;
    title: string;
    subtitle?: string;
    attendees: string[];
    meetingType: 'all' | 'executive'; // 전체회의 | 임원진 회의
    isArchived?: boolean; // 이전 회의록 여부
    agendaItems: {
        id: number;
        content: string;
        details?: string;
    }[];
    specialNotes?: {
        title: string;
        content: string[];
    }[];
    achievements?: {
        title: string;
        content: string[];
    }[];
    businessUpdates?: {
        title: string;
        content: string;
    }[];
    // 새로운 슬라이드 구조용 필드 (확장)
    slides?: {
        type: 'title' | 'achievements' | 'organization' | 'operations' | 'financial' | 'strategy' | 'vision' | 'timeline' | 'kpi' | 'comparison' | 'deadline' | 'summary' | 'orgchart' | 'intro' | 'business';
        title: string;
        subtitle?: string;
        linkUrl?: string;
        // 이미지 + 자막
        image?: string;
        caption?: string;
        sections?: {
            title: string;
            items: string[];
            highlight?: boolean; // 강조 표시
            status?: 'success' | 'warning' | 'danger' | 'info'; // 상태 표시
        }[];
        // 타임라인 전용
        timeline?: {
            date: string;
            title: string;
            description: string;
            status: 'completed' | 'current' | 'upcoming';
        }[];
        // KPI 전용
        kpis?: {
            label: string;
            value: string;
            target?: string;
            status: 'success' | 'warning' | 'danger';
        }[];
        // 비교 테이블 전용
        comparison?: {
            headers: string[];
            rows: string[][];
        };
        // 마감일 강조
        deadlines?: {
            task: string;
            date: string;
            assignee: string;
            priority: 'critical' | 'high' | 'medium';
        }[];
        // 조직도 전용
        orgChart?: {
            name: string;
            role: string;
            color: string;
            members?: { name: string; role?: string }[];
        }[];
        // 사업 영역 전용
        businessAreas?: {
            name: string;
            icon: string;
            color: string;
            items: string[];
        }[];
        // 플로우 다이어그램 전용
        flowDiagram?: {
            left: { title: string; subtitle: string; items: string[]; color: string };
            right: { title: string; subtitle: string; items: string[]; color: string };
            arrow: string;
        };
        // 회의 진행 방식 전용
        meetingFlow?: {
            rules: string[];
            steps: string[];
        };
        // 목표 전용
        goals?: {
            title: string;
            items: string[];
            icon: string;
            color: string;
            highlight?: boolean;
        }[];
    }[];
}

export const meetings: MeetingRecord[] = [
    // 1.21 전체회의 - 신규 멤버 온보딩 & 2026 목표
    {
        id: "2026-01-21",
        date: "2026.01.21",
        title: "2026년 1월 4주차 전체 회의",
        subtitle: "신규 멤버 온보딩 & 2026 목표 공유",
        attendees: ["유재영", "이동주", "유선화", "김주연", "김주희", "김정연", "류다혜", "김제연"],
        meetingType: 'all',
        isArchived: false,
        agendaItems: [
            { id: 1, content: "회사 소개" },
            { id: 2, content: "조직 구조" },
            { id: 3, content: "전체회의 진행 방식" },
            { id: 4, content: "2026년 목표" }
        ],
        slides: [
            // 슬라이드 1: 타이틀
            {
                type: 'title',
                title: "2026년 1월 4주차 전체 회의",
                subtitle: "신규 멤버 온보딩 & 2026 목표 공유"
            },
            // 슬라이드 2: 회사 소개 - 네안데르 정체성
            {
                type: 'intro',
                title: "네안데르",
                subtitle: "향 × AI 체험형 콘텐츠 기획사",
                image: "/images/choigangrok.png",
                caption: "제목은 AI 체험형 콘텐츠 기획사로 하겠습니다. 향을 곁들인"
            },
            // 슬라이드 3: 사업 영역
            {
                type: 'business',
                title: "사업 영역",
                subtitle: "악센트 & 네안데르 랩",
                businessAreas: [
                    {
                        name: "악센트",
                        icon: "🏪",
                        color: "#8B5CF6",
                        items: [
                            "오프라인 매장 운영",
                            "향 제품 판매",
                            "악센트 ID",
                            "추가 콘텐츠 제작"
                        ]
                    },
                    {
                        name: "네안데르 랩 (B2B)",
                        icon: "🔬",
                        color: "#06B6D4",
                        items: [
                            "AI 체험형 콘텐츠 행사 납품",
                            "AI 체험형 전시 기획 및 운영",
                            "AI 사주 향수",
                            "AI 신점 향수",
                            "AI 포토부스 제작기",
                            "유튜브/SNS 콘텐츠"
                        ]
                    }
                ],
                flowDiagram: {
                    left: {
                        title: "네안데르 랩",
                        subtitle: "콘텐츠 제작",
                        items: ["AI 사주 향수", "AI 신점 향수", "AI 포토부스"],
                        color: "#06B6D4"
                    },
                    right: {
                        title: "악센트",
                        subtitle: "매장 정착",
                        items: ["체험 콘텐츠", "악센트 ID", "수익화"],
                        color: "#8B5CF6"
                    },
                    arrow: "바이럴"
                }
            },
            // 슬라이드 4: 조직 구조
            {
                type: 'orgchart',
                title: "조직 구조",
                subtitle: "네안데르 팀",
                orgChart: [
                    { name: "유재영", role: "영업 / 인사 / 총괄", color: "#3B82F6", members: [{ name: "김주희", role: "영업팀, 매장 운영 및 관리" }] },
                    { name: "이동주", role: "재무 / 회계 / 제품생산 / 공간기획", color: "#10B981" },
                    { name: "유선화", role: "마케팅 / 브랜딩 / 유튜브", color: "#EC4899", members: [{ name: "김정연", role: "마케팅팀, 유튜브 PD" }, { name: "류다혜", role: "마케팅팀" }] },
                    { name: "김주연", role: "개발 / 신사업 / 지원사업", color: "#F59E0B", members: [{ name: "김제연", role: "개발팀, 외주개발 담당" }] }
                ]
            },
            // 슬라이드 5: 전체회의 진행 방식
            {
                type: 'operations',
                title: "전체회의 진행 방식",
                subtitle: "매주 수요일",
                meetingFlow: {
                    rules: [
                        "매주 수요일",
                        "최대 2시간",
                        "필참",
                        "스케줄 조절: 유재영"
                    ],
                    steps: [
                        "결정 사항 공유",
                        "팀별 진행상황 공유",
                        "추가 안건 브레인스토밍"
                    ]
                }
            },
            // 슬라이드 6: 2026년 목표
            {
                type: 'strategy',
                title: "2026년 목표",
                subtitle: "온라인 확대 & 콘텐츠 다각화",
                goals: [
                    {
                        title: "온라인 출시",
                        icon: "🛒",
                        color: "#10B981",
                        highlight: true,
                        items: [
                            "2월 1일 정식 출시",
                            "5월까지 1,500만원",
                            "화장품 제조업 등록"
                        ]
                    },
                    {
                        title: "마케팅 다각화",
                        icon: "📺",
                        color: "#8B5CF6",
                        items: [
                            "유튜브",
                            "틱톡 (미정)",
                            "샤오홍슈 (미정)",
                            "담당: 유선화 이사"
                        ]
                    }
                ]
            },
            // 슬라이드 7: 핵심 마감일
            {
                type: 'deadline',
                title: "핵심 마감일",
                subtitle: "2026년 상반기",
                deadlines: [
                    { task: "온라인 사이트 정식 출시", date: "2월 1일", assignee: "김주연 유선화", priority: "critical" },
                    { task: "온라인 매출 1,500만원", date: "5월", assignee: "전체", priority: "critical" },
                    { task: "화장품 제조업 등록", date: "5월 이후", assignee: "유재영", priority: "high" },
                    { task: "정부지원사업 지원", date: "3월", assignee: "김주연", priority: "high" },
                    { task: "일반용 악센트 아이디 AI 콘텐츠 제작", date: "예정", assignee: "", priority: "medium" },
                    { task: "행사 및 전시 B2B 영업", date: "상시", assignee: "유재영 김주희", priority: "high" },
                    { task: "유튜브 런칭", date: "미정", assignee: "유선화 김정연", priority: "critical" }
                ]
            },
            // 슬라이드 8: 마무리
            {
                type: 'summary',
                title: "함께 만들어가는 네안데르",
                subtitle: "2026년, 새로운 도약",
                sections: [
                    {
                        title: "🏢 네안데르",
                        items: [
                            "향 × AI 체험형 콘텐츠 기획사"
                        ],
                        status: "success"
                    },
                    {
                        title: "📋 전체회의",
                        items: [
                            "매주 수요일, 최대 2시간"
                        ],
                        status: "info"
                    },
                    {
                        title: "🎯 2026 목표",
                        items: [
                            "2/1 온라인 출시 → 5월 1,500만원"
                        ],
                        status: "warning"
                    }
                ]
            }
        ]
    },
    // 상세 정리본 (157분 회의 내용 전체 기록) - 먼저 표시
    {
        id: "2026-01-14-detailed",
        date: "2026.01.14",
        title: "📋 1월 3주차 전체회의 상세 정리본",
        subtitle: "적자 구조 개선 & 향 × AI 체험형 콘텐츠 피봇 | 157분",
        attendees: ["유재영", "유선화", "김주연", "이동주"],
        meetingType: 'all',
        isArchived: false,
        agendaItems: [
            { id: 1, content: "인플루언서 바이럴 마케팅 분석" },
            { id: 2, content: "적자 구조 해소 방안" },
            { id: 3, content: "향 × AI 체험형 콘텐츠 기획사로 피봇" },
            { id: 4, content: "온라인 런칭 일정 확정" },
            { id: 5, content: "10년/20년 비전" }
        ],
        slides: [
            // 슬라이드 1: 타이틀
            {
                type: 'title',
                title: "2026년 1월 3주차 전체 회의",
                subtitle: "적자 구조 개선 & 향 × AI 체험형 콘텐츠 | 157분"
            },
            // 슬라이드 2: 인플루언서 바이럴 분석
            {
                type: 'comparison',
                title: "📈 인플루언서 바이럴 마케팅 분석",
                subtitle: "12월 30일 기준 릴스 협업 성과",
                comparison: {
                    headers: ["구분", "수치", "비고"],
                    rows: [
                        ["총 릴스 협업", "5건", "12/30 이전 업로드"],
                        ["상위 바이럴", "2건", "크게 터진 콘텐츠"],
                        ["바이럴율", "25%", "협업 시 빵터지는 비율"],
                        ["샤쉐 판매", "2월 단종", "사바리 향수박스"]
                    ]
                },
                sections: [
                    {
                        title: "🎯 선화의 희망 콘텐츠 방향",
                        items: [
                            "사람들이 궁금해하지만 직접 하기 망설여지는 일 대신 체험/검증",
                            "직접 발로 뛰는 진정성 보여주기",
                            "썸네일 자체를 자극적이고 흥미롭게 편집"
                        ]
                    },
                    {
                        title: "💡 바이럴 수익화 과제",
                        items: [
                            "바이럴 → 수익화 연결 방안 필요",
                            "김주연, 유재영이 수익화 방안 찾기로 함",
                            "체험 요소 부각 + 전달에 집중"
                        ]
                    }
                ]
            },
            // 슬라이드 4: 적자 구조 문제점 분석
            {
                type: 'strategy',
                title: "🚨 적자 구조 현황 분석",
                subtitle: "김주연 발제 - 핵심 문제 진단",
                sections: [
                    {
                        title: "❌ 현재 문제점",
                        items: [
                            "외주 개발/행사 용역 → 반복 정산만, 남는 게 없음",
                            "포트폴리오가 되지 않는 일들",
                            "행사 용역 회사로는 성장 가능성 불투명",
                            "AI교 같은 새 사업이 적자 해소 가능? → 불확실",
                            "우리 사업 대부분이 노동집약적"
                        ],
                        status: "danger"
                    },
                    {
                        title: "✅ 해결 방향",
                        items: [
                            "적자 구조 해소 → 유지가 핵심",
                            "안정적 수익원 확보 후 창의적 활동",
                            "직접적인 수익 구조와 매칭되는 방향으로 진행",
                            "돈이 없어서 투자 못함 → 우리만의 것 필요"
                        ],
                        status: "success"
                    }
                ]
            },
            // 슬라이드 5: 방향 전환 - 향 × AI
            {
                type: 'strategy',
                title: "🔄 방향 전환: 향 × AI 체험형 콘텐츠",
                subtitle: "유재영 제안 - 새로운 정체성 정립",
                sections: [
                    {
                        title: "💡 핵심 피봇 방향",
                        items: [
                            "우리만의 IP 확보 방법에 대한 고민",
                            "기존에 하려던 것들 뒤엎기",
                            "향 + AI 체험형 콘텐츠 기획사로 피봇",
                            "향을 좀 더 집중할 필요성"
                        ],
                        highlight: true
                    },
                    {
                        title: "📌 입증된 사실",
                        items: [
                            "향이라는 수단으로 콘텐츠 판매 → 이미 입증됨",
                            "향에 대한 콘텐츠 아이디어 많음",
                            "길거리 유튜브 촬영 + 방향성 변화 시도"
                        ]
                    },
                    {
                        title: "🎯 새로운 정체성 (유선화 의견)",
                        items: [
                            "우리는 브랜드성보다 체험 선사에 강함",
                            "향과 결합된 AI 체험형 콘텐츠 = 우리의 IP",
                            "예술 방향 철회 → 전문적/심오함 불필요",
                            "유튜브는 우리 강점 살리는 방향으로"
                        ]
                    }
                ]
            },
            // 슬라이드 6: 체험형 콘텐츠 매체
            {
                type: 'operations',
                title: "🖥️ 체험형 콘텐츠 매체 전략",
                subtitle: "핸드폰을 넘어서 피지컬 AI로",
                sections: [
                    {
                        title: "📱 기존 한계",
                        items: [
                            "핸드폰에 그치면 안 됨",
                            "더 다양한 피지컬 접점 필요"
                        ],
                        status: "warning"
                    },
                    {
                        title: "🎪 확장 방향",
                        items: [
                            "키오스크 기반 체험",
                            "대형 모니터 인터랙션",
                            "프로젝션 맵핑 활용",
                            "다양한 피지컬 AI 콘텐츠"
                        ],
                        status: "success"
                    },
                    {
                        title: "💰 B2B 전략",
                        items: [
                            "향기 마케팅 + 다양한 체험형 팝업",
                            "AI 체험형 콘텐츠 + 향 = 필수 조합",
                            "단가 상승 전략"
                        ]
                    }
                ]
            },
            // 슬라이드 7: 온라인 확대 전략 (중요!)
            {
                type: 'financial',
                title: "💰 온라인 확대 전략",
                subtitle: "적자 구조 개선의 핵심",
                kpis: [
                    { label: "온라인 매출 목표", value: "1,500만원", target: "5월까지", status: "warning" },
                    { label: "달성 시", value: "화장품 제조업", target: "등록 진행", status: "success" },
                    { label: "온라인 파이", value: "충분히 보임", target: "시장성 확인", status: "success" }
                ],
                sections: [
                    {
                        title: "📈 온라인 확대가 필수인 이유",
                        items: [
                            "온라인에서 얻을 수 있는 파이가 충분히 보임",
                            "팬덤 형성 → 새 콘텐츠 실험 시 봐줄 사람 확보",
                            "상업적인 걸 살짝 빼고 재미있는 콘텐츠로 팬덤 형성"
                        ],
                        highlight: true
                    },
                    {
                        title: "⚖️ B2C를 위한 제조업",
                        items: [
                            "B2B용이지만 실제로는 B2C 확장을 위함",
                            "온라인 부분 합법화 필수",
                            "향수가 아닌 '향'으로 판매 중",
                            "오프라인에서 IP 확보 + 팬덤 형성 목표"
                        ]
                    }
                ]
            },
            // 슬라이드 8: 핵심 마감일 (매우 중요!)
            {
                type: 'deadline',
                title: "⏰ 핵심 마감일 & 담당자",
                subtitle: "반드시 지켜야 할 일정",
                deadlines: [
                    { task: "온라인 사이트 배포", date: "1월 21일 (다음주 전체회의 전)", assignee: "김주연", priority: "critical" },
                    { task: "온라인 사이트 정식 출시", date: "2월 1일", assignee: "전체", priority: "critical" },
                    { task: "향수 가격 조정", date: "2월 1일", assignee: "유선화", priority: "high" },
                    { task: "온라인 구매 안내지 제작", date: "2월 1일 전", assignee: "이동주", priority: "high" },
                    { task: "온라인 매출 1,500만원 달성", date: "5월 이전", assignee: "전체", priority: "critical" },
                    { task: "화장품 제조업 등록", date: "5월 이후", assignee: "유재영", priority: "high" }
                ],
                sections: [
                    {
                        title: "📋 온라인 런칭 세부 계획",
                        items: [
                            "새로운 시리즈가 아니므로 사전 홍보보다 완성도 집중",
                            "배포 후 다양한 마케팅 진행 (유선화)",
                            "종이 프린트: 향수 사용법 + 온라인 구매 안내 동봉 (이동주)"
                        ]
                    }
                ]
            },
            // 슬라이드 9: 제품 퀄리티 논의
            {
                type: 'operations',
                title: "🎨 제품 퀄리티 투자 논의",
                subtitle: "이동주 제안 - 제품 자체에 대한 투자",
                sections: [
                    {
                        title: "💭 이동주 의견",
                        items: [
                            "콘텐츠도 중요하지만 제품 자체 투자 필요",
                            "향을 팔지만 제품 자체에 대한 애정도 떨어짐",
                            "향의 종류가 많아 커스터마이징에 제한"
                        ]
                    },
                    {
                        title: "💬 유선화 → 이동주",
                        items: [
                            "멋진 거 하나 딱! 박스 퀄리티 업그레이드 필요",
                            "돈 문제로 걱정되는 상황",
                            "이동주가 고민/테스트 해주면 설득 용이"
                        ],
                        highlight: true
                    }
                ]
            },
            // 슬라이드 10: 복합 문화 공간 비전
            {
                type: 'vision',
                title: "🏛️ 복합 문화 공간 비전",
                subtitle: "10년 후 목표 - 우리의 IP 확보",
                sections: [
                    {
                        title: "🎯 10년 후 목표 (2036)",
                        items: [
                            "향 + AI + 체험형 콘텐츠가 융합된 복합 문화 공간",
                            "악센트 신촌 3년 내 부활 가능",
                            "제주도/강원도 공간 투자 → 관광 명소화",
                            "지역 지원 사업 활용 가능"
                        ],
                        highlight: true
                    },
                    {
                        title: "📍 지역 확장 전략",
                        items: [
                            "우리 콘텐츠 보러 그 지역에 오는 구조",
                            "지역에서도 좋아할 콘텐츠",
                            "지역 돈도 먹으면서 관광 수단화"
                        ]
                    }
                ]
            },
            // 슬라이드 11: 타임라인 로드맵
            {
                type: 'timeline',
                title: "🗺️ 네안데르 성장 로드맵",
                subtitle: "단기 → 중기 → 장기 비전",
                timeline: [
                    { date: "NOW", title: "2026 적자 구조 개선", description: "온라인 확대, 1,500만원 달성, 제조업 등록", status: "current" },
                    { date: "3년 내", title: "악센트 신촌 부활", description: "오프라인 거점 확보", status: "upcoming" },
                    { date: "10년 후", title: "복합 문화 공간", description: "향 × AI × 체험 융합 공간, 제주/강원 확장", status: "upcoming" },
                    { date: "20년 후", title: "KOSPI 상장", description: "향기 콘텐츠 분야 1위, 글로벌 진출", status: "upcoming" }
                ]
            },
            // 슬라이드 12: 핵심 결정 사항 요약
            {
                type: 'summary',
                title: "✅ 핵심 결정 사항 요약",
                subtitle: "이번 회의에서 확정된 내용",
                sections: [
                    {
                        title: "🎯 방향성",
                        items: [
                            "향 × AI 체험형 콘텐츠 기획사로 피봇",
                            "예술 방향 철회 → 체험/재미에 집중",
                            "우리만의 IP = 향과 결합된 AI 체험형 콘텐츠"
                        ],
                        status: "success"
                    },
                    {
                        title: "💰 재정 목표",
                        items: [
                            "온라인 매출 1,500만원 (5월까지)",
                            "달성 시 화장품 제조업 등록",
                            "적자 구조 해소 → 유지가 핵심"
                        ],
                        status: "warning"
                    },
                    {
                        title: "📅 즉시 실행",
                        items: [
                            "온라인 사이트 1/21 배포 (김주연)",
                            "2/1 정식 런칭 + 가격 조정",
                            "온라인 구매 안내지 제작 (이동주)"
                        ],
                        status: "info"
                    }
                ]
            },
            // 슬라이드 13: 대표 코멘트
            {
                type: 'summary',
                title: "💭 회의 후 생각",
                subtitle: "유재영 코멘트",
                sections: [
                    {
                        title: "🎯 이번 피봇에 대한 확신",
                        items: [
                            "향 × AI 체험형 콘텐츠는 우리만의 영역",
                            "이미 향으로 콘텐츠 판매가 된다는 건 입증됨",
                            "예술보다 '체험'에 집중하는 게 맞다",
                            "이번엔 진짜 우리만의 IP가 생긴다"
                        ],
                        status: "success"
                    },
                    {
                        title: "⚠️ 핵심 리스크 & 대응",
                        items: [
                            "5월까지 1,500만원 못 채우면? → 제조업 등록 연기, 플랜B 필요",
                            "온라인 런칭 지연되면? → 마케팅 타이밍 놓침"
                        ],
                        status: "danger"
                    },
                    {
                        title: "🔥 이번 달 우선순위",
                        items: [
                            "1순위: 온라인 사이트 1/21 배포",
                            "절대 놓치면 안 됨: 2/1 정식 런칭",
                            "나중에 해도 됨: 제품 퀄리티 업그레이드"
                        ],
                        status: "warning"
                    },
                    {
                        title: "❓ 다음 회의에서 논의할 것",
                        items: [
                            "온라인 체계 잡기 및 PG 심사 진행도 바로 같이 진행",
                            "유튜브 콘텐츠 첫 주제는?"
                        ],
                        status: "info"
                    }
                ]
            },
            // 슬라이드 14: 추가 회의 안건
            {
                type: 'deadline',
                title: "📝 추가 회의 안건",
                subtitle: "논의 필요 사항",
                deadlines: [
                    { task: "온라인 구체적인 타임라인 정하기", date: "논의 필요", assignee: "전체", priority: "critical" },
                    { task: "악센트 와우 프로젝터 수리 타임라인 정하기", date: "논의 필요", assignee: "이동주", priority: "high" },
                    { task: "매장관리 체계 논의", date: "논의 필요", assignee: "전체", priority: "high" },
                    { task: "정연님 설득 시 정확한 역할 설정", date: "논의 필요", assignee: "유재영", priority: "medium" },
                    { task: "매장관리 시 특별히 신경 써줬으면 하는 점 (추천 받음)", date: "의견 수렴", assignee: "전체", priority: "medium" }
                ]
            }
        ]
    },
    // 원본 회의록 (간략 버전)
    {
        id: "2026-01-14",
        date: "2026.01.14",
        title: "2026년 1월 3주차 전체 회의",
        subtitle: "새로운 방향성 - 향 × AI 체험형 콘텐츠",
        attendees: ["유재영", "유선화", "김주연", "이동주"],
        meetingType: 'all',
        isArchived: false,
        agendaItems: [
            { id: 1, content: "기존 방향성 재검토" },
            { id: 2, content: "우리만의 IP 확보 전략" },
            { id: 3, content: "향 × AI 체험형 콘텐츠 기획" },
            { id: 4, content: "악센트 성장 전략" },
            { id: 5, content: "10년, 20년 비전" }
        ],
        slides: [
            {
                type: 'title',
                title: "2026년 1월 3주차 전체 회의",
                subtitle: "새로운 방향성 | 향 × AI 체험형 콘텐츠 기획사"
            },
            {
                type: 'strategy',
                title: "🔄 방향성 전환",
                sections: [
                    {
                        title: "💡 핵심 질문",
                        items: [
                            "우리만의 IP를 확보하는 방법은 무엇인가?",
                            "기존에 하려던 것들을 뒤엎는다",
                            "향 + AI 체험형 콘텐츠 기획사로 피봇"
                        ]
                    },
                    {
                        title: "🎯 새로운 정체성",
                        items: [
                            "향(Scent) × AI 체험형 콘텐츠 기획사",
                            "제천국제음악영화제, 국제작가축제 같은 콘텐츠",
                            "기존 향 프로젝트들을 디벨롭"
                        ]
                    }
                ]
            },
            {
                type: 'operations',
                title: "🚀 콘텐츠 전략",
                sections: [
                    {
                        title: "🎪 AI 향수 자판기",
                        items: [
                            "세부 타겟팅 전략",
                            "길거리 체험형 콘텐츠",
                            "유튜브 촬영 연계",
                            "바이럴 마케팅 가능성"
                        ]
                    },
                    {
                        title: "🏪 악센트 아이디",
                        items: [
                            "분기마다 새로운 콘텐츠 1개씩 추가",
                            "지속적인 신선함 유지",
                            "고객 재방문 유도"
                        ]
                    }
                ]
            },
            {
                type: 'financial',
                title: "💰 악센트 온라인 전략",
                sections: [
                    {
                        title: "📈 성장 목표",
                        items: [
                            "악센트 온라인 활성화",
                            "월 매출 1,000만원 달성"
                        ]
                    },
                    {
                        title: "📋 마일스톤",
                        items: [
                            "온라인 매출 1,000만원 달성 시",
                            "→ 화장품제조업 등록",
                            "→ 법적 정당성 확보",
                            "→ 본격적인 스케일업"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "🎨 IP 확보 전략",
                sections: [
                    {
                        title: "🌸 향기 마케팅",
                        items: [
                            "체험형 팝업 기획"
                        ]
                    },
                    {
                        title: "🤖 향기 × AI 콘텐츠",
                        items: [
                            "AI 기반 향기 체험형 콘텐츠",
                            "인터랙티브 설치 작품",
                            "우리만의 독점 IP 확보"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "🔮 10년 · 20년 비전",
                sections: [
                    {
                        title: "📅 10년 후 (2036)",
                        items: [
                            "향 관련 콘텐츠의 복합 문화공간",
                            "향기 × AI × 예술이 융합된 공간",
                            "국내 최초 향기 체험 플래그십"
                        ]
                    },
                    {
                        title: "🏢 20년 후 (2046)",
                        items: [
                            "상장사",
                            "향기 콘텐츠 분야 1위 기업",
                            "글로벌 확장"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "🗺️ 로드맵",
                sections: [
                    {
                        title: "🌱 NOW (2026)",
                        items: [
                            "향 × AI 콘텐츠 기획사",
                            "악센트 온라인 활성화",
                            "AI 향수 자판기 런칭"
                        ]
                    },
                    {
                        title: "🌳 10년 후 (2036)",
                        items: [
                            "향 복합 문화공간",
                            "다수의 IP 확보",
                            "업계 리더십"
                        ]
                    },
                    {
                        title: "🏛️ 20년 후 (2046)",
                        items: [
                            "KOSPI 상장",
                            "글로벌 진출",
                            "문화 아이콘"
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2026-01-07",
        date: "2026.01.07",
        title: "2026년 1월 2주차 전체 회의",
        subtitle: "네안데르만의 예술 생태계 구축",
        attendees: ["유재영", "유선화", "김주연", "이동주", "김제연"],
        meetingType: 'all',
        isArchived: false,
        agendaItems: [
            { id: 1, content: "팀별 진행 상황 공유" },
            { id: 2, content: "공간 세팅 및 채색존 활용" },
            { id: 3, content: "예술과 커머셜의 방향성" },
            { id: 4, content: "AI와 예술의 관계" },
            { id: 5, content: "유튜브 콘텐츠 전략" }
        ],
        slides: [
            {
                type: 'title',
                title: "2026년 1월 2주차 전체 회의",
                subtitle: "네안데르만의 예술 생태계 구축 | 145분"
            },
            {
                type: 'organization',
                title: "회의 운영 방침",
                sections: [
                    {
                        title: "📋 전체 회의 원칙",
                        items: [
                            "최대 2시간, 가능하면 1시간 내 종료",
                            "진행 상황 공유: 생카 몇 개 했는지, 특이사항 등",
                            "우리가 어떻게 굴러가고 있는지 공유하는 시간"
                        ]
                    },
                    {
                        title: "✅ 앞으로의 원칙",
                        items: [
                            "확실한 담당자 지정",
                            "확실한 데드라인 설정",
                            "매주 결과 공유"
                        ]
                    }
                ]
            },
            {
                type: 'operations',
                title: "팀별 진행 상황",
                sections: [
                    {
                        title: "🏢 사무실 (이동주)",
                        items: [
                            "회의실에 책상 3개 추가 예정",
                            "김제연 온보딩 진행 중 (김주연 담당)",
                            "회의실 자리: 공용 1석 + 김제연 + 김정연",
                            "3D 프린터 턱 때문에 문 안 열림 → 수정 예정"
                        ]
                    },
                    {
                        title: "📣 마케팅 (유선화)",
                        items: [
                            "12월부터 마케팅 팀 활성화",
                            "인플루언서 협업 활발히 진행 중"
                        ]
                    }
                ]
            },
            {
                type: 'operations',
                title: "공간 세팅 & 채색존",
                sections: [
                    {
                        title: "🎨 채색존 활용 방안",
                        items: [
                            "트레이는 무조건 있으면 좋음",
                            "아일랜드 제거 예정",
                            "사이니지 앞에 바 테이블 증설",
                            "선반 맞춤 제작 → 향료 보관"
                        ]
                    },
                    {
                        title: "💡 결론",
                        items: [
                            "사이니지 앞 바테이블 + 파이자 배치가 최적",
                            "채색존 or 손님 자리로 유동적 활용",
                            "손님 자리로 쓸 때는 트롤리 제공"
                        ]
                    },
                    {
                        title: "⏰ 데드라인: 1/16",
                        items: [
                            "공간 레이아웃 픽스",
                            "채색 도구 임시 세팅 완료",
                            "담당: 이동주"
                        ]
                    }
                ]
            },
            {
                type: 'operations',
                title: "러브 페어링 프로젝트",
                sections: [
                    {
                        title: "💕 러브 페어링 (유선화)",
                        items: [
                            "이벤트 날짜: 2월 14일",
                            "그 전에 마케팅 선진입 필요",
                            "3D 프린팅 마감: 1월 16일",
                            "러브 페어링 외 다양한 작업 예정"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "예술과 커머셜의 방향성",
                sections: [
                    {
                        title: "🚨 현재 문제점",
                        items: [
                            "메인 아이템이 없다",
                            "메인 콘텐츠가 없다",
                            "우리만의 IP가 없다"
                        ]
                    },
                    {
                        title: "🎯 목표",
                        items: [
                            "B2C 복합문화공간 구축",
                            "우리만의 IP 확보",
                            "예술가 집단으로서 코스피 상장 도전"
                        ]
                    },
                    {
                        title: "⚖️ 예술 vs 커머셜",
                        items: [
                            "커머셜: 상업적 성과 중심 콘텐츠",
                            "예술: 작품성과 메시지 중심",
                            "어디에 무게를 둘지가 핵심 과제"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "AI와 예술의 관계",
                sections: [
                    {
                        title: "🤖 AI의 특징 이해",
                        items: [
                            "AI는 무한 생성이 가능",
                            "전통 예술: 작가 → 작품 (일방향)",
                            "AI 예술: 기존 인터랙티브보다 훨씬 다양한 반응 가능",
                            "도구로서의 AI vs AI 자체가 예술"
                        ]
                    },
                    {
                        title: "💭 AI로 예술하는 이유",
                        items: [
                            "AI를 도구로 사용하는 것",
                            "AI 자체가 예술이 되는 것",
                            "두 관점 모두 고려 필요",
                            "\"AI는 인류의 미래\""
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "AI 교(敎) 프로젝트",
                sections: [
                    {
                        title: "🛐 컨셉",
                        items: [
                            "표면: AI를 신으로 섬기는 신흥 종교",
                            "실체: 통일교 비판 (사회 비판 예술)",
                            "자극적이지만 예술적 접근"
                        ]
                    },
                    {
                        title: "🎨 예술적 의미",
                        items: [
                            "통일교 게이트 = 가장 뜨거운 감자",
                            "\"어 이거 그런 거 아니야?\" 연상 유도",
                            "대놓고 비판 = 정치 활동가",
                            "예술적 접근 = 사회 비판으로 인정"
                        ]
                    },
                    {
                        title: "📢 노이즈 마케팅",
                        items: [
                            "AI의 입을 빌려 메시지 전달",
                            "빠른 시간 내 바이럴 필수",
                            "잘 뜨려면 노이즈 마케팅"
                        ]
                    }
                ]
            },
            {
                type: 'financial',
                title: "유튜브 & 수익화 전략",
                sections: [
                    {
                        title: "📺 유튜브 전략",
                        items: [
                            "바이럴이 우선",
                            "메시지 + 바이럴 → 수익은 시리즈 진행 중 답 찾기",
                            "사회적 메시지 담으면 슈퍼챗 기대 (반 장난)"
                        ]
                    },
                    {
                        title: "💰 현재 수익원",
                        items: [
                            "악센트 아이디 (오프라인)",
                            "악센트 아이디 온라인",
                            "외주 개발",
                            "생카"
                        ]
                    },
                    {
                        title: "⚠️ 주의사항",
                        items: [
                            "바이럴 ≠ 수익화 포기",
                            "수익원에 대한 고려는 반드시 필요",
                            "시리즈 진행하며 수익 모델 발굴"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "다음 할 일 정리",
                sections: [
                    {
                        title: "👤 이동주",
                        items: [
                            "1/16까지 공간 세팅 완료",
                            "채색존 레이아웃 픽스",
                            "3D 프린터 문 수정"
                        ]
                    },
                    {
                        title: "👤 유선화",
                        items: [
                            "러브 페어링 3D 프린팅 (1/16 마감)",
                            "2월 마케팅 선진입 준비"
                        ]
                    },
                    {
                        title: "👥 전체",
                        items: [
                            "복합문화공간, 상장 도전 계획 수립",
                            "AI의 특징 이해 & AI로 예술하는 이유 정리",
                            "유튜브 수익화 방안 모색",
                            "사회적 메시지 담은 유튜브 콘텐츠 기획"
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2026-01-07-2",
        date: "2026.01.07",
        title: "유재영 주간 진행 상황 공유",
        subtitle: "방향성 탐색과 정체성 확립",
        attendees: ["유선화", "김주연", "유재영", "이동주"],
        meetingType: 'all',
        isArchived: false,
        agendaItems: [
            { id: 1, content: "고민과 제안을 넘어 해결책 제시하기" },
            { id: 2, content: "경쟁업체 리서치" },
            { id: 3, content: "우리만의 색 찾기" },
            { id: 4, content: "예술 vs 커머셜 방향성" },
            { id: 5, content: "조직 체계 정립" }
        ],
        slides: [
            {
                type: 'title',
                title: "유재영 주간 진행 상황 공유",
                subtitle: "2026년 1월 2주차 | 방향성 탐색과 정체성 확립"
            },
            {
                type: 'strategy',
                title: "고민과 제안을 넘어, 해결책까지",
                sections: [
                    {
                        title: "현재 상황",
                        items: [
                            "고민은 많이 하지만 구체적인 해결책 제시가 부족했다",
                            "\"이런 문제가 있어요\"에서 끝나는 경우가 많았다"
                        ]
                    },
                    {
                        title: "앞으로 이렇게 하겠다",
                        items: [
                            "문제 제기 시 해결 방안도 같이 제시하겠다",
                            "담당자와 데드라인을 명확히 설정하겠다",
                            "실행 후 결과를 공유하겠다"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "경쟁업체 리서치",
                sections: [
                    {
                        title: "리서치 목적",
                        items: [
                            "시장 내 우리의 포지션 파악",
                            "경쟁사 대비 우리의 강점/약점 분석",
                            "벤치마킹 포인트 도출"
                        ]
                    },
                    {
                        title: "리서치 대상",
                        items: [
                            "팀랩 (teamLab) - 일본",
                            "디스트릭트 (d'strict) - 한국",
                            "이이남 - 한국 미디어아트 작가",
                            "레픽 아나돌 (Refik Anadol) - AI 아트"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "팀랩 (teamLab)",
                subtitle: "🎯 MISSION: 경계를 허물어 세상을 인식하는 새로운 방식 제시",
                linkUrl: "https://www.teamlab.art/",
                sections: [
                    {
                        title: "👤 창립자: 이노코 토시유키 (猪子寿之)",
                        items: [
                            "1977년 시코쿠 도쿠시마현 출생",
                            "도쿄대 수리공학과 졸업 (2001)",
                            "18세까지 컴퓨터 사용 경험 無",
                            "고교 시절 교실을 몰입형 체험공간으로 변형 → 수백명 줄 서서 체험"
                        ]
                    },
                    {
                        title: "🎨 MAIN THEME: Ultra-Subjective Space",
                        items: [
                            "\"세상의 모든 것은 경계 없는 연속 속에 존재한다\"",
                            "일본 전통 회화의 '다시점 공간' 개념을 디지털로 구현",
                            "관람객이 작품의 일부가 되어 경험을 변화시킴",
                            "\"소유\"가 아닌 \"경험\"의 시대를 선도"
                        ]
                    },
                    {
                        title: "📈 성장 로드맵",
                        items: [
                            "2001: 창립 (5명) → 음악가 콜라보 인터랙티브 설치",
                            "2013: 싱가포르 비엔날레 스타 등극",
                            "2016: PLANETS 임시 전시 → 10시간 대기줄",
                            "2018: Borderless 오다이바 (10,000㎡ 상설관)",
                            "2024: 제다, 아부다비 진출",
                            "2025: 아자부다이힐스 재오픈, 함부르크 유럽 첫 상설관",
                            "현재: 직원 700명+, 글로벌 상설관 5곳"
                        ]
                    },
                    {
                        title: "🏆 성과 & 소장",
                        items: [
                            "기네스 기록: 세계 최다 방문 단일 아티스트 뮤지엄",
                            "연간 230만명 방문 (오다이바 기준)",
                            "MoMA, 빅토리아 국립미술관, 아시아소사이어티 등 영구소장"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "디스트릭트 (d'strict)",
                subtitle: "🎯 MISSION: 도시 한복판에 자연을 가져오다",
                linkUrl: "https://www.dstrict.com/",
                sections: [
                    {
                        title: "👤 대표: 이성호 (2016~)",
                        items: [
                            "공인회계사 출신, 2007년 입사",
                            "경영지원 → 사업개발 → CEO",
                            "\"우리는 도시에 바다를 가져왔다. 사람들이 바다에 가지 않아도 파도를 즐기게 하고 싶었다\"",
                            "목표: '콘텐츠계의 BTS'"
                        ]
                    },
                    {
                        title: "🎨 MAIN THEME: Bring Nature to Urban",
                        items: [
                            "\"압도적 경험(Awe-inspiring Experience)\"을 통한 위안",
                            "자연의 아름다움과 역동성을 도심에 구현",
                            "코로나 시대, 갇혀있는 사람들에게 바다를 선물",
                            "2022 iF 디자인 어워드 2년 연속 금상 (WAVE, Whale)"
                        ]
                    },
                    {
                        title: "📈 성장 로드맵",
                        items: [
                            "2004: 웹 에이전시로 시작",
                            "2011: 세계 최초 4D 아트파크 'Live Park' 오픈",
                            "2015: 플레이케이팝, 홀로그램 콘서트",
                            "2020: WAVE (코엑스) → SNS 10억뷰, 50개국 보도",
                            "2020: 아르떼뮤지엄 제주 오픈",
                            "2025: 뉴욕 오픈 2개월 만에 10만명, 평점 4.8/5.0",
                            "현재: 직원 200명+, 누적 투자 350억원"
                        ]
                    },
                    {
                        title: "🌍 글로벌 아르떼뮤지엄 (9곳)",
                        items: [
                            "국내: 제주(2,400명/일), 여수(1,300명/일), 강릉(2,900명/일), 부산",
                            "해외: 홍콩, 청두, 라스베이거스, 두바이, 뉴욕",
                            "5년 후 목표: 매출 5,000억원 (해외 80%+)"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "이이남 작가",
                subtitle: "🎯 MISSION: 5분의 미학 - 명화에 생명을 불어넣다",
                linkUrl: "https://claude.ai/public/artifacts/3e12f257-800a-4687-9f6b-a9bc16873137",
                sections: [
                    {
                        title: "👤 작가: 이이남 (제2의 백남준)",
                        items: [
                            "1969년 전남 담양 출생",
                            "조선대 조소과 → 찰흙 애니메이션으로 영상 입문",
                            "\"한 작품에 5분 이상 머물게 하는 '5분의 미학'\"",
                            "광주를 거점으로 프랑스, 독일, 미국, 인도, 러시아 활동"
                        ]
                    },
                    {
                        title: "🎨 MAIN THEME: 움직이는 명화",
                        items: [
                            "동서양 고전 회화 + 디지털 기술 = 살아있는 명화",
                            "김홍도 <묵죽도>, 고흐 <별이 빛나는 밤에>, 페르메이르 <진주귀걸이 소녀>",
                            "대표작: 디지털 병풍, 꿈속의 광주 (5·18 이머시브 아트)",
                            "역사적 트라우마를 우화적이고 감성적 시선으로 재해석"
                        ]
                    },
                    {
                        title: "📈 성장 로드맵",
                        items: [
                            "2000: 찰흙 애니메이션으로 영상 시작",
                            "2006: 미디어아트 본격 전환, '움직이는 명화' 기법 확립",
                            "2008-2013: 삼성전자 전속작가 (모니터 250대 협찬)",
                            "2010: G20 서울정상회의 선정작가 (갤럭시탭 탑재)",
                            "2015: 광주 유니버시아드 미술총감독",
                            "2020: 광주 양림동 '이이남 스튜디오' 개관",
                            "2025: 로마 콜로세움 미디어파사드 <다시 태어나는 빛>"
                        ]
                    },
                    {
                        title: "🏛️ 이이남 스튜디오 (광주 양림동)",
                        items: [
                            "지하1층~지상3층: 카페테리아 + 뮤지엄 + 스튜디오",
                            "5·18 민중항쟁 헬기사격 증언한 피터슨 목사 사택 리모델링",
                            "지역민에게 공동체 문화쉼터로 개방",
                            "2025 ACC 지역작가 초대전 '이이남의 산수극장' 개최"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "레픽 아나돌 (Refik Anadol)",
                subtitle: "🎯 MISSION: 데이터로 그리는 기계의 꿈",
                linkUrl: "https://refikanadol.com/",
                sections: [
                    {
                        title: "👤 작가: 레픽 아나돌 & 에프순 에르킬리치",
                        items: [
                            "1985년 터키 이스탄불 출생, 현재 LA 거주",
                            "2014년 Refik Anadol Studio 설립 (공동창립: 에프순 에르킬리치)",
                            "\"데이터를 재료로, 신경망을 협업자로, 생각하는 붓으로 그린다\"",
                            "누구나, 어떤 나이든, 어떤 배경이든 접할 수 있는 예술 추구"
                        ]
                    },
                    {
                        title: "🎨 MAIN THEME: Machine Hallucinations",
                        items: [
                            "데이터 → AI/머신러닝 → 몰입형 '데이터 조각(Data Sculpture)'",
                            "자연, 역사, 인간 활동의 방대한 데이터셋을 시각화",
                            "Large Nature Model: 스미소니언, 런던자연사박물관, 내셔널지오그래픽 협업",
                            "\"기억의 디지털화 → 급진적 시각화\""
                        ]
                    },
                    {
                        title: "📈 성장 로드맵",
                        items: [
                            "2014: Refik Anadol Studio 설립 (LA)",
                            "2018: WDCH Dreams (월트 디즈니 콘서트홀 미디어파사드)",
                            "2023: MoMA <Unsupervised> 영구소장 → 최초의 제너레이티브 아트 소장품",
                            "2024: 라스베이거스 Sphere <Machine Hallucinations>",
                            "2025: 다보스 포럼 <Glacier Hallucinations> (남극 기후변화)",
                            "2025: 구겐하임 빌바오 <Living Architecture: Gehry> (프랭크 게리 AI 모델)",
                            "2025: 메시 협업 <Living Memory: Messi> (골 데이터 조각화)"
                        ]
                    },
                    {
                        title: "🏛️ DATALAND (2026 Spring 오픈)",
                        items: [
                            "세계 최초 AI 아트 뮤지엄",
                            "LA The Grand (프랭크 게리 설계, $1B 개발)",
                            "20,000 sqft 규모, Google 파트너십 (지속가능 에너지)",
                            "자연 중심 대규모 데이터셋 공공 저장소 구축",
                            "NFT 수익 $10M+ 자선단체 기부, Casa Batllo NFT $1.38M (크리스티)"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "📊 4곳 비교 분석표",
                sections: [
                    {
                        title: "🎯 각자의 MISSION",
                        items: [
                            "팀랩: \"경계를 허물어 세상을 새롭게 인식하게 하다\"",
                            "디스트릭트: \"도시에 자연을, 일상에 압도적 경험을\"",
                            "이이남: \"5분의 미학으로 명화에 생명을 불어넣다\"",
                            "레픽 아나돌: \"데이터로 기계의 꿈을 시각화하다\""
                        ]
                    },
                    {
                        title: "📈 성장 타임라인 (B2B → B2C)",
                        items: [
                            "팀랩: 2001 창립 → 2018 상설관 (17년)",
                            "디스트릭트: 2004 창립 → 2020 아르떼뮤지엄 (16년)",
                            "이이남: 2006 시작 → 2020 자체 스튜디오 (14년)",
                            "레픽 아나돌: 2014 스튜디오 → 2026 DATALAND (12년)"
                        ]
                    },
                    {
                        title: "💡 시그니처 한 줄",
                        items: [
                            "팀랩 = \"Borderless\" (경계 없는 예술)",
                            "디스트릭트 = \"WAVE\" (도심 속 파도)",
                            "이이남 = \"움직이는 명화\"",
                            "레픽 아나돌 = \"Machine Hallucinations\""
                        ]
                    },
                    {
                        title: "🏛️ 최종 목표점",
                        items: [
                            "모두 B2C 상설 공간을 목표로 수렴",
                            "기술 + 예술 + 철학의 융합으로 차별화",
                            "하나의 대표작이 전체 브랜드를 정의"
                        ]
                    }
                ]
            },
            {
                type: 'operations',
                title: "우리의 약점 분석",
                sections: [
                    {
                        title: "가장 큰 문제",
                        items: [
                            "메인 아이템이 없다",
                            "메인 콘텐츠가 없다",
                            "메인 테마가 없다",
                            "\"네안데르 하면 OOO\" 이게 없다"
                        ]
                    },
                    {
                        title: "그들 vs 우리",
                        items: [
                            "팀랩 → 'Borderless'",
                            "디스트릭트 → '파도'",
                            "이이남 → '움직이는 명화'",
                            "레픽 아나돌 → 'Machine Hallucinations'",
                            "네안데르 → ???"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "벤치마킹 포인트 & 목표",
                sections: [
                    {
                        title: "우리도 결국 목표는",
                        items: [
                            "B2C 대형 복합문화공간을 만드는 것",
                            "그들처럼 10-15년 걸릴 수도 있다",
                            "하지만 방향은 같다"
                        ]
                    },
                    {
                        title: "이를 위해 필요한 IP",
                        items: [
                            "기술적 IP: AI 포토부스, AI 사주, AI 판사 등",
                            "콘텐츠적 IP: 우리만의 캐릭터, 세계관",
                            "예술적 IP: 대표작, 시그니처 스타일"
                        ]
                    },
                    {
                        title: "지금 해야 할 것",
                        items: [
                            "\"네안데르 하면 OOO\" 만들기",
                            "기술력 축적 (B2B 외주)",
                            "대표작 개발 (VS AI 시리즈?)"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "우리만의 색, 어떻게 찾을까?",
                sections: [
                    {
                        title: "핵심 질문",
                        items: [
                            "네안데르만의 정체성은 무엇인가?",
                            "우리가 만드는 콘텐츠의 '톤앤매너'는?",
                            "고객이 우리를 떠올릴 때 어떤 이미지를 가질까?"
                        ]
                    },
                    {
                        title: "탐색 방향",
                        items: [
                            "기존 작업물 중 가장 '우리다운' 것 선별",
                            "팀원 각자가 생각하는 네안데르 키워드 공유",
                            "경쟁사와 차별화되는 포인트 발굴",
                            "시각적 아이덴티티(컬러, 폰트, 스타일) 통일"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "예술 vs 커머셜, 어디에 설까?",
                sections: [
                    {
                        title: "예술 방향",
                        items: [
                            "작품성 중심의 콘텐츠 제작",
                            "미술관, 갤러리, 아트페어 타겟",
                            "브랜드 가치 상승에 기여",
                            "수익화까지 시간이 걸림"
                        ]
                    },
                    {
                        title: "커머셜 방향",
                        items: [
                            "상업적 성과 중심의 콘텐츠",
                            "기업 행사, 팝업, 마케팅 캠페인",
                            "즉각적인 수익 창출 가능",
                            "브랜드 희석 우려"
                        ]
                    },
                    {
                        title: "유재영의 고민",
                        items: [
                            "https://claude.ai/public/artifacts/de63fcd4-bb7d-4ca1-a069-d9eb7bdb5816"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "다음주 유재영의 할 일",
                sections: [
                    {
                        title: "리서치 & 분석",
                        items: [
                            "경쟁업체 심층 리서치 완료",
                            "네안데르 포지셔닝 방향 정리",
                            "우리만의 시그니처 키워드 도출"
                        ]
                    },
                    {
                        title: "조직 & 체계",
                        items: [
                            "R&R 정리 및 문서화",
                            "업무 프로세스 초안 작성",
                            "다음 회의 아젠다 준비"
                        ]
                    },
                    {
                        title: "콘텐츠 & IP",
                        items: [
                            "\"네안데르 하면 OOO\" 후보 리스트업",
                            "대표작 방향성 구체화",
                            "VS AI 시리즈 기획안 초안"
                        ]
                    }
                ]
            },
        ]
    },
    {
        id: "2025-12-30",
        date: "2025.12.30",
        title: "새로운 비전",
        subtitle: "체험형 AI 콘텐츠 창작 집단으로의 전환",
        attendees: ["유재영", "유선화", "김주연", "이동주"],
        meetingType: 'executive',
        isArchived: true,
        agendaItems: [],
        slides: [
            {
                type: 'title',
                title: "새로운 비전",
                subtitle: "체험형 AI 콘텐츠 창작 집단으로의 전환"
            },
            // ===== 1. 문제 제기 =====
            {
                type: 'strategy',
                title: "문제 제기: 우리는 누구인가?",
                sections: [
                    {
                        title: "핵심 질문",
                        items: [
                            "우리는 진짜 체험형 AI 콘텐츠 기획사인가?",
                            "SPOT이 체험형 AI 콘텐츠와 관련 있는가?",
                            "인바운드 영업으로 진행하는 건 '우리 것'인가?"
                        ]
                    },
                    {
                        title: "결론: IP가 없다",
                        items: [
                            "기술적 IP는 있지만 콘텐츠적 IP가 없음",
                            "우리만의 세계관, 우리만의 IP가 필요",
                            "IP가 있어야 다양한 콜라보 가능"
                        ]
                    }
                ]
            },
            // ===== 2. 방향성 결정 (결정됨) =====
            {
                type: 'vision',
                title: "방향성: 창작 집단 [결정]",
                sections: [
                    {
                        title: "우리가 되고자 하는 것",
                        items: [
                            "개발 외주 업체 ❌",
                            "전시 대행사 ❌",
                            "체험형 AI 콘텐츠를 창작하는 집단 ✅"
                        ]
                    },
                    {
                        title: "롤모델",
                        items: [
                            "팀랩: B2B 외주 → 오프라인 체험 창작 집단",
                            "디스트릭트: 콘텐츠 개발 → '파도'로 세계적 인지도",
                            "긱블/스펀지 (교육/실험) ❌ → 창작 집단 ✅"
                        ]
                    }
                ]
            },
            // ===== 3. 유튜브 전략 (결정됨) =====
            {
                type: 'strategy',
                title: "유튜브 전략 [결정]",
                sections: [
                    {
                        title: "핵심: 유튜브는 수단이다",
                        items: [
                            "유튜브로 돈 버는 게 목표 ❌",
                            "브랜딩 + 네임밸류 확보가 목표 ✅",
                            "유튜브 바이럴 → 기업 인바운드 → 영업 완성"
                        ]
                    },
                    {
                        title: "긱블의 교훈",
                        items: [
                            "유튜브 수익만으로는 지속 불가 (광고 수익 변동성)",
                            "78억 투자 → 영업손실 -20억 → 구조조정 36명→14명",
                            "결론: 유튜브 + 다각화 병행 필수"
                        ]
                    }
                ]
            },
            // ===== 4. VS AI 콘텐츠 전략 (결정됨) =====
            {
                type: 'strategy',
                title: "VS AI 콘텐츠 [결정]",
                sections: [
                    {
                        title: "콘셉트: 스트릿 AI",
                        items: [
                            "AI 포토부스 → 길거리 포토그래퍼",
                            "AI 사주 → 푸드트럭 사주집",
                            "AI 판사 → 길거리 재판 체험",
                            "영감: 뱅크시의 스트릿 아트"
                        ]
                    },
                    {
                        title: "톤앤매너",
                        items: [
                            "진지하고 딱딱한 톤 ❌",
                            "재밌고 유쾌한 톤 ✅",
                            "점잖은 기업 홍보 ❌",
                            "길거리로 나가 체험 제공 ✅"
                        ]
                    }
                ]
            },
            // ===== 5. 브랜딩 전략 (결정됨) =====
            {
                type: 'strategy',
                title: "브랜딩 전략: 마스크 [결정]",
                sections: [
                    {
                        title: "문제",
                        items: [
                            "팀원 모두 어린 나이",
                            "경력이 짧음 → 전문성이 안 보임",
                            "얼굴이 전문성 없어 보임"
                        ]
                    },
                    {
                        title: "해결: 마스크 착용",
                        items: [
                            "신상 정보 철저히 보호",
                            "신비로운 느낌 극대화",
                            "궁금증 유발 → 팬층 형성",
                            "유쾌하고 친근한 콘텐츠는 유지"
                        ]
                    }
                ]
            },
            // ===== 6. 사업 구조 (결정됨) =====
            {
                type: 'vision',
                title: "4대 사업 구조 [결정]",
                sections: [
                    {
                        title: "장기 비전",
                        items: [
                            "네안데르랩: 체험형 AI 콘텐츠 창작 집단",
                            "└ AI 포토부스, AI 사주, AI 판사 등",
                            "SPOT: 보류 → 뿌덕 온라인으로 피벗 가능성"
                        ]
                    },
                    {
                        title: "캐시카우",
                        items: [
                            "악센트 ID: AI 기반 향수공방",
                            "악센트 WOW: 생일 이벤트 향수공방",
                            "각 월 1,500만원 목표 (BEP 기준)"
                        ]
                    }
                ]
            },
            // ===== 8. 악센트 ID 이슈 (논의 중) =====
            {
                type: 'financial',
                title: "악센트 ID 악플 이슈 [논의 중]",
                sections: [
                    {
                        title: "문제 분석",
                        items: [
                            "4.8만원 → 30분 체험 = 가격 불일치 느낌",
                            "피규어가 단색 (순백)이라 완성도 낮아 보임",
                            "알바 응대 품질 불균일",
                            "뿌덕 디퓨저 첫 리뷰가 악플"
                        ]
                    },
                    {
                        title: "제안된 해결방안",
                        items: [
                            "1. 알바 교육 강화 (친절/공감 강조)",
                            "2. 색칠 과정 추가 (체험 확장)",
                            "3. 리뷰 이벤트 진행",
                            "4. 디테일 추상화 (우리 스타일로)"
                        ]
                    }
                ]
            },
            // ===== 9. 악센트 WOW 이슈 (논의 중) =====
            {
                type: 'financial',
                title: "악센트 WOW 이슈 [논의 중]",
                sections: [
                    {
                        title: "문제 분석",
                        items: [
                            "일반 생카 커피: 6,000원",
                            "악센트 WOW 최저가: 1.5만원",
                            "고객 대부분 10대 (구매력 낮음)",
                            "약 70% 가격 듣고 이탈"
                        ]
                    },
                    {
                        title: "제안된 해결방안",
                        items: [
                            "1. 이탈 고객 데이터 1개월 수집 필요",
                            "2. 3D 피규어 디퓨저 도입 검토",
                            "3. 5,000원 저가 상품 출시 검토",
                            "4. 오수 상품 가치 재확인 필요"
                        ]
                    }
                ]
            },
            // ===== 11. 팀 문화 (결정됨) =====
            {
                type: 'organization',
                title: "팀 문화: 한 몸이 되자 [결정]",
                sections: [
                    {
                        title: "핵심 원칙",
                        items: [
                            "우리 비전이 이미 하나임",
                            "서로에게 말 안 해도 알 수 있는 관계",
                            "새 인원이 와도 위아래 없이 동등하게"
                        ]
                    },
                    {
                        title: "경계해야 할 것",
                        items: [
                            "조직 내 개인의 역할 감소",
                            "기존 일 놓치면서 새 일 하기",
                            "유튜브 때문에 영업 소홀해지면 안 됨"
                        ]
                    }
                ]
            },
            // ===== 12. 장기 비전 (결정됨) =====
            {
                type: 'vision',
                title: "장기 비전: 작품화 [결정]",
                sections: [
                    {
                        title: "4단계 비전",
                        items: [
                            "1단계: 10개 이상 오프라인 체험 프로그램 개발",
                            "2단계: 한 공간에 모아서 전시 콘텐츠화",
                            "3단계: 전 세계를 돌아다니며 AI 콘텐츠 전시",
                            "4단계: '창작 집단'으로 인정받기"
                        ]
                    },
                    {
                        title: "작품화의 의미",
                        items: [
                            "약간의 예술성으로 포장하자 ✅",
                            "콘텐츠 자체로 가치 보유 ✅",
                            "기업들이 '저 프로그램 우리 행사에!' 하게"
                        ]
                    }
                ]
            },
            // ===== 13. 최종 선언 =====
            {
                type: 'vision',
                title: "최종 선언",
                sections: [
                    {
                        title: "2026년, 우리는",
                        items: [
                            "체험형 AI 콘텐츠를 창작하는 집단",
                            "팀랩처럼, 디스트릭트처럼",
                            "전 세계에 우리의 작품을 선보일 것"
                        ]
                    },
                    {
                        title: "Coming Soon",
                        items: [
                            "20년 차 인물 작가 vs 성수동 로봇 작가"
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2025-12-29",
        date: "2025.12.29",
        title: "주간 회의",
        subtitle: "2025년 12월 5주차",
        attendees: ["유재영", "유선화", "김주연", "이동주"],
        meetingType: 'executive',
        isArchived: true,
        agendaItems: [],
        slides: [
            {
                type: 'title',
                title: "주간 회의",
                subtitle: "2025년 12월 5주차"
            },
            {
                type: 'achievements',
                title: "지난주 회의 피드백",
                sections: [
                    {
                        title: "2026 목표 수립 회의 결과",
                        items: [
                            "https://presentation-mu-puce.vercel.app"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "다시 생각해봤으면 하는 점",
                sections: [
                    {
                        title: "1. SPOT의 정체성",
                        items: [
                            "우리의 목표: 최고의 체험형 AI 콘텐츠 기획사",
                            "SPOT이 체험형 AI 콘텐츠를 가리키는 브랜드인가?",
                            "줄이거나 없애거나 확실한 전환이 필요"
                        ]
                    },
                    {
                        title: "2. 우리만의 IP",
                        items: [
                            "AI 콘텐츠 기획사에게 가장 필요한 건 IP",
                            "인바운드 영업으로 진행하는 건 좋지만, 그게 과연 우리 것인가?",
                            "우리만의 IP를 키워나가면서 체험형 콘텐츠 기획사로 성장하는 방법은?",
                            "우리의 세계관, 우리의 IP가 있다면?"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "다시 생각해봤으면 하는 점 (2)",
                sections: [
                    {
                        title: "3. 체험형 AI 콘텐츠의 정의",
                        items: [
                            "체험형 AI 콘텐츠란 무엇인가?",
                            "좋은 AI 체험형 콘텐츠는 어떤 것인가?",
                            "왜 재밌고 좋은 AI 체험형 콘텐츠를 만들어야 하는가?"
                        ]
                    },
                    {
                        title: "4. 우리가 나아갈 방향",
                        items: [
                            "우리가 가진 콘텐츠로 돈을 벌기 위해서는?",
                            "제2의 빠더너스, 긱블이 되는 방법을 고민해야 한다",
                            "우리만의 IP를 확보할 필요가 있다"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "조직 역할 정의",
                sections: [
                    {
                        title: "C-Level",
                        items: [
                            "CEO 유재영: 영업, 영업팀 관리(네안데르 랩), 인사, 스케줄링, 인력배치",
                            "CFO 이동주: 재무/회계, 제품 생산 관리",
                            "CMO 유선화: 브랜딩/마케팅, 생일이벤트, 네안데르 랩 마케팅(유튜브) 총괄",
                            "CTO 김주연: 개발, 신사업 아이디어, 정부지원사업 관리"
                        ]
                    },
                    {
                        title: "사원",
                        items: [
                            "류다혜: 생일 이벤트 담당, 미디어아트 제작",
                            "김주희: 영업팀 - 제안서 작성, 프로젝트 매니저(PM), 매장 관리"
                        ]
                    },
                    {
                        title: "추가 고용 예정",
                        items: [
                            "김정연: 유튜브 컨텐츠 제작",
                            "김제연 (프리랜서): 외주개발, 시제품 제작"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "네안데르의 목표는 무엇인가?",
                sections: [
                    {
                        title: "질문들",
                        items: [
                            "내년 목표는 유튜브 하기인가?",
                            "네안데르 랩의 목표는 무엇인가?",
                            "체험형 AI 콘텐츠 기획사가 목표는 아니잖아?",
                            "체험형 AI 콘텐츠로 어떤 걸 어떻게 할 건지?"
                        ]
                    },
                    {
                        title: "CEO 의견",
                        items: [
                            "네안데르: 체험형 AI 콘텐츠 기획사로서의 정체성 확립",
                            "네안데르 랩: 우리만의 IP를 키우는 콘텐츠 채널",
                            "유튜브는 수단이지 목표가 아님 - IP와 팬덤 확보가 핵심",
                            "B2B(영업)와 B2C(유튜브/IP)의 균형 필요"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "네안데르 랩 2026 목표",
                sections: [
                    {
                        title: "유튜브 수익창출 조건",
                        items: [
                            "구독자 1,000명 이상",
                            "시청시간 4,000시간 이상 (최근 12개월)",
                            "또는 Shorts 조회수 1,000만 (최근 90일)"
                        ]
                    },
                    {
                        title: "2026 목표",
                        items: [
                            "1차 목표: 수익창출 조건 달성",
                            "구독자 목표: 1,000명 → 5,000명",
                            "정기적인 콘텐츠 업로드 체계 구축"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "벤치마킹: 긱블 (1/3)",
                sections: [
                    {
                        title: "회사 개요",
                        items: [
                            "법인명: 주식회사 긱블 (Geekble)",
                            "설립일: 2016년 12월 28일",
                            "창업자: 박찬후 (차누) - 포스텍 컴퓨터공학과",
                            "슬로건: 'Geek + Able = 괴짜는 무엇이든 할 수 있다'",
                            "2018년 포브스 '아시아 30세 이하 리더 30인' 선정"
                        ]
                    },
                    {
                        title: "채널 현황 (2025년 1월)",
                        items: [
                            "긱블 메인: 120만 구독자 / 6.8억 조회수",
                            "긱블랩: 2.6만 구독자",
                            "짧은긱블: 7.4천 구독자",
                            "문과vs이과: 3.7만 구독자"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "벤치마킹: 긱블 (2/3)",
                sections: [
                    {
                        title: "투자 유치 히스토리",
                        items: [
                            "2016.10 Seed: 비공개 (메디아티)",
                            "2017.11 Pre-A: 8억원 (네이버 5억 포함)",
                            "2020.12 Series A: 20억원",
                            "2022.12 Series A: 50억원",
                            "총 누적 투자: 약 78억원"
                        ]
                    },
                    {
                        title: "재무 현황",
                        items: [
                            "2022년 매출: 11억 / 영업손실: -21억",
                            "2023년 영업손실: -20억",
                            "2024년 4Q: 현금흐름 기준 흑자전환 달성",
                            "구조조정 후 콘텐츠 포맷 다각화로 체질 개선"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "벤치마킹: 긱블 (3/3)",
                sections: [
                    {
                        title: "2024년 대규모 구조조정",
                        items: [
                            "구조조정 전: 36명 → 후: 14명 (필수인력만)",
                            "본부 4명 + 미디어사업부 5명 + 에듀사업부 5명",
                            "커머스/비즈니스 사업부 해체"
                        ]
                    },
                    {
                        title: "교훈 및 시사점",
                        items: [
                            "유튜브 수익만으로는 지속 불가 (광고 수익 변동성)",
                            "사업 다각화 시 핵심 역량 집중 필요",
                            "인력 확장 속도 조절 중요",
                            "투자금 소진 후 생존을 위한 구조조정 불가피",
                            "콘텐츠 + 키트판매 + 교육사업 병행 모델"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "뿌디, 이대로 괜찮은가?",
                sections: [
                    {
                        title: "퀄리티 개선 방안",
                        items: [
                            "모양을 우리 스타일로 변환 (주연이 방식)",
                            "디테일한 후보정 작업 추가",
                            "일관된 아트 스타일 적용",
                            "배경/소품 퀄리티 향상"
                        ]
                    },
                    {
                        title: "논의 사항",
                        items: [
                            "현재 퀄리티로 충분한가?",
                            "어떤 스타일이 우리다운가?",
                            "개선에 필요한 리소스는?"
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2025-12-20",
        date: "2025.12.20",
        title: "2026 목표 수립 회의 결과",
        subtitle: "체험형 AI 콘텐츠 기획사로의 전환",
        attendees: ["유재영", "김주연", "유선화", "이동주", "김주희", "김정연", "김제연"],
        meetingType: 'all',
        isArchived: true,
        agendaItems: [
            { id: 1, content: "기업 정체성 확립" },
            { id: 2, content: "VS AI 콘텐츠 전략" },
            { id: 3, content: "콘텐츠 제작 프로세스" },
            { id: 4, content: "유튜브/릴스 전략" },
            { id: 5, content: "사업 영역별 역할" },
            { id: 6, content: "실행 일정 및 예산" }
        ],
        slides: [
            {
                type: 'title',
                title: "2026 목표 수립 회의 결과",
                subtitle: "체험형 AI 콘텐츠 기획사로의 전환"
            },
            {
                type: 'strategy',
                title: "핵심 결론: 기업 정체성 확립",
                sections: [
                    {
                        title: "🎯 네안데르의 새로운 정체성",
                        items: [
                            "\"체험형 AI 콘텐츠 기획사\" - 네안데르의 새로운 정체성",
                            "AI 콘텐츠를 오프라인에서 체험할 수 있게 만드는 회사",
                            "단순 온라인 AI가 아닌, 피지컬 AI (Physical AI) 추구",
                            "팝업스토어 대행사 ❌ → AI 콘텐츠가 주(主), 공간은 표현 수단"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "VS AI 콘텐츠 전략",
                sections: [
                    {
                        title: "📌 첫 번째 콘텐츠: AI 포토부스 vs 사람",
                        items: [
                            "AI 포토부스 vs 인간 사진작가 대결 시리즈",
                            "시리즈 구성: 일반인 → 사진전공 학생 → 전문가 → 최고 사진작가",
                            "평가 시스템: AI 평가 + 전문가 평가 + 대중 평가 (3자 평가)",
                            "도전자 모집: 댓글/커뮤니티를 통한 참여 유도"
                        ]
                    },
                    {
                        title: "💡 확장 가능 콘텐츠 아이디어",
                        items: [
                            "AI vs 기자 (기사 작성 대결)",
                            "AI vs 요리사 (레시피 대결)",
                            "AI vs 변호사/판사 (법률 분석)",
                            "AI vs 영화학과 (영상 제작)"
                        ]
                    }
                ]
            },
            {
                type: 'operations',
                title: "콘텐츠 제작 프로세스",
                sections: [
                    {
                        title: "📋 워크플로우",
                        items: [
                            "1. 콘텐츠 기획 → 2. 스토리보드 작성",
                            "3. 장소/인물 섭외 → 4. AI 콘텐츠 개발",
                            "5. 공간 기획/연출 → 6. 촬영",
                            "7. 편집 (프리미어 + 캔바 자막) → 8. 배포"
                        ]
                    },
                    {
                        title: "👥 역할 분담 (확정)",
                        items: [
                            "총괄: 유선화 (모든 단계 결정권)",
                            "AI 콘텐츠 기획: 김주연 (개발 겸임)",
                            "영상 스토리보드/편집: 김정연",
                            "촬영 스케줄링: 김주희",
                            "예산/재무: 이동주",
                            "촬영 실무: 유재영 (스튜디오 촬영 시)"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "유튜브/릴스 콘텐츠 전략",
                sections: [
                    {
                        title: "🎬 콘텐츠 방향 결정",
                        items: [
                            "롱폼(유튜브) + 숏폼(릴스) 동시 진행",
                            "시리즈화 필수: 1화, 2화... 연속성 있는 콘텐츠",
                            "AI 콘텐츠 개발 과정을 담은 비하인드 영상 제작",
                            "재미 콘텐츠 70% : 수익화 연결 콘텐츠 30%"
                        ]
                    },
                    {
                        title: "📺 레퍼런스 스타일",
                        items: [
                            "긱블 스타일: 유익 + 재미 (기획형)",
                            "문상훈 스타일: 리얼리티 + 편집력",
                            "말왕 스타일: 정제된 기획 + 병맛 요소",
                            "➡️ 우리만의 '깔'을 잡는 것이 핵심"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "사업 영역별 역할 정리",
                sections: [
                    {
                        title: "🔬 네안데르 LAB (AI 콘텐츠)",
                        items: [
                            "AI 콘텐츠 기획/개발: 김주연",
                            "영상 콘텐츠 기획/촬영/편집: 김정연",
                            "마케팅 콘텐츠: 김주희 (서브: 유선화)"
                        ]
                    },
                    {
                        title: "📍 SPOT (콜라보 제품)",
                        items: [
                            "콜라보 영업: 유재영",
                            "상품 기획: 김주희 + 이동주",
                            "온라인 플랫폼 개발: 김주연",
                            "제품 촬영/편집: 유재영",
                            "배포/마케팅: 김주희"
                        ]
                    },
                    {
                        title: "🎂 악센트 ID",
                        items: [
                            "총괄: 유선화",
                            "뿌덕 운영 유지 + 트위터 바이럴 활용"
                        ]
                    }
                ]
            },
            {
                type: 'financial',
                title: "실행 일정 및 예산",
                sections: [
                    {
                        title: "📅 타임라인",
                        items: [
                            "2026년 1월: 지원사업 준비 집중 (네안데르 LAB + SPOT)",
                            "2026년 2월: VS AI 첫 번째 콘텐츠 촬영 시작",
                            "2026년 3월: 첫 번째 프로젝트 배포 (롱폼 + 숏폼)",
                            "악센트 ID 마케팅 콘텐츠: 월 2회 목표"
                        ]
                    },
                    {
                        title: "💰 예산 및 자원",
                        items: [
                            "월별 콘텐츠 예산: 추후 확정 (이동주 재무 담당)",
                            "촬영 장소: 대흥 사무실 활용 (검정 배경 설치 가능)",
                            "신촌 사무실 임대 이후 새로운 촬영 공간 물색 검토",
                            "첫 프로젝트는 완료 후 분할 배포 → 두 번째 프로젝트 병행"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "핵심 키워드 및 다음 단계",
                sections: [
                    {
                        title: "🔑 회의 핵심 키워드",
                        items: [
                            "체험형 AI 콘텐츠 기획사 (Physical AI)",
                            "VS AI 시리즈 (AI vs 인간 대결)",
                            "롱폼 + 숏폼 동시 운영",
                            "바이럴 → 콜라보 → 수익화 선순환 구조"
                        ]
                    },
                    {
                        title: "📝 다음 회의까지 준비사항",
                        items: [
                            "각자 선호하는 유튜브 콘텐츠 스타일 조사",
                            "AI 포토부스 vs 사람 첫 촬영 기획안 작성",
                            "유튜브 채널 컨셉 및 이름 아이디어 (체험형 AI 콘텐츠 ○○○)",
                            "ETC 매출 관련 - 제연이형이랑 이야기해보기"
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2025-12-19",
        date: "2025.12.19",
        title: "2026 목표 수립 회의",
        subtitle: "임원 회의 자료",
        attendees: ["유재영", "이동주", "유선화", "김주연"],
        meetingType: 'executive',
        isArchived: true,
        agendaItems: [
            { id: 1, content: "2025년 회고" },
            { id: 2, content: "BM별 2026 전략" },
            { id: 3, content: "6인 의견 종합" },
            { id: 4, content: "유재영 추천안" },
            { id: 5, content: "2026년 목표" },
            { id: 6, content: "2030 비전" }
        ],
        slides: [
            {
                type: 'title',
                title: "2026 목표 수립 회의",
                subtitle: "임원 회의 자료",
                sections: [
                    {
                        title: "NEANDER",
                        items: [
                            "2025.12.19",
                            "참석자: 유재영, 이동주, 유선화, 김주연"
                        ]
                    }
                ]
            },
            {
                type: 'achievements',
                title: "2025년 회고",
                sections: [
                    {
                        title: "목표 달성 현황",
                        items: [
                            "✅ 악센트 ID 안정화 - 성공",
                            "✅ 플래그십 스토어 런칭 - 성공 (3월 런칭 → 9월 피벗 → 뿌덕 전환 성공)",
                            "❌ 신촌 매장 콜라보 - 실패 (매장 폐점)",
                            "✅ 네안데르 연 수입 6.6억 - 달성 (6.63억, 지원금 포함 / 대출금 미포함)",
                            "🔄 체계화 - 진행 중 (내년에도 계속 진행 예정)"
                        ]
                    }
                ]
            },
            {
                type: 'achievements',
                title: "2025년 월별 회고 (1분기)",
                sections: [
                    {
                        title: "1월",
                        items: [
                            "악센트 아이디 플래그십 스토어 준비",
                            "스니프 콜라보 진행",
                            "발렌타인데이 이벤트 진행",
                            "단박스 & 사쉐 겸용 발주"
                        ]
                    },
                    {
                        title: "2월",
                        items: [
                            "악센트 아이디 공사 진행",
                            "알바 추가 고용",
                            "정부지원사업 지원",
                            "임원진 월급 미지급금 전환"
                        ]
                    },
                    {
                        title: "3월",
                        items: [
                            "지원사업 합격 소식",
                            "아이디 공사 마무리",
                            "플래그십 스토어 런칭"
                        ]
                    }
                ]
            },
            {
                type: 'achievements',
                title: "2025년 월별 회고 (2분기)",
                sections: [
                    {
                        title: "4월",
                        items: [
                            "지원사업 발표 (캠퍼스타운, 청창, 신창사, 관광벤처, 예비창업패키지, 창중대)",
                            "악센트 아이디 운영 (매출 X)"
                        ]
                    },
                    {
                        title: "5월",
                        items: [
                            "악센트 아이디 리뷰 이벤트 진행",
                            "뿌덕 콘텐츠 기획 시작",
                            "⚠️ 임원진 급여 미지급"
                        ]
                    },
                    {
                        title: "6월",
                        items: [
                            "🔥 뿌덕 성공 (터닝포인트)",
                            "🔥 B2B, 개발외주용역 시작 (터닝포인트)",
                            "악센트 신촌 폐점 결정",
                            "⚠️ 임원진 급여 미지급"
                        ]
                    }
                ]
            },
            {
                type: 'achievements',
                title: "2025년 월별 회고 (3분기)",
                sections: [
                    {
                        title: "7월",
                        items: [
                            "매출 복구 시작",
                            "지원금 들어오기 시작",
                            "⚠️ 임원진 급여 미지급"
                        ]
                    },
                    {
                        title: "8월",
                        items: [
                            "아이디 방학 시즌 매출 호조 (월 1,000만원+)",
                            "💰 임원진 급여 150만원 지급 시작",
                            "엡손 원데이클래스, 어나더선데이성수"
                        ]
                    },
                    {
                        title: "9월",
                        items: [
                            "✅ 임원진 급여 원상복구 (300만원)",
                            "임원진 매장 출근 주 1회 이하로 축소",
                            "사무실 대흥 이전 (20평 규모)",
                            "악센트 신촌 폐점",
                            "제천국제음악영화제, 남산골한옥마을, 서울국제작가축제"
                        ]
                    }
                ]
            },
            {
                type: 'achievements',
                title: "2025년 월별 회고 (4분기)",
                sections: [
                    {
                        title: "10월",
                        items: [
                            "임원진 매장 출근 완전 종료",
                            "3D 프린터기 구매",
                            "뿌덕 2 패키지 픽스 및 진행",
                            "와우북페스티벌, 캠타데이"
                        ]
                    },
                    {
                        title: "11월",
                        items: [
                            "뿌덕 2 + SPOT 뉴 브랜드 출시 준비",
                            "휴리즈"
                        ]
                    },
                    {
                        title: "12월",
                        items: [
                            "뿌덕 2 런칭",
                            "브릭스 콜라보 준비 완료",
                            "SPOT 런칭",
                            "흑석 팝업스토어"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "BM별 2026 전략",
                sections: [
                    {
                        title: "AC'SCENT (유지)",
                        items: [
                            "ID (일반, 뿌덕, 뿌디) / WOW (생일이벤트)",
                            "* 뿌디(뿌덕 디퓨저)는 SPOT 콜라보로 집중"
                        ]
                    },
                    {
                        title: "SPOT (FOCUS)",
                        items: [
                            "핫플 콜라보 / AC'SCENT 콜라보",
                            "시그니처 상품 출시 및 온라인 플랫폼 구축"
                        ]
                    },
                    {
                        title: "NEANDER LAB (FOCUS)",
                        items: [
                            "AI 콘텐츠 기획사 / B2B",
                            "마케팅 및 영업 전략 수립 및 실행 (릴스 촬영)"
                        ]
                    },
                    {
                        title: "ETC (축소)",
                        items: [
                            "외주개발, 향수납품, 사쉐납품, 시제품제작",
                            "리소스 효율화를 위해 점진적 축소"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "이동주",
                sections: [
                    {
                        title: "2026 개인 목표",
                        items: [
                            "대학원 준비 - 2026학년도 후기 전공 서칭 및 자격 취득 (토익 등)",
                            "글쓰기 - 단편소설 1편 완성 후 출판사 투고"
                        ]
                    },
                    {
                        title: "2026 회사 목표",
                        items: [
                            "흑자전환 달성",
                            "매출: B2C(매장) 3,800만 + B2B 2,000만 = 월 5,800만",
                            "순영업수입: 7억 (전년 대비 +35%)",
                            "순영업이익: +1억 (전년 -1.2억 → 흑자전환)"
                        ]
                    },
                    {
                        title: "2030 개인 목표",
                        items: [
                            "대학원 졸업 (진학 시)",
                            "단편소설 공모전 수상 또는 등단",
                            "첫 단행본 출간 (소설집 또는 에세이)"
                        ]
                    },
                    {
                        title: "2030 회사 목표",
                        items: [
                            "순영업수입: 100억",
                            "순영업이익: 10~15억 (이익률 10~15%)",
                            "무차입 경영 달성",
                            "B2B 매출 비중 50% 이상",
                            "핵심 인력 10인 체제, 자율 운영 시스템 구축"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "김주연",
                linkUrl: "https://2025meeting.vercel.app/december/week3",
                sections: [
                    {
                        title: "2026 개인 목표",
                        items: [
                            "꾸준한 운동 습관 유지",
                            "베트남 여행"
                        ]
                    },
                    {
                        title: "2026 회사 목표",
                        items: [
                            "\"우리 것\"에 집중",
                            "유튜브 필수 시작 (반응 없어도 유지)",
                            "네안데르 Lab 운영",
                            "VS AI 콘텐츠 제작",
                            "K-POP AI 콘텐츠 개발",
                            "유튜버 맞춤형 AI 프로그램 제공"
                        ]
                    },
                    {
                        title: "2030 목표",
                        items: [
                            "작성 예정"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "유선화",
                linkUrl: "https://meeting-records-eubyiysua-okkhoxos-projects.vercel.app/유선화_2026_목표.pdf",
                sections: [
                    {
                        title: "2026 개인 목표",
                        items: [
                            "무슨 운동이든 운동 주 1회 이상 하기 (1회당 1시간)",
                            "영양제 거르지 않고 챙겨먹기 (월 20회 이상)",
                            "새로운 취미 찾기 (자기계발)"
                        ]
                    },
                    {
                        title: "2026 회사 목표",
                        items: [
                            "비전과 수익의 균형점 찾기",
                            "회사의 방향성(비전)을 명확하게 잡기",
                            "우리가 무엇을 하는 회사인지 명확해지기"
                        ]
                    },
                    {
                        title: "2026 마케팅 KPI",
                        items: [
                            "악센트 아이디: 인스타그램 팔로워 1만, 뿌덕 ROAS 300%, 월 2000만원 달성",
                            "SPOT: 12건 콜라보 제품 출시, 매출 발생",
                            "생일이벤트: 월 평균 1500만원, 다혜에게 안정적 인수인계"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "유재영",
                linkUrl: "https://2026-review.vercel.app",
                sections: [
                    {
                        title: "2026 개인 목표",
                        items: [
                            "사람 챙기기: 물질적으로 정신적으로 모두 다 챙기기",
                            "네트워크 확장: 다양한 사람 만나기, 경험과 인간관계 중심",
                            "골프 영업: 주 3회 이상 연습, 필드 경험 축적"
                        ]
                    },
                    {
                        title: "2026 회사 목표",
                        items: [
                            "기업 정체성 확립: 한 문장으로 회사를 소개할 수 있도록 정립",
                            "매출 목표 10억 달성 (네안데르 LAB 3억 + SPOT 3억 + AC'SCENT 3억 + 기타 1억)"
                        ]
                    },
                    {
                        title: "2030 목표",
                        items: [
                            "우리 6명 중 단 한명도 빠지지 않고 계속 커지는 회사를 영차영차 운영하는 것"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "류다혜",
                sections: [
                    {
                        title: "2026 개인 목표",
                        items: [
                            "네임드 국가지원공모 1개 이상 붙기",
                            "VJ, 오디오비주얼 부문에서 꾸준히 작업 업로드하기"
                        ]
                    },
                    {
                        title: "2026 회사에서의 개인 목표",
                        items: [
                            "주3일 출근 유지하면서 생카 전담업무 가능하게 하기"
                        ]
                    },
                    {
                        title: "2030 개인 목표",
                        items: [
                            "2030년 전까지 개인전 열기"
                        ]
                    },
                    {
                        title: "2030 회사 목표",
                        items: [
                            "회사 인원이 많아져도 수평적 분위기 유지"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "김주희",
                sections: [
                    {
                        title: "2026 개인 목표",
                        items: [
                            "어학능력 올리기",
                            "역량강화: 일본어, 영화, 정신건강",
                            "레포트 작성: 이창동 영화, 예술경영 AI/OTT, 문화연구 시/에포케, 포스트모더니즘/예술"
                        ]
                    },
                    {
                        title: "2026 회사 목표",
                        items: [
                            "매출 1억 2천 찍기",
                            "자료 별도 첨부"
                        ]
                    },
                    {
                        title: "2030 개인 목표",
                        items: [
                            "어느정도 고정된 출퇴근 시간, 일정 등 / 더울 때 시원하게, 추울 때 따뜻하게 일하기",
                            "나의 필드를 해외로 확장하기 / 성장 내가 하고 싶은 일을 잘하고 있는가 고민하기"
                        ]
                    },
                    {
                        title: "꿈꾸는 직장",
                        items: [
                            "하나의 방향, 각자의 역할: 명확한 포지션 위에서 장기적 목표를 함께 향해가는 팀",
                            "검색되는 존재감: 인터넷에 우리 이름을 검색하면 제대로 된 정보가 나오는 회사",
                            "글로벌 경험: 연 1회 이상의 해외 출장 / 세계 시장과 트렌드를 직접 경험",
                            "누구나 아는 이름: 말하면 알아보는 브랜드로 성장"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "2026년 목표에 대해서 이야기 해보고 정해봅시다!",
                sections: [
                    {
                        title: "",
                        items: [
                            ""
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2025-12-13",
        date: "2025.12.13",
        title: "주간 회의록 및 영업팀 성과 보고",
        subtitle: "브릭스/뿌덕 운영 현황 및 2026 목표 설정",
        attendees: ["유재영", "이동주", "유선화", "김주연"],
        meetingType: 'executive',
        isArchived: true,
        agendaItems: [
            { id: 1, content: "지난주 완료 업무" },
            { id: 2, content: "조직 구성 및 R&R" },
            { id: 3, content: "운영 프로세스" },
            { id: 4, content: "재무 분석 및 인력" },
            { id: 5, content: "미래 전략" },
            { id: 6, content: "2026 목표" }
        ],
        slides: [
            {
                type: 'title',
                title: "주간 회의록 및 영업팀 성과 보고",
                subtitle: "브릭스/뿌덕 운영 현황 및 2026 목표 설정",
                sections: [
                    {
                        title: "2025년 12월 2주차",
                        items: [
                            "업무 성과",
                            "조직 개편",
                            "BEP 분석",
                            "미래 전략"
                        ]
                    }
                ]
            },
            {
                type: 'achievements',
                title: "지난주 주요 완료 업무 및 성과",
                sections: [
                    {
                        title: "브릭스/뿌덕 완료 사항",
                        items: [
                            "브릭스(Bricks): 문서화 및 시각화 정리 완료",
                            "뿌덕(Ppudeok): 업로드 시 공동작업자 등록 설정 완료",
                            "마케팅: 선화 마케팅 용어 '질석' → '사쉐스톤'으로 변경 완료"
                        ]
                    },
                    {
                        title: "영업팀 성과",
                        items: [
                            "흑석 팝업스토어 완벽 진행 완료 (약 550만원 입금 예정)",
                            "LG 생활건강 자회사 팀장 미팅 진행 완료",
                            "숨고/크몽 B2B 관련 서비스 업로드 완료"
                        ]
                    }
                ]
            },
            {
                type: 'organization',
                title: "업무 분담",
                sections: [
                    {
                        title: "뿌덕 2 담당자 현황",
                        items: [
                            "총괄: 유선화",
                            "이미지 생성: 김주연",
                            "3D 프린팅 및 팟 재고 관리: 유재영",
                            "포장 및 운송: 이동주"
                        ]
                    },
                    {
                        title: "급여 및 인력 이슈 (회계 담당자 컨펌 필요)",
                        items: [
                            "김주희 (매장관리, B2B 영상/영업, 6일 출근): 230~240만원 예상",
                            "류다혜 (생카 이월): 250만원 예상",
                            "임원진: 300만원 예상"
                        ]
                    }
                ]
            },
            {
                type: 'operations',
                title: "운영 프로세스 및 특이사항",
                sections: [
                    {
                        title: "뿌덕 매커니즘",
                        items: [
                            "김주연 스마트플레이스 수정 예정: 상품별 환불규정 차별화",
                            "예약 취소는 5일 전까지만 가능",
                            "일요일 '뿌덕 2' 시작 동시 메커니즘 연습 필수"
                        ]
                    },
                    {
                        title: "영업/마케팅 이슈",
                        items: [
                            "캠타데이 미지급 건 주시 중 (특이사항)",
                            "추가 B2B 소식 부재",
                            "리뷰 이벤트 진행 중 (다이소/키링 구매 및 3D 제작 시도)"
                        ]
                    }
                ]
            },
            {
                type: 'financial',
                title: "재무 분석 및 인력 효율화",
                sections: [
                    {
                        title: "손익분기점(BEP) 분석 요청",
                        items: [
                            "뿌덕 관리자 1인 추가 (급여 220만원 기준) 시",
                            "이득을 보기 위한 월 목표 매출액 및 판매 개수(원가 기준) 산출 필요"
                        ]
                    },
                    {
                        title: "인력 효율화 방안",
                        items: [
                            "유재영 학부 후배 실습계 연계 추진",
                            "디자인 및 3D 업무 가능 인력 활용",
                            "무료 인건비 창출 방법 모색 중"
                        ]
                    }
                ]
            },
            {
                type: 'strategy',
                title: "미래 전략 및 마케팅 확장",
                sections: [
                    {
                        title: "AI 콘텐츠 전략",
                        items: [
                            "AI 포토부스 외 홍보용 신규 콘텐츠 아이디어 발굴 필요"
                        ]
                    },
                    {
                        title: "협업 전략",
                        items: [
                            "브릭스 커피 콜라보레이션 마케팅 형태 구체적 구축"
                        ]
                    },
                    {
                        title: "내년도 회의 체계 개편",
                        items: [
                            "주간 회의: 전체 인원 참석 진행",
                            "임원진 회의: 1시간 제한 (대외비 안건만)",
                            "팀별 회의: 영업팀, 마케팅팀, 생일이벤트팀 주 1회 별도 진행"
                        ]
                    }
                ]
            },
            {
                type: 'vision',
                title: "연말 계획 및 2026 목표",
                sections: [
                    {
                        title: "연말 행사",
                        items: [
                            "연말 회식 및 탁구대회 진행 확정"
                        ]
                    },
                    {
                        title: "목표 설정 (다음 주까지 필수)",
                        items: [
                            "올해 매출 성과 분석 및 공유",
                            "내년도 목표 매출액 및 팀별 목표 구체적 설정",
                            "팀원들에게 명확한 비전 제시"
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2025-12-07",
        date: "2025.12.07",
        title: "2026년 네안데르 운영 전략 회의",
        attendees: ["유재영", "이동주", "유선화", "김주연"],
        meetingType: 'executive',
        isArchived: true,
        agendaItems: [
            {
                id: 1,
                content: "2026년 네안데르 목표 설정 및 운영 방식 재정립",
                details: "올해 한 해를 돌아보며 내년도 사업 방향성과 팀 운영 체계를 새롭게 정비할 필요가 있음. 각 팀원별 역할 재정의 및 사업 확장에 따른 조직 구조 개편 논의 필요."
            },
            {
                id: 2,
                content: "매장 매니저 추가 고용 검토 - 김정연 후보",
                details: "김정연을 매장 매니저로 고용하는 방안을 검토했으나, 본인이 영화 현장에서 일하고 싶다는 강한 열망을 가지고 있음. 영화 산업에 대한 꿈이 확실하기 때문에 장기적으로 함께하기 어려울 수 있다는 우려 존재. 다른 대안 모색 필요."
            },
            {
                id: 3,
                content: "대안: 기존 인력(김주희, 류다혜) 역할 확대 + 급여 인상",
                details: "새로운 매니저를 200만원에 고용하는 대신, 이 비용을 김주희와 류다혜의 월급 인상에 활용하면서 매장 관리 책임을 부여하는 방안. 외부 인력보다 이미 네안데르 문화와 업무를 이해하고 있는 기존 멤버에게 권한과 책임을 주는 것이 더 효율적일 수 있음."
            },
            {
                id: 4,
                content: "창업 멤버 4인(재영, 동주, 선화, 주연) 급여 인상",
                details: "2025년 한 해 동안의 성과와 2026년 확대되는 사업 규모를 고려하여, 창업 멤버 4인의 급여도 함께 인상. 팀의 사기 진작과 장기적인 동기부여를 위해 필수적인 조치."
            },
            {
                id: 5,
                content: "2026년도 정부 지원사업 전략 수립",
                details: "창업중심대학, 관광벤처 초기, 청년창업사관학교, 초기창업패키지 등 다양한 지원사업에 어떤 아이템으로 지원할지 전략적 판단 필요. 담당자 김주연이 각 지원사업별 특성을 분석하고 네안데르의 강점을 살릴 수 있는 아이템 매칭 전략 수립 예정. 가장 중요한 것은 '미리 준비하기'! 대부분의 지원사업이 1~2월에 공고가 나므로 12월부터 사업계획서 초안 작성 시작, 1월부터 본격 작업 돌입해야 함."
            }
        ],
        specialNotes: [
            {
                title: "김주희 2026년 역할 및 계획",
                content: [
                    "네안데르 매장 운영 총괄 관리자로 역할 확대",
                    "내년 자취 시작 예정 - 독립적인 생활 기반 마련",
                    "뿌덕 사업 운영 및 재고 관리 책임",
                    "사업 규모 확장 시 류다혜와 협업하여 3D 모델링 및 출력 업무 공동 진행",
                    "급여 인상과 함께 책임 범위 확대"
                ]
            },
            {
                title: "류다혜 역할 재정의 필요",
                content: [
                    "현재 담당 업무 외 추가로 맡길 수 있는 업무가 있는지 검토 필요",
                    "3D 모델링 역량을 활용한 뿌덕 사업 확장 시 핵심 인력으로 참여 예정",
                    "김주희와의 협업 체계 구축 방안 논의",
                    "내년 급여 인상폭 및 역할 범위 확정 필요"
                ]
            },
            {
                title: "스케줄 조정 요청",
                content: [
                    "김주희, 김정연이 여행을 가고 싶다며 스케줄 조정 가능 여부 문의",
                    "재영이 승인 - 여행 일정 조정 가능하도록 허락함",
                    "팀원들의 워라밸과 재충전 시간 보장을 위해 유연한 스케줄 운영 지향"
                ]
            }
        ],
    },
    {
        id: "2025-11-21",
        date: "2025.11.21",
        title: "주간 회의 - SPOT 런칭 및 뿌덕 2 집중",
        attendees: ["유재영", "이동주", "유선화", "김주연"],
        meetingType: 'executive',
        isArchived: true,
        agendaItems: [
            { id: 1, content: "Ai 포토부스 → 출력 걸기 실버 필라멘트" },
            { id: 2, content: "시그니처 판매가 당장 안된다! 뿌덕 2에 집중해서 판매를 하자!", details: "담당: 재영, 주연" },
            { id: 3, content: "소프트 시그니처도 제대로 해야한다! 키비주얼, 브랜드 비전 설정하는게 중요할 것 같다.", details: "담당: 선화" },
            { id: 4, content: "다양한 라인업을 만들고 그 중 하나를 디벨롭 하자?" },
            { id: 5, content: "코그세 개최식 무산" },
            { id: 6, content: "크리스마스 광고 기획중 2025년을 최애와 같이 진행하는 방법." },
            { id: 7, content: "갓모양 화분도 이쁘겠다." },
            { id: 8, content: "스팟 → 사람, 화분" },
            { id: 9, content: "스케줄 11월 안에 spot 인스타그램 세팅 및 업로드" },
            { id: 10, content: "12월 13일~15일 뿌덕 2 런칭" }
        ],
        specialNotes: [
            {
                title: "이번주 특이사항",
                content: [
                    "이번주가 지원사업 마지막 주입니다.",
                    "주연: 주연 관광 지원사업 서류 처리하기",
                    "재영: 선화, 재영 지원사업 서류 처리하기, 지원금 남은 돈 탈탈 털기!"
                ]
            }
        ],
        achievements: [
            {
                title: "휴리즈 팝업스토어 성공",
                content: [
                    "남은 돈 1000만원 달성",
                    "고생한 이동주, 김주희 박수!",
                    "2-3주동안 준비했고 잘 마무리 했습니다.",
                    "성과: 내년 5월 팝업스토어 성수 10일동안 진행하는 행사 사실상 확정",
                    "다양한 영업처들 생겼습니다."
                ]
            }
        ],
        businessUpdates: [
            { title: "갤럭시코퍼레이션 미팅", content: "내년 팝업스토어에 인터렉션 미디어아트 진행 가능 여부 타진 (사운드 비주얼라이징 + AI 변환). 레퍼런스 공유 완료했으나 확정 아님." },
            { title: "무비랜드", content: "까였다가 다시 관심 보임. 샘플 보내고 AI 프로그램 제작 예정." },
            { title: "유니버셜 코리아 랩", content: "제안서 완성 중. AI 콘텐츠 제작 예정." },
            { title: "니즈스페이스", content: "국내 최대 대행사 과장님과의 친분으로 다양한 행사의 대대행 기회 확보." }
        ]
    }
];
