(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e90ab"],{"8c9c":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._m(0),n("vxe-form",{attrs:{data:e.formData,"title-width":"120","title-align":"right"},on:{submit:e.searchEvent,reset:e.searchEvent}},[n("vxe-form-item",{attrs:{field:"name",title:"Input",span:"8","title-prefix":{message:"帮助信息！！！",icon:"fa fa-exclamation-circle"},"item-render":{name:"Input"}}}),n("vxe-form-item",{attrs:{field:"role",title:"AutoComplete",span:"8","item-render":{name:"AutoComplete",props:{data:e.restaurants,filterMethod:e.roleFilterMethod}}}}),n("vxe-form-item",{attrs:{field:"age",title:"InputNumber",span:"8","item-render":{name:"InputNumber"}}}),n("vxe-form-item",{attrs:{field:"sex",title:"Select",span:"8","item-render":{name:"Select",options:e.sexList}}}),n("vxe-form-item",{attrs:{field:"region",title:"Cascader",span:"8","item-render":{name:"Cascader",props:{data:e.regionList}}}}),n("vxe-form-item",{attrs:{field:"date",title:"DatePicker",span:"8","item-render":{name:"DatePicker",props:{type:"date",format:"yyyy/MM/dd"}}}}),n("vxe-form-item",{attrs:{field:"date6",title:"TimePicker",span:"8",folding:"","item-render":{name:"TimePicker",props:{type:"time"}}}}),n("vxe-form-item",{attrs:{field:"flag",title:"iSwitch",span:"8",folding:"","item-render":{name:"iSwitch"}}}),n("vxe-form-item",{attrs:{field:"rate",title:"Rate",span:"8",folding:"","item-render":{name:"Rate"}}}),n("vxe-form-item",{attrs:{field:"flag1",title:"Radio",span:"8",folding:"","item-render":{name:"Radio",options:[{label:"是",value:"Y"},{label:"否",value:"N"}]}}}),n("vxe-form-item",{attrs:{field:"checkedList",title:"Checkbox",span:"8",folding:"","item-render":{name:"Checkbox",options:[{label:"北京",value:"beijing"},{label:"深圳",value:"shenzhen"},{label:"上海",value:"shanghai"}]},"visible-method":e.visibleMethod}}),n("vxe-form-item",{attrs:{span:"24",align:"center","collapse-node":"","item-render":{name:"ElButtons",children:[{content:"查询",props:{type:"primary",nativeType:"submit"}},{content:"重置",props:{nativeType:"reset"}}]}}})],1),n("vxe-toolbar",{attrs:{export:"",print:"",custom:""},scopedSlots:e._u([{key:"buttons",fn:function(){return[n("Button",{on:{click:e.insertEvent}},[e._v("新增")]),n("Button",{on:{click:e.saveEvent}},[e._v("保存")]),n("Button",{on:{click:e.validEvent}},[e._v("校验")]),n("Dropdown",{on:{"on-click":e.dropdownMenuEvent}},[n("Button",[e._v(" 操作"),n("Icon",{attrs:{type:"ios-arrow-down"}})],1),n("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[n("DropdownItem",{attrs:{name:"remove"}},[e._v("删除选中")]),n("DropdownItem",{attrs:{name:"export"}},[e._v("导出数据")])],1)],1)]},proxy:!0}])}),n("vxe-table",{ref:"xTable",attrs:{border:"",resizable:"","show-overflow":"","keep-source":"","highlight-hover-row":"","export-config":"",height:"460",loading:e.loading,data:e.tableData,"edit-rules":e.validRules,"edit-config":{trigger:"click",mode:"row",showStatus:!0}},on:{"edit-actived":e.editActivedEvent,"edit-closed":e.editClosedEvent}},[n("vxe-table-column",{attrs:{type:"checkbox",width:"60",fixed:"left"}}),n("vxe-table-column",{attrs:{type:"seq",width:"60",fixed:"left"}}),n("vxe-table-column",{attrs:{field:"name",title:"Input","min-width":"140",fixed:"left","edit-render":{name:"Input"}}}),n("vxe-table-column",{attrs:{field:"role",title:"AutoComplete","min-width":"160","edit-render":{name:"AutoComplete",props:{data:e.restaurants,filterMethod:e.roleFilterMethod}}}}),n("vxe-table-column",{attrs:{field:"age",title:"InputNumber",width:"140","edit-render":{name:"InputNumber",props:{max:35,min:18}}}}),n("vxe-table-column",{attrs:{field:"sex",title:"Select",width:"140","edit-render":{name:"Select",options:e.sexList}}}),n("vxe-table-column",{attrs:{field:"sexList",title:"Select multiple",width:"180","edit-render":{name:"Select",options:e.sexList,props:{multiple:!0}}}}),n("vxe-table-column",{attrs:{field:"state",title:"Select",width:"140","edit-render":{name:"Select",options:e.stateOptions,props:{remote:!0,filterable:!0,loading:e.stateloading,remoteMethod:e.remoteStateMethod}}}}),n("vxe-table-column",{attrs:{field:"region",title:"Cascader",width:"200","edit-render":{name:"Cascader",props:{data:e.regionList}}}}),n("vxe-table-column",{attrs:{field:"date",title:"DatePicker",width:"200","edit-render":{name:"DatePicker",props:{type:"date",format:"yyyy/MM/dd"}}}}),n("vxe-table-column",{attrs:{field:"date6",title:"TimePicker",width:"200","edit-render":{name:"TimePicker",props:{type:"time"}}}}),n("vxe-table-column",{attrs:{field:"flag",title:"iSwitch",width:"100","cell-render":{name:"iSwitch"}}}),n("vxe-table-column",{attrs:{field:"rate",title:"Rate",width:"200",fixed:"right","cell-render":{name:"Rate"}}})],1),n("Page",{attrs:{"show-sizer":"","show-total":"","show-elevator":"","prev-text":"Previous","next-text":"Next","page-size-opts":[5,10,15,20,50,100,150,200],total:e.tablePage.totalResult,current:e.tablePage.currentPage},on:{"update:current":function(t){return e.$set(e.tablePage,"currentPage",t)},"on-page-size-change":e.handleSizeChange,"on-change":e.handleCurrentChange}}),n("p",{staticClass:"demo-code"},[e._v(e._s(e.$t("app.body.button.showCode")))]),n("pre",[e._v("    "),n("code",{staticClass:"xml"},[e._v(e._s(e.demoCodes[0]))]),e._v("\n    "),n("code",{staticClass:"javascript"},[e._v(e._s(e.demoCodes[1]))]),e._v("\n  ")])],1)},i=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("p",{staticClass:"tip"},[e._v(" 与 "),n("a",{staticClass:"link",attrs:{href:"https://github.com/x-extends/iview"}},[e._v("iview")]),e._v(" 组合渲染 + 使用分页"),n("br"),n("span",{staticClass:"red"},[e._v("（注：该示例仅供参考，具体逻辑请自行实现）")])])}],s=(n("d81d"),n("d3b7"),n("159b"),n("a630"),n("3ca3"),n("99af"),n("4de4"),n("ac1f"),n("5319"),n("628a")),r=n.n(s),o=n("1487"),l=n.n(o),d={data:function(){return{loading:!1,tableData:[],validRules:{name:[{required:!0,message:"app.body.valid.rName"},{min:3,max:50,message:"名称长度在 3 到 50 个字符"}],sex:[{required:!0,message:"性别必须填写"}]},sexList:[],regionList:[],stateList:[],stateOptions:[],stateloading:!1,states:["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],restaurants:["前端","后端","开发","测试"],tablePage:{currentPage:1,pageSize:10,totalResult:0},formData:{name:"",role:"",sex:null,age:null,region:[],date:null,date6:null,flag:!1,rate:0,flag1:"",checkedList:[]},demoCodes:['\n        <vxe-form :data="formData" title-width="120" title-align="right" @submit="searchEvent" @reset="searchEvent">\n          <vxe-form-item field="name" title="Input" span="8" :title-prefix="{ message: \'帮助信息！！！\', icon: \'fa fa-exclamation-circle\' }" :item-render="{name: \'Input\'}"></vxe-form-item>\n          <vxe-form-item field="role" title="AutoComplete" span="8" :item-render="{name: \'AutoComplete\', props: {data: restaurants, filterMethod: roleFilterMethod}}"></vxe-form-item>\n          <vxe-form-item field="age" title="InputNumber" span="8" :item-render="{name: \'InputNumber\'}"></vxe-form-item>\n          <vxe-form-item field="sex" title="Select" span="8" :item-render="{name: \'Select\', options: sexList}"></vxe-form-item>\n          <vxe-form-item field="region" title="Cascader" span="8" :item-render="{name: \'Cascader\', props: {data: regionList}}"></vxe-form-item>\n          <vxe-form-item field="date" title="DatePicker" span="8" :item-render="{name: \'DatePicker\', props: {type: \'date\', format: \'yyyy/MM/dd\'}}"></vxe-form-item>\n          <vxe-form-item field="date6" title="TimePicker" span="8" folding :item-render="{name: \'TimePicker\', props: {type: \'time\'}}"></vxe-form-item>\n          <vxe-form-item field="flag" title="iSwitch" span="8" folding :item-render="{name: \'iSwitch\'}"></vxe-form-item>\n          <vxe-form-item field="rate" title="Rate" span="8" folding :item-render="{name: \'Rate\'}"></vxe-form-item>\n          <vxe-form-item field="flag1" title="Radio" span="8" folding :item-render="{name: \'Radio\', options: [{label: \'是\', value: \'Y\'}, {label: \'否\', value: \'N\'}]}"></vxe-form-item>\n          <vxe-form-item field="checkedList" title="Checkbox" span="8" folding :item-render="{name: \'Checkbox\', options: [{label: \'北京\', value: \'beijing\'}, {label: \'深圳\', value: \'shenzhen\'}, {label: \'上海\', value: \'shanghai\'}]}" :visible-method="visibleMethod"></vxe-form-item>\n          <vxe-form-item span="24" align="center" collapse-node :item-render="{name: \'ElButtons\', children: [{ content: \'查询\', props: {type: \'primary\', nativeType: \'submit\'} }, { content: \'重置\', props: {nativeType: \'reset\'} }]}"></vxe-form-item>\n        </vxe-form>\n\n        <vxe-toolbar export print custom>\n          <template v-slot:buttons>\n            <Button @click="insertEvent">新增</Button>\n            <Button @click="saveEvent">保存</Button>\n            <Button @click="validEvent">校验</Button>\n            <Dropdown @on-click="dropdownMenuEvent">\n              <Button>\n                操作<Icon type="ios-arrow-down"></Icon>\n              </Button >\n              <DropdownMenu slot="list">\n                <DropdownItem name="remove">删除选中</DropdownItem>\n                <DropdownItem name="export">导出数据</DropdownItem>\n              </DropdownMenu>\n          </Dropdown>\n          </template>\n        </vxe-toolbar>\n\n        <vxe-table\n          border\n          resizable\n          show-overflow\n          keep-source\n          highlight-hover-row\n          export-config\n          ref="xTable"\n          height="460"\n          :loading="loading"\n          :data="tableData"\n          :edit-rules="validRules"\n          :edit-config="{trigger: \'click\', mode: \'row\', showStatus: true}"\n          @edit-actived="editActivedEvent"\n          @edit-closed="editClosedEvent">\n          <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>\n          <vxe-table-column type="seq" width="60" fixed="left"></vxe-table-column>\n          <vxe-table-column field="name" title="Input" min-width="140" fixed="left" :edit-render="{name: \'Input\'}"></vxe-table-column>\n          <vxe-table-column field="role" title="AutoComplete" min-width="160" :edit-render="{name: \'AutoComplete\', props: {data: restaurants, filterMethod: roleFilterMethod}}"></vxe-table-column>\n          <vxe-table-column field="age" title="InputNumber" width="140" :edit-render="{name: \'InputNumber\', props: {max: 35, min: 18}}"></vxe-table-column>\n          <vxe-table-column field="sex" title="Select" width="140" :edit-render="{name: \'Select\', options: sexList}"></vxe-table-column>\n          <vxe-table-column field="sexList" title="Select multiple" width="180" :edit-render="{name: \'Select\', options: sexList, props: {multiple: true}}"></vxe-table-column>\n          <vxe-table-column field="state" title="Select" width="140" :edit-render="{name: \'Select\', options: stateOptions, props: {remote: true, filterable: true, loading: stateloading, remoteMethod: remoteStateMethod}}"></vxe-table-column>\n          <vxe-table-column field="region" title="Cascader" width="200" :edit-render="{name: \'Cascader\', props: {data: regionList}}"> </vxe-table-column>\n          <vxe-table-column field="date" title="DatePicker" width="200" :edit-render="{name: \'DatePicker\', props: {type: \'date\', format: \'yyyy/MM/dd\'}}"></vxe-table-column>\n          <vxe-table-column field="date6" title="TimePicker" width="200" :edit-render="{name: \'TimePicker\', props: {type: \'time\'}}"></vxe-table-column>\n          <vxe-table-column field="flag" title="iSwitch" width="100" :cell-render="{name: \'iSwitch\'}"></vxe-table-column>\n          <vxe-table-column field="rate" title="Rate" width="200" fixed="right" :cell-render="{name: \'Rate\'}"></vxe-table-column>\n        </vxe-table>\n\n        <Page\n          show-sizer\n          show-total\n          show-elevator\n          prev-text="Previous"\n          next-text="Next"\n          :page-size-opts="[5, 10, 15, 20, 50, 100, 150, 200]"\n          :total="tablePage.totalResult"\n          :current.sync="tablePage.currentPage"\n          @on-page-size-change="handleSizeChange"\n          @on-change="handleCurrentChange"/>\n        ',"\n        export default {\n          data () {\n            return {\n              loading: false,\n              tableData: [],\n              validRules: {\n                name: [\n                  { required: true, message: 'app.body.valid.rName' },\n                  { min: 3, max: 50, message: '名称长度在 3 到 50 个字符' }\n                ],\n                sex: [\n                  { required: true, message: '性别必须填写' }\n                ]\n              },\n              sexList: [],\n              regionList: [],\n              stateList: [],\n              stateOptions: [],\n              stateloading: false,\n              states: [\n                'Alabama', 'Alaska', 'Arizona',\n                'Arkansas', 'California', 'Colorado',\n                'Connecticut', 'Delaware', 'Florida',\n                'Georgia', 'Hawaii', 'Idaho', 'Illinois',\n                'Indiana', 'Iowa', 'Kansas', 'Kentucky',\n                'Louisiana', 'Maine', 'Maryland',\n                'Massachusetts', 'Michigan', 'Minnesota',\n                'Mississippi', 'Missouri', 'Montana',\n                'Nebraska', 'Nevada', 'New Hampshire',\n                'New Jersey', 'New Mexico', 'New York',\n                'North Carolina', 'North Dakota', 'Ohio',\n                'Oklahoma', 'Oregon', 'Pennsylvania',\n                'Rhode Island', 'South Carolina',\n                'South Dakota', 'Tennessee', 'Texas',\n                'Utah', 'Vermont', 'Virginia',\n                'Washington', 'West Virginia', 'Wisconsin',\n                'Wyoming'\n              ],\n              restaurants: ['前端', '后端', '开发', '测试'],\n              tablePage: {\n                currentPage: 1,\n                pageSize: 10,\n                totalResult: 0\n              },\n              formData: {\n                name: '',\n                role: '',\n                sex: null,\n                age: null,\n                region: [],\n                date: null,\n                date6: null,\n                flag: false,\n                rate: 0,\n                flag1: '',\n                checkedList: []\n              }\n            }\n          },\n          created () {\n            this.stateList = this.states.map(item => {\n              return { value: `value:${item}`, label: `label:${item}` }\n            })\n            this.findList()\n            this.findSexList()\n            this.findRegionList()\n          },\n          methods: {\n            findList () {\n              // 模拟后台数据\n              this.loading = true\n              XEAjax.get(`/api/user/page/list/${this.tablePage.pageSize}/${this.tablePage.currentPage}`, this.formData).then(({ page, result }) => {\n                this.tableData = result\n                this.tablePage.totalResult = page.totalResult\n                this.loading = false\n                this.updateStateList()\n              }).catch(e => {\n                this.loading = false\n              })\n            },\n            findSexList () {\n              return XEAjax.get('/api/conf/sex/list').then(data => {\n                this.sexList = data\n                return data\n              })\n            },\n            findRegionList () {\n              return XEAjax.get('/api/conf/region/list').then(data => {\n                this.regionList = data\n                return data\n              })\n            },\n            remoteStateMethod (query) {\n              if (query !== '') {\n                this.stateloading = true\n                setTimeout(() => {\n                  this.stateloading = false\n                  this.stateOptions = this.stateList.filter(item => {\n                    return item.label.toLowerCase()\n                      .indexOf(query.toLowerCase()) > -1\n                  })\n                }, 200)\n              } else {\n                this.stateOptions = []\n              }\n            },\n            // 模拟后台查当前页出远程下拉值\n            updateStateList () {\n              setTimeout(() => {\n                let defaultStateList = []\n                this.tableData.forEach(row => {\n                  if (row.state && !defaultStateList.some(item => item.value === row.state)) {\n                    defaultStateList.push({\n                      label: row.state.replace('value', 'label'),\n                      value: row.state\n                    })\n                  }\n                })\n                this._defaultStateList = defaultStateList\n                this.stateOptions = defaultStateList\n              }, 100)\n            },\n            editActivedEvent ({ row }) {\n              // 当激活编辑时，重新更新远程下拉值\n              if (row.state) {\n                if (row._stateOptions) {\n                  this.stateOptions = row._stateOptions\n                } else {\n                  // 如果是第一次点击则使用默认的列表\n                  this.stateOptions = this._defaultStateList\n                }\n              } else {\n                this.stateOptions = []\n              }\n            },\n            editClosedEvent ({ row }) {\n              // 当激活编辑时，记录当前远程下拉值\n              row._stateOptions = this.stateOptions\n            },\n            insertEvent () {\n              let record = {\n                role: '',\n                age: 18,\n                region: [],\n                flag: false,\n                rate: 2\n              }\n              this.$refs.xTable.insert(record).then(({ row }) => this.$refs.xTable.setActiveRow(row))\n            },\n            saveEvent () {\n              let { insertRecords, removeRecords, updateRecords } = this.$refs.xTable.getRecordset()\n              if (insertRecords.length || removeRecords.length || updateRecords.length) {\n                this.$Message.success('保存成功！')\n                this.searchEvent()\n              } else {\n                this.$Message.info('数据未改动！')\n              }\n            },\n            validEvent () {\n              this.$refs.xTable.validate((errMap) => {\n                if (errMap) {\n                  this.$XModal.message({ status: 'error', message: '校验不通过！' })\n                } else {\n                  this.$XModal.message({ status: 'success', message: '校验成功！' })\n                }\n              })\n            },\n            dropdownMenuEvent (name) {\n              switch (name) {\n                case 'remove': {\n                  let selectRecords = this.$refs.xTable.getCheckboxRecords()\n                  if (selectRecords.length) {\n                    this.$refs.xTable.removeCheckboxRow()\n                  } else {\n                    this.$Message.info('请至少选择一条数据！')\n                  }\n                  break\n                }\n                case 'export': {\n                  this.$refs.xTable.exportData()\n                  break\n                }\n              }\n            },\n            searchEvent () {\n              this.tablePage.currentPage = 1\n              this.findList()\n            },\n            handleSizeChange (pageSize) {\n              this.tablePage.pageSize = pageSize\n              this.searchEvent()\n            },\n            handleCurrentChange (currentPage) {\n              this.tablePage.currentPage = currentPage\n              this.findList()\n            },\n            visibleMethod ({ data }) {\n              return data.flag1 === 'Y'\n            },\n            roleFilterMethod  (value, option) {\n              return option.toUpperCase().indexOf(value.toUpperCase()) !== -1\n            }\n          }\n        }\n        "]}},created:function(){this.stateList=this.states.map((function(e){return{value:"value:".concat(e),label:"label:".concat(e)}})),this.findList(),this.findSexList(),this.findRegionList()},mounted:function(){Array.from(this.$el.querySelectorAll("pre code")).forEach((function(e){l.a.highlightBlock(e)}))},methods:{findList:function(){var e=this;this.loading=!0,r.a.get("/api/user/page/list/".concat(this.tablePage.pageSize,"/").concat(this.tablePage.currentPage),this.formData).then((function(t){var n=t.page,a=t.result;e.tableData=a,e.tablePage.totalResult=n.totalResult,e.loading=!1,e.updateStateList()})).catch((function(){e.loading=!1}))},findSexList:function(){var e=this;return r.a.get("/api/conf/sex/list").then((function(t){return e.sexList=t,t}))},findRegionList:function(){var e=this;return r.a.get("/api/conf/region/list").then((function(t){return e.regionList=t,t}))},remoteStateMethod:function(e){var t=this;""!==e?(this.stateloading=!0,setTimeout((function(){t.stateloading=!1,t.stateOptions=t.stateList.filter((function(t){return t.label.toLowerCase().indexOf(e.toLowerCase())>-1}))}),200)):this.stateOptions=[]},updateStateList:function(){var e=this;setTimeout((function(){var t=[];e.tableData.forEach((function(e){e.state&&!t.some((function(t){return t.value===e.state}))&&t.push({label:e.state.replace("value","label"),value:e.state})})),e._defaultStateList=t,e.stateOptions=t}),100)},editActivedEvent:function(e){var t=e.row;t.state?t._stateOptions?this.stateOptions=t._stateOptions:this.stateOptions=this._defaultStateList:this.stateOptions=[]},editClosedEvent:function(e){var t=e.row;t._stateOptions=this.stateOptions},insertEvent:function(){var e=this,t={role:"",age:18,region:[],flag:!1,rate:2};this.$refs.xTable.insert(t).then((function(t){var n=t.row;return e.$refs.xTable.setActiveRow(n)}))},saveEvent:function(){var e=this.$refs.xTable.getRecordset(),t=e.insertRecords,n=e.removeRecords,a=e.updateRecords;t.length||n.length||a.length?(this.$Message.success("保存成功！"),this.searchEvent()):this.$Message.info("数据未改动！")},validEvent:function(){var e=this;this.$refs.xTable.validate((function(t){t?e.$XModal.message({status:"error",message:"校验不通过！"}):e.$XModal.message({status:"success",message:"校验成功！"})}))},dropdownMenuEvent:function(e){switch(e){case"remove":var t=this.$refs.xTable.getCheckboxRecords();t.length?this.$refs.xTable.removeCheckboxRow():this.$Message.info("请至少选择一条数据！");break;case"export":this.$refs.xTable.exportData();break}},searchEvent:function(){this.tablePage.currentPage=1,this.findList()},handleSizeChange:function(e){this.tablePage.pageSize=e,this.searchEvent()},handleCurrentChange:function(e){this.tablePage.currentPage=e,this.findList()},visibleMethod:function(e){var t=e.data;return"Y"===t.flag1},roleFilterMethod:function(e,t){return-1!==t.toUpperCase().indexOf(e.toUpperCase())}}},m=d,c=n("2877"),u=Object(c["a"])(m,a,i,!1,null,null,null);t["default"]=u.exports}}]);