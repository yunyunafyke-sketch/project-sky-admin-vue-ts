<template>
  <div
    :id="id"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts';
import {Component, Prop, Watch} from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import ResizeMixin from './mixins/resize';

    @Component({
        'name': 'MixedChart'
    })

export default class extends mixins(ResizeMixin) {
        // 这些 props 由父组件传入，用来控制图表容器和标题。
        @Prop({ 'default': 'chart' }) private className!: string
        @Prop({ 'default': 'mixedChart' }) private id!: string
        @Prop({ 'default': '100%' }) private width!: string
        @Prop({ 'default': '250px' }) private height!: string
        @Prop({ 'default': 'Requests' }) private title!: string
        // 柱状图数据，通常包含 xData/yData。
        @Prop({ 'default': {} }) private chartData!: any

        mounted() {
            this.init()
        }
        @Watch('chartData')
        // 父组件重新请求到数据后，chartData 变化，图表需要重新渲染。
        private changeData(newVal:string ,oldVal:string){
          this.init()
        }

        init(){
          this.$nextTick(() => {
            this.initChart();
          });
        }
        beforeDestroy() {
            // 销毁组件时释放 ECharts 实例，避免内存泄漏。
            if (!this.chart) {
                return;
            }
            this.chart.dispose();
            this.chart = null;
        }

        private initChart() {
            // ECharts 必须绑定一个真实 DOM 节点，所以这里通过 id 找到 template 中的 div。
            this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement);
            this.chart.setOption({
                'backgroundColor': '#fff',
                'title': {
                    'text': this.title,
                    'top': '0',
                    'textStyle': {
                        'color': '#000',
                        'fontSize': 18
                    },
                    'subtextStyle': {
                        'color': '#90979c',
                        'fontSize': 16
                    }
                },
                'tooltip': {
                    'trigger': 'axis'
                },
                'grid': {
                    'left': '50',
                    'right': '5%',
                    'borderWidth': 0,
                    'top': 60,
                    'bottom': 35,
                    'textStyle': {
                        'color': '#fff'
                    }
                },
                'xAxis': [{
                    'type': 'category',
                    'axisLine': {
                        'lineStyle': {
                            'color': '#90979c'
                        }
                    },
                    'splitLine': {
                        'show': false
                    },
                    'axisTick': {
                        'show': true
                    },
                    'splitArea': {
                        'show': false
                    },
                    'axisLabel': {
                        'interval': 0,
                        'rotate':-20
                    },
                    'data': this.chartData.xData
                }],
                'yAxis': [{
                    'type': 'value',
                    'splitLine': {
                        'show': false
                    },
                    'axisLine': {
                        'lineStyle': {
                            'color': '#90979c'
                        }
                    },
                    'axisTick': {
                        'show': false
                    },
                    'axisLabel': {
                        'interval': 0
                    },
                    'splitArea': {
                        'show': false
                    }
                }],
                'series': [{
                    'name': '店内',
                    'type': 'bar',
                    'stack': 'total',
                    'barMaxWidth': 15,
                    'barGap': '10%',
                    'itemStyle': {
                        'normal': {
                            'barBorderRadius':[10, 10, 0, 0],
                            'color': new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {'offset': 0, 'color': '#55A9FF'},
                                    {'offset': 1, 'color': '#379AFF'}
                                ]
                            )
                        },
                        'label': {
                            'show': true,
                            'textStyle': {
                                'color': '#fff'
                            },
                            'position': 'insideTop',
                            formatter(p: any) {
                                return p.value > 0 ? p.value : '';
                            }
                        }
                    },
                    'data': this.chartData.yData
                }]
            } as EChartOption<EChartOption.SeriesLine | EChartOption.SeriesBar>);
        }
}
</script>
