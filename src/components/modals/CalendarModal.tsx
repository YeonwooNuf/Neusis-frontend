import React, { useState, useEffect } from 'react';
import './CalendarModal.css';

interface CalendarModalProps {
    readDates: string[]; // "YYYY-MM-DD"
    onClose: () => void;
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const CalendarModal: React.FC<CalendarModalProps> = ({ readDates, onClose }) => {
    const [current, setCurrent] = useState(new Date());
    const [holidayDates, setHolidayDates] = useState<string[]>([]);

    const readSet = new Set(readDates);
    const holidaySet = new Set(holidayDates);

    const year = current.getFullYear();
    const month = current.getMonth(); // 0~11

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const startWeek = first.getDay();       // 0 = Sun
    const daysInMonth = last.getDate();     // 28~31

    const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

    const formatDate = (y: number, m: number, d: number) =>
        `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // 현재 연/월이 바뀔 때마다 공휴일 가져오기
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/calendar/${year}/${month + 1}/holidays`
                );
                if (!res.ok) return;

                const raw = await res.json();

                // 공휴일 0건일 경우 응답이 배열이 아님 → 보호 처리
                const list = Array.isArray(raw) ? raw : [];

                setHolidayDates(list.map((h) => h.date));
            } catch (e) {
                console.error('공휴일 조회 실패', e);
            }
        };

        fetchHolidays();
    }, [year, month]);

    const rows: React.ReactNode[] = [];
    let cells: React.ReactNode[] = [];

    // 앞부분 빈 칸
    for (let i = 0; i < startWeek; i++) {
        cells.push(<td key={`empty-${i}`} />);
    }

    // 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
        const iso = formatDate(year, month, day);
        const isRead = readSet.has(iso);
        const isHoliday = holidaySet.has(iso);

        // 요일 계산 (0 = Sun, 6 = Sat)
        const weekIndex = (startWeek + (day - 1)) % 7;

        const classNames = ['calendar-day'];

        if (weekIndex === 0) classNames.push('sun');      // 일요일
        if (weekIndex === 6) classNames.push('sat');      // 토요일
        if (isHoliday) classNames.push('holiday');        // 공휴일은 무조건 빨간색
        if (isRead) classNames.push('read-day');          // 출석일(읽은 날)

        cells.push(
            <td key={day} className={classNames.join(' ')}>
                {day}
            </td>
        );

        if (cells.length % 7 === 0) {
            rows.push(<tr key={`row-${day}`}>{cells}</tr>);
            cells = [];
        }
    }

    if (cells.length > 0) {
        rows.push(<tr key="row-last">{cells}</tr>);
    }

    return (
        <div className="calendar-backdrop" onClick={onClose}>
            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                <div className="calendar-header">
                    <button onClick={prevMonth}>&lt;</button>
                    <span>
                        {year} - {String(month + 1).padStart(2, '0')}
                    </span>
                    <button onClick={nextMonth}>&gt;</button>
                </div>

                <table className="calendar-table">
                    <thead>
                        <tr>
                            <th className="sun">Sun</th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th className="sat">Sat</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>

                <div className="calendar-footer">
                    <span className="legend">
                        <span className="legend-dot attended" /> Attended
                    </span>
                    <span className="legend">
                        <span className="legend-dot holiday" /> Holiday
                    </span>
                    <button className="calendar-close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;