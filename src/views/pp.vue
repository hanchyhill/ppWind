<template>
  <div class="index">
    起报时间
    <DatePicker type="date" :options="dateOption" :value="startDate" @on-change="(date)=>changeDate(date,0)"
    placeholder="选择日期" style="width: 200px">
    </DatePicker>
    <Select v-model="startHour" style="width:200px">
      <Option v-for="item of validTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    结束时间
    <DatePicker type="date" :options="dateOption" :value="endDate" @on-change="(date)=>changeDate(date,1)"
    placeholder="选择日期" style="width: 200px">
    </DatePicker>
    <Select v-model="endHour" style="width:200px">
      <Option v-for="item of validTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <br>
    <Button type="primary" icon="ios-search">查询</Button>
    <Button type="primary" icon="images">图形显示</Button>
    <!--<Row type="flex" justify="center" align="middle">-->
    <Row type="flex" >
      <Col span="24">
        <Table :columns="tableTitle" :data="tableData">
        </Table>
      </Col>
    </Row>
  </div>
</template>
<script>
import axios from 'axios';
  export default {
    name: 'pp-Main',
    data () {
      let tableTitle = [{title: '时次',key: 'time'},
                          {title: '粤西海面',key: 'west'},
                          {title: '粤中海面',key: 'middle'},
                          {title: '粤东海面',key: 'east'},
                          {title: '类型',key: 'type'},
                          ];
      
      /* let tableData = [{time:'10月29日08时',east:'7级',middle:'6级'},
                       {time:'10月29日11时',east:'8级',middle:'7级', west:'6级'},
                       {time:'10月30日02时',east:'7级',middle:'6级',type:'东部型'}]; */
      const dateOption = {
        shortcuts: [
          {
            text: '今天',
            value () {
              return new Date();
            },
          },
          {
            text: '昨天',
            value () {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              return date;
            },
          },
          {
            text: '一周前',
            value () {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              return date;
            },
          }
        ]
      }

      const validTime = [{value:'00', label:'00 UTC'}, {value:'12', label:'12 UTC'}];
      return {
        tableTitle,
        // tableData,
        dateOption,
        validTime,
        rawData:[],
        startHour:'',
        endHour:'',
        startDate:'2016-01-01',
        endDate:'2016-01-01',
      }
    },
    methods: {
      getData(){
        axios.get('/api/ppWind?model=ECMWF-thin')
        .then((res)=>{

        })
        .catch(err=>{

        })
      },
      projectScale(wind){
        switch(wind){
          case 0:
            return '';
            break;
          case 1:
            return '6级';
            break;
          case 2:
            return '7级';
            break;
          case 3:
            return '8级';
            break;
          case 4:
            return '6级及以上';
            break;
          case 5:
            return '7级及以上';
            break;
          default:
            return '';
            console.error('错误的风力等级');
        }
      },
      projectType(type){
        switch(type){
          case 0:
            return '西部型';
            break;
          case 1:
            return '中部型';
            break;
          case 2:
            return '东部型';
            break;
          default:
            return '';
            console.error('错误的类型type');
        }
      },
      changeDate(formatDate,which){
        console.log(formatDate);
        if(which == 0){
          this.startDate = formatDate;
        }
        else{
          this.endDate = formatDate;
        }

      }
    },
    created(){
      axios.get('http://localhost:10073/api/getData?start=2017-10-28 12:00:00&end=2017-11-01 12:00:00')
      .then(res=>{
        this.rawData = res.data;
      })
      .catch(err=>{
        console.error(err);
      })
    },
    computed:{
      tableData(){
        if(this.rawData.length==0) return [];// 如果数组为空直接返回
        const transData = this.rawData.map(item=>{
          const time = item.time;
          const west = this.projectScale(item.w);
          const middle = this.projectScale(item.m);
          const east = this.projectScale(item.e);
          const type = this.projectType(item.type);
          return {
            time,
            west,
            middle,
            east,
            type,
          }
        });
        return transData;
      }
    },
  };
</script>
<style scoped>
    .index {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
    }

    .index h1 {
        height: 150px;
    }

    .index h1 img {
        height: 100%;
    }

    .index h2 {
        color: #666;
        margin-bottom: 200px;
    }

    .index h2 p {
        margin: 0 0 50px;
    }

    .index .ivu-row-flex {
        height: 100%;
    }
</style>