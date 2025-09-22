import { Header } from '@/components/layout/Header';
import { TimetableGrid } from '@/components/timetable/TimetableGrid';

export default function Timetable() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <TimetableGrid />
      </div>
    </div>
  );
}