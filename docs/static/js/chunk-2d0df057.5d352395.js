(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0df057"],{"87ac":function(e,t,n){"use strict";n.r(t);n("b0c0");var d=n("7a23"),a={class:"tip"},i=Object(d["createTextVNode"])("通过 "),o=Object(d["createTextVNode"])("."),r=Object(d["createTextVNode"])(" 方法来判断单元格是否禁用，禁用后不可编辑"),s={class:"demo-code"},l=Object(d["createTextVNode"])("      "),c=Object(d["createTextVNode"])("\r\n      "),m=Object(d["createTextVNode"])("\r\n    "),u=Object(d["createElementVNode"])("p",{class:"tip"},"禁用第二行编辑",-1),p={class:"demo-code"},x=Object(d["createTextVNode"])("      "),b=Object(d["createTextVNode"])("\r\n      "),g=Object(d["createTextVNode"])("\r\n    ");function v(e,t,n,v,O,f){var V=Object(d["resolveComponent"])("table-api-link"),h=Object(d["resolveComponent"])("vxe-input"),j=Object(d["resolveComponent"])("vxe-grid"),w=Object(d["resolveComponent"])("pre-code");return Object(d["openBlock"])(),Object(d["createElementBlock"])("div",null,[Object(d["createElementVNode"])("p",a,[i,Object(d["createVNode"])(V,{prop:"edit-config"}),o,Object(d["createVNode"])(V,{prop:"activeMethod"}),r]),Object(d["createVNode"])(j,Object(d["mergeProps"])(e.gridOptions1,{onEditDisabled:e.editDisabledEvent}),{name_edit:Object(d["withCtx"])((function(e){var t=e.row;return[Object(d["createVNode"])(h,{modelValue:t.name,"onUpdate:modelValue":function(e){return t.name=e}},null,8,["modelValue","onUpdate:modelValue"])]})),sex_edit:Object(d["withCtx"])((function(e){var t=e.row;return[Object(d["createVNode"])(h,{modelValue:t.sex,"onUpdate:modelValue":function(e){return t.sex=e}},null,8,["modelValue","onUpdate:modelValue"])]})),age_edit:Object(d["withCtx"])((function(e){var t=e.row;return[Object(d["createVNode"])(h,{modelValue:t.age,"onUpdate:modelValue":function(e){return t.age=e}},null,8,["modelValue","onUpdate:modelValue"])]})),address_edit:Object(d["withCtx"])((function(e){var t=e.row;return[Object(d["createVNode"])(h,{modelValue:t.address,"onUpdate:modelValue":function(e){return t.address=e}},null,8,["modelValue","onUpdate:modelValue"])]})),_:1},16,["onEditDisabled"]),Object(d["createElementVNode"])("p",s,Object(d["toDisplayString"])(e.$t("app.body.button.showCode")),1),Object(d["createElementVNode"])("pre",null,[l,Object(d["createVNode"])(w,{class:"xml"},{default:Object(d["withCtx"])((function(){return[Object(d["createTextVNode"])(Object(d["toDisplayString"])(e.demoCodes[0]),1)]})),_:1}),c,Object(d["createVNode"])(w,{class:"typescript"},{default:Object(d["withCtx"])((function(){return[Object(d["createTextVNode"])(Object(d["toDisplayString"])(e.demoCodes[1]),1)]})),_:1}),m]),u,Object(d["createVNode"])(j,Object(d["mergeProps"])(e.gridOptions2,{onEditDisabled:e.editDisabledEvent}),{name_edit:Object(d["withCtx"])((function(e){var t=e.row;return[Object(d["createVNode"])(h,{modelValue:t.name,"onUpdate:modelValue":function(e){return t.name=e}},null,8,["modelValue","onUpdate:modelValue"])]})),sex_edit:Object(d["withCtx"])((function(e){var t=e.row;return[Object(d["createVNode"])(h,{modelValue:t.sex,"onUpdate:modelValue":function(e){return t.sex=e}},null,8,["modelValue","onUpdate:modelValue"])]})),age_edit:Object(d["withCtx"])((function(e){var t=e.row;return[Object(d["createVNode"])(h,{modelValue:t.age,"onUpdate:modelValue":function(e){return t.age=e}},null,8,["modelValue","onUpdate:modelValue"])]})),address_edit:Object(d["withCtx"])((function(e){var t=e.row;return[Object(d["createVNode"])(h,{modelValue:t.address,"onUpdate:modelValue":function(e){return t.address=e}},null,8,["modelValue","onUpdate:modelValue"])]})),_:1},16,["onEditDisabled"]),Object(d["createElementVNode"])("p",p,Object(d["toDisplayString"])(e.$t("app.body.button.showCode")),1),Object(d["createElementVNode"])("pre",null,[x,Object(d["createVNode"])(w,{class:"xml"},{default:Object(d["withCtx"])((function(){return[Object(d["createTextVNode"])(Object(d["toDisplayString"])(e.demoCodes[2]),1)]})),_:1}),b,Object(d["createVNode"])(w,{class:"typescript"},{default:Object(d["withCtx"])((function(){return[Object(d["createTextVNode"])(Object(d["toDisplayString"])(e.demoCodes[3]),1)]})),_:1}),g])])}var O=Object(d["defineComponent"])({setup:function(){var e=Object(d["reactive"])({border:!0,showOverflow:!0,editConfig:{trigger:"click",mode:"cell",activeMethod:function(e){var t=e.columnIndex;return 1!==t}},columns:[{type:"seq",width:50},{field:"name",title:"Name",editRender:{},slots:{edit:"name_edit"}},{field:"sex",title:"Sex",editRender:{},slots:{edit:"sex_edit"}},{field:"age",title:"Age",editRender:{},slots:{edit:"age_edit"}},{field:"address",title:"Address",editRender:{},slots:{edit:"address_edit"}}],data:[{id:10001,name:"Test1",nickname:"T1",role:"Develop",sex:"Man",age:28,address:"Shenzhen"},{id:10002,name:"Test2",nickname:"T2",role:"Test",sex:"Women",age:22,address:"Guangzhou"},{id:10003,name:"Test3",nickname:"T3",role:"PM",sex:"Man",age:32,address:"Shanghai"},{id:10004,name:"Test4",nickname:"T4",role:"Designer",sex:"Women",age:23,address:"Shenzhen"},{id:10005,name:"Test5",nickname:"T5",role:"Develop",sex:"Women",age:30,address:"Shanghai"}]}),t=function(){console.log("禁止编辑")},n=Object(d["ref"])({}),a=Object(d["reactive"])({border:!0,showOverflow:!0,editConfig:{trigger:"click",mode:"cell",activeMethod:function(e){var t=e.rowIndex;return 1!==t}},columns:[{type:"seq",width:50},{field:"name",title:"Name",editRender:{},slots:{edit:"name_edit"}},{field:"sex",title:"Sex",editRender:{},slots:{edit:"sex_edit"}},{field:"age",title:"Age",editRender:{},slots:{edit:"age_edit"}},{field:"address",title:"Address",editRender:{},slots:{edit:"address_edit"}}],data:[{id:10001,name:"Test1",nickname:"T1",role:"Develop",sex:"Man",age:28,address:"Shenzhen"},{id:10002,name:"Test2",nickname:"T2",role:"Test",sex:"Women",age:22,address:"Guangzhou"},{id:10003,name:"xest3",nickname:"T3",role:"PM",sex:"Man",age:32,address:"Shanghai"},{id:10004,name:"Test4",nickname:"T4",role:"Designer",sex:"Women",age:23,address:"Shenzhen"},{id:10005,name:"Test5",nickname:"T5",role:"Develop",sex:"Women",age:30,address:"Shanghai"}]});return{gridOptions1:e,editDisabledEvent:t,xGrid2:n,gridOptions2:a,demoCodes:['\n        <vxe-grid v-bind="gridOptions1" @edit-disabled="editDisabledEvent">\n          <template #name_edit="{ row }">\n            <vxe-input v-model="row.name"></vxe-input>\n          </template>\n          <template #sex_edit="{ row }">\n            <vxe-input v-model="row.sex"></vxe-input>\n          </template>\n          <template #age_edit="{ row }">\n            <vxe-input v-model="row.age"></vxe-input>\n          </template>\n          <template #address_edit="{ row }">\n            <vxe-input v-model="row.address"></vxe-input>\n          </template>\n        </vxe-grid>\n        ',"\n        import { defineComponent, reactive } from 'vue'\n        import { VxeGridProps, VxeGridEvents } from 'vxe-table'\n\n        export default defineComponent({\n          setup () {\n            const gridOptions1 = reactive({\n              border: true,\n              showOverflow: true,\n              editConfig: {\n                trigger: 'click',\n                mode: 'cell',\n                activeMethod ({ columnIndex }) {\n                  if (columnIndex === 1) {\n                    return false\n                  }\n                  return true\n                }\n              },\n              columns: [\n                { type: 'seq', width: 50 },\n                { field: 'name', title: 'Name', editRender: {}, slots: { edit: 'name_edit' } },\n                { field: 'sex', title: 'Sex', editRender: {}, slots: { edit: 'sex_edit' } },\n                { field: 'age', title: 'Age', editRender: {}, slots: { edit: 'age_edit' } },\n                { field: 'address', title: 'Address', editRender: {}, slots: { edit: 'address_edit' } }\n              ],\n              data: [\n                { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },\n                { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },\n                { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },\n                { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'Shenzhen' },\n                { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' }\n              ]\n            })\n\n            const editDisabledEvent: VxeGridEvents.EditDisabled = () => {\n              console.log('禁止编辑')\n            }\n\n            return {\n              gridOptions1,\n              editDisabledEvent\n            }\n          }\n        })\n        ",'\n        <vxe-grid ref="xGrid2" v-bind="gridOptions2" @edit-actived="editDisabledEvent">\n          <template #name_edit="{ row }">\n            <vxe-input v-model="row.name"></vxe-input>\n          </template>\n          <template #sex_edit="{ row }">\n            <vxe-input v-model="row.sex"></vxe-input>\n          </template>\n          <template #age_edit="{ row }">\n            <vxe-input v-model="row.age"></vxe-input>\n          </template>\n          <template #address_edit="{ row }">\n            <vxe-input v-model="row.address"></vxe-input>\n          </template>\n        </vxe-grid>\n        ',"\n        import { defineComponent, reactive, ref } from 'vue'\n        import { VxeGridProps, VxeGridInstance, VxeGridEvents } from 'vxe-table'\n\n        export default defineComponent({\n          setup () {\n            const xGrid2 = ref({} as VxeGridInstance)\n\n            const gridOptions2 = reactive<VxeGridProps>({\n              border: true,\n              showOverflow: true,\n              editConfig: {\n                trigger: 'click',\n                mode: 'cell',\n                activeMethod ({ rowIndex }) {\n                  if (rowIndex === 1) {\n                    return false\n                  }\n                  return true\n                }\n              },\n              columns: [\n                { type: 'seq', width: 50 },\n                { field: 'name', title: 'Name', editRender: {}, slots: { edit: 'name_edit' } },\n                { field: 'sex', title: 'Sex', editRender: {}, slots: { edit: 'sex_edit' } },\n                { field: 'age', title: 'Age', editRender: {}, slots: { edit: 'age_edit' } },\n                { field: 'address', title: 'Address', editRender: {}, slots: { edit: 'address_edit' } }\n              ],\n              data: [\n                { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },\n                { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },\n                { id: 10003, name: 'xest3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },\n                { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'Shenzhen' },\n                { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' }\n              ]\n            })\n\n            const editDisabledEvent: VxeGridEvents.EditDisabled = () => {\n              console.log('禁止编辑')\n            }\n\n            return {\n              xGrid2,\n              gridOptions2,\n              editDisabledEvent\n            }\n          }\n        })\n        "]}}}),f=n("6b0d"),V=n.n(f);const h=V()(O,[["render",v]]);t["default"]=h}}]);