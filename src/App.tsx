import { useState, useEffect } from 'react';
import { fetchKarnatakaWeather, WeatherData } from './services/weatherService';
import { CityCard } from './components/CityCard';
import { WeatherDetail } from './components/WeatherDetail';
import { RefreshCw, MapPin, Wind, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchKarnatakaWeather();
      setWeatherData(data);
      if (!selectedCity && data.length > 0) {
        setSelectedCity(data[0]);
      } else if (selectedCity) {
        const updated = data.find(c => c.city === selectedCity.city);
        if (updated) setSelectedCity(updated);
      }
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to load weather data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">K-Air Monitor</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full text-xs font-medium text-black/60">
              <MapPin className="w-3 h-3" />
              Karnataka, India
            </div>
            <button 
              onClick={loadData}
              disabled={loading}
              className="p-2 hover:bg-black/5 rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: City List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-black/40">Major Cities</h2>
              <span className="text-[10px] font-mono text-black/30">Last update: {lastRefreshed}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {loading && weatherData.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-40 bg-black/5 rounded-2xl animate-pulse" />
                ))
              ) : (
                weatherData.map((data) => (
                  <CityCard 
                    key={data.city} 
                    data={data} 
                    isSelected={selectedCity?.city === data.city}
                    onClick={() => setSelectedCity(data)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Main Content: Details */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedCity ? (
                <motion.div
                  key={selectedCity.city}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WeatherDetail data={selectedCity} />
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-black/5 border-dashed">
                  <Search className="w-12 h-12 text-black/10 mb-4" />
                  <h3 className="text-xl font-bold">Select a city</h3>
                  <p className="text-black/40">Choose a city from the list to see detailed environmental data</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-black/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-black/40">
            © 2026 Karnataka Air Quality Monitor. Data sourced via Gemini Search.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">About</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Data Policy</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper for App.tsx if needed
import { cn } from './utils';
