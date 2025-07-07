/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { AlerteChart } from "./AlertChart";
import {
  getAvailableYears,
  getAlertDataByYear,
  getAlerteByCriticite,
  getRecentStep2Alerts,
  getAlertsByYear,
} from "@/actions/alertActions";
import { CriticiteChart } from "./AlerteChart2";
import { MultiSelect } from "@/components/ui/multi-select";
import { RecentSales } from "@/features/overview/components/recent-sales";
import { ChartCirculare } from "@/features/overview/components/chartCircualreCategory";

type AlertData = {
  month: string;
  Nombre: number;
};
const criticiteLabels: Record<number, string> = {
  0: "Non classé",
  1: "Faible",
  2: "Modérée",
  3: "Élevée",
  4: "Critique",
};

const criticiteColors: Record<number, string> = {
  0: "#94a3b8", // Neutral - slate-400
  1: "#4ade80", // Green - green-400
  2: "#0096FF", // Yellow - yellow-400
  3: "#FFA500", // Orange - orange-400
  4: "#FF0000", // Red - red-400
};

type AlerteChartItem = {
  label: string;
  Nombre: number;
  fill: string;
};
type CategoryChartData = {
  browser: string;
  visitors: number;
  fill: string;
};
// Initialize with all criticity levels
const initialData: AlerteChartItem[] = [0, 1, 2, 3, 4].map((level) => ({
  label: criticiteLabels[level],
  Nombre: 0,
  fill: criticiteColors[level],
}));
const DashboardCharts = () => {
  const [alertData, setAlertData] = useState<AlertData[]>([]);
  const [alerts, setAlers] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryChartData[]>([]);
  const [alertDataCriticity, setAlertDataCriticity] =
    useState<AlerteChartItem[]>(initialData);
  const [selectedYears, setSelectedYears] = useState<number[]>([
    new Date().getFullYear(),
  ]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const barRef = useRef<any>(null);
  const [isSticky, setIsSticky] = useState(false);
  const sectionRef = useRef<any>(null);

  const containerRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current || !sectionRef.current || !containerRef.current)
        return;

      const titleHeight = barRef.current.offsetHeight;
      const sectionTop = sectionRef.current.getBoundingClientRect().top;

      if (sectionTop <= titleHeight) {
        setIsSticky(true);
        // Set exact width of container when sticky
        barRef.current.style.width = `${containerRef.current.offsetWidth}px`;
      } else {
        setIsSticky(false);
        barRef.current.style.width = "auto";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch available years on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const years = await getAvailableYears();
        setAvailableYears(years);
        const res = await getRecentStep2Alerts();
        setAlers(res);
        if (years.length > 0) {
          // Set to most recent year by default
          const latestYear = Math.max(...years);
          setSelectedYears([latestYear]);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Fetch alert data when selected years change
  useEffect(() => {
    console.log(selectedYearValues);
    const loadAlertData = async () => {
      if (selectedYears.length === 0) return;

      setIsLoading(true);
      try {
        // Fetch data for all selected years and combine
        const allData = await Promise.all(
          selectedYears.map((year) => getAlertDataByYear(year))
        );
        const combinedData = combineAlertDataByMonth(allData);
        setAlertData(combinedData);

        // Combine data by criticity level
        const allData2 = await Promise.all(
          selectedYears.map((year) => getAlerteByCriticite(year))
        );
        const combinedData2 = combineCriticityData(allData2);

        // Update the initial data with counts from API
        const updatedData = initialData.map((item) => {
          const level = Object.entries(criticiteLabels).find(
            ([_, label]) => label === item.label
          )?.[0];
          const Nombre = combinedData2.get(Number(level)) || 0;
          return { ...item, Nombre };
        });

        setAlertDataCriticity(updatedData);
        // Combine data by month

        const allAlerts = await Promise.all(
          selectedYears.map((year) => getAlertsByYear(year))
        );
        const combinedAlerts = allAlerts.flat();

        // Prepare category data here instead of in ChartCirculare
        const categoryCount: Record<string, number> = {};
        combinedAlerts.forEach((alert: any) => {
          categoryCount[alert.category] =
            (categoryCount[alert.category] || 0) + 1;
        });

        // Generate colors for categories
        const baseColors = [
          "#347928",
          "#FF9B45",
          "#E50046",
          "#6439FF",
          "#FFC300",
          "#00A6ED",
          "#A100FF",
          "#FF6F61",
          "#6D7278",
          "#00C49F",
        ];
        const categoryColors: Record<string, string> = {};
        Object.keys(categoryCount).forEach((cat, index) => {
          categoryColors[cat] = baseColors[index % baseColors.length];
        });

        // Format data for the chart
        const formattedData = Object.entries(categoryCount).map(
          ([category, visitors]) => ({
            browser: category,
            visitors,
            fill: categoryColors[category],
          })
        );

        setCategoryData(formattedData);
      } catch (error) {
        console.error("Error loading alert data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlertData();
  }, [selectedYears]);

  // Helper function to combine data from multiple years by month
  const combineCriticityData = (dataArrays: any[][]) => {
    const criticityMap = new Map<number, number>();

    dataArrays.forEach((yearData) => {
      yearData.forEach(({ criticite, Nombre }) => {
        const currentCount = criticityMap.get(criticite) || 0;
        criticityMap.set(criticite, currentCount + Nombre);
      });
    });

    return criticityMap;
  };
  const combineAlertDataByMonth = (dataArrays: AlertData[][]) => {
    const monthMap = new Map<string, number>();

    dataArrays.forEach((yearData) => {
      yearData.forEach(({ month, Nombre }) => {
        const currentCount = monthMap.get(month) || 0;
        monthMap.set(month, currentCount + Nombre);
      });
    });

    return Array.from(monthMap.entries()).map(([month, Nombre]) => ({
      month,
      Nombre,
    }));
  };

  // Convert available years to MultiSelect options format
  const yearOptions = availableYears.map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  // Convert selected years to string array for MultiSelect
  const selectedYearValues = selectedYears.map((year) => year.toString());

  const handleYearSelection = (selectedValues: string[]) => {
    setSelectedYears(selectedValues.map((v) => parseInt(v)));
  };

  return (
    <div ref={containerRef} className="relative">
      <div ref={sectionRef}>
        <div
          ref={barRef}
          className={`transition-all ${
            isSticky
              ? "fixed top-1 z-50 bg-white shadow-md rounded-md px-4 py-2 border-b"
              : "relative bg-white shadow-lg rounded-md px-4 py-2 border my-3"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">Statistiques des alertes</div>
              <div>
                Affichage des alertes par mois pour {selectedYears.join(", ")}
              </div>
            </div>

            <div className="relative w-1/2 flex items-center justify-end">
              <MultiSelect
                options={yearOptions}
                defaultValue={selectedYearValues}
                onValueChange={handleYearSelection}
                placeholder="Select years"
                variant="inverted"
                className="w-fit"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <AlerteChart alertData={alertData} isLoading={isLoading} />
          </div>
          <div className="col-span-4 md:col-span-3">
            <RecentSales alerts={alerts} />
          </div>
          <div className="col-span-4">
            <ChartCirculare chartData={categoryData} isLoading={isLoading} />
          </div>
          {/*<div className="col-span-4">
            <RadarChart />
           </div>*/}
          <div className="col-span-4 md:col-span-3">
            <CriticiteChart data={alertDataCriticity} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardCharts;
