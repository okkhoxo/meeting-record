'use client';

import { useState } from 'react';
import Link from 'next/link';
import { meetings } from '@/data/meetings';
import styles from './page.module.css';
import { ArrowRight, Calendar, Users, Lock, Shield, ChevronRight } from 'lucide-react';

const EXECUTIVE_PASSWORD = '110619';

export default function Home() {
  const [showAllSection, setShowAllSection] = useState(false);
  const [isExecutiveUnlocked, setIsExecutiveUnlocked] = useState(false);
  const [showExecutiveSection, setShowExecutiveSection] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // 전체 회의 (meetingType === 'all')
  const allMeetings = meetings.filter(m => m.meetingType === 'all');

  // 임원진 회의 (meetingType === 'executive')
  const executiveMeetings = meetings.filter(m => m.meetingType === 'executive');

  // 월별로 그룹화
  const groupByMonth = (meetingList: typeof meetings) => {
    const grouped: { [key: string]: typeof meetings } = {};

    meetingList.forEach(meeting => {
      const [year, month] = meeting.date.split('.');
      const key = `${year}.${month}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(meeting);
    });

    return grouped;
  };

  const allGrouped = groupByMonth(allMeetings);
  const executiveGrouped = groupByMonth(executiveMeetings);

  const handlePasswordSubmit = () => {
    if (passwordInput === EXECUTIVE_PASSWORD) {
      setIsExecutiveUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('.');
    const monthNames = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    return `${year}년 ${monthNames[parseInt(month)]}`;
  };

  const renderMeetingCard = (meeting: typeof meetings[0], index: number) => (
    <Link href={`/meetings/${meeting.id}`} key={meeting.id}>
      <div className={`${styles.meetingCard} glass-card animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <div className={styles.dateBadge}>
              <Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />
              {meeting.date}
            </div>
          </div>
          <h2 className={styles.cardTitle}>{meeting.title}</h2>
          {meeting.subtitle && (
            <p className={styles.cardSubtitle}>{meeting.subtitle}</p>
          )}
          <div className={styles.attendees}>
            <Users size={14} style={{ marginRight: '5px', color: '#888' }} />
            {meeting.attendees.map(attendee => (
              <span key={attendee} className={styles.attendee}>{attendee}</span>
            ))}
          </div>
        </div>
        <div className={styles.arrow}>
          <ArrowRight size={24} />
        </div>
      </div>
    </Link>
  );

  return (
    <main className={styles.main}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />

      <section className={styles.hero}>
        <div className="animate-fade-in">
          <h1 className={styles.heroTitle}>Neander<br />Archives</h1>
          <p className={styles.heroSubtitle}>
            Weekly meeting records, decisions, and milestones.
            <br />
            Preserved in the digital ether.
          </p>
        </div>
      </section>

      {/* 전체 회의 섹션 */}
      <section className={styles.meetingsSection}>
        <button
          className={`${styles.sectionHeader} ${styles.clickableAll}`}
          onClick={() => setShowAllSection(!showAllSection)}
        >
          <Users size={24} />
          <h2>전체 회의</h2>
          <ChevronRight size={20} className={`${styles.chevron} ${showAllSection ? styles.open : ''}`} />
        </button>

        {showAllSection && (
          <>
            {Object.keys(allGrouped).sort().reverse().map(monthKey => (
              <div key={monthKey} className={styles.monthSection}>
                <h3 className={styles.monthTitle}>{getMonthName(monthKey)}</h3>
                <div className={styles.meetingsList}>
                  {allGrouped[monthKey].map((meeting, idx) => renderMeetingCard(meeting, idx))}
                </div>
              </div>
            ))}

            {allMeetings.length === 0 && (
              <p className={styles.emptyMessage}>등록된 전체 회의가 없습니다.</p>
            )}
          </>
        )}
      </section>

      {/* 임원진 회의 섹션 */}
      <section className={styles.executiveSection}>
        <button
          className={`${styles.sectionHeader} ${styles.executiveHeader} ${styles.clickable}`}
          onClick={() => setShowExecutiveSection(!showExecutiveSection)}
        >
          <Shield size={24} />
          <h2>임원진 회의</h2>
          <ChevronRight size={20} className={`${styles.chevron} ${showExecutiveSection ? styles.open : ''}`} />
        </button>

        {showExecutiveSection && (
          <>
            {!isExecutiveUnlocked ? (
              <div className={styles.passwordSection}>
                <div className={styles.lockIcon}>
                  <Lock size={48} />
                </div>
                <p className={styles.passwordDesc}>임원진 회의록을 열람하려면 비밀번호를 입력하세요</p>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type="password"
                    className={`${styles.passwordInput} ${passwordError ? styles.error : ''}`}
                    placeholder="4자리"
                    maxLength={6}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  />
                  <button
                    className={styles.passwordSubmit}
                    onClick={handlePasswordSubmit}
                  >
                    확인
                  </button>
                </div>
                {passwordError && (
                  <p className={styles.passwordErrorText}>비밀번호가 올바르지 않습니다</p>
                )}
              </div>
            ) : (
              <>
                {Object.keys(executiveGrouped).sort().reverse().map(monthKey => (
                  <div key={monthKey} className={styles.monthSection}>
                    <h3 className={styles.monthTitle}>{getMonthName(monthKey)}</h3>
                    <div className={styles.meetingsList}>
                      {executiveGrouped[monthKey].map((meeting, idx) => renderMeetingCard(meeting, idx))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}
