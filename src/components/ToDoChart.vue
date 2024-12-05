<template>
  <div class="charts-container">
    <div class="chart-item">
      <v-chart class="chart" :option="pieOption" autoresize />
    </div>
    <div class="chart-item">
      <v-chart class="chart" :option="barOption" autoresize />
    </div>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

export default {
  props: {
    todoItems: {
      type: Array,
      required: true
    }
  },
  computed: {
    pieOption() {
      const completed = this.todoItems.filter(item => item.done).length;
      const pending = this.todoItems.length - completed;
      
      return {
        title: {
          text: '待办事项完成情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}'
            },
            data: [
              { value: completed, name: '已完成' },
              { value: pending, name: '待完成' }
            ]
          }
        ]
      };
    },
    barOption() {
      // 按标签分组统计完成情况
      const stats = {};
      this.todoItems.forEach(item => {
        if (!stats[item.label]) {
          stats[item.label] = { total: 0, done: 0 };
        }
        stats[item.label].total += 1;
        if (item.done) stats[item.label].done += 1;
      });

      const labels = Object.keys(stats);
      const doneData = labels.map(label => stats[label].done);
      const totalData = labels.map(label => stats[label].total);

      return {
        title: {
          text: '待办事项详细统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['已完成', '总数'],
          top: '10%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: labels,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '已完成',
            type: 'bar',
            data: doneData
          },
          {
            name: '总数',
            type: 'bar',
            data: totalData
          }
        ]
      };
    }
  }
};
</script>

<style scoped>
.charts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
}

.chart-item {
  flex: 1;
  min-width: 300px;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style> 