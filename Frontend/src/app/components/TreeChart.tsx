'use client';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface TreeChartProps {
  data: any;
  userInput: string;
}

const TreeChart: React.FC<TreeChartProps> = ({ data, userInput }) => {
  const [option, setOption] = useState<EChartsOption | null>(null);

  useEffect(() => {
    if (data) {
      const optionTemp: EChartsOption = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
        },
        series: [
          {
            type: 'tree',
            data: data.data,
            orient: data.orient || 'LR',
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 10,
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
              },
            },
            emphasis: {
              focus: 'descendant',
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      };

      setOption(optionTemp);
    }
  }, [data]);

  if (!option) return <p className="text-center text-gray-500">No data to display.</p>;

  return (
    <div className="flex flex-col items-center text-black">
      <div className="text-lg font-bold mb-4">{userInput} Mindmap</div>
      <ReactECharts option={option} style={{ height: '600px', width: '100%' }} />
    </div>
  );
};

export default TreeChart;
