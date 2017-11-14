<template>
  <div class="index">
    <Menu mode="horizontal" theme="dark" active-name="1">
      
      <div class="layout-nav">
          
        <MenuItem name="1">
          <Icon type="ios-navigate" size="32"></Icon>
          <span class="larger-font">PP法冬季海上强风预测</span>
        </MenuItem>
      </div>
    </Menu>
    起报时间
    <DatePicker type="date" :options="dateOption" :value="startDate" @on-change="(date)=>changeDate(date,0)"
    placeholder="选择日期" style="width: 150px">
    </DatePicker>
    <Select v-model="startHour" style="width:100px">
      <Option v-for="item of validTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    结束时间
    <DatePicker type="date" :options="dateOption" :value="endDate" @on-change="(date)=>changeDate(date,1)"
    placeholder="选择日期" style="width: 150px">
    </DatePicker>
    <Select v-model="endHour" style="width:100px">
      <Option v-for="item of validTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Select v-model="modelSelected" style="width:150px">
        <Option v-for="item in modelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <br>
    <Button type="primary" icon="ios-search" @click.native = "getData">查询</Button>
    <Button type="primary" icon="images">图形显示</Button>
    <Select v-model="timeInterval" style="width:150px">
        <Option v-for="item in intervalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    
    <!--<Row type="flex" justify="center" align="middle">-->
    <Row type="flex" >
      <Col span="1"></Col>
      <Col span="22">
        <Table :columns="tableTitle" :data="tableData" height="800" :loading="tableLoading">
        </Table>
      </Col>
      <Col span="1"></Col>
    </Row>
  </div>
</template>
<script>
import axios from 'axios';
import Util from '../libs/util';
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
      const intervalList = [{value:1,label:'所有时次',},
                            {value:6,label:'6小时间隔',},
                            {value:12,label:'12小时间隔',},];// 时间间隔

      const modelList = [{value:'ecmwfthin',label:'EC细网格',},
                         {value:'necp',label:'NCEP-GFS',},
                         {value:'jmathin',label:'日本',},
                         {value:'grapes9km',label:'Grapes9km',},];// 模式选择

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
      let iniTime = new Date();
      let suffixTime = 3<=iniTime.getHours()&&iniTime.getHours()<15 ? {case:0,date:-1,hour:'12'}:{case:1,date:0,hour:'00'};//

      let startDate = iniTime.getFullYear().toString() + '-' +
                      (Array(2).join('0') + (iniTime.getMonth()+1)).slice(-2) + '-' +
                      (Array(2).join('0') + (iniTime.getDate()+suffixTime.date)).slice(-2);
      let endDate = iniTime.getFullYear().toString() + '-' +
                    (Array(2).join('0') + (iniTime.getMonth()+1)).slice(-2) + '-' +
                    (Array(2).join('0') + (iniTime.getDate()+suffixTime.date+5)).slice(-2);
      let [startHour,endHour] = [suffixTime.hour,suffixTime.hour];

      return {
        tableTitle,
        timeInterval:1,
        intervalList,
        modelList,
        modelSelected:'ecmwfthin',
        dateOption,
        validTime,
        rawData:[],
        startHour,
        endHour,
        startDate,
        endDate,
        postStartTime:undefined,
        tableLoading:false,
      }
    },
    methods: {
      getData(){
        let fullUrl = `http://localhost:10073/api/getData?start=${this.startString}&end=${this.endString}&model=ecthin`;
        console.log(fullUrl);
        let reqUrl = `/api/getData?start=${this.startString}&end=${this.endString}&model=ecthin`;
        //axios.get('http://localhost:10073/api/getData?start=2017-10-28 12:00:00&end=2017-11-01 12:00:00')
        this.$Notice.open({
          title: '正在查询',
          duration: 1.5,
        });
        this.tableLoading = true;
        Util.ajax.get(reqUrl)
        .then(res=>{
          this.tableLoading = false;
          this.changePostTime();
          this.rawData = res.data;
          this.$Notice.success({
              title: '查询成功',
              duration: 2,
          });
        })
        .catch(err=>{
          this.tableLoading = false;
          this.$Notice.error({
              title: '查询发生错误，F12打开控制台查看详情',
              desc:err.response.data?err.response.data:err,
              duration: 5,
          });
          console.error(err);
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
            console.error(`错误的类型: ${type}`);
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

      },
      changePostTime(){
        this.postStartTime = this.startDate.split('-').map(num=>parseInt(num));
        this.postStartTime.push(parseInt(this.endHour));
      },
      projectTime(hour){
        const time = this.postStartTime;
        const utc8 = 8;
        const transDate = new Date(time[0],time[1]-1,time[2],time[3]+hour+utc8);// 年，月，日，世界时+8
        const dateString = (Array(2).join('0') + (transDate.getMonth()+1)).slice(-2) + '-' +
                           (Array(2).join('0') + (transDate.getDate())).slice(-2) + ' ' +
                           (Array(2).join('0') + (transDate.getHours())).slice(-2) + '时';
        return dateString;
      },
      intervalFilter(item){
        return item.time%this.timeInterval===0?true:false;
      },
    },
    created(){
      this.getData();
    },
    computed:{
      tableData(){
        if(this.rawData.length==0) return [];// 如果数组为空直接返回
        console.log(this.timeInterval);
        const transData = this.rawData.filter(this.intervalFilter).map(item=>{
          const time = this.projectTime(item.time);
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
      },
      startString(){
        return this.startDate+' '+this.startHour+':00:00';
      },
      endString(){
        return this.endDate+' '+this.endHour+':00:00';
      },
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

    .larger-font{
      font-size:175%;
    }
    
</style>