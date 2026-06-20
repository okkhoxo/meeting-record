'use client';

import { useState, useEffect, useRef } from 'react';
import { PriorityItem } from '@/data/meetings';
import styles from './page.module.css';
import {
    Plus, Pencil, Trash2, Save, Check, X,
    ChevronUp, ChevronDown, PauseCircle, PlayCircle,
    ArrowDownWideNarrow, RotateCcw, GripVertical
} from 'lucide-react';

// localStorage 키 — 저장(commit)된 스냅샷 / 작업(draft) 중 상태
export const MPB_SAVED_PREFIX = 'mpb-saved:';
export const MPB_DRAFT_PREFIX = 'mpb-draft:';

export const PRIORITY_META: Record<PriorityItem['priority'], { label: string; color: string }> = {
    critical: { label: '최우선', color: '#EF4444' },
    high: { label: '높음', color: '#F59E0B' },
    medium: { label: '보통', color: '#3B82F6' },
    low: { label: '낮음', color: '#6B7280' },
};
const PRIORITY_RANK: Record<PriorityItem['priority'], number> = { critical: 0, high: 1, medium: 2, low: 3 };
const VALID_PRIORITY = new Set<string>(['critical', 'high', 'medium', 'low']);

// 우선순위 메타 안전 조회 (손상 데이터로 인한 흰 화면 방지)
export function priorityMeta(p: unknown): { label: string; color: string } {
    return PRIORITY_META[(typeof p === 'string' && VALID_PRIORITY.has(p) ? p : 'medium') as PriorityItem['priority']];
}

function newId() {
    return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
}

// 마감일 문자열 → <input type="date"> 값(YYYY-MM-DD). 날짜형이 아니면 빈값(달력 비움)
export function deadlineToDateInput(s?: string): string {
    if (!s) return '';
    const m = s.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
    if (!m) return '';
    return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
}

// <input type="date"> 값(YYYY-MM-DD) → 마감일 문자열(YYYY.MM.DD)
export function dateInputToDeadline(v: string): string {
    if (!v) return '';
    const [y, mo, d] = v.split('-');
    if (!y || !mo || !d) return '';
    return `${y}.${mo}.${d}`;
}

// 손상/구버전 localStorage 데이터 방어 — 모양이 깨진 항목을 정규화하거나 폐기
export function sanitizeItems(arr: unknown): PriorityItem[] {
    if (!Array.isArray(arr)) return [];
    return arr
        .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
        .map((x) => ({
            id: typeof x.id === 'string' && x.id ? x.id : newId(),
            title: typeof x.title === 'string' ? x.title : '',
            desc: typeof x.desc === 'string' ? x.desc : '',
            channel: typeof x.channel === 'string' ? x.channel : '',
            assignee: typeof x.assignee === 'string' ? x.assignee : '',
            deadline: typeof x.deadline === 'string' ? x.deadline : '',
            priority: (typeof x.priority === 'string' && VALID_PRIORITY.has(x.priority) ? x.priority : 'medium') as PriorityItem['priority'],
            status: x.status === 'hold' ? 'hold' : 'active' as PriorityItem['status'],
        }));
}

// SlideDeck이 마운트 시 저장된 보드를 복원할 때 사용
export function loadSavedBoardItems(boardId: string): PriorityItem[] | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(MPB_SAVED_PREFIX + boardId);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items)) return sanitizeItems(parsed.items);
        return null;
    } catch {
        return null;
    }
}

// SlideDeck이 요약 페이지의 stale(보드에 미저장 수정 있음) 여부를 판단할 때 사용
export function loadBoardDirty(boardId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const raw = window.localStorage.getItem(MPB_DRAFT_PREFIX + boardId);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return Boolean(parsed && parsed.dirty);
    } catch {
        return false;
    }
}

interface Props {
    boardId: string;
    accent: string;
    title: string;
    subtitle?: string;
    index: number; // 슬라이드 번호
    initialItems: PriorityItem[];
    onSaved: (boardId: string, items: PriorityItem[]) => void;
    onReset?: (boardId: string) => void;
    onDirtyChange?: (boardId: string, dirty: boolean) => void;
}

export default function MarketingPriorityBoard({ boardId, accent, title, subtitle, index, initialItems, onSaved, onReset, onDirtyChange }: Props) {
    const [items, setItems] = useState<PriorityItem[]>(initialItems);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<PriorityItem | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // 실제 사용자 변경이 있었을 때만 draft를 기록 (단순 조회만으로 시드가 박제되는 것 방지)
    const touchedRef = useRef(false);

    const draftKey = MPB_DRAFT_PREFIX + boardId;
    const savedKey = MPB_SAVED_PREFIX + boardId;

    // 마운트 시: 작업중 draft가 있으면 복원, 없으면 시드
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(draftKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.items)) {
                    setItems(sanitizeItems(parsed.items));
                    setDirty(Boolean(parsed.dirty));
                }
            }
        } catch {
            /* ignore */
        }
        setHydrated(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardId]);

    // 실제 변경이 있을 때만 draft 자동 저장 (페이지 이동/새로고침에도 유지)
    useEffect(() => {
        if (!hydrated || !touchedRef.current) return;
        try {
            window.localStorage.setItem(draftKey, JSON.stringify({ items, dirty }));
        } catch {
            /* ignore */
        }
    }, [items, dirty, hydrated, draftKey]);

    // dirty 상태를 부모(SlideDeck)에 통지 → 요약 페이지의 'stale' 경고
    useEffect(() => {
        if (!hydrated) return;
        onDirtyChange?.(boardId, dirty);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dirty, hydrated, boardId]);

    useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

    function flash(msg: string) {
        setToast(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3200);
    }

    function markDirty() { touchedRef.current = true; setDirty(true); }

    // ── 우선순위 이동 (같은 상태 그룹 내) ──
    function move(id: string, dir: -1 | 1) {
        setItems(prev => {
            const idx = prev.findIndex(i => i.id === id);
            if (idx < 0) return prev;
            const status = prev[idx].status;
            let j = idx + dir;
            while (j >= 0 && j < prev.length && prev[j].status !== status) j += dir;
            if (j < 0 || j >= prev.length) return prev;
            const next = [...prev];
            [next[idx], next[j]] = [next[j], next[idx]];
            return next;
        });
        markDirty();
    }

    // ── 드래그앤드롭 — 진행중 항목 순서 변경 (유튜브 뮤직 방식) ──
    function dropOn(targetId: string) {
        const sourceId = draggingId;
        setDraggingId(null);
        setDragOverId(null);
        if (!sourceId || sourceId === targetId) return;
        setItems(prev => {
            const active = prev.filter(i => i.status === 'active');
            const hold = prev.filter(i => i.status === 'hold');
            const from = active.findIndex(i => i.id === sourceId);
            const to = active.findIndex(i => i.id === targetId);
            if (from < 0 || to < 0) return prev;
            const next = [...active];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return [...next, ...hold];
        });
        markDirty();
    }

    // ── 우선순위순 자동 정렬 (진행중 항목만, 보류는 뒤로) ──
    function sortByPriority() {
        setItems(prev => {
            const active = prev.filter(i => i.status === 'active')
                .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
            const hold = prev.filter(i => i.status === 'hold');
            return [...active, ...hold];
        });
        markDirty();
        flash('우선순위순으로 정렬했어요');
    }

    // ── 보류 / 재개 ──
    function toggleHold(id: string) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'hold' ? 'active' : 'hold' } : i));
        markDirty();
    }

    // ── 삭제 ──
    function remove(id: string) {
        if (!window.confirm('이 실행안을 삭제할까요?')) return;
        setItems(prev => prev.filter(i => i.id !== id));
        if (editingId === id) { setEditingId(null); setDraft(null); }
        markDirty();
    }

    // 편집 중이던 '빈 신규 항목'(이름 미입력) 정리 — 단, keepId는 보존
    function dropDanglingEmpty(list: PriorityItem[], keepId?: string) {
        return list.filter(i => i.id === keepId || !(i.id === editingId && !i.title.trim()));
    }

    // ── 추가 ──
    function addItem() {
        const item: PriorityItem = { id: newId(), title: '', desc: '', channel: '', assignee: '', deadline: '', priority: 'medium', status: 'active' };
        // 직전 편집 중이던 빈 신규 항목은 정리하고, 진행중 목록 맨 위에 삽입 (바로 편집 시작)
        setItems(prev => [item, ...dropDanglingEmpty(prev)]);
        setEditingId(item.id);
        setDraft(item);
    }

    // ── 수정 시작 / 저장 / 취소 ──
    function startEdit(item: PriorityItem) {
        // 다른 항목 편집으로 전환 시, 직전 빈 신규 항목 정리
        setItems(prev => dropDanglingEmpty(prev, item.id));
        setEditingId(item.id);
        setDraft({ ...item });
    }
    function cancelEdit() {
        // 빈 신규 항목이면 취소 시 제거
        setItems(prev => prev.filter(i => !(i.id === editingId && !i.title.trim())));
        setEditingId(null);
        setDraft(null);
    }
    // 마감일 설정 (달력/직접입력/칩 공용)
    function setDeadline(v: string) {
        setDraft(d => d ? { ...d, deadline: v } : d);
    }
    function commitEdit() {
        if (!draft) return;
        if (!draft.title.trim()) { flash('실행안 이름을 입력해주세요'); return; }
        setItems(prev => prev.map(i => i.id === draft.id ? draft : i));
        setEditingId(null);
        setDraft(null);
        markDirty();
    }

    // ── 저장 (commit → 요약 페이지 생성) ──
    function save() {
        // 1) 편집 중인 내용이 있으면 먼저 반영 (확인 안 눌러도 유실 방지)
        let next = items;
        if (editingId && draft && draft.title.trim()) {
            next = next.map(i => i.id === editingId ? draft : i);
        }
        // 2) 이름 없는 항목(미완성 신규)은 저장에서 제외
        next = next.filter(i => i.title.trim());

        setItems(next);
        setEditingId(null);
        setDraft(null);
        touchedRef.current = true;
        try {
            window.localStorage.setItem(savedKey, JSON.stringify({ items: next, savedAt: Date.now() }));
            window.localStorage.setItem(draftKey, JSON.stringify({ items: next, dirty: false }));
        } catch {
            /* ignore */
        }
        setDirty(false);
        onSaved(boardId, next);
        flash("저장됨 ✓  마지막에 '한눈에 보기' 요약 페이지가 추가됐어요");
    }

    // ── 시드로 초기화 ──
    function resetToSeed() {
        if (!window.confirm('처음 회의 시드 상태로 되돌릴까요? (저장한 요약 페이지도 함께 제거됩니다)')) return;
        setItems(initialItems);
        setEditingId(null);
        setDraft(null);
        setDirty(false);
        touchedRef.current = false; // 시드와 동일하므로 자동저장 불필요
        try {
            window.localStorage.removeItem(draftKey);
            window.localStorage.removeItem(savedKey); // 저장본도 제거 → 요약 페이지 제거
        } catch { /* ignore */ }
        onReset?.(boardId);   // SlideDeck의 요약 페이지 제거
        flash('시드 상태로 되돌렸어요 — 요약 페이지도 제거됨');
    }

    const activeItems = items.filter(i => i.status === 'active');
    const holdItems = items.filter(i => i.status === 'hold');

    const renderEditForm = () => (
        <div className={styles.mpbEditForm} style={{ borderColor: `${accent}66` }}>
            <input
                className={styles.mpbInput}
                placeholder="실행안 이름 *"
                value={draft?.title ?? ''}
                autoFocus
                onChange={e => setDraft(d => d ? { ...d, title: e.target.value } : d)}
            />
            <input
                className={styles.mpbInput}
                placeholder="한 줄 설명"
                value={draft?.desc ?? ''}
                onChange={e => setDraft(d => d ? { ...d, desc: e.target.value } : d)}
            />
            <div className={styles.mpbEditRow}>
                <input
                    className={styles.mpbInputSm}
                    placeholder="구분 (예: 유입)"
                    value={draft?.channel ?? ''}
                    onChange={e => setDraft(d => d ? { ...d, channel: e.target.value } : d)}
                />
                <input
                    className={styles.mpbInputSm}
                    placeholder="담당"
                    value={draft?.assignee ?? ''}
                    onChange={e => setDraft(d => d ? { ...d, assignee: e.target.value } : d)}
                />
                <select
                    className={styles.mpbSelect}
                    value={draft?.priority ?? 'medium'}
                    onChange={e => setDraft(d => d ? { ...d, priority: e.target.value as PriorityItem['priority'] } : d)}
                >
                    {(Object.keys(PRIORITY_META) as PriorityItem['priority'][]).map(p => (
                        <option key={p} value={p}>{PRIORITY_META[p].label}</option>
                    ))}
                </select>
            </div>

            {/* 📅 마감일 설정 — 달력 날짜 선택 + 직접 입력 + 빠른 선택 */}
            <div className={styles.mpbDeadlineBox}>
                <span className={styles.mpbDeadlineLabel}>📅 마감일</span>
                <input
                    type="date"
                    className={styles.mpbDateInput}
                    value={deadlineToDateInput(draft?.deadline)}
                    onChange={e => setDeadline(dateInputToDeadline(e.target.value))}
                    title="달력에서 마감 날짜 선택"
                />
                <input
                    className={styles.mpbInputSm}
                    placeholder="또는 직접 입력 (상시·이번 주 등)"
                    value={draft?.deadline ?? ''}
                    onChange={e => setDeadline(e.target.value)}
                />
                <div className={styles.mpbChips}>
                    {['즉시', '이번 주', '이번 달', '상시'].map(c => (
                        <button key={c} type="button" className={styles.mpbChip} onClick={() => setDeadline(c)}>{c}</button>
                    ))}
                    <button type="button" className={styles.mpbChip} onClick={() => setDeadline('')}>지우기</button>
                </div>
            </div>

            <div className={styles.mpbEditActions}>
                <button className={styles.mpbBtnConfirm} style={{ background: accent }} onClick={commitEdit}>
                    <Check size={15} /> 확인
                </button>
                <button className={styles.mpbBtnGhost} onClick={cancelEdit}>
                    <X size={15} /> 취소
                </button>
            </div>
        </div>
    );

    const renderCard = (it: PriorityItem, ordinal: number | null, posInGroup: number, groupLen: number) => {
        if (editingId === it.id) {
            return <div key={it.id} className={styles.mpbCard}>{renderEditForm()}</div>;
        }
        const pm = priorityMeta(it.priority);
        const isHold = it.status === 'hold';
        const draggable = !isHold;
        const cardClass = `${styles.mpbCard} ${isHold ? styles.mpbCardHold : ''} ${draggable ? styles.mpbCardDraggable : ''} ${draggingId === it.id ? styles.mpbCardDragging : ''} ${dragOverId === it.id && draggingId !== it.id ? styles.mpbCardDragOver : ''}`;
        return (
            <div
                key={it.id}
                className={cardClass}
                style={{ borderLeftColor: isHold ? '#555' : pm.color }}
                draggable={draggable}
                onDragStart={draggable ? (e) => { setDraggingId(it.id); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', it.id); } catch { /* ignore */ } } : undefined}
                onDragEnd={draggable ? () => { setDraggingId(null); setDragOverId(null); } : undefined}
                onDragOver={draggable ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (dragOverId !== it.id) setDragOverId(it.id); } : undefined}
                onDragLeave={draggable ? () => { if (dragOverId === it.id) setDragOverId(null); } : undefined}
                onDrop={draggable ? (e) => { e.preventDefault(); dropOn(it.id); } : undefined}
            >
                <div className={styles.mpbCardLeft}>
                    {!isHold && (
                        <span className={styles.mpbDragHandle} title="드래그해서 순서 변경">
                            <GripVertical size={16} />
                        </span>
                    )}
                    {ordinal !== null ? (
                        <span className={styles.mpbOrdinal} style={{ background: `${accent}22`, color: accent }}>{ordinal}</span>
                    ) : (
                        <span className={styles.mpbOrdinalHold}><GripVertical size={16} /></span>
                    )}
                    {!isHold && (
                        <div className={styles.mpbReorder}>
                            <button className={styles.mpbReorderBtn} disabled={posInGroup === 0} onClick={() => move(it.id, -1)} aria-label="위로"><ChevronUp size={15} /></button>
                            <button className={styles.mpbReorderBtn} disabled={posInGroup === groupLen - 1} onClick={() => move(it.id, 1)} aria-label="아래로"><ChevronDown size={15} /></button>
                        </div>
                    )}
                </div>

                <div className={styles.mpbCardBody}>
                    <div className={styles.mpbCardTitleRow}>
                        <span className={styles.mpbCardTitle}>{it.title || '(이름 없음)'}</span>
                        <span className={styles.mpbBadge} style={{ background: `${pm.color}22`, color: pm.color, borderColor: `${pm.color}66` }}>{pm.label}</span>
                        {it.channel && <span className={styles.mpbTag}>{it.channel}</span>}
                    </div>
                    {it.desc && <div className={styles.mpbCardDesc}>{it.desc}</div>}
                    <div className={styles.mpbMetaRow}>
                        {it.assignee && <span className={styles.mpbMeta}>👤 {it.assignee}</span>}
                        {it.deadline && <span className={styles.mpbMeta} style={{ color: accent }}>⏰ {it.deadline}</span>}
                    </div>
                </div>

                <div className={styles.mpbCardActions}>
                    <button className={styles.mpbIconBtn} title="수정" onClick={() => startEdit(it)}><Pencil size={15} /></button>
                    <button className={styles.mpbIconBtn} title={isHold ? '재개' : '보류'} onClick={() => toggleHold(it.id)}>
                        {isHold ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
                    </button>
                    <button className={`${styles.mpbIconBtn} ${styles.mpbIconDanger}`} title="삭제" onClick={() => remove(it.id)}><Trash2 size={15} /></button>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.slideContent}>
            <div className={styles.newSlideHeader}>
                <div className={styles.slideHeaderLeft}>
                    <span className={styles.slideIcon} style={{ background: `${accent}20`, color: accent }}>🎛️</span>
                    <span className={styles.slideNumber} style={{ color: accent }}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <span className={styles.mpbLiveBadge} style={{ borderColor: `${accent}55`, color: accent }}>● 인터랙티브 · 실시간 편집</span>
            </div>
            <h2 className={styles.newSlideTitle} style={{ color: accent }}>{title}</h2>
            {subtitle && <p style={{ color: '#888', fontSize: '1.2rem', marginBottom: '1rem' }}>{subtitle}</p>}

            {/* 툴바 */}
            <div className={styles.mpbToolbar}>
                <div className={styles.mpbToolbarLeft}>
                    <button className={styles.mpbBtn} style={{ borderColor: `${accent}66`, color: accent }} onClick={addItem}><Plus size={16} /> 추가</button>
                    <button className={styles.mpbBtn} onClick={sortByPriority}><ArrowDownWideNarrow size={16} /> 우선순위순 정렬</button>
                    <button className={styles.mpbBtnGhost} onClick={resetToSeed}><RotateCcw size={14} /> 초기화</button>
                </div>
                <div className={styles.mpbToolbarRight}>
                    {dirty && <span className={styles.mpbDirty}>저장 안 됨</span>}
                    <button className={styles.mpbBtnSave} style={{ background: accent }} onClick={save}><Save size={16} /> 저장</button>
                </div>
            </div>

            {/* 진행중 — 우선순위 순 */}
            <div className={styles.mpbList}>
                {activeItems.length === 0 && (
                    <div className={styles.mpbEmpty}>진행중 실행안이 없습니다. ‘추가’로 새 실행안을 만들어보세요.</div>
                )}
                {activeItems.map((it, i) => renderCard(it, i + 1, i, activeItems.length))}
            </div>

            {/* 보류 */}
            {holdItems.length > 0 && (
                <>
                    <div className={styles.mpbSectionLabel}>⏸ 보류 ({holdItems.length})</div>
                    <div className={styles.mpbList}>
                        {holdItems.map((it, i) => renderCard(it, null, i, holdItems.length))}
                    </div>
                </>
            )}

            {toast && <div className={styles.mpbToast} style={{ borderColor: `${accent}88` }}>{toast}</div>}
        </div>
    );
}
