(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21da58"],{d1d9:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._m(0),n("vxe-toolbar",{scopedSlots:e._u([{key:"buttons",fn:function(){return[n("vxe-button",{on:{click:function(t){return e.$refs.xTree.toggleTreeExpand(e.tableData[0],!0)}}},[e._v("切换第一个")]),n("vxe-button",{on:{click:function(t){return e.$refs.xTree.setTreeExpand(e.tableData[2],!0)}}},[e._v("展开第三个")]),n("vxe-button",{on:{click:function(t){return e.$refs.xTree.setAllTreeExpand(!0)}}},[e._v("展开所有")]),n("vxe-button",{on:{click:function(t){return e.$refs.xTree.clearTreeExpand()}}},[e._v("关闭所有")])]},proxy:!0}])}),n("vxe-table",{ref:"xTree",attrs:{resizable:"","show-overflow":"","tree-config":{children:"children"},"edit-config":{trigger:"click",mode:"row"},"checkbox-config":{labelField:"id"},data:e.tableData}},[n("vxe-table-column",{attrs:{type:"checkbox",title:"ID","tree-node":""}}),n("vxe-table-column",{attrs:{field:"name",title:"Name","edit-render":{name:"input"}}}),n("vxe-table-column",{attrs:{field:"size",title:"Size","edit-render":{name:"input"}}}),n("vxe-table-column",{attrs:{field:"type",title:"Type","edit-render":{name:"input"}}}),n("vxe-table-column",{attrs:{field:"date",title:"Date","edit-render":{name:"$input",props:{type:"date"}}}})],1),n("p",{staticClass:"demo-code"},[e._v(e._s(e.$t("app.body.button.showCode")))]),n("pre",[e._v("    "),n("code",{staticClass:"xml"},[e._v(e._s(e.demoCodes[0]))]),e._v("\n    "),n("code",{staticClass:"javascript"},[e._v(e._s(e.demoCodes[1]))]),e._v("\n  ")])],1)},l=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("p",{staticClass:"tip"},[e._v(" 可编辑树表格，还可以通过手动调用展开收起"),n("br")])}],r=(n("d3b7"),n("159b"),n("a630"),n("3ca3"),n("c695")),o=n.n(r),i=n("1487"),c=n.n(i),d={data:function(){return{tableData:[],demoCodes:['\n        <vxe-toolbar>\n          <template v-slot:buttons>\n            <vxe-button @click="$refs.xTree.toggleTreeExpand(tableData[0], true)">切换第一个</vxe-button>\n            <vxe-button @click="$refs.xTree.setTreeExpand(tableData[2], true)">展开第三个</vxe-button>\n            <vxe-button @click="$refs.xTree.setAllTreeExpand(true)">展开所有</vxe-button>\n            <vxe-button @click="$refs.xTree.clearTreeExpand()">关闭所有</vxe-button>\n          </template>\n        </vxe-toolbar>\n\n        <vxe-table\n          resizable\n          show-overflow\n          ref="xTree"\n          :tree-config="{children: \'children\'}"\n          :edit-config="{trigger: \'click\', mode: \'row\'}"\n          :checkbox-config="{labelField: \'id\'}"\n          :data="tableData">\n          <vxe-table-column type="checkbox" title="ID" tree-node></vxe-table-column>\n          <vxe-table-column field="name" title="Name" :edit-render="{name: \'input\'}"></vxe-table-column>\n          <vxe-table-column field="size" title="Size" :edit-render="{name: \'input\'}"></vxe-table-column>\n          <vxe-table-column field="type" title="Type" :edit-render="{name: \'input\'}"></vxe-table-column>\n          <vxe-table-column field="date" title="Date" :edit-render="{name: \'$input\', props: {type: \'date\'}}"></vxe-table-column>\n        </vxe-table>\n        ',"\n        export default {\n          data () {\n            return {\n              tableData: []\n            }\n          },\n          created () {\n            this.tableData = window.MOCK_TREE_DATA_LIST\n          }\n        }\n        "]}},created:function(){this.tableData=o.a.clone(window.MOCK_TREE_DATA_LIST,!0)},mounted:function(){Array.from(this.$el.querySelectorAll("pre code")).forEach((function(e){c.a.highlightBlock(e)}))}},u=d,s=n("2877"),b=Object(s["a"])(u,a,l,!1,null,null,null);t["default"]=b.exports}}]);