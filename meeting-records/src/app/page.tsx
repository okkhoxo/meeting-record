import Link from 'next/link';
import { meetings } from '@/data/meetings';
import styles from './page.module.css';
import { ArrowRight, Calendar, Users } from 'lucide-react';

export default function Home() {
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

      <section className={styles.timelineSection}>
        <div className={styles.timelineLine} />

        {meetings.map((meeting, index) => (
          <Link href={`/meetings/${meeting.id}`} key={meeting.id}>
            <div className={`${styles.meetingCard} glass-card animate-fade-in`} style={{ animationDelay: `${index * 0.2}s` }}>
              <div className={styles.cardContent}>
                <div className={styles.dateBadge}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />
                  {meeting.date}
                </div>
                <h2 className={styles.cardTitle}>{meeting.title}</h2>
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
        ))}
      </section>
    </main>
  );
}
