(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0df7c5"],{"89b0":function(e,t,n){"use strict";n.r(t);var o=n("7a23"),r={class:"tip"},c=Object(o["createTextVNode"])(" 虚拟滚动"),a=Object(o["createElementVNode"])("span",{class:"orange"},"（最大可以支撑 10w 列、30w 行）",-1),l=Object(o["createElementVNode"])("br",null,null,-1),d=Object(o["createTextVNode"])(" 高性能的虚拟渲染，默认情况下，如果设置了 "),i=Object(o["createTextVNode"])("、"),b=Object(o["createTextVNode"])(" 则会根据触发规则自动启用虚拟渲染，触发规则由 "),x=Object(o["createTextVNode"])("."),u=Object(o["createTextVNode"])(" | "),s=Object(o["createTextVNode"])("."),f=Object(o["createTextVNode"])(" 设置。虚拟滚动启用后只会渲染指定范围内的可视区数据，其他的数据将被卷去收起，当滚动到可视区时才被渲染出来"),m=Object(o["createElementVNode"])("br",null,null,-1),j={class:"red"},O=Object(o["createTextVNode"])("（注：启用虚拟滚动后："),h=Object(o["createTextVNode"])("，"),p=Object(o["createTextVNode"])("，"),N=Object(o["createTextVNode"])(" 参数将根据不同场景各自触发生效，无法取消；如果需要支持，将虚拟滚动关闭即可）"),w={class:"demo-code"},v=Object(o["createTextVNode"])("      "),V=Object(o["createTextVNode"])("\r\n      "),T=Object(o["createTextVNode"])("\r\n    "),A={class:"tip"},g=Object(o["createTextVNode"])(" 手动调优，对于低性能的浏览器可以通过设置 "),y=Object(o["createTextVNode"])(" 偏移量来缓解渲染次数，偏移量越大渲染次数就越少，但是每次渲染的耗时就越久"),C=Object(o["createElementVNode"])("br",null,null,-1),E=Object(o["createTextVNode"])(" 通过指定 "),k=Object(o["createTextVNode"])("={gt: 20} 或 "),D=Object(o["createTextVNode"])("={gt: 40} 适合的参数可以手动调优，如果设置 "),M=Object(o["createTextVNode"])("=false 则关闭虚拟滚动"),S=Object(o["createElementVNode"])("br",null,null,-1),$=Object(o["createTextVNode"])("      "),L=Object(o["createTextVNode"])("\r\n        | Arrow Up ↑ | 匀速向上滚动数据 |\r\n        | Arrow Down ↓ | 匀速向下滚动数据 |\r\n        | Arrow Left ← | 匀速向左滚动数据 |\r\n        | Arrow Right → | 匀速向右滚动数据 |\r\n        | Page Up | 向上翻页滚动 |\r\n        | Page Down | 向下翻页滚动 |\r\n        | Spacebar | 翻页滚动 |\r\n        | Home | 滚动到顶部 |\r\n        | End | 滚动到底部 |\r\n      "),_=Object(o["createTextVNode"])("\r\n    "),I={class:"demo-code"},U=Object(o["createTextVNode"])("      "),q=Object(o["createTextVNode"])("\r\n      "),X=Object(o["createTextVNode"])("\r\n    ");function R(e,t,n,R,B,J){var P=Object(o["resolveComponent"])("table-api-link"),z=Object(o["resolveComponent"])("vxe-column"),H=Object(o["resolveComponent"])("vxe-table"),F=Object(o["resolveComponent"])("pre-code");return Object(o["openBlock"])(),Object(o["createElementBlock"])("div",null,[Object(o["createElementVNode"])("p",r,[c,a,l,d,Object(o["createVNode"])(P,{prop:"height"}),i,Object(o["createVNode"])(P,{prop:"max-height"}),b,Object(o["createVNode"])(P,{prop:"scroll-x"}),x,Object(o["createVNode"])(P,{prop:"gt"}),u,Object(o["createVNode"])(P,{prop:"scroll-y"}),s,Object(o["createVNode"])(P,{prop:"gt"}),f,m,Object(o["createElementVNode"])("span",j,[O,Object(o["createVNode"])(P,{prop:"show-overflow"}),h,Object(o["createVNode"])(P,{prop:"show-header-overflow"}),p,Object(o["createVNode"])(P,{prop:"show-footer-overflow"}),N])]),Object(o["createVNode"])(H,{border:"","show-overflow":"","highlight-hover-row":"",ref:"xTable1",height:"300"},{default:Object(o["withCtx"])((function(){return[Object(o["createVNode"])(z,{type:"seq",width:"100"}),Object(o["createVNode"])(z,{field:"name",title:"Name",sortable:""}),Object(o["createVNode"])(z,{field:"role",title:"Role"}),Object(o["createVNode"])(z,{field:"sex",title:"Sex"})]})),_:1},512),Object(o["createElementVNode"])("p",w,Object(o["toDisplayString"])(e.$t("app.body.button.showCode")),1),Object(o["createElementVNode"])("pre",null,[v,Object(o["createVNode"])(F,{class:"xml"},{default:Object(o["withCtx"])((function(){return[Object(o["createTextVNode"])(Object(o["toDisplayString"])(e.demoCodes[0]),1)]})),_:1}),V,Object(o["createVNode"])(F,{class:"typescript"},{default:Object(o["withCtx"])((function(){return[Object(o["createTextVNode"])(Object(o["toDisplayString"])(e.demoCodes[1]),1)]})),_:1}),T]),Object(o["createElementVNode"])("p",A,[g,Object(o["createVNode"])(P,{prop:"oSize"}),y,C,E,Object(o["createVNode"])(P,{prop:"scroll-x"}),k,Object(o["createVNode"])(P,{prop:"scroll-y"}),D,Object(o["createVNode"])(P,{prop:"enabled"}),M,S]),Object(o["createVNode"])(H,{border:"","show-overflow":"","show-header-overflow":"","show-footer-overflow":"","show-footer":"",ref:"xTable2",height:"300","footer-method":e.footerMethod,"scroll-x":{gt:10},"scroll-y":{gt:100}},{default:Object(o["withCtx"])((function(){return[Object(o["createVNode"])(z,{type:"seq",width:"100"}),Object(o["createVNode"])(z,{field:"name",title:"Name",width:"150",sortable:""}),Object(o["createVNode"])(z,{field:"attr1",title:"Attr1",width:"100"}),Object(o["createVNode"])(z,{field:"attr2",title:"Attr2",width:"100"}),Object(o["createVNode"])(z,{field:"attr3",title:"Attr3",width:"100"}),Object(o["createVNode"])(z,{field:"attr4",title:"Attr4",width:"100"}),Object(o["createVNode"])(z,{field:"attr5",title:"Attr5",width:"150",sortable:""}),Object(o["createVNode"])(z,{field:"attr6",title:"Attr6",width:"100"}),Object(o["createVNode"])(z,{field:"attr7",title:"Attr7",width:"100"}),Object(o["createVNode"])(z,{field:"attr8",title:"Attr8",width:"200","show-overflow":""}),Object(o["createVNode"])(z,{field:"attr9",title:"Attr9",width:"100"}),Object(o["createVNode"])(z,{field:"attr10",title:"Attr10",width:"100"}),Object(o["createVNode"])(z,{field:"attr11",title:"Attr11",width:"100"}),Object(o["createVNode"])(z,{field:"attr12",title:"Attr12",width:"100"}),Object(o["createVNode"])(z,{field:"attr13",title:"Attr13",width:"150",sortable:""}),Object(o["createVNode"])(z,{field:"attr14",title:"Attr14",width:"100"}),Object(o["createVNode"])(z,{field:"attr15",title:"Attr15",width:"100"})]})),_:1},8,["footer-method"]),Object(o["createElementVNode"])("pre",null,[$,Object(o["createVNode"])(F,null,{default:Object(o["withCtx"])((function(){return[L]})),_:1}),_]),Object(o["createElementVNode"])("p",I,Object(o["toDisplayString"])(e.$t("app.body.button.showCode")),1),Object(o["createElementVNode"])("pre",null,[U,Object(o["createVNode"])(F,{class:"xml"},{default:Object(o["withCtx"])((function(){return[Object(o["createTextVNode"])(Object(o["toDisplayString"])(e.demoCodes[2]),1)]})),_:1}),q,Object(o["createVNode"])(F,{class:"typescript"},{default:Object(o["withCtx"])((function(){return[Object(o["createTextVNode"])(Object(o["toDisplayString"])(e.demoCodes[3]),1)]})),_:1}),X])])}n("d3b7"),n("159b"),n("a9e3"),n("d81d");var B=n("c695"),J=n.n(B),P=Object(o["defineComponent"])({setup:function(){for(var e=[],t=0;t<200;t++)e.push({name:"Test"+t,role:"Developer",sex:"男"});var n=Object(o["ref"])({});Object(o["onMounted"])((function(){Object(o["nextTick"])((function(){var t=n.value;t&&t.loadData(J.a.clone(e,!0))}))}));for(var r=[],c=0;c<200;c++)r.push({name:"Test"+c,attr1:c,attr2:"a2-"+c,attr3:"a3-"+c,attr4:"a4-"+c,attr5:"a5-"+c,attr6:"a6-"+c,attr7:"a7-"+c,attr8:"a8-"+c,attr9:"a9-"+c,attr10:"a10-"+c,attr11:"a11-"+c,attr12:"a12-"+c,attr13:"a13-"+c,attr14:"a14-"+c});var a=Object(o["ref"])({});Object(o["onMounted"])((function(){Object(o["nextTick"])((function(){var e=a.value;e&&e.loadData(J.a.clone(r,!0))}))}));var l=function(e,t){var n=0;return e.forEach((function(e){n+=Number(e[t])})),n},d=function(e){var t=e.columns,n=e.data,o=[t.map((function(e,t){if(0===t)return"平均";switch(e.property){case"attr1":return l(n,"attr1")}return"-"}))];return o};return{xTable1:n,xTable2:a,footerMethod:d,demoCodes:['\n        <vxe-table\n          border\n          show-overflow\n          highlight-hover-row\n          ref="xTable1"\n          height="300">\n          <vxe-column type="seq" width="100"></vxe-column>\n          <vxe-column field="name" title="Name" sortable></vxe-column>\n          <vxe-column field="role" title="Role"></vxe-column>\n          <vxe-column field="sex" title="Sex"></vxe-column>\n        </vxe-table>\n        ',"\n        import { defineComponent, ref, onMounted, nextTick } from 'vue'\n        import { VxeTableInstance } from 'vxe-table'\n        import XEUtils from 'xe-utils'\n\n        export default defineComponent({\n          setup () {\n            const mockList1: any = []\n            for (let index = 0; index < 200; index++) {\n              mockList1.push({\n                name: 'Test' + index,\n                role: 'Developer',\n                sex: '男'\n              })\n            }\n\n            const xTable1 = ref({} as VxeTableInstance)\n\n            onMounted(() => {\n              nextTick(() => {\n                const $table = xTable1.value\n                if ($table) {\n                  $table.loadData(XEUtils.clone(mockList1, true))\n                }\n              })\n            })\n\n            return {\n              xTable1\n            }\n          }\n        })\n        ",'\n        <vxe-table\n          border\n          show-overflow\n          show-header-overflow\n          show-footer-overflow\n          show-footer\n          ref="xTable2"\n          height="300"\n          :footer-method="footerMethod"\n          :scroll-x="{gt: 10}"\n          :scroll-y="{gt: 100}">\n          <vxe-column type="seq" width="100"></vxe-column>\n          <vxe-column field="name" title="Name" width="150" sortable></vxe-column>\n          <vxe-column field="attr1" title="Attr1" width="100"></vxe-column>\n          <vxe-column field="attr2" title="Attr2" width="100"></vxe-column>\n          <vxe-column field="attr3" title="Attr3" width="100"></vxe-column>\n          <vxe-column field="attr4" title="Attr4" width="100"></vxe-column>\n          <vxe-column field="attr5" title="Attr5" width="150" sortable></vxe-column>\n          <vxe-column field="attr6" title="Attr6" width="100"></vxe-column>\n          <vxe-column field="attr7" title="Attr7" width="100"></vxe-column>\n          <vxe-column field="attr8" title="Attr8" width="200" show-overflow></vxe-column>\n          <vxe-column field="attr9" title="Attr9" width="100"></vxe-column>\n          <vxe-column field="attr10" title="Attr10" width="100"></vxe-column>\n          <vxe-column field="attr11" title="Attr11" width="100"></vxe-column>\n          <vxe-column field="attr12" title="Attr12" width="100"></vxe-column>\n          <vxe-column field="attr13" title="Attr13" width="150" sortable></vxe-column>\n          <vxe-column field="attr14" title="Attr14" width="100"></vxe-column>\n          <vxe-column field="attr15" title="Attr15" width="100"></vxe-column>\n        </vxe-table>\n        ',"\n        import { defineComponent, ref, onMounted, nextTick } from 'vue'\n        import { VxeTableInstance } from 'vxe-table'\n        import XEUtils from 'xe-utils'\n\n        export default defineComponent({\n          setup () {\n            const mockList2: any = []\n            for (let index = 0; index < 200; index++) {\n              mockList2.push({\n                name: 'Test' + index,\n                attr1: index,\n                attr2: 'a2-' + index,\n                attr3: 'a3-' + index,\n                attr4: 'a4-' + index,\n                attr5: 'a5-' + index,\n                attr6: 'a6-' + index,\n                attr7: 'a7-' + index,\n                attr8: 'a8-' + index,\n                attr9: 'a9-' + index,\n                attr10: 'a10-' + index,\n                attr11: 'a11-' + index,\n                attr12: 'a12-' + index,\n                attr13: 'a13-' + index,\n                attr14: 'a14-' + index\n              })\n            }\n\n            const xTable2 = ref({} as VxeTableInstance)\n\n            onMounted(() => {\n              nextTick(() => {\n                const $table = xTable2.value\n                if ($table) {\n                  $table.loadData(XEUtils.clone(mockList2, true))\n                }\n              })\n            })\n\n            const sumNum = (list: any[], field: string) => {\n              let count = 0\n              list.forEach(item => {\n                count += Number(item[field])\n              })\n              return count\n            }\n\n            const footerMethod = ({ columns, data }: any) => {\n              // 返回一个二维数组的表尾合计\n              const footData = [\n                columns.map((column: any, columnIndex: any) => {\n                  if (columnIndex === 0) {\n                    return '平均'\n                  }\n                  switch (column.property) {\n                    case 'attr1':\n                      return sumNum(data, 'attr1')\n                  }\n                  return '-'\n                })\n              ]\n              return footData\n            }\n\n            return {\n              xTable2,\n              footerMethod\n            }\n          }\n        })\n        "]}}}),z=n("6b0d"),H=n.n(z);const F=H()(P,[["render",R]]);t["default"]=F}}]);