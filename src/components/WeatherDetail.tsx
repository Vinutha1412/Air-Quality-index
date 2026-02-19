import React from 'react';
import { WeatherData } from '../services/weatherService';
import { cn, getAQIColor, getAQILabel } from '../utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Wind, Droplets, Thermometer, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherDetailProps {
  data: WeatherData;
}

export const WeatherDetail: React.FC<WeatherDetailProps> = ({ data }) => {
  const aqiColorClass = getAQIColor(data.aqi);
  
  const pollutantData = [
    { name: 'PM2.5', value: data.pollutants.pm25, full: 100 },
    { name: 'PM10', value: data.pollutants.pm10, full: 150 },
    { name: 'NO2', value: data.pollutants.no2, full: 80 },
    { name: 'O3', value: data.pollutants.o3, full: 120 },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black text-white p-8 rounded-3xl overflow-hidden relative"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-5xl font-bold tracking-tighter mb-2">{data.city}</h2>
              <p className="text-white/60 font-mono tracking-widest uppercase text-sm">Real-time Environmental Status</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-light tracking-tighter">{data.temperature}°</div>
              <p className="text-white/60 text-sm font-medium">{data.condition}</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Air Quality Index</p>
              <div className="flex items-baseline gap-2">
                <span className={cn("text-5xl font-bold", aqiColorClass.split(' ')[0])}>{data.aqi}</span>
                <span className="text-white/60 font-medium">{getAQILabel(data.aqi)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Humidity</p>
              <div className="flex items-center gap-3">
                <Droplets className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold">{data.humidity}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Wind Speed</p>
              <div className="flex items-center gap-3">
                <Wind className="w-8 h-8 text-emerald-400" />
                <span className="text-3xl font-bold">{data.windSpeed} <span className="text-sm font-normal text-white/40">km/h</span></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Pollutants Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold tracking-tight">Pollutant Breakdown</h3>
            <Info className="w-4 h-4 text-black/20" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pollutantData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#00000010" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={60} />
                <Tooltip 
                  cursor={{ fill: '#00000005' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#000000" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm"
        >
          <h3 className="text-lg font-bold tracking-tight mb-6">Health Recommendations</h3>
          <div className="space-y-4">
            {data.aqi <= 100 ? (
              <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900">Air quality is good</p>
                  <p className="text-sm text-emerald-700">Perfect for outdoor activities and exercise. No special precautions needed.</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
                <div>
                  <p className="font-bold text-orange-900">Moderate air pollution</p>
                  <p className="text-sm text-orange-700">Sensitive groups should reduce prolonged outdoor exertion. Consider wearing a mask.</p>
                </div>
              </div>
            )}
            
            <div className="p-6 bg-black/5 rounded-2xl">
              <h4 className="font-bold text-sm mb-2 uppercase tracking-wider">Quick Tips</h4>
              <ul className="text-sm space-y-2 text-black/70">
                <li>• Keep windows closed during peak traffic hours</li>
                <li>• Use air purifiers if living near industrial zones</li>
                <li>• Stay hydrated to help your body process pollutants</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
