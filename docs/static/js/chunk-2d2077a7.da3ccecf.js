(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2077a7"],{a167:function(e,t,n){"use strict";n.r(t);n("b0c0");var a=n("7a23"),o={class:"tip"},i=Object(a["createTextVNode"])("表单，可以通过设置 "),r=Object(a["createTextVNode"])("={data, items} 渲染表单"),s={class:"demo-code"},l=Object(a["createTextVNode"])("      "),d=Object(a["createTextVNode"])("\r\n      "),c=Object(a["createTextVNode"])("\r\n    ");function m(e,t,n,m,u,p){var f=Object(a["resolveComponent"])("grid-api-link"),b=Object(a["resolveComponent"])("vxe-input"),x=Object(a["resolveComponent"])("vxe-option"),v=Object(a["resolveComponent"])("vxe-select"),g=Object(a["resolveComponent"])("vxe-button"),O=Object(a["resolveComponent"])("vxe-grid"),j=Object(a["resolveComponent"])("pre-code");return Object(a["openBlock"])(),Object(a["createElementBlock"])("div",null,[Object(a["createElementVNode"])("p",o,[i,Object(a["createVNode"])(f,{prop:"form-config"}),r]),Object(a["createVNode"])(O,Object(a["mergeProps"])(e.gridOptions,Object(a["toHandlers"])(e.gridEvents)),{name_item:Object(a["withCtx"])((function(e){var t=e.data;return[Object(a["createVNode"])(b,{modelValue:t.name,"onUpdate:modelValue":function(e){return t.name=e},type:"text",placeholder:"请输入名称"},null,8,["modelValue","onUpdate:modelValue"])]})),sex_item:Object(a["withCtx"])((function(t){var n=t.data;return[Object(a["createVNode"])(v,{modelValue:n.sex,"onUpdate:modelValue":function(e){return n.sex=e},transfer:""},{default:Object(a["withCtx"])((function(){return[(Object(a["openBlock"])(!0),Object(a["createElementBlock"])(a["Fragment"],null,Object(a["renderList"])(e.sexList1,(function(e){return Object(a["openBlock"])(),Object(a["createBlock"])(x,{key:e.value,value:e.value,label:e.label},null,8,["value","label"])})),128))]})),_:2},1032,["modelValue","onUpdate:modelValue"])]})),operate_item:Object(a["withCtx"])((function(){return[Object(a["createVNode"])(g,{type:"submit",status:"primary",content:"查询"}),Object(a["createVNode"])(g,{type:"reset",content:"重置"})]})),_:1},16),Object(a["createElementVNode"])("p",s,Object(a["toDisplayString"])(e.$t("app.body.button.showCode")),1),Object(a["createElementVNode"])("pre",null,[l,Object(a["createVNode"])(j,{class:"xml"},{default:Object(a["withCtx"])((function(){return[Object(a["createTextVNode"])(Object(a["toDisplayString"])(e.demoCodes[0]),1)]})),_:1}),d,Object(a["createVNode"])(j,{class:"javascript"},{default:Object(a["withCtx"])((function(){return[Object(a["createTextVNode"])(Object(a["toDisplayString"])(e.demoCodes[1]),1)]})),_:1}),c])])}var u=Object(a["defineComponent"])({setup:function(){var e=Object(a["reactive"])({resizable:!0,border:!0,showOverflow:!0,loading:!1,height:400,exportConfig:{},formConfig:{data:{name:"",sex:""},items:[{field:"name",title:"Name",slots:{default:"name_item"}},{field:"sex",title:"性别",titlePrefix:{message:"帮助信息！！！",icon:"fa fa-info-circle"},slots:{default:"sex_item"}},{slots:{default:"operate_item"}}]},toolbarConfig:{export:!0,custom:!0},columns:[{type:"seq",width:60},{type:"checkbox",width:60},{field:"name",title:"Name"},{field:"nickname",title:"Nickname"},{field:"age",title:"Age"},{field:"sex",title:"Sex"},{field:"address",title:"Address",showOverflow:!0}],data:[]}),t=function(){e.loading=!0,setTimeout((function(){e.data=[{id:10001,name:"Test1",nickname:"T1",role:"Develop",sex:"1",age:28,address:"Shenzhen"},{id:10002,name:"Test2",nickname:"T2",role:"Test",sex:"0",age:22,address:"Guangzhou"},{id:10003,name:"Test3",nickname:"T3",role:"PM",sex:"1",age:32,address:"Shanghai"},{id:10004,name:"Test4",nickname:"T4",role:"Designer",sex:"0 ",age:23,address:"Shenzhen"},{id:10005,name:"Test5",nickname:"T5",role:"Develop",sex:"0 ",age:30,address:"Shanghai"}],e.loading=!1}),500)},n={formSubmit:function(){t()}};t();var o=Object(a["ref"])([]);return setTimeout((function(){o.value=[{value:"1",label:"男"},{value:"0",label:"女"}]}),200),{gridOptions:e,gridEvents:n,sexList1:o,demoCodes:['\n        <vxe-grid v-bind="gridOptions" v-on="gridEvents">\n          <template #name_item="{ data }">\n            <vxe-input v-model="data.name" type="text" placeholder="请输入名称"></vxe-input>\n          </template>\n          <template #sex_item="{ data }">\n            <vxe-select v-model="data.sex" transfer>\n              <vxe-option v-for="item in sexList1" :key="item.value" :value="item.value" :label="item.label"></vxe-option>\n            </vxe-select>\n          </template>\n          <template #operate_item>\n            <vxe-button type="submit" status="primary" content="查询"></vxe-button>\n            <vxe-button type="reset" content="重置"></vxe-button>\n          </template>\n        </vxe-grid>\n        ',"\n        import { defineComponent, reactive, ref } from 'vue'\n        import { VxeGridProps, VxeGridListeners } from 'vxe-table'\n\n        export default defineComponent({\n          setup () {\n            const gridOptions = reactive<VxeGridProps>({\n              resizable: true,\n              border: true,\n              showOverflow: true,\n              loading: false,\n              height: 400,\n              exportConfig: {},\n              formConfig: {\n                data: {\n                  name: '',\n                  sex: ''\n                },\n                items: [\n                  { field: 'name', title: 'Name', slots: { default: 'name_item' } },\n                  { field: 'sex', title: '性别', titlePrefix: { message: '帮助信息！！！', icon: 'fa fa-info-circle' }, slots: { default: 'sex_item' } },\n                  { slots: { default: 'operate_item' } }\n                ]\n              },\n              toolbarConfig: {\n                export: true,\n                custom: true\n              },\n              columns: [\n                { type: 'seq', width: 60 },\n                { type: 'checkbox', width: 60 },\n                { field: 'name', title: 'Name' },\n                { field: 'nickname', title: 'Nickname' },\n                { field: 'age', title: 'Age' },\n                { field: 'sex', title: 'Sex' },\n                { field: 'address', title: 'Address', showOverflow: true }\n              ],\n              data: []\n            })\n\n            const findList = () => {\n              gridOptions.loading = true\n              setTimeout(() => {\n                gridOptions.data = [\n                  { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'Shenzhen' },\n                  { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou' },\n                  { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai' },\n                  { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: '0 ', age: 23, address: 'Shenzhen' },\n                  { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: '0 ', age: 30, address: 'Shanghai' }\n                ]\n                gridOptions.loading = false\n              }, 500)\n            }\n\n            const gridEvents: VxeGridListeners = {\n              formSubmit () {\n                findList()\n              }\n            }\n\n            findList()\n\n            const sexList1 = ref<any[]>([])\n\n            // 异步更新下拉选项\n            setTimeout(() => {\n              sexList1.value = [\n                { value: '1', label: '男' },\n                { value: '0', label: '女' }\n              ]\n            }, 200)\n\n            return {\n              gridOptions,\n              gridEvents,\n              sexList1\n            }\n          }\n        })\n        "]}}}),p=n("6b0d"),f=n.n(p);const b=f()(u,[["render",m]]);t["default"]=b}}]);