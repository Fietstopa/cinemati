// File: components/MoviePage/MovieInsights.tsx

import React from "react";
import { Card } from "@/components/ui/card";
import IconLoader from "@/components/iconLoader";
import imdb from "@/assets/imdb.png";
import metaBg from "@/assets/metacritic.png";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  LabelList,
} from "recharts";
import { Star, Award } from "lucide-react";
import CustomYAxisTick from "./customYAxisTick";

interface Props {
  stats: { icon: string; label: string; value: string }[];
  ratingData: { source: string; value: number }[];
  imdbGauge: { name: string; value: number }[];
  metaGauge: { name: string; value: number }[];
  imdbScore: string;
  metaScore: string;
}
const sourceColors: Record<string, string> = {
  "Rotten Tomatoes": "#f87171", // červená
  IMDb: "#deb522", // žlutá
  Metacritic: "#60a5fa", // modrá
};

const MovieInsights: React.FC<Props> = ({
  stats,
  ratingData,
  imdbGauge,
  metaGauge,
  imdbScore,
  metaScore,
}) => {
  return (
    <>
      {/* Quick Stats */}
      <div className=" mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-30 pt-12 pb-6">
        {stats.map(({ icon, label, value }) => (
          <Card
            key={label}
            className="bg-black/80 border border-yellow-400/30 p-4 flex items-center gap-4 rounded-xl"
          >
            <IconLoader iconName={icon} className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-yellow-200/70 mb-1">
                {label}
              </p>
              <p className="text-lg font-semibold text-yellow-50 leading-tight max-w-[10rem] truncate">
                {value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Gauges & Charts */}
      <div className=" mx-auto grid lg:grid-cols-4 gap-8 px-4 md:px-30 py-10">
        {/* IMDb Gauge */}
        <Card className="relative  bg-black/80 border border-yellow-400/30 shadow-yellow-500/20 shadow-lg flex items-center justify-center p-6 rounded-2xl">
          {/* Overlay obrázku s jasem */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${imdb})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              filter: "brightness(0.5)", // jen na obrázek!
            }}
          />

          {/* Obsah nad obrázkem */}
          <div className="relative z-10 flex flex-col items-center">
            <Star className="w-40 h-40 text-yellow-600/10 absolute -top-1 -left-1" />
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={imdbGauge}
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {imdbGauge.map((entry, idx) => (
                      <Cell
                        key={`imdb-${idx}`}
                        fill={idx === 0 ? "#fde047" : "#27272a"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-extrabold text-yellow-400 leading-none drop-shadow-md">
                  {imdbScore}
                </p>
                <p className="text-[10px] text-yellow-200/70 mt-1 uppercase tracking-wide">
                  IMDb
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Metascore Gauge */}
        <Card className="relative overflow-hidden bg-black/80 border border-yellow-400/30 shadow-yellow-500/20 shadow-lg flex items-center justify-center p-6 rounded-2xl">
          {/* Overlay obrázku s jasem */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${metaBg})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              filter: "brightness(0.5)", // jen obrázek
            }}
          />

          {/* Obsah nad obrázkem */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metaGauge}
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {metaGauge.map((entry, idx) => (
                      <Cell
                        key={`meta-${idx}`}
                        fill={idx === 0 ? "#fde047" : "#27272a"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-extrabold text-yellow-400 leading-none drop-shadow-md">
                  {isNaN(Number(metaScore)) ? "N/A" : metaScore}
                </p>
                <p className="text-[10px] text-yellow-200/70 mt-1 uppercase tracking-wide">
                  Metascore
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Bar Chart */}
        <Card className="bg-black/80 border border-yellow-400/30  shadow-yellow-500/10 rounded-2xl col-span-full lg:col-span-2">
          <div className="p-4 md:p-6 h-96 flex flex-col">
            <h2 className="text-lg md:text-xl text-yellow-300 font-bold mb-4">
              Ratings by Critics
            </h2>
            <div className="flex-grow">
              {ratingData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ratingData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, bottom: 5, left: 40 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#facc15"
                      opacity={0.15}
                    />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                      dataKey="source"
                      type="category"
                      width={60}
                      tick={<CustomYAxisTick />}
                    />

                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      formatter={(v: number) => `${Math.round(v)}%`}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {ratingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={sourceColors[entry.source] || "#a3a3a3"} // fallback barva
                        />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        formatter={(val: number) => `${Math.round(val)}%`}
                        fill="#fefce8"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-yellow-200/60">
                  No rating breakdown available.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default MovieInsights;
