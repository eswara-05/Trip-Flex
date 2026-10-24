import React from 'react';
import { Train, Clock, Calendar, AlertTriangle, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { TrainJourney } from '../lib/types';
import { formatINR } from '../lib/pricing';

interface TrainListingCardProps {
  train: TrainJourney;
  onSelectJourney: (train: TrainJourney, classCode: string) => void;
}

export const TrainListingCard: React.FC<TrainListingCardProps> = ({ train, onSelectJourney }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-400 transition-all shadow-sm hover:shadow-md p-5 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading font-extrabold text-lg text-black">
                {train.trainName}
              </span>
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 rounded">
                #{train.trainNumber}
              </span>
            </div>
            <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
              <span>Runs on: {train.runsOnDays.join(', ')}</span>
            </div>
          </div>

          {/* Integration Status Badge */}
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Info className="w-3 h-3 text-amber-600" />
              Schedule Timetable (IRCTC Adapter Ready)
            </span>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="grid grid-cols-3 items-center py-3 my-2 border-y border-gray-100 bg-[#F7F7F7]/60 rounded-lg px-3">
          <div>
            <div className="text-lg font-extrabold text-black font-heading">{train.departureTime}</div>
            <div className="text-xs font-semibold text-gray-800 truncate">{train.originStation}</div>
            <div className="text-[11px] font-mono text-gray-500 font-bold">{train.originCode}</div>
          </div>

          <div className="text-center">
            <span className="text-[11px] font-bold text-gray-400 block">{train.duration}</span>
            <div className="w-full flex items-center justify-center my-1">
              <div className="h-[2px] w-full bg-gray-300 relative flex items-center justify-center">
                <Train className="w-3.5 h-3.5 text-[#E50914] bg-[#F7F7F7] px-0.5" />
              </div>
            </div>
            <span className="text-[10px] text-gray-500">Non-Stop / Express</span>
          </div>

          <div className="text-right">
            <div className="text-lg font-extrabold text-black font-heading">{train.arrivalTime}</div>
            <div className="text-xs font-semibold text-gray-800 truncate">{train.destinationStation}</div>
            <div className="text-[11px] font-mono text-gray-500 font-bold">{train.destinationCode}</div>
          </div>
        </div>

        {/* Classes Available */}
        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Available Classes & Fares
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {train.classes.map((cls) => (
              <div
                key={cls.code}
                onClick={() => onSelectJourney(train, cls.code)}
                className="p-2.5 rounded-lg border border-gray-200 hover:border-[#E50914] bg-gray-50/50 hover:bg-red-50/20 transition cursor-pointer flex flex-col justify-between text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-black font-mono">{cls.code}</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                    AVL: {cls.seatsLeft}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 truncate mb-1">{cls.name}</div>
                <div className="text-xs font-extrabold text-[#E50914]">
                  {formatINR(cls.baseFareINR)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Note per Prompt */}
        <div className="mt-3 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-600 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
          <p className="leading-tight">
            {train.sourceNote}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">Independent railway search</span>
        <button
          onClick={() => onSelectJourney(train, train.classes[0].code)}
          className="px-4 py-2 rounded-lg bg-[#111111] hover:bg-black text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <span>Select Journey Details</span>
        </button>
      </div>
    </div>
  );
};
