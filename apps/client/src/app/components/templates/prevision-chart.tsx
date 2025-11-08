"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Données : toute l'année, mais réel seulement jusqu'à Avril
const data = [
  { mois: "Janv", reel: 42000 },
  { mois: "Févr", reel: 47000 },
  { mois: "Mars", reel: 51000 },
  { mois: "Avr", reel: 49500, prevision: 49500 },
  { mois: "Mai", prevision: 52000 },
  { mois: "Juin" },
  { mois: "Juil" },
  { mois: "Août" },
  { mois: "Sept" },
  { mois: "Oct" },
  { mois: "Nov" },
  { mois: "Déc" },
];

export default function PrevisionCAChart() {
  return (
    <div className="w-[500px] h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis tickFormatter={(v) => `${v / 1000}k €`} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                // Cherche la première valeur non null
                const point = payload.find((p) => p.value !== null);
                if (point) {
                  return (
                    <div
                      style={{
                        background: "white",
                        border: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      <strong>{label}</strong>
                      <div>
                        {point.name}: {point?.value?.toLocaleString()} €
                      </div>
                    </div>
                  );
                }
              }
              return null;
            }}
          />
          <Legend />

          {/* Ligne CA réel */}

          {/* Ligne Prévision (pointillée) */}
          <Line
            type="monotone"
            dataKey="prevision"
            stroke="#00C49F"
            strokeWidth={3}
            strokeDasharray="6 4"
            dot={(props) => {
              const { cx, cy, payload } = props;
              // n’affiche le dot que si c’est un point de prévision
              if (payload.prevision && !payload.reel) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#00C49F"
                    stroke="#00C49F"
                  />
                );
              }
              return <g />; // sinon aucun point
            }}
            activeDot={false}
            connectNulls={true}
          />

          <Line
            type="monotone"
            dataKey="reel"
            stroke="#0011AA"
            strokeWidth={3}
            dot={{ r: 5, fill: "#0011AA" }}
            name="CA Réel"
            connectNulls={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
