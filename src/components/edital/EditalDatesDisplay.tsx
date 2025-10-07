import { useState, useEffect } from 'react';
import { CalendarCheck, CalendarDays, CalendarX, Clock } from 'lucide-react';
import { Congress, Deadline } from '../../../types/congress';

interface EditalDatesDisplayProps {
  editalDates: NonNullable<Congress['editalDates']>;
  colors: Congress['colors'];
}

// Helper to create a reliable Date object from a Deadline
const getDeadlineDate = (deadline: Deadline): Date => {
  const dateParts = deadline.date.split('-').map(part => parseInt(part, 10));
  const timeParts = (deadline.time || '23:59').split(':').map(part => parseInt(part, 10));

  const year = dateParts[0];
  const month = dateParts[1] - 1; // Month is 0-indexed
  const day = dateParts[2];

  const hours = timeParts[0] || 23;
  const minutes = timeParts[1] || 59;
  const seconds = timeParts.length > 2 ? timeParts[2] : 59;

  return new Date(year, month, day, hours, minutes, seconds);
};

const calculateTimeLeft = (deadline: Deadline | null) => {
  if (!deadline) return {};

  const target = getDeadlineDate(deadline);
  const difference = +target - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const getNextUpcomingDeadline = (deadlines: Deadline[] | undefined): Deadline | null => {
  if (!deadlines || deadlines.length === 0) return null;
  const now = new Date();

  const upcoming = deadlines
    .filter(d => {
      const deadlineDate = getDeadlineDate(d);
      return deadlineDate > now;
    })
    .sort((a, b) => getDeadlineDate(a).getTime() - getDeadlineDate(b).getTime());

  return upcoming.length > 0 ? upcoming[0] : null;
};

const formatDate = (deadline: Deadline | undefined) => {
  if (!deadline) return 'N/A';
  try {
    const [year, month, day] = deadline.date.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  } catch {
    return deadline.date;
  }
};

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const Countdown = ({ deadline }: { deadline: Deadline | null }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(deadline));

  useEffect(() => {
    if (!deadline) return;
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);
    return () => clearTimeout(timer);
  }, [deadline, timeLeft]);

  const timeUnits = {
    days: 'Dias',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
  };

  if (!Object.keys(timeLeft).length) {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
        <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Clock className="w-6 h-6" />
          Prazo Encerrado!
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 md:mt-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-6 max-w-2xl mx-auto">
        {Object.entries(timeUnits).map(([unit, label]) => (
          <div 
            key={unit} 
            className="relative group"
          >
            <div className="absolute inset-0 bg-white/20 rounded-xl md:rounded-2xl blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
            <div className="relative flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/30 shadow-xl group-hover:scale-105 transition-transform duration-300">
              <div className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-0.5 sm:mb-1 tracking-tight">
                {String(timeLeft[unit as keyof TimeLeft] || 0).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EditalDatesDisplay: React.FC<EditalDatesDisplayProps> = ({ editalDates, colors }) => {
  const now = new Date();
  const upcomingSubmissionIndex = (editalDates.submissionDeadlines || []).findIndex(d => {
      const deadlineDate = getDeadlineDate(d);
      return deadlineDate > now;
  });

  const submissionDeadlineToShow = upcomingSubmissionIndex !== -1
      ? (editalDates.submissionDeadlines || [])[upcomingSubmissionIndex]
      : null;

  const resultsDeadlineToShow = upcomingSubmissionIndex !== -1 && editalDates.resultsDeadlines && editalDates.resultsDeadlines.length > upcomingSubmissionIndex
      ? editalDates.resultsDeadlines[upcomingSubmissionIndex]
      : null;

  const nextPresentationDeadline = getNextUpcomingDeadline(editalDates.presentationDeadlines);

  const DeadlineItem = ({ deadline, icon: Icon, colors }: { deadline: Deadline; icon: React.ElementType; colors: Congress['colors'] }) => {
    return (
      <div className="group relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl blur-xl" style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)` }}></div>
        <div className="relative flex items-center gap-3 sm:gap-4 md:gap-5 p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-opacity-0" style={{ borderLeftWidth: '4px', borderLeftColor: colors.accent }}>
          <div className="flex-shrink-0 p-2 sm:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: colors.accent }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-0.5 sm:mb-1">Prazo</p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate" style={{ color: colors.primary }}>
              {formatDate(deadline)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const DeadlineCategory = ({ title, deadline, icon, colors }: { title: string; deadline: Deadline | null; icon: React.ElementType; colors: Congress['colors'] }) => {
    if (!deadline) {
      return null;
    }

    return (
      <div className="space-y-3 md:space-y-4">
        <h4 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3" style={{ color: colors.secondary }}>
          <div className="w-1 md:w-1.5 h-6 md:h-8 rounded-full" style={{ backgroundColor: colors.accent }}></div>
          {title}
        </h4>
        <DeadlineItem deadline={deadline} icon={icon} colors={colors} />
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl md:rounded-3xl"></div>
      <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-12 border border-gray-200/50">
        
        {/* Hero Banner - Next Deadline */}
        {submissionDeadlineToShow ? (
          <div className="relative mb-8 md:mb-12 overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl group">
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')]"></div>
            <div
              className="relative p-5 sm:p-6 md:p-8 lg:p-12 text-white text-center transition-all duration-700"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})` }}
            >
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-3 sm:mb-4">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest">Encerramento das Submissões</span>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mt-2 sm:mt-3 md:mt-4 mb-1 sm:mb-2 drop-shadow-lg break-words">
                {formatDate(submissionDeadlineToShow)}
              </p>
              <Countdown deadline={submissionDeadlineToShow} />
            </div>
          </div>
        ) : (
          <div className="mb-8 md:mb-12 text-center p-6 sm:p-8 md:p-10 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl md:rounded-3xl border-2 border-dashed border-gray-300">
            <CalendarX className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 opacity-50" style={{ color: colors.secondary }} />
            <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: colors.secondary }}>
              Todos os prazos de submissão foram encerrados.
            </p>
          </div>
        )}

        {/* Static Dates Section */}
        {(editalDates.openingDate || editalDates.publicationDate) && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-8 md:mb-12">
              {editalDates.openingDate && (
                <div className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-white to-gray-50 p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br opacity-10 rounded-full blur-3xl -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500" style={{ backgroundColor: colors.primary }}></div>
                  <div className="relative flex items-center gap-3 sm:gap-4 md:gap-5">
                    <div className="p-2.5 sm:p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md" style={{ backgroundColor: `${colors.primary}15` }}>
                      <CalendarCheck className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" style={{ color: colors.primary }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-500 text-[10px] sm:text-xs md:text-sm uppercase tracking-wide mb-0.5 sm:mb-1">Abertura do Edital</p>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate" style={{ color: colors.primary }}>
                        {formatDate({date: editalDates.openingDate, name: ''})}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {editalDates.publicationDate && (
                <div className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-white to-gray-50 p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br opacity-10 rounded-full blur-3xl -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500" style={{ backgroundColor: colors.primary }}></div>
                  <div className="relative flex items-center gap-3 sm:gap-4 md:gap-5">
                    <div className="p-2.5 sm:p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md" style={{ backgroundColor: `${colors.primary}15` }}>
                      <CalendarDays className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" style={{ color: colors.primary }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-500 text-[10px] sm:text-xs md:text-sm uppercase tracking-wide mb-0.5 sm:mb-1">Publicação dos Anais</p>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate" style={{ color: colors.primary }}>
                        {formatDate({date: editalDates.publicationDate, name: ''})}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative my-8 md:my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 bg-white text-[10px] sm:text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider rounded-full shadow-md border border-gray-200">
                  Outras Datas Importantes
                </span>
              </div>
            </div>
          </>
        )}

        {/* Deadline Categories - Modern Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {resultsDeadlineToShow && (
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3" style={{ color: colors.secondary }}>
                <div className="w-1 md:w-1.5 h-6 md:h-8 rounded-full" style={{ backgroundColor: colors.accent }}></div>
                Resultados das Submissões
              </h4>
              <DeadlineItem deadline={resultsDeadlineToShow} icon={CalendarX} colors={colors} />
            </div>
          )}

          <DeadlineCategory 
            title="Envio das Apresentações" 
            deadline={nextPresentationDeadline} 
            icon={CalendarDays} 
            colors={colors} 
          />
        </div>
      </div>
    </div>
  );
};

export default EditalDatesDisplay;