import React from 'react';
import { Wind, Droplets, Thermometer, Cloud } from 'lucide-react';
import { WeatherData } from '../services/weatherService';
import { cn, getAQIColor, getAQILabel } from '../utils';
import { motion } from 'motion/react';

interface CityCardProps {
  data: WeatherData;
  isSelected: boolean;
  onClick: () => void;
}

export const CityCard: React.FC<CityCardProps> = ({ data, isSelected, onClick }) => {
  const aqiColorClass = getAQIColor(data.aqi);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer p-6 rounded-2xl border transition-all duration-300",
        isSelected 
          ? "bg-white border-black shadow-xl ring-1 ring-black" 
          : "bg-white/50 border-black/5 hover:border-black/20 hover:bg-white"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{data.city}</h3>
          <p className="text-sm text-black/40 font-mono uppercase tracking-wider">Karnataka</p>
        </div>
        <div className={cn("px-3 py-1 rounded-full text-xs font-bold border", aqiColorClass)}>
          AQI {data.aqi}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-black/40" />
          <span className="text-lg font-medium">{data.temperature}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-black/40" />
          <span className="text-sm truncate">{data.condition}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-xs text-black/60">
            <Droplets className="w-3 h-3" />
            {data.humidity}%
          </div>
          <div className="flex items-center gap-1 text-xs text-black/60">
            <Wind className="w-3 h-3" />
            {data.windSpeed} km/h
          </div>
        </div>
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", aqiColorClass.split(' ')[0])}>
          {getAQILabel(data.aqi)}
        </span>
      </div>
    </motion.div>
  );
};
