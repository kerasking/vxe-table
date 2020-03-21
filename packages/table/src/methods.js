import XEUtils from 'xe-utils/methods/xe-utils'
import Cell from '../../cell'
import VXETable from '../../v-x-e-table'
import { UtilTools, DomTools } from '../../tools'

let rowUniqueId = 0
const browse = DomTools.browse
const isWebkit = browse['-webkit'] && !browse.edge
const debounceScrollYDuration = browse.msie ? 40 : 20

// 分组表头的属性
const headerProps = {
  children: 'children'
}

/**
 * 生成行的唯一主键
 */
function getRowUniqueId () {
  return `row_${++rowUniqueId}`
}

/**
 * 判断是否点击了单选框或复选框
 */
function isTargetRadioOrCheckbox (evnt, column, colType, targetType) {
  const target = evnt.target
  return target && column.type === colType && target.tagName.toLowerCase() === 'input' && target.type === (targetType || colType)
}

const Methods = {
  /**
   * 获取父容器元素
   */
  getParentElem () {
    return this.$xegrid ? this.$xegrid.$el.parentNode : this.$el.parentNode
  },
  /**
   * 获取父容器的高度
   */
  getParentHeight () {
    return this.$xegrid ? this.$xegrid.getParentHeight() : this.getParentElem().clientHeight
  },
  /**
   * 获取需要排除的高度
   * 但渲染表格高度时，需要排除工具栏或分页等相关组件的高度
   * 如果存在表尾合计滚动条，则需要排除滚动条高度
   */
  getExcludeHeight () {
    return this.$xegrid ? this.$xegrid.getExcludeHeight() : 0
  },
  /**
   * 重置表格的一切数据状态
   */
  clearAll () {
    this.inited = false
    this.clearSort()
    this.clearCurrentRow()
    this.clearCurrentColumn()
    this.clearRadioRow()
    this.clearRadioReserve()
    this.clearCheckboxRow()
    this.clearCheckboxReserve()
    this.clearRowExpand()
    this.clearTreeExpand()
    if (VXETable._edit) {
      this.clearActived()
    }
    if (VXETable._filter) {
      this.clearFilter()
    }
    if (this.keyboardConfig || this.mouseConfig) {
      this.clearIndexChecked()
      this.clearHeaderChecked()
      this.clearChecked()
      this.clearSelected()
      this.clearCopyed()
    }
    return this.clearScroll()
  },
  refreshData () {
    UtilTools.warn('vxe.error.delFunc', ['refreshData', 'syncData'])
    return this.syncData()
  },
  /**
   * 同步 data 数据
   * 如果用了该方法，那么组件将不再记录增删改的状态，只能自行实现对应逻辑
   * 对于某些特殊的场景，比如深层树节点元素发生变动时可能会用到
   */
  syncData () {
    return this.$nextTick().then(() => {
      this.tableData = []
      return this.$nextTick().then(() => this.loadTableData(this.tableFullData))
    })
  },
  /**
   * 手动处理数据
   * 对于手动更改了排序、筛选...等条件后需要重新处理数据时可能会用到
   */
  updateData () {
    return this.handleTableData(true).then(this.updateFooter).then(this.recalculate)
  },
  handleTableData (force) {
    const { scrollYLoad, scrollYStore } = this
    const fullData = force ? this.updateAfterFullData() : this.afterFullData
    this.tableData = scrollYLoad ? fullData.slice(scrollYStore.startIndex, scrollYStore.startIndex + scrollYStore.renderSize) : fullData.slice(0)
    return this.$nextTick()
  },
  /**
   * 加载表格数据
   * @param {Array} datas 数据
   */
  loadTableData (datas) {
    const { keepSource, height, maxHeight, showOverflow, treeConfig, editStore, optimizeOpts, scrollYStore } = this
    const { scrollY } = optimizeOpts
    const tableFullData = datas ? datas.slice(0) : []
    const scrollYLoad = !treeConfig && scrollY && scrollY.gt && scrollY.gt < tableFullData.length
    scrollYStore.startIndex = 0
    scrollYStore.visibleIndex = 0
    editStore.insertList = []
    editStore.removeList = []
    // 全量数据
    this.tableFullData = tableFullData
    // 缓存数据
    this.updateCache(true)
    // 原始数据
    this.tableSynchData = datas
    if (keepSource) {
      this.tableSourceData = XEUtils.clone(tableFullData, true)
    }
    this.scrollYLoad = scrollYLoad
    if (scrollYLoad) {
      if (!(height || maxHeight)) {
        UtilTools.error('vxe.error.reqProp', ['height | max-height'])
      }
      if (!showOverflow) {
        UtilTools.warn('vxe.error.reqProp', ['show-overflow'])
      }
    }
    this.handleTableData(true)
    this.updateFooter()
    return this.computeScrollLoad().then(() => {
      // 是否加载了数据
      this.isLoadData = true
      this.computeRowHeight()
      this.handleReserveStatus()
      this.checkSelectionStatus()
      return this.$nextTick().then(this.recalculate).then(this.refreshScroll)
    })
  },
  /**
   * 重新加载数据，不会清空表格状态
   * @param {Array} datas 数据
   */
  loadData (datas) {
    this.inited = true
    return this.loadTableData(datas).then(this.recalculate)
  },
  /**
   * 重新加载数据，会清空表格状态
   * @param {Array} datas 数据
   */
  reloadData (datas) {
    return this.clearAll()
      .then(() => {
        this.inited = true
        return this.loadTableData(datas)
      })
      .then(this.handleDefaults)
  },
  /**
   * 局部加载行数据并恢复到初始状态
   * 对于行数据需要局部更改的场景中可能会用到
   * @param {Row} row 行对象
   * @param {Object} record 新数据
   * @param {String} field 字段名
   */
  reloadRow (row, record, field) {
    const { keepSource, tableSourceData, tableData } = this
    if (keepSource) {
      const rowIndex = this.getRowIndex(row)
      const oRow = tableSourceData[rowIndex]
      if (oRow && row) {
        if (field) {
          XEUtils.set(oRow, field, XEUtils.get(record || row, field))
        } else {
          if (record) {
            tableSourceData[rowIndex] = record
            XEUtils.clear(row, undefined)
            Object.assign(row, this.defineField(Object.assign({}, record)))
            this.updateCache(true)
          } else {
            XEUtils.destructuring(oRow, XEUtils.clone(row, true))
          }
        }
      }
      this.tableData = tableData.slice(0)
    } else {
      UtilTools.warn('vxe.error.reqProp', ['keep-source'])
    }
    return this.$nextTick()
  },
  /**
   * 加载列配置
   * 对于表格列需要重载、局部递增场景下可能会用到
   * @param {ColumnConfig} columns 列配置
   */
  loadColumn (columns) {
    this.collectColumn = XEUtils.mapTree(columns, column => Cell.createColumn(this, column), headerProps)
    return this.$nextTick()
  },
  /**
   * 加载列配置并恢复到初始状态
   * 对于表格列需要重载、局部递增场景下可能会用到
   * @param {ColumnConfig} columns 列配置
   */
  reloadColumn (columns) {
    this.clearAll()
    return this.loadColumn(columns)
  },
  /**
   * 更新数据行的 Map
   * 牺牲数据组装的耗时，用来换取使用过程中的流畅
   */
  updateCache (source) {
    const { treeConfig, treeOpts, tableFullData, fullDataRowMap, fullAllDataRowMap } = this
    let { fullDataRowIdData, fullAllDataRowIdData } = this
    const rowkey = UtilTools.getRowkey(this)
    const isLazy = treeConfig && treeOpts.lazy
    const handleCache = (row, index) => {
      let rowid = UtilTools.getRowid(this, row)
      if (!rowid) {
        rowid = getRowUniqueId()
        XEUtils.set(row, rowkey, rowid)
      }
      if (isLazy && row[treeOpts.hasChild] && XEUtils.isUndefined(row[treeOpts.children])) {
        row[treeOpts.children] = null
      }
      const rest = { row, rowid, index: treeConfig ? -1 : index }
      if (source) {
        fullDataRowIdData[rowid] = rest
        fullDataRowMap.set(row, rest)
      }
      fullAllDataRowIdData[rowid] = rest
      fullAllDataRowMap.set(row, rest)
    }
    if (source) {
      fullDataRowIdData = this.fullDataRowIdData = {}
      fullDataRowMap.clear()
    }
    fullAllDataRowIdData = this.fullAllDataRowIdData = {}
    fullAllDataRowMap.clear()
    if (treeConfig) {
      XEUtils.eachTree(tableFullData, handleCache, treeOpts)
    } else {
      tableFullData.forEach(handleCache)
    }
  },
  appendTreeCache (row, childs) {
    const { keepSource, tableSourceData, treeOpts, fullDataRowIdData, fullDataRowMap, fullAllDataRowMap, fullAllDataRowIdData } = this
    const { children, hasChild } = treeOpts
    const rowkey = UtilTools.getRowkey(this)
    const rowid = UtilTools.getRowid(this, row)
    let matchObj
    if (keepSource) {
      matchObj = XEUtils.findTree(tableSourceData, item => rowid === UtilTools.getRowid(this, item), treeOpts)
    }
    XEUtils.eachTree(childs, (row, index) => {
      let rowid = UtilTools.getRowid(this, row)
      if (!rowid) {
        rowid = getRowUniqueId()
        XEUtils.set(row, rowkey, rowid)
      }
      if (row[hasChild] && XEUtils.isUndefined(row[children])) {
        row[children] = null
      }
      const rest = { row, rowid, index }
      fullDataRowIdData[rowid] = rest
      fullDataRowMap.set(row, rest)
      fullAllDataRowIdData[rowid] = rest
      fullAllDataRowMap.set(row, rest)
    }, treeOpts)
    if (matchObj) {
      matchObj.item[children] = XEUtils.clone(childs, true)
    }
  },
  /**
   * 更新数据列的 Map
   * 牺牲数据组装的耗时，用来换取使用过程中的流畅
   */
  cacheColumnMap () {
    const { isGroup, tableFullColumn, collectColumn, fullColumnMap } = this
    const fullColumnIdData = this.fullColumnIdData = {}
    fullColumnMap.clear()
    if (isGroup) {
      XEUtils.eachTree(collectColumn, (column, index) => {
        if (column.children && column.children.length) {
          const rest = { column, colid: column.id, index }
          fullColumnIdData[column.id] = rest
          fullColumnMap.set(column, rest)
        }
      }, headerProps)
    }
    tableFullColumn.forEach((column, index) => {
      const rest = { column, colid: column.id, index }
      fullColumnIdData[column.id] = rest
      fullColumnMap.set(column, rest)
    }, headerProps)
  },
  /**
   * 根据 tr 元素获取对应的 row 信息
   * @param {Element} tr 元素
   */
  getRowNode (tr) {
    if (tr) {
      const { treeConfig, treeOpts, tableFullData, fullAllDataRowIdData } = this
      const rowid = tr.getAttribute('data-rowid')
      if (treeConfig) {
        const matchObj = XEUtils.findTree(tableFullData, row => UtilTools.getRowid(this, row) === rowid, treeOpts)
        if (matchObj) {
          return matchObj
        }
      } else {
        if (fullAllDataRowIdData[rowid]) {
          const rest = fullAllDataRowIdData[rowid]
          return { item: rest.row, index: rest.index, items: tableFullData }
        }
      }
    }
    return null
  },
  /**
   * 根据 th/td 元素获取对应的 column 信息
   * @param {Element} cell 元素
   */
  getColumnNode (cell) {
    if (cell) {
      const { fullColumnIdData, tableFullColumn } = this
      const colid = cell.getAttribute('data-colid')
      const { column, index } = fullColumnIdData[colid]
      return { item: column, index, items: tableFullColumn }
    }
    return null
  },
  /**
   * 根据 row 获取相对于 data 中的索引
   * @param {Row} row 行对象
   */
  getRowIndex (row) {
    return this.fullDataRowMap.has(row) ? this.fullDataRowMap.get(row).index : -1
  },
  /**
   * 根据 row 获取相对于当前数据中的索引
   * @param {Row} row 行对象
   */
  _getRowIndex (row) {
    return this.afterFullData.indexOf(row)
  },
  /**
   * 根据 row 获取渲染中的虚拟索引
   * @param {Row} row 行对象
   */
  $getRowIndex (row) {
    return this.tableData.indexOf(row)
  },
  /**
   * 根据 column 获取相对于 columns 中的索引
   * @param {ColumnConfig} column 列配置
   */
  getColumnIndex (column) {
    return this.fullColumnMap.has(column) ? this.fullColumnMap.get(column).index : -1
  },
  /**
   * 根据 column 获取渲染中的虚拟索引
   * @param {ColumnConfig} column 列配置
   */
  $getColumnIndex (column) {
    return this.visibleColumn.indexOf(column)
  },
  /**
   * 判断是否为索引列
   * @param {ColumnConfig} column 列配置
   */
  isSeqColumn (column) {
    return column && (column.type === 'seq' || column.type === 'index')
  },
  /**
   * 定义行数据中的列属性，如果不存在则定义
   * @param {Row} row 行数据
   */
  defineField (row) {
    const { treeConfig, treeOpts } = this
    const rowkey = UtilTools.getRowkey(this)
    this.visibleColumn.forEach(({ property, editRender }) => {
      if (property && !XEUtils.has(row, property)) {
        XEUtils.set(row, property, editRender && !XEUtils.isUndefined(editRender.defaultValue) ? editRender.defaultValue : null)
      }
    })
    if (treeConfig && treeOpts.lazy && XEUtils.isUndefined(row[treeOpts.children])) {
      row[treeOpts.children] = null
    }
    // 必须有行数据的唯一主键，可以自行设置；也可以默认生成一个随机数
    if (!XEUtils.get(row, rowkey)) {
      XEUtils.set(row, rowkey, getRowUniqueId())
    }
    return row
  },
  /**
   * 创建 data 对象
   * 对于某些特殊场景可能会用到，会自动对数据的字段名进行检测，如果不存在就自动定义
   * @param {Array} records 新数据
   */
  createData (records) {
    return this.$nextTick().then(() => records.map(this.defineField))
  },
  /**
   * 创建 Row|Rows 对象
   * 对于某些特殊场景需要对数据进行手动插入时可能会用到
   * @param {Array/Object} records 新数据
   */
  createRow (records) {
    const isArr = XEUtils.isArray(records)
    if (!isArr) {
      records = [records]
    }
    return this.$nextTick().then(() => {
      const rows = records.map(record => this.defineField(Object.assign({}, record)))
      return isArr ? rows : rows[0]
    })
  },
  revert (...args) {
    UtilTools.warn('vxe.error.delFunc', ['revert', 'revertData'])
    return this.revertData(...args)
  },
  /**
   * 还原数据
   * 如果不传任何参数，则还原整个表格
   * 如果传 row 则还原一行
   * 如果传 rows 则还原多行
   * 如果还额外传了 field 则还原指定的单元格数据
   */
  revertData (rows, field) {
    const { keepSource, tableSourceData, tableFullData } = this
    if (keepSource) {
      if (arguments.length) {
        if (rows && !XEUtils.isArray(rows)) {
          rows = [rows]
        }
        rows.forEach(row => {
          if (!this.isInsertByRow(row)) {
            const rowIndex = tableFullData.indexOf(row)
            const oRow = tableSourceData[rowIndex]
            if (oRow && row) {
              if (field) {
                XEUtils.set(row, field, XEUtils.clone(XEUtils.get(oRow, field), true))
              } else {
                XEUtils.destructuring(row, XEUtils.clone(oRow, true))
              }
            }
          }
        })
        return this.$nextTick()
      }
      return this.reloadData(tableSourceData)
    }
    return this.$nextTick()
  },
  /**
   * 清空单元格内容
   * 如果不创参数，则清空整个表格内容
   * 如果传 row 则清空一行内容
   * 如果传 rows 则清空多行内容
   * 如果还额外传了 field 则清空指定单元格内容
   * @param {Array/Row} rows 行数据
   * @param {String} field 字段名
   */
  clearData (rows, field) {
    const { tableFullData, visibleColumn } = this
    if (!arguments.length) {
      rows = tableFullData
    } else if (rows && !XEUtils.isArray(rows)) {
      rows = [rows]
    }
    if (field) {
      rows.forEach(row => XEUtils.set(row, field, null))
    } else {
      rows.forEach(row => {
        visibleColumn.forEach(column => {
          if (column.property) {
            UtilTools.setCellValue(row, column, null)
          }
        })
      })
    }
    return this.$nextTick()
  },
  /**
   * 检查是否为临时行数据
   * @param {Row} row 行对象
   */
  isInsertByRow (row) {
    return this.editStore.insertList.indexOf(row) > -1
  },
  // 在 v3.0 中废弃 hasRowChange
  hasRowChange (row, field) {
    UtilTools.warn('vxe.error.delFunc', ['hasRowChange', 'isUpdateByRow'])
    return this.isUpdateByRow(row, field)
  },
  /**
   * 检查行或列数据是否发生改变
   * @param {Row} row 行对象
   * @param {String} field 字段名
   */
  isUpdateByRow (row, field) {
    const { visibleColumn, keepSource, treeConfig, treeOpts, tableSourceData, fullDataRowIdData } = this
    if (keepSource) {
      let oRow, property
      const rowid = UtilTools.getRowid(this, row)
      // 新增的数据不需要检测
      if (!fullDataRowIdData[rowid]) {
        return false
      }
      if (treeConfig) {
        const children = treeOpts.children
        const matchObj = XEUtils.findTree(tableSourceData, item => rowid === UtilTools.getRowid(this, item), treeOpts)
        row = Object.assign({}, row, { [children]: null })
        if (matchObj) {
          oRow = Object.assign({}, matchObj.item, { [children]: null })
        }
      } else {
        const oRowIndex = fullDataRowIdData[rowid].index
        oRow = tableSourceData[oRowIndex]
      }
      if (oRow) {
        if (arguments.length > 1) {
          return !XEUtils.isEqual(XEUtils.get(oRow, field), XEUtils.get(row, field))
        }
        for (let index = 0, len = visibleColumn.length; index < len; index++) {
          property = visibleColumn[index].property
          if (property && !XEUtils.isEqual(XEUtils.get(oRow, property), XEUtils.get(row, property))) {
            return true
          }
        }
      }
    }
    return false
  },
  /**
   * 获取表格的可视列，也可以指定索引获取列
   * @param {Number} columnIndex 索引
   */
  getColumns (columnIndex) {
    const columns = this.visibleColumn
    return arguments.length ? columns[columnIndex] : columns.slice(0)
  },
  /**
   * 根据列的唯一主键获取列
   * @param {String} colid 列主键
   */
  getColumnById (colid) {
    const fullColumnIdData = this.fullColumnIdData
    return fullColumnIdData[colid] ? fullColumnIdData[colid].column : null
  },
  /**
   * 根据列的字段名获取列
   * @param {String} field 字段名
   */
  getColumnByField (field) {
    return XEUtils.find(this.tableFullColumn, column => column.property === field)
  },
  /**
   * 获取当前表格的列
   * 收集到的全量列、全量表头列、处理条件之后的全量表头列、当前渲染中的表头列
   */
  getTableColumn () {
    return {
      collectColumn: this.collectColumn.slice(0),
      fullColumn: this.tableFullColumn.slice(0),
      visibleColumn: this.visibleColumn.slice(0),
      tableColumn: this.tableColumn.slice(0)
    }
  },
  // 在 v3.0 中废弃 getRecords
  getRecords (...args) {
    UtilTools.warn('vxe.error.delFunc', ['getRecords', 'getData'])
    return this.getData(...args)
  },
  /**
   * 获取数据，和 data 的行为一致，也可以指定索引获取数据
   */
  getData (rowIndex) {
    const tableSynchData = this.data || this.tableSynchData
    return arguments.length ? tableSynchData[rowIndex] : tableSynchData.slice(0)
  },
  // 在 v3.0 中废弃 getAllRecords
  getAllRecords () {
    UtilTools.warn('vxe.error.delFunc', ['getAllRecords', 'getRecordset'])
    return this.getRecordset()
  },
  // 在 v3.0 中废弃 getSelectRecords
  getSelectRecords () {
    UtilTools.warn('vxe.error.delFunc', ['getSelectRecords', 'getCheckboxRecords'])
    return this.getCheckboxRecords()
  },
  /**
   * 用于多选行，获取已选中的数据
   */
  getCheckboxRecords () {
    const { tableFullData, treeConfig, treeOpts, checkboxOpts } = this
    const { checkField: property } = checkboxOpts
    let rowList = []
    if (property) {
      if (treeConfig) {
        rowList = XEUtils.filterTree(tableFullData, row => XEUtils.get(row, property), treeOpts)
      } else {
        rowList = tableFullData.filter(row => XEUtils.get(row, property))
      }
    } else {
      const { selection } = this
      if (treeConfig) {
        rowList = XEUtils.filterTree(tableFullData, row => selection.indexOf(row) > -1, treeOpts)
      } else {
        rowList = tableFullData.filter(row => selection.indexOf(row) > -1)
      }
    }
    return rowList
  },
  /**
   * 获取处理后全量的表格数据
   * 如果存在筛选条件，继续处理
   */
  updateAfterFullData () {
    const { visibleColumn, tableFullData, remoteSort, remoteFilter, filterOpts, sortOpts } = this
    let tableData = tableFullData.slice(0)
    const column = XEUtils.find(visibleColumn, column => column.order)
    const filterColumns = []
    visibleColumn.forEach(column => {
      if (column.filters && column.filters.length) {
        const valueList = []
        const itemList = []
        column.filters.forEach(item => {
          if (item.checked) {
            itemList.push(item)
            valueList.push(item.value)
          }
        })
        filterColumns.push({ column, valueList, itemList })
      }
    })
    if (filterColumns.length) {
      tableData = tableData.filter(row => {
        return filterColumns.every(({ column, valueList, itemList }) => {
          if (valueList.length && !(filterOpts.remote || remoteFilter)) {
            const { filterRender, property } = column
            let { filterMethod } = column
            const compConf = filterRender ? VXETable.renderer.get(filterRender.name) : null
            if (!filterMethod && compConf && compConf.renderFilter) {
              filterMethod = compConf.filterMethod
            }
            return filterMethod ? itemList.some(item => filterMethod({ value: item.value, option: item, row, column })) : valueList.indexOf(XEUtils.get(row, property)) > -1
          }
          return true
        })
      })
    }
    if (column && column.order) {
      const allSortMethod = sortOpts.sortMethod || this.sortMethod
      const isRemote = XEUtils.isBoolean(column.remoteSort) ? column.remoteSort : (sortOpts.remote || remoteSort)
      if (!isRemote) {
        if (allSortMethod) {
          tableData = allSortMethod({ data: tableData, column, property: column.property, order: column.order, $table: this }) || tableData
        } else {
          const rest = column.sortMethod ? tableData.sort(column.sortMethod) : XEUtils.sortBy(tableData, column.property)
          tableData = column.order === 'desc' ? rest.reverse() : rest
        }
      }
    }
    this.afterFullData = tableData
    return tableData
  },
  /**
   * 根据行的唯一主键获取行
   * @param {String/Number} rowid 行主键
   */
  getRowById (rowid) {
    const fullDataRowIdData = this.fullDataRowIdData
    return fullDataRowIdData[rowid] ? fullDataRowIdData[rowid].row : null
  },
  /**
   * 根据行获取行的唯一主键
   * @param {Row} row 行对象
   */
  getRowid (row) {
    const fullAllDataRowMap = this.fullAllDataRowMap
    return fullAllDataRowMap.has(row) ? fullAllDataRowMap.get(row).rowid : null
  },
  /**
   * 获取处理后的表格数据
   * 如果存在筛选条件，继续处理
   * 如果存在排序，继续处理
   */
  getTableData () {
    const { tableFullData, afterFullData, tableData, footerData } = this
    return {
      fullData: tableFullData.slice(0),
      visibleData: afterFullData.slice(0),
      tableData: tableData.slice(0),
      footerData: footerData.slice(0)
    }
  },
  /**
   * 默认行为只允许执行一次
   */
  handleDefaults () {
    // 在 v3.0 中废弃 selectConfig
    const checkboxConfig = this.checkboxConfig || this.selectConfig
    if (checkboxConfig) {
      this.handleDefaultSelectionChecked()
    }
    if (this.radioConfig) {
      this.handleDefaultRadioChecked()
    }
    if (this.sortConfig) {
      this.handleDefaultSort()
    }
    if (this.expandConfig) {
      this.handleDefaultRowExpand()
    }
    if (this.treeConfig) {
      this.handleDefaultTreeExpand()
    }
    this.$nextTick(() => setTimeout(this.recalculate))
  },
  /**
   * 动态列处理
   */
  mergeCustomColumn (customColumns) {
    const { tableFullColumn } = this
    this.isUpdateCustoms = true
    if (customColumns.length) {
      tableFullColumn.forEach(column => {
        // 在 v3.0 中废弃 prop
        const item = XEUtils.find(customColumns, item => column.property && (item.field || item.prop) === column.property)
        if (item) {
          if (XEUtils.isNumber(item.resizeWidth)) {
            column.resizeWidth = item.resizeWidth
          }
          if (XEUtils.isBoolean(item.visible)) {
            column.visible = item.visible
          }
        }
      })
    }
    this.$emit('update:customs', tableFullColumn)
  },
  /**
   * 手动重置列的所有操作，还原到初始状态
   * 如果已关联工具栏，则会同步更新
   */
  resetAll () {
    UtilTools.warn('vxe.error.delFunc', ['resetAll', 'resetColumn'])
    this.resetColumn(true)
  },
  /**
   * 隐藏指定列
   * @param {ColumnConfig} column 列配置
   */
  hideColumn (column) {
    return this.handleVisibleColumn(column, false)
  },
  /**
   * 显示指定列
   * @param {ColumnConfig} column 列配置
   */
  showColumn (column) {
    return this.handleVisibleColumn(column, true)
  },
  /**
   * 手动重置列的显示隐藏、列宽拖动的状态；
   * 如果为 true 则重置所有状态
   * 如果已关联工具栏，则会同步更新
   */
  resetColumn (options) {
    const opts = Object.assign({ visible: true }, options)
    if (options === true || opts.resizable) {
      this.handleResetResizable()
    }
    if (opts.visible) {
      return this.handleVisibleColumn()
    }
    return this.$nextTick()
  },
  resetCustoms () {
    UtilTools.warn('vxe.error.delFunc', ['resetCustoms', 'resetColumn'])
    return this.resetColumn()
  },
  handleVisibleColumn (column, visible) {
    if (arguments.length) {
      column.visible = visible
    } else {
      this.tableFullColumn.forEach(column => {
        column.visible = true
      })
    }
    if (this.$toolbar) {
      this.$toolbar.handleCustoms()
    }
    return this.$nextTick()
  },
  /**
   * 手动重置列宽拖动的操作，还原到初始状态
   * 如果已关联工具栏，则会同步更新
   */
  handleResetResizable () {
    this.tableFullColumn.forEach(column => {
      column.resizeWidth = 0
    })
    if (this.$toolbar) {
      this.$toolbar.resetResizable()
    }
    this.analyColumnWidth()
    return this.recalculate(true)
  },
  resetResizable () {
    UtilTools.warn('vxe.error.delFunc', ['resetResizable', 'resetColumn'])
    return this.handleResetResizable()
  },
  /**
   * 已废弃的方法
   */
  reloadCustoms (customColumns) {
    UtilTools.warn('vxe.error.delFunc', ['reloadCustoms', 'column.visible & refreshColumn'])
    return this.$nextTick().then(() => {
      this.mergeCustomColumn(customColumns)
      return this.refreshColumn().then(() => this.tableFullColumn)
    })
  },
  /**
   * 刷新列信息
   * 将固定的列左边、右边分别靠边
   * 如果使用了分组表头，固定列必须在左侧或者右侧
   */
  refreshColumn () {
    let isColspan
    let letIndex = 0
    const leftList = []
    let leftStartIndex = null
    let rightEndIndex = null
    const centerList = []
    const rightList = []
    const { tableFullColumn, isGroup, columnStore, scrollXStore, optimizeOpts } = this
    const { scrollX } = optimizeOpts
    // 如果是分组表头，如果子列全部被隐藏，则根列也隐藏
    if (isGroup) {
      XEUtils.eachTree(this.collectColumn, column => {
        if (column.children && column.children.length) {
          column.visible = !!XEUtils.findTree(column.children, subColumn => subColumn.children && subColumn.children.length ? 0 : subColumn.visible, headerProps)
        }
      }, headerProps)
    }
    // 重新分配列
    tableFullColumn.filter(column => column.visible).forEach((column, columnIndex) => {
      if (column.fixed === 'left') {
        if (leftStartIndex === null) {
          leftStartIndex = letIndex
        }
        if (!isColspan) {
          if (columnIndex - letIndex !== 0) {
            isColspan = true
          } else {
            letIndex++
          }
        }
        leftList.push(column)
      } else if (column.fixed === 'right') {
        if (!isColspan) {
          if (rightEndIndex === null) {
            rightEndIndex = columnIndex
          }
          if (columnIndex - rightEndIndex !== 0) {
            isColspan = true
          } else {
            rightEndIndex++
          }
        }
        rightList.push(column)
      } else {
        centerList.push(column)
      }
    })
    let visibleColumn = leftList.concat(centerList).concat(rightList)
    const scrollXLoad = scrollX && scrollX.gt && scrollX.gt < tableFullColumn.length
    Object.assign(columnStore, { leftList, centerList, rightList })
    if (isGroup && (isColspan || leftStartIndex || (rightEndIndex !== null && rightEndIndex !== visibleColumn.length))) {
      UtilTools.error('vxe.error.groupFixed')
    }
    if (scrollXLoad) {
      if (this.isGroup) {
        UtilTools.warn('vxe.error.scrollXNotGroup')
      }
      if (this.showHeader && !this.showHeaderOverflow) {
        UtilTools.warn('vxe.error.reqProp', ['show-header-overflow'])
      }
      if (this.showFooter && !this.showFooterOverflow) {
        UtilTools.warn('vxe.error.reqProp', ['show-footer-overflow'])
      }
      // if (this.resizable || visibleColumn.some(column => column.resizable)) {
      //   UtilTools.warn('vxe.error.scrollXNotResizable')
      // }
      Object.assign(scrollXStore, {
        startIndex: 0,
        visibleIndex: 0
      })
      visibleColumn = visibleColumn.slice(scrollXStore.startIndex, scrollXStore.startIndex + scrollXStore.renderSize)
    }
    this.scrollXLoad = scrollXLoad
    this.tableColumn = visibleColumn
    return this.$nextTick().then(() => {
      this.updateFooter()
      this.recalculate(true)
    })
  },
  /**
   * 指定列宽的列进行拆分
   */
  analyColumnWidth () {
    const { columnWidth, columnMinWidth } = this
    const resizeList = []
    const pxList = []
    const pxMinList = []
    const scaleList = []
    const scaleMinList = []
    const autoList = []
    this.tableFullColumn.forEach(column => {
      if (columnWidth && !column.width) {
        column.width = columnWidth
      }
      if (columnMinWidth && !column.minWidth) {
        column.minWidth = columnMinWidth
      }
      if (column.visible) {
        if (column.resizeWidth) {
          resizeList.push(column)
        } else if (DomTools.isPx(column.width)) {
          pxList.push(column)
        } else if (DomTools.isScale(column.width)) {
          scaleList.push(column)
        } else if (DomTools.isPx(column.minWidth)) {
          pxMinList.push(column)
        } else if (DomTools.isScale(column.minWidth)) {
          scaleMinList.push(column)
        } else {
          autoList.push(column)
        }
      }
    })
    Object.assign(this.columnStore, { resizeList, pxList, pxMinList, scaleList, scaleMinList, autoList })
  },
  /**
   * 刷新滚动操作，手动同步滚动相关位置（对于某些特殊的操作，比如滚动条错位、固定列不同步）
   */
  refreshScroll () {
    const { lastScrollLeft, lastScrollTop } = this
    this.clearScroll()
    return this.$nextTick().then(() => {
      if (lastScrollLeft || lastScrollTop) {
        // 重置最后滚动状态
        this.lastScrollLeft = 0
        this.lastScrollTop = 0
        // 还原滚动状态
        return this.scrollTo(lastScrollLeft, lastScrollTop)
      }
    })
  },
  /**
   * 计算单元格列宽，动态分配可用剩余空间
   * 支持 width=? width=?px width=?% min-width=? min-width=?px min-width=?%
   */
  recalculate (refull) {
    const { $refs } = this
    const { tableBody, tableHeader, tableFooter } = $refs
    const bodyElem = tableBody ? tableBody.$el : null
    const headerElem = tableHeader ? tableHeader.$el : null
    const footerElem = tableFooter ? tableFooter.$el : null
    if (bodyElem) {
      this.autoCellWidth(headerElem, bodyElem, footerElem)
      if (refull === true) {
        // 初始化时需要在列计算之后再执行优化运算，达到最优显示效果
        return this.computeScrollLoad().then(() => {
          this.autoCellWidth(headerElem, bodyElem, footerElem)
          this.computeScrollLoad()
        })
      }
    }
    return this.computeScrollLoad()
  },
  /**
   * 列宽算法
   * 支持 px、%、固定 混合分配
   * 支持动态列表调整分配
   * 支持自动分配偏移量
   * @param {Element} headerElem
   * @param {Element} bodyElem
   * @param {Element} footerElem
   * @param {Number} bodyWidth
   */
  autoCellWidth (headerElem, bodyElem, footerElem) {
    let tableWidth = 0
    const minCellWidth = 40 // 列宽最少限制 40px
    const bodyWidth = bodyElem.clientWidth
    let remainWidth = bodyWidth
    let meanWidth = remainWidth / 100
    const { fit, columnStore } = this
    const { resizeList, pxMinList, pxList, scaleList, scaleMinList, autoList } = columnStore
    // 最小宽
    pxMinList.forEach(column => {
      const minWidth = parseInt(column.minWidth)
      tableWidth += minWidth
      column.renderWidth = minWidth
    })
    // 最小百分比
    scaleMinList.forEach(column => {
      const scaleWidth = Math.floor(parseInt(column.minWidth) * meanWidth)
      tableWidth += scaleWidth
      column.renderWidth = scaleWidth
    })
    // 固定百分比
    scaleList.forEach(column => {
      const scaleWidth = Math.floor(parseInt(column.width) * meanWidth)
      tableWidth += scaleWidth
      column.renderWidth = scaleWidth
    })
    // 固定宽
    pxList.forEach(column => {
      const width = parseInt(column.width)
      tableWidth += width
      column.renderWidth = width
    })
    // 调整了列宽
    resizeList.forEach(column => {
      const width = parseInt(column.resizeWidth)
      tableWidth += width
      column.renderWidth = width
    })
    remainWidth -= tableWidth
    meanWidth = remainWidth > 0 ? Math.floor(remainWidth / (scaleMinList.length + pxMinList.length + autoList.length)) : 0
    if (fit) {
      if (remainWidth > 0) {
        scaleMinList.concat(pxMinList).forEach(column => {
          tableWidth += meanWidth
          column.renderWidth += meanWidth
        })
      }
    } else {
      meanWidth = minCellWidth
    }
    // 自适应
    autoList.forEach(column => {
      const width = Math.max(meanWidth, minCellWidth)
      column.renderWidth = width
      tableWidth += width
    })
    if (fit) {
      /**
       * 偏移量算法
       * 如果所有列足够放的情况下，从最后动态列开始分配
       */
      const dynamicList = scaleList.concat(scaleMinList).concat(pxMinList).concat(autoList)
      let dynamicSize = dynamicList.length - 1
      if (dynamicSize > 0) {
        let odiffer = bodyWidth - tableWidth
        if (odiffer > 0) {
          while (odiffer > 0 && dynamicSize >= 0) {
            odiffer--
            dynamicList[dynamicSize--].renderWidth++
          }
          tableWidth = bodyWidth
        }
      }
    }
    const tableHeight = bodyElem.offsetHeight
    const overflowY = bodyElem.scrollHeight > bodyElem.clientHeight
    this.scrollbarWidth = overflowY ? bodyElem.offsetWidth - bodyWidth : 0
    this.overflowY = overflowY
    this.tableWidth = tableWidth
    this.tableHeight = tableHeight
    this.parentHeight = this.getParentHeight()
    if (headerElem) {
      this.headerHeight = headerElem.clientHeight
      // 检测是否同步滚动
      if (headerElem.scrollLeft !== bodyElem.scrollLeft) {
        headerElem.scrollLeft = bodyElem.scrollLeft
      }
    } else {
      this.headerHeight = 0
    }
    if (footerElem) {
      const footerHeight = footerElem.offsetHeight
      this.scrollbarHeight = Math.max(footerHeight - footerElem.clientHeight, 0)
      this.overflowX = tableWidth > footerElem.clientWidth
      this.footerHeight = footerHeight
    } else {
      this.footerHeight = 0
      this.scrollbarHeight = Math.max(tableHeight - bodyElem.clientHeight, 0)
      this.overflowX = tableWidth > bodyWidth
    }
    if (this.overflowX) {
      this.checkScrolling()
    }
  },
  /**
   * 放弃 vue 的双向 dom 绑定，使用原生的方式更新 Dom，性能翻倍提升
   */
  updateStyle () {
    const {
      $refs,
      isGroup,
      fullColumnIdData,
      height,
      parentHeight,
      border,
      headerHeight,
      showFooter,
      showOverflow: allColumnOverflow,
      showHeaderOverflow: allColumnHeaderOverflow,
      showFooterOverflow: allColumnFooterOverflow,
      footerHeight,
      tableHeight,
      tableWidth,
      scrollbarHeight,
      scrollbarWidth,
      scrollXLoad,
      scrollYLoad,
      cellOffsetWidth,
      columnStore,
      elemStore,
      editStore,
      currentRow,
      mouseConfig
    } = this
    let { maxHeight, tableColumn } = this
    const containerList = ['main', 'left', 'right']
    let customHeight = 0
    if (height) {
      customHeight = height === 'auto' ? parentHeight : ((DomTools.isScale(height) ? Math.floor(parseInt(height) / 100 * parentHeight) : XEUtils.toNumber(height)) - this.getExcludeHeight())
      if (showFooter) {
        customHeight += scrollbarHeight + 1
      }
    }
    const emptyPlaceholderElem = $refs.emptyPlaceholder
    const bodyWrapperElem = elemStore['main-body-wrapper']
    if (emptyPlaceholderElem) {
      emptyPlaceholderElem.style.top = `${headerHeight}px`
      emptyPlaceholderElem.style.height = bodyWrapperElem ? `${bodyWrapperElem.offsetHeight - scrollbarHeight}px` : ''
    }
    containerList.forEach((name, index) => {
      const fixedType = index > 0 ? name : ''
      const layoutList = ['header', 'body', 'footer']
      const fixedColumn = columnStore[`${fixedType}List`]
      const fixedWrapperElem = $refs[`${fixedType}Container`]
      layoutList.forEach(layout => {
        const wrapperElem = elemStore[`${name}-${layout}-wrapper`]
        const tableElem = elemStore[`${name}-${layout}-table`]
        if (layout === 'header') {
          // 表头体样式处理
          // 横向滚动渲染
          let tWidth = tableWidth
          if (scrollXLoad) {
            if (fixedType) {
              tableColumn = fixedColumn
            }
            tWidth = tableColumn.reduce((previous, column) => previous + column.renderWidth, 0)
          }
          if (tableElem) {
            tableElem.style.width = tWidth ? `${tWidth + scrollbarWidth}px` : ''
            // 修复 IE 中高度无法自适应问题
            if (browse.msie) {
              XEUtils.arrayEach(tableElem.querySelectorAll('.vxe-resizable'), resizeElem => {
                resizeElem.style.height = `${resizeElem.parentNode.offsetHeight}px`
              })
            }
          }

          const repairElem = elemStore[`${name}-${layout}-repair`]
          if (repairElem) {
            repairElem.style.width = `${tableWidth}px`
          }

          const listElem = elemStore[`${name}-${layout}-list`]
          if (isGroup && listElem) {
            // XEUtils.arrayEach(listElem.querySelectorAll(`.col--gutter`), thElem => {
            //   thElem.style.width = `${scrollbarWidth}px`
            // })
            XEUtils.arrayEach(listElem.querySelectorAll('.col--group'), thElem => {
              const column = this.getColumnNode(thElem).item
              const { showHeaderOverflow } = column
              const cellOverflow = XEUtils.isBoolean(showHeaderOverflow) ? showHeaderOverflow : allColumnHeaderOverflow
              const showEllipsis = cellOverflow === 'ellipsis'
              const showTitle = cellOverflow === 'title'
              const showTooltip = cellOverflow === true || cellOverflow === 'tooltip'
              const hasEllipsis = showTitle || showTooltip || showEllipsis
              let childWidth = 0
              let countChild = 0
              if (hasEllipsis) {
                XEUtils.eachTree(column.children, item => {
                  if (!item.children || !column.children.length) {
                    countChild++
                  }
                  childWidth += item.renderWidth
                })
                thElem.style.width = `${childWidth - countChild - (border ? 2 : 0)}px`
              }
            })
          }
        } else if (layout === 'body') {
          const emptyBlockElem = elemStore[`${name}-${layout}-emptyBlock`]
          if (wrapperElem) {
            if (maxHeight) {
              maxHeight = maxHeight === 'auto' ? parentHeight : (DomTools.isScale(maxHeight) ? Math.floor(parseInt(maxHeight) / 100 * parentHeight) : XEUtils.toNumber(maxHeight))
              wrapperElem.style.maxHeight = `${fixedType ? maxHeight - headerHeight - (showFooter ? 0 : scrollbarHeight) : maxHeight - headerHeight}px`
            } else {
              if (customHeight > 0) {
                wrapperElem.style.height = `${fixedType ? (customHeight > 0 ? customHeight - headerHeight - footerHeight : tableHeight) - (showFooter ? 0 : scrollbarHeight) : customHeight - headerHeight - footerHeight}px`
              } else {
                wrapperElem.style.height = ''
              }
            }
          }

          // 如果是固定列
          if (fixedWrapperElem) {
            const isRightFixed = fixedType === 'right'
            const fixedColumn = columnStore[`${fixedType}List`]
            wrapperElem.style.top = `${headerHeight}px`
            fixedWrapperElem.style.height = `${(customHeight > 0 ? customHeight - headerHeight - footerHeight : tableHeight) + headerHeight + footerHeight - scrollbarHeight * (showFooter ? 2 : 1)}px`
            fixedWrapperElem.style.width = `${fixedColumn.reduce((previous, column) => previous + column.renderWidth, isRightFixed ? scrollbarWidth : 0)}px`
          }

          let tWidth = tableWidth
          // 如果是固定列与设置了超出隐藏
          if (fixedType && allColumnOverflow) {
            tableColumn = fixedColumn
            tWidth = tableColumn.reduce((previous, column) => previous + column.renderWidth, 0)
          } else if (scrollXLoad) {
            if (fixedType) {
              tableColumn = fixedColumn
            }
            tWidth = tableColumn.reduce((previous, column) => previous + column.renderWidth, 0)
          }

          if (tableElem) {
            tableElem.style.width = tWidth ? `${tWidth}px` : ''
            // 兼容性处理
            tableElem.style.paddingRight = scrollbarWidth && fixedType && (browse['-moz'] || browse.safari) ? `${scrollbarWidth}px` : ''
          }
          if (emptyBlockElem) {
            emptyBlockElem.style.width = tWidth ? `${tWidth}px` : ''
          }
        } else if (layout === 'footer') {
          // 如果是使用优化模式
          let tWidth = tableWidth
          if (fixedType && allColumnOverflow) {
            tableColumn = fixedColumn
            tWidth = tableColumn.reduce((previous, column) => previous + column.renderWidth, 0)
          } else if (scrollXLoad) {
            if (fixedType) {
              tableColumn = fixedColumn
            }
            tWidth = tableColumn.reduce((previous, column) => previous + column.renderWidth, 0)
          }
          if (wrapperElem) {
            // 如果是固定列
            if (fixedWrapperElem) {
              wrapperElem.style.top = `${customHeight > 0 ? customHeight - footerHeight : tableHeight + headerHeight}px`
            }
            wrapperElem.style.marginTop = `${-scrollbarHeight}px`
          }
          if (tableElem) {
            tableElem.style.width = tWidth ? `${tWidth + scrollbarWidth}px` : ''
          }
          // const listElem = elemStore[`${name}-${layout}-list`]
          // if (listElem) {
          //   XEUtils.arrayEach(listElem.querySelectorAll(`.col--gutter`), thElem => {
          //     thElem.style.width = `${scrollbarWidth}px`
          //   })
          // }
        }
        const colgroupElem = elemStore[`${name}-${layout}-colgroup`]
        if (colgroupElem) {
          XEUtils.arrayEach(colgroupElem.children, colElem => {
            const colid = colElem.getAttribute('name')
            if (colid === 'col_gutter') {
              colElem.style.width = `${scrollbarWidth}px`
            }
            if (fullColumnIdData[colid]) {
              const column = fullColumnIdData[colid].column
              const { showHeaderOverflow, showFooterOverflow, showOverflow } = column
              let cellOverflow
              colElem.style.width = `${column.renderWidth}px`
              if (layout === 'header') {
                cellOverflow = XEUtils.isUndefined(showHeaderOverflow) || XEUtils.isNull(showHeaderOverflow) ? allColumnHeaderOverflow : showHeaderOverflow
              } else if (layout === 'footer') {
                cellOverflow = XEUtils.isUndefined(showFooterOverflow) || XEUtils.isNull(showFooterOverflow) ? allColumnFooterOverflow : showFooterOverflow
              } else {
                cellOverflow = XEUtils.isUndefined(showOverflow) || XEUtils.isNull(showOverflow) ? allColumnOverflow : showOverflow
              }
              const showEllipsis = cellOverflow === 'ellipsis'
              const showTitle = cellOverflow === 'title'
              const showTooltip = cellOverflow === true || cellOverflow === 'tooltip'
              let hasEllipsis = showTitle || showTooltip || showEllipsis
              const listElem = elemStore[`${name}-${layout}-list`]
              // 滚动的渲染不支持动态行高
              if ((scrollXLoad || scrollYLoad) && !hasEllipsis) {
                hasEllipsis = true
              }
              if (listElem && hasEllipsis) {
                XEUtils.arrayEach(listElem.querySelectorAll(`.${column.id}`), elem => {
                  const colspan = parseInt(elem.getAttribute('colspan') || 1)
                  const cellElem = elem.querySelector('.vxe-cell')
                  let colWidth = column.renderWidth
                  if (cellElem) {
                    if (colspan > 1) {
                      const columnIndex = this.getColumnIndex(column)
                      for (let index = 1; index < colspan; index++) {
                        const nextColumn = this.getColumns(columnIndex + index)
                        if (nextColumn) {
                          colWidth += nextColumn.renderWidth
                        }
                      }
                    }
                    cellElem.style.width = `${colWidth - (cellOffsetWidth * colspan)}px`
                  }
                })
              }
            }
          })
        }
      })
    })
    if (currentRow) {
      this.setCurrentRow(currentRow)
    }
    if (mouseConfig && mouseConfig.selected && editStore.selected.row && editStore.selected.column) {
      this.addColSdCls()
    }
    return this.$nextTick()
  },
  /**
   * 处理固定列的显示状态
   */
  checkScrolling () {
    const { tableBody, leftContainer, rightContainer } = this.$refs
    const bodyElem = tableBody ? tableBody.$el : null
    if (bodyElem) {
      if (leftContainer) {
        DomTools[bodyElem.scrollLeft > 0 ? 'addClass' : 'removeClass'](leftContainer, 'scrolling--middle')
      }
      if (rightContainer) {
        DomTools[bodyElem.clientWidth < bodyElem.scrollWidth - Math.ceil(bodyElem.scrollLeft) ? 'addClass' : 'removeClass'](rightContainer, 'scrolling--middle')
      }
    }
  },
  preventEvent (evnt, type, args, next, end) {
    const evntList = VXETable.interceptor.get(type)
    let rest
    if (!evntList.some(func => func(Object.assign({ $table: this }, args), evnt, this) === false)) {
      if (next) {
        rest = next()
      }
    }
    if (end) {
      end()
    }
    return rest
  },
  /**
   * 全局按下事件处理
   */
  handleGlobalMousedownEvent (evnt) {
    const { $el, $refs, mouseConfig, mouseOpts, editStore, ctxMenuStore, editOpts, filterStore, getRowNode } = this
    const { actived } = editStore
    const { filterWrapper, validTip } = $refs
    // 在 v3.0 中废弃 mouse-config.checked
    const isMouseChecked = mouseConfig && (mouseOpts.range || mouseOpts.checked)
    if (filterWrapper) {
      if (DomTools.getEventTargetNode(evnt, $el, 'vxe-cell--filter').flag) {
        // 如果点击了筛选按钮
      } else if (DomTools.getEventTargetNode(evnt, filterWrapper.$el).flag) {
        // 如果点击筛选容器
      } else {
        this.preventEvent(evnt, 'event.clearFilter', filterStore.args, this.closeFilter)
      }
    }
    // 如果已激活了编辑状态
    if (actived.row) {
      if (!(editOpts.autoClear === false)) {
        if (validTip && DomTools.getEventTargetNode(evnt, validTip.$el).flag) {
          // 如果是激活状态，且点击了校验提示框
        } else if (!this.lastCallTime || this.lastCallTime + 50 < Date.now()) {
          // 如果是激活状态，且点击了下拉选项
          if (!DomTools.getEventTargetNode(evnt, document.body, 'vxe-dropdown--panel').flag) {
            // 如果手动调用了激活单元格，避免触发源被移除后导致重复关闭
            this.preventEvent(evnt, 'event.clearActived', actived.args, () => {
              let isClear
              if (editOpts.mode === 'row') {
                const rowNode = DomTools.getEventTargetNode(evnt, $el, 'vxe-body--row')
                // row 方式，如果点击了不同行
                isClear = rowNode.flag ? getRowNode(rowNode.targetElem).item !== getRowNode(actived.args.cell.parentNode).item : false
              } else {
                // cell 方式，如果是非编辑列
                isClear = !DomTools.getEventTargetNode(evnt, $el, 'col--edit').flag
              }
              if (!isClear) {
                isClear = DomTools.getEventTargetNode(evnt, $el, 'vxe-header--row').flag
              }
              if (!isClear) {
                isClear = DomTools.getEventTargetNode(evnt, $el, 'vxe-footer--row').flag
              }
              if (
                isClear ||
                  // 如果点击了当前表格之外
                  !DomTools.getEventTargetNode(evnt, $el).flag
              ) {
                // this.triggerValidate('blur').then(a => {
                // 保证 input 的 change 事件能先触发之后再清除
                setTimeout(() => this.clearActived(evnt))
                // }).catch(e => e)
              }
            })
          }
        }
      }
    } else if (mouseConfig) {
      if (!DomTools.getEventTargetNode(evnt, $el).flag && !DomTools.getEventTargetNode(evnt, $refs.tableWrapper).flag) {
        if (isMouseChecked) {
          this.clearIndexChecked()
          this.clearHeaderChecked()
          this.clearChecked()
        }
        this.clearSelected()
      }
    }
    // 如果配置了快捷菜单且，点击了其他地方则关闭
    if (ctxMenuStore.visible && this.$refs.ctxWrapper && !DomTools.getEventTargetNode(evnt, this.$refs.ctxWrapper.$el).flag) {
      this.closeMenu()
    }
    // 最后激活的表格
    this.isActivated = DomTools.getEventTargetNode(evnt, (this.$xegrid || this).$el).flag
  },
  /**
   * 窗口失焦事件处理
   */
  handleGlobalBlurEvent () {
    this.closeFilter()
    this.closeMenu()
  },
  /**
   * 全局滚动事件
   */
  handleGlobalMousewheelEvent () {
    this.clostTooltip()
    this.closeMenu()
  },
  /**
   * 全局键盘事件
   */
  handleGlobalKeydownEvent (evnt) {
    // 该行为只对当前激活的表格有效
    if (this.isActivated) {
      this.preventEvent(evnt, 'event.keydown', { $table: this }, () => {
        const { isCtxMenu, ctxMenuStore, editStore, editOpts, mouseConfig = {}, keyboardConfig = {}, treeConfig, treeOpts, highlightCurrentRow, currentRow } = this
        const { selected, actived } = editStore
        const keyCode = evnt.keyCode
        const isBack = keyCode === 8
        const isTab = keyCode === 9
        const isEnter = keyCode === 13
        const isEsc = keyCode === 27
        const isSpacebar = keyCode === 32
        const isLeftArrow = keyCode === 37
        const isUpArrow = keyCode === 38
        const isRightArrow = keyCode === 39
        const isDwArrow = keyCode === 40
        const isDel = keyCode === 46
        const isA = keyCode === 65
        const isC = keyCode === 67
        const isV = keyCode === 86
        const isX = keyCode === 88
        const isF2 = keyCode === 113
        const isCtrlKey = evnt.ctrlKey
        const isShiftKey = evnt.shiftKey
        const operArrow = isLeftArrow || isUpArrow || isRightArrow || isDwArrow
        const operCtxMenu = isCtxMenu && ctxMenuStore.visible && (isEnter || isSpacebar || operArrow)
        let params
        if (isEsc) {
          // 如果按下了 Esc 键，关闭快捷菜单、筛选
          this.closeMenu()
          this.closeFilter()
          // 如果是激活编辑状态，则取消编辑
          if (actived.row) {
            params = actived.args
            this.clearActived(evnt)
            // 如果配置了选中功能，则为选中状态
            if (mouseConfig.selected) {
              this.$nextTick(() => this.handleSelected(params, evnt))
            }
          }
        } else if (isSpacebar && (keyboardConfig.isArrow || keyboardConfig.isTab) && selected.row && selected.column && (selected.column.type === 'checkbox' || selected.column.type === 'selection' || selected.column.type === 'radio')) {
          // 在 v3.0 中废弃 type=selection
          // 空格键支持选中复选列
          evnt.preventDefault()
          // 在 v3.0 中废弃 type=selection
          if (selected.column.type === 'checkbox' || selected.column.type === 'selection') {
            this.handleToggleCheckRowEvent(selected.args, evnt)
          } else {
            this.triggerRadioRowEvent(evnt, selected.args)
          }
        } else if (isEnter && keyboardConfig.isEnter && (selected.row || actived.row || (treeConfig && highlightCurrentRow && currentRow))) {
          // 退出选中
          if (isCtrlKey) {
            // 如果是激活编辑状态，则取消编辑
            if (actived.row) {
              params = actived.args
              this.clearActived(evnt)
              // 如果配置了选中功能，则为选中状态
              if (mouseConfig.selected) {
                this.$nextTick(() => this.handleSelected(params, evnt))
              }
            }
          } else {
            // 如果是激活状态，退则出到上一行/下一行
            if (selected.row || actived.row) {
              if (isShiftKey) {
                this.moveSelected(selected.row ? selected.args : actived.args, isLeftArrow, true, isRightArrow, false, evnt)
              } else {
                this.moveSelected(selected.row ? selected.args : actived.args, isLeftArrow, false, isRightArrow, true, evnt)
              }
            } else if (treeConfig && highlightCurrentRow && currentRow) {
              // 如果是树形表格当前行回车移动到子节点
              const childrens = currentRow[treeOpts.children]
              if (childrens && childrens.length) {
                evnt.preventDefault()
                const targetRow = childrens[0]
                params = { $table: this, row: targetRow }
                this.setTreeExpansion(currentRow, true)
                  .then(() => this.scrollToRow(targetRow))
                  .then(() => this.triggerCurrentRowEvent(evnt, params))
              }
            }
          }
        } else if (operCtxMenu) {
          // 如果配置了右键菜单; 支持方向键操作、回车
          evnt.preventDefault()
          if (ctxMenuStore.showChild && UtilTools.hasChildrenList(ctxMenuStore.selected)) {
            this.moveCtxMenu(evnt, keyCode, ctxMenuStore, 'selectChild', 37, false, ctxMenuStore.selected.children)
          } else {
            this.moveCtxMenu(evnt, keyCode, ctxMenuStore, 'selected', 39, true, this.ctxMenuList)
          }
        } else if (isF2) {
          // 如果按下了 F2 键
          if (selected.row && selected.column) {
            evnt.preventDefault()
            this.handleActived(selected.args, evnt)
          }
        } else if (operArrow && keyboardConfig.isArrow) {
          // 如果按下了方向键
          if (selected.row && selected.column) {
            this.moveSelected(selected.args, isLeftArrow, isUpArrow, isRightArrow, isDwArrow, evnt)
          } else if ((isUpArrow || isDwArrow) && highlightCurrentRow && currentRow) {
            // 当前行按键上下移动
            this.moveCurrentRow(isUpArrow, isDwArrow, evnt)
          }
        } else if (isTab && keyboardConfig.isTab) {
          // 如果按下了 Tab 键切换
          if (selected.row || selected.column) {
            this.moveTabSelected(selected.args, isShiftKey, evnt)
          } else if (actived.row || actived.column) {
            this.moveTabSelected(actived.args, isShiftKey, evnt)
          }
        } else if (isDel || (treeConfig && highlightCurrentRow && currentRow ? isBack && keyboardConfig.isArrow : isBack)) {
          // 如果是删除键
          if (keyboardConfig.isDel && (selected.row || selected.column)) {
            UtilTools.setCellValue(selected.row, selected.column, null)
            if (isBack) {
              this.handleActived(selected.args, evnt)
            }
          } else if (isBack && keyboardConfig.isArrow && treeConfig && highlightCurrentRow && currentRow) {
            // 如果树形表格回退键关闭当前行返回父节点
            const { parent: parentRow } = XEUtils.findTree(this.afterFullData, item => item === currentRow, treeOpts)
            if (parentRow) {
              evnt.preventDefault()
              params = { $table: this, row: parentRow }
              this.setTreeExpansion(parentRow, false)
                .then(() => this.scrollToRow(parentRow))
                .then(() => this.triggerCurrentRowEvent(evnt, params))
            }
          }
        } else if (keyboardConfig.isCut && isCtrlKey && (isA || isX || isC || isV)) {
          // 如果开启复制功能
          if (isA) {
            this.handleAllChecked(evnt)
          } else if (isX || isC) {
            this.handleCopyed(isX, evnt)
          } else {
            this.handlePaste(evnt)
          }
        } else if (keyboardConfig.isEdit && !isCtrlKey && ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || (keyCode >= 186 && keyCode <= 192) || (keyCode >= 219 && keyCode <= 222) || keyCode === 32)) {
          // 如果是按下非功能键之外允许直接编辑
          if (selected.column && selected.row && selected.column.editRender) {
            if (!keyboardConfig.editMethod || !(keyboardConfig.editMethod(selected.args, evnt) === false)) {
              if (!editOpts.activeMethod || editOpts.activeMethod(selected.args)) {
                UtilTools.setCellValue(selected.row, selected.column, null)
                this.handleActived(selected.args, evnt)
              }
            }
          }
        }
        this.$emit('keydown', { $table: this }, evnt)
      })
    }
  },
  handleGlobalResizeEvent () {
    this.closeMenu()
    this.recalculate()
  },
  handleTooltipLeaveEvent () {
    const tooltipOpts = this.tooltipOpts
    setTimeout(() => {
      if (!this.tooltipActive) {
        this.clostTooltip()
      }
    }, tooltipOpts.leaveDelay)
  },
  handleTargetEnterEvent () {
    clearTimeout(this.tooltipTimeout)
    this.tooltipActive = true
    this.clostTooltip()
  },
  handleTargetLeaveEvent () {
    const tooltipOpts = this.tooltipOpts
    this.tooltipActive = false
    if (tooltipOpts.enterable) {
      this.tooltipTimeout = setTimeout(() => {
        if (!this.$refs.tooltip.isHover) {
          this.clostTooltip()
        }
      }, tooltipOpts.leaveDelay)
    } else {
      this.clostTooltip()
    }
  },
  /**
   * 触发表头 tooltip 事件
   */
  triggerHeaderTooltipEvent (evnt, params) {
    const { tooltipStore } = this
    const { cell, column } = params
    this.handleTargetEnterEvent()
    if (tooltipStore.column !== column || !tooltipStore.visible) {
      this.handleTooltip(evnt, cell, cell.querySelector('.vxe-cell--title'), column)
    }
  },
  /**
   * 触发表尾 tooltip 事件
   */
  triggerFooterTooltipEvent (evnt, params) {
    const { cell, column } = params
    const tooltipStore = this.tooltipStore
    this.handleTargetEnterEvent()
    if (tooltipStore.column !== column || !tooltipStore.visible) {
      this.handleTooltip(evnt, cell, cell.children[0], column)
    }
  },
  /**
   * 触发 tooltip 事件
   */
  triggerTooltipEvent (evnt, params) {
    const { editConfig, editOpts, editStore, tooltipStore } = this
    const { actived } = editStore
    const { cell, row, column } = params
    this.handleTargetEnterEvent()
    if (editConfig) {
      if ((editOpts.mode === 'row' && actived.row === row) || (actived.row === row && actived.column === column)) {
        return
      }
    }
    if (tooltipStore.column !== column || tooltipStore.row !== row || !tooltipStore.visible) {
      this.handleTooltip(evnt, cell, column.treeNode ? cell.querySelector('.vxe-tree-cell') : cell.children[0], column, row)
    }
  },
  /**
   * 处理显示 tooltip
   * @param {Event} evnt 事件
   * @param {ColumnConfig} column 列配置
   * @param {Row} row 行对象
   */
  handleTooltip (evnt, cell, overflowElem, column, row) {
    const tooltip = this.$refs.tooltip
    const content = overflowElem.textContent
    if (content && overflowElem.scrollWidth > overflowElem.clientWidth) {
      Object.assign(this.tooltipStore, {
        row,
        column,
        visible: true
      })
      if (tooltip) {
        tooltip.toVisible(cell, UtilTools.formatText(content))
      }
    }
    return this.$nextTick()
  },
  /**
   * 关闭 tooltip
   */
  clostTooltip () {
    const tooltip = this.$refs.tooltip
    Object.assign(this.tooltipStore, {
      row: null,
      column: null,
      content: null,
      visible: false
    })
    if (tooltip) {
      tooltip.close()
    }
    return this.$nextTick()
  },
  /**
   * 处理默认勾选
   */
  handleDefaultSelectionChecked () {
    const { fullDataRowIdData, checkboxOpts } = this
    const { checkAll, checkRowKeys } = checkboxOpts
    if (checkAll) {
      this.setAllCheckboxRow(true)
    } else if (checkRowKeys) {
      const defSelection = []
      checkRowKeys.forEach(rowid => {
        if (fullDataRowIdData[rowid]) {
          defSelection.push(fullDataRowIdData[rowid].row)
        }
      })
      this.setCheckboxRow(defSelection, true)
    }
  },
  // 在 v3.0 中废弃 setSelection
  setSelection (rows, value) {
    UtilTools.warn('vxe.error.delFunc', ['setSelection', 'setCheckboxRow'])
    return this.setCheckboxRow(rows, value)
  },
  /**
   * 用于多选行，设置行为选中状态，第二个参数为选中与否
   * @param {Array/Row} rows 行数据
   * @param {Boolean} value 是否选中
   */
  setCheckboxRow (rows, value) {
    if (rows && !XEUtils.isArray(rows)) {
      rows = [rows]
    }
    rows.forEach(row => this.handleSelectRow({ row }, !!value))
    return this.$nextTick()
  },
  isCheckedByRow (row) {
    UtilTools.warn('vxe.error.delFunc', ['isCheckedByRow', 'isCheckedByCheckboxRow'])
    return this.isCheckedByCheckboxRow(row)
  },
  isCheckedByCheckboxRow (row) {
    const { checkField: property } = this.checkboxOpts
    if (property) {
      return XEUtils.get(row, property)
    }
    return this.selection.indexOf(row) > -1
  },
  /**
   * 多选，行选中事件
   * value 选中true 不选false 不确定-1
   */
  handleSelectRow ({ row }, value) {
    const { selection, afterFullData, treeConfig, treeOpts, treeIndeterminates, checkboxOpts } = this
    const { checkField: property, checkStrictly, checkMethod } = checkboxOpts
    if (property) {
      if (treeConfig && !checkStrictly) {
        if (value === -1) {
          treeIndeterminates.push(row)
          XEUtils.set(row, property, false)
        } else {
          // 更新子节点状态
          XEUtils.eachTree([row], (item, $rowIndex) => {
            if (row === item || (!checkMethod || checkMethod({ row: item, $rowIndex }))) {
              XEUtils.set(item, property, value)
              this.handleCheckboxReserveRow(row, value)
            }
          }, treeOpts)
          XEUtils.remove(treeIndeterminates, item => item === row)
        }
        // 如果存在父节点，更新父节点状态
        const matchObj = XEUtils.findTree(afterFullData, item => item === row, treeOpts)
        if (matchObj && matchObj.parent) {
          let parentStatus
          const vItems = checkMethod ? matchObj.items.filter((item, $rowIndex) => checkMethod({ row: item, $rowIndex })) : matchObj.items
          const indeterminatesItem = XEUtils.find(matchObj.items, item => treeIndeterminates.indexOf(item) > -1)
          if (indeterminatesItem) {
            parentStatus = -1
          } else {
            const selectItems = matchObj.items.filter(item => XEUtils.get(item, property))
            parentStatus = selectItems.filter(item => vItems.indexOf(item) > -1).length === vItems.length ? true : (selectItems.length || value === -1 ? -1 : false)
          }
          return this.handleSelectRow({ row: matchObj.parent }, parentStatus)
        }
      } else {
        XEUtils.set(row, property, value)
        this.handleCheckboxReserveRow(row, value)
      }
    } else {
      if (treeConfig && !checkStrictly) {
        if (value === -1) {
          treeIndeterminates.push(row)
          XEUtils.remove(selection, item => item === row)
        } else {
          // 更新子节点状态
          XEUtils.eachTree([row], (item, $rowIndex) => {
            if (row === item || (!checkMethod || checkMethod({ row: item, $rowIndex }))) {
              if (value) {
                selection.push(item)
              } else {
                XEUtils.remove(selection, select => select === item)
              }
              this.handleCheckboxReserveRow(row, value)
            }
          }, treeOpts)
          XEUtils.remove(treeIndeterminates, item => item === row)
        }
        // 如果存在父节点，更新父节点状态
        const matchObj = XEUtils.findTree(afterFullData, item => item === row, treeOpts)
        if (matchObj && matchObj.parent) {
          let parentStatus
          const vItems = checkMethod ? matchObj.items.filter((item, $rowIndex) => checkMethod({ row: item, $rowIndex })) : matchObj.items
          const indeterminatesItem = XEUtils.find(matchObj.items, item => treeIndeterminates.indexOf(item) > -1)
          if (indeterminatesItem) {
            parentStatus = -1
          } else {
            const selectItems = matchObj.items.filter(item => selection.indexOf(item) > -1)
            parentStatus = selectItems.filter(item => vItems.indexOf(item) > -1).length === vItems.length ? true : (selectItems.length || value === -1 ? -1 : false)
          }
          return this.handleSelectRow({ row: matchObj.parent }, parentStatus)
        }
      } else {
        if (value) {
          if (selection.indexOf(row) === -1) {
            selection.push(row)
          }
        } else {
          XEUtils.remove(selection, item => item === row)
        }
        this.handleCheckboxReserveRow(row, value)
      }
    }
    this.checkSelectionStatus()
  },
  handleToggleCheckRowEvent (params, evnt) {
    const { selection, checkboxOpts } = this
    const { checkField: property } = checkboxOpts
    const { row } = params
    const value = property ? !XEUtils.get(row, property) : selection.indexOf(row) === -1
    if (evnt) {
      this.triggerCheckRowEvent(evnt, params, value)
    } else {
      this.handleSelectRow(params, value)
    }
  },
  triggerCheckRowEvent (evnt, params, value) {
    const { checkMethod } = this.checkboxOpts
    if (!checkMethod || checkMethod({ row: params.row, rowIndex: params.rowIndex, $rowIndex: params.$rowIndex })) {
      this.handleSelectRow(params, value)
      const records = this.getCheckboxRecords()
      // 在 v3.0 中废弃 select-change
      if (this.$listeners['select-change']) {
        UtilTools.warn('vxe.error.delEvent', ['select-change', 'checkbox-change'])
        this.$emit('select-change', Object.assign({ records, selection: records, reserves: this.getCheckboxReserveRecords(), checked: value, $table: this }, params), evnt)
      } else {
        this.$emit('checkbox-change', Object.assign({ records, selection: records, reserves: this.getCheckboxReserveRecords(), checked: value, $table: this }, params), evnt)
      }
    }
  },
  // 在 v3.0 中废弃 toggleRowSelection
  toggleRowSelection (row) {
    UtilTools.warn('vxe.error.delFunc', ['toggleRowSelection', 'toggleCheckboxRow'])
    return this.toggleCheckboxRow(row)
  },
  /**
   * 多选，切换某一行的选中状态
   */
  toggleCheckboxRow (row) {
    this.handleToggleCheckRowEvent({ row })
    return this.$nextTick()
  },
  // 在 v3.0 中废弃 setAllSelection
  setAllSelection (value) {
    UtilTools.warn('vxe.error.delFunc', ['setAllSelection', 'setAllCheckboxRow'])
    return this.setAllCheckboxRow(value)
  },
  /**
   * 用于多选行，设置所有行的选中状态
   * @param {Boolean} value 是否选中
   */
  setAllCheckboxRow (value) {
    const { afterFullData, treeConfig, treeOpts, selection, checkboxReserveRowMap, checkboxOpts } = this
    const { checkField: property, reserve, checkStrictly, checkMethod } = checkboxOpts
    let selectRows = []
    const beforeSelection = treeConfig ? [] : selection.filter(row => afterFullData.indexOf(row) === -1)
    if (!checkStrictly) {
      if (property) {
        const indexKey = `${treeConfig ? '$' : ''}rowIndex`
        const setValFn = (row, rowIndex) => {
          if (!checkMethod || checkMethod({ row, [indexKey]: rowIndex, $rowIndex: rowIndex })) {
            XEUtils.set(row, property, value)
          }
        }
        const clearValFn = (row, rowIndex) => {
          if (!checkMethod || (checkMethod({ row, [indexKey]: rowIndex, $rowIndex: rowIndex }) ? 0 : selection.indexOf(row) > -1)) {
            XEUtils.set(row, property, value)
          }
        }
        if (treeConfig) {
          XEUtils.eachTree(afterFullData, value ? setValFn : clearValFn, treeOpts)
        } else {
          afterFullData.forEach(value ? setValFn : clearValFn)
        }
      } else {
        if (treeConfig) {
          if (value) {
            XEUtils.eachTree(afterFullData, (row, $rowIndex) => {
              if (!checkMethod || checkMethod({ row, $rowIndex })) {
                selectRows.push(row)
              }
            }, treeOpts)
          } else {
            if (checkMethod) {
              XEUtils.eachTree(afterFullData, (row, $rowIndex) => {
                if (checkMethod({ row, $rowIndex }) ? 0 : selection.indexOf(row) > -1) {
                  selectRows.push(row)
                }
              }, treeOpts)
            }
          }
        } else {
          if (value) {
            if (checkMethod) {
              selectRows = afterFullData.filter((row, rowIndex) => selection.indexOf(row) > -1 || checkMethod({ row, rowIndex, $rowIndex: rowIndex }))
            } else {
              selectRows = afterFullData.slice(0)
            }
          } else {
            if (checkMethod) {
              selectRows = afterFullData.filter((row, rowIndex) => checkMethod({ row, rowIndex, $rowIndex: rowIndex }) ? 0 : selection.indexOf(row) > -1)
            }
          }
        }
      }
      if (reserve) {
        if (value) {
          selectRows.forEach(row => {
            checkboxReserveRowMap[UtilTools.getRowid(this, row)] = row
          })
        } else {
          afterFullData.forEach(row => {
            const rowid = UtilTools.getRowid(this, row)
            if (checkboxReserveRowMap[rowid]) {
              delete checkboxReserveRowMap[rowid]
            }
          })
        }
      }
      this.selection = beforeSelection.concat(selectRows)
    }
    this.treeIndeterminates = []
    this.checkSelectionStatus()
  },
  checkSelectionStatus () {
    const { afterFullData, selection, treeIndeterminates, checkboxOpts } = this
    const { checkField: property, checkStrictly, checkMethod } = checkboxOpts
    if (!checkStrictly) {
      if (property) {
        this.isAllSelected = afterFullData.length && afterFullData.every(
          checkMethod
            ? (row, rowIndex) => !checkMethod({ row, rowIndex, $rowIndex: rowIndex }) || XEUtils.get(row, property)
            : row => XEUtils.get(row, property)
        )
        this.isIndeterminate = !this.isAllSelected && afterFullData.some(row => XEUtils.get(row, property) || treeIndeterminates.indexOf(row) > -1)
      } else {
        this.isAllSelected = afterFullData.length && afterFullData.every(
          checkMethod
            ? (row, rowIndex) => !checkMethod({ row, rowIndex, $rowIndex: rowIndex }) || selection.indexOf(row) > -1
            : row => selection.indexOf(row) > -1
        )
        this.isIndeterminate = !this.isAllSelected && afterFullData.some(row => treeIndeterminates.indexOf(row) > -1 || selection.indexOf(row) > -1)
      }
    }
  },
  // 还原展开、选中等相关状态
  handleReserveStatus () {
    const { treeConfig, fullDataRowIdData, radioReserveRow, radioOpts, checkboxReserveRowMap, checkboxOpts } = this
    let reserveRadioRow = null
    const reserveSelection = []
    const reserveRowExpandeds = []
    const reserveTreeExpandeds = []
    const reserveTreeIndeterminates = []
    // 单选框
    if (radioOpts.reserve && radioReserveRow) {
      const rowid = UtilTools.getRowid(this, radioReserveRow)
      if (fullDataRowIdData[rowid]) {
        reserveRadioRow = fullDataRowIdData[rowid].row
      }
    }
    this.selectRow = reserveRadioRow
    // 复选框
    this.handleReserveByRowid(this.selection, reserveSelection)
    if (checkboxOpts.reserve) {
      XEUtils.each(checkboxReserveRowMap, (item, rowid) => {
        if (fullDataRowIdData[rowid] && reserveSelection.indexOf(fullDataRowIdData[rowid].row) === -1) {
          reserveSelection.push(fullDataRowIdData[rowid].row)
        }
      })
    }
    this.selection = reserveSelection
    // 行展开
    this.handleReserveByRowid(this.rowExpandeds, reserveRowExpandeds)
    this.rowExpandeds = reserveRowExpandeds
    // 树展开
    if (treeConfig) {
      this.handleReserveByRowid(this.treeIndeterminates, reserveTreeIndeterminates)
      this.handleReserveByRowid(this.treeExpandeds, reserveTreeExpandeds)
    }
    this.treeExpandeds = reserveTreeExpandeds
    this.treeIndeterminates = reserveTreeIndeterminates
  },
  handleReserveByRowid (list, rest) {
    const fullDataRowIdData = this.fullDataRowIdData
    list.forEach(row => {
      const rowid = UtilTools.getRowid(this, row)
      if (fullDataRowIdData[rowid]) {
        rest.push(fullDataRowIdData[rowid].row)
      }
    })
  },
  /**
   * 获取单选框保留选中的行
   */
  getRadioReserveRecord () {
    const { fullDataRowIdData, radioReserveRow, radioOpts } = this
    if (radioOpts.reserve && radioReserveRow) {
      if (!fullDataRowIdData[UtilTools.getRowid(this, radioReserveRow)]) {
        return radioReserveRow
      }
    }
    return null
  },
  clearRadioReserve () {
    this.radioReserveRow = null
    return this.$nextTick()
  },
  handleRadioReserveRow (row) {
    const { radioOpts } = this
    if (radioOpts.reserve) {
      this.radioReserveRow = row
    }
  },
  // 在 v3.0 中废弃 getSelectReserveRecords
  getSelectReserveRecords () {
    UtilTools.warn('vxe.error.delFunc', ['getSelectReserveRecords', 'getCheckboxReserveRecords'])
    return this.getCheckboxReserveRecords()
  },
  /**
   * 获取保留选中的行
   */
  getCheckboxReserveRecords () {
    const { fullDataRowIdData, checkboxReserveRowMap, checkboxOpts } = this
    const reserveSelection = []
    if (checkboxOpts.reserve) {
      Object.keys(checkboxReserveRowMap).forEach(rowid => {
        if (!fullDataRowIdData[rowid]) {
          reserveSelection.push(checkboxReserveRowMap[rowid])
        }
      })
    }
    return reserveSelection
  },
  // 在 v3.0 中废弃 clearSelectReserve
  clearSelectReserve () {
    UtilTools.warn('vxe.error.delFunc', ['clearSelectReserve', 'clearCheckboxReserve'])
    return this.clearCheckboxReserve()
  },
  clearCheckboxReserve () {
    this.checkboxReserveRowMap = {}
    return this.$nextTick()
  },
  handleCheckboxReserveRow (row, checked) {
    const { checkboxReserveRowMap, checkboxOpts } = this
    if (checkboxOpts.reserve) {
      const rowid = UtilTools.getRowid(this, row)
      if (checked) {
        checkboxReserveRowMap[rowid] = row
      } else if (checkboxReserveRowMap[rowid]) {
        delete checkboxReserveRowMap[rowid]
      }
    }
  },
  /**
   * 多选，选中所有事件
   */
  triggerCheckAllEvent (evnt, value) {
    this.setAllCheckboxRow(value)
    const records = this.getCheckboxRecords()
    // 在 v3.0 中废弃 select-all
    if (this.$listeners['select-all']) {
      UtilTools.warn('vxe.error.delEvent', ['select-all', 'checkbox-all'])
      this.$emit('select-all', { records, selection: records, reserves: this.getCheckboxReserveRecords(), checked: value, $table: this }, evnt)
    } else {
      this.$emit('checkbox-all', { records, selection: records, reserves: this.getCheckboxReserveRecords(), checked: value, $table: this }, evnt)
    }
  },
  // 在 v3.0 中废弃 toggleAllSelection
  toggleAllSelection () {
    UtilTools.warn('vxe.error.delFunc', ['toggleAllSelection', 'toggleAllCheckboxRow'])
    return this.toggleAllCheckboxRow()
  },
  /**
   * 多选，切换所有行的选中状态
   */
  toggleAllCheckboxRow () {
    this.triggerCheckAllEvent(null, !this.isAllSelected)
    return this.$nextTick()
  },
  // 在 v3.0 中废弃 clearSelection
  clearSelection () {
    UtilTools.warn('vxe.error.delFunc', ['clearSelection', 'clearCheckboxRow'])
    return this.clearCheckboxRow()
  },
  /**
   * 用于多选行，手动清空用户的选择
   */
  clearCheckboxRow () {
    const { tableFullData, treeConfig, treeOpts, checkboxOpts } = this
    const { checkField: property } = checkboxOpts
    if (property) {
      if (treeConfig) {
        XEUtils.eachTree(tableFullData, item => XEUtils.set(item, property, false), treeOpts)
      } else {
        tableFullData.forEach(item => XEUtils.set(item, property, false))
      }
    }
    this.isAllSelected = false
    this.isIndeterminate = false
    this.selection = []
    this.treeIndeterminates = []
    return this.$nextTick()
  },
  /**
   * 处理单选框默认勾选
   */
  handleDefaultRadioChecked () {
    const { radioOpts, fullDataRowIdData } = this
    const { checkRowKey: rowid } = radioOpts
    if (rowid && fullDataRowIdData[rowid]) {
      this.setRadioRow(fullDataRowIdData[rowid].row)
    }
  },
  /**
   * 单选，行选中事件
   */
  triggerRadioRowEvent (evnt, params) {
    const { radioOpts } = this
    const { checkMethod } = radioOpts
    if (!checkMethod || checkMethod({ row: params.row, rowIndex: params.rowIndex, $rowIndex: params.$rowIndex })) {
      const isChange = this.selectRow !== params.row
      this.setRadioRow(params.row)
      if (isChange) {
        this.$emit('radio-change', params, evnt)
      }
    }
  },
  triggerCurrentRowEvent (evnt, params) {
    const isChange = this.currentRow !== params.row
    this.setCurrentRow(params.row)
    if (isChange) {
      this.$emit('current-change', params, evnt)
    }
  },
  /**
   * 用于当前行，设置某一行为高亮状态
   * @param {Row} row 行对象
   */
  setCurrentRow (row) {
    this.clearCurrentRow()
    this.clearCurrentColumn()
    this.currentRow = row
    if (this.highlightCurrentRow) {
      XEUtils.arrayEach(this.$el.querySelectorAll(`[data-rowid="${UtilTools.getRowid(this, row)}"]`), elem => DomTools.addClass(elem, 'row--current'))
    }
    return this.$nextTick()
  },
  isCheckedByRadioRow (row) {
    return this.selectRow === row
  },
  /**
   * 用于单选行，设置某一行为选中状态
   * @param {Row} row 行对象
   */
  setRadioRow (row) {
    if (this.selectRow !== row) {
      this.clearRadioRow()
    }
    this.selectRow = row
    this.handleRadioReserveRow(row)
    return this.$nextTick()
  },
  /**
   * 用于当前行，手动清空当前高亮的状态
   */
  clearCurrentRow () {
    this.currentRow = null
    this.hoverRow = null
    XEUtils.arrayEach(this.$el.querySelectorAll('.row--current'), elem => DomTools.removeClass(elem, 'row--current'))
    return this.$nextTick()
  },
  /**
   * 用于单选行，手动清空用户的选择
   */
  clearRadioRow () {
    this.selectRow = null
    return this.$nextTick()
  },
  // 在 v3.0 中废弃 getCurrentRow
  getCurrentRow () {
    UtilTools.warn('vxe.error.delFunc', ['getCurrentRow', 'getCurrentRecord'])
    return this.getCurrentRecord()
  },
  /**
   * 用于当前行，获取当前行的数据
   */
  getCurrentRecord () {
    return this.currentRow
  },
  // 在 v3.0 中废弃 getRadioRow
  getRadioRow () {
    UtilTools.warn('vxe.error.delFunc', ['getRadioRow', 'getRadioRecord'])
    return this.getRadioRecord()
  },
  /**
   * 用于单选行，获取当已选中的数据
   */
  getRadioRecord () {
    return this.selectRow
  },
  /**
   * 行 hover 事件
   */
  triggerHoverEvent (evnt, { row }) {
    this.setHoverRow(row)
  },
  setHoverRow (row) {
    const rowid = UtilTools.getRowid(this, row)
    this.clearHoverRow()
    XEUtils.arrayEach(this.$el.querySelectorAll(`[data-rowid="${rowid}"]`), elem => DomTools.addClass(elem, 'row--hover'))
    this.hoverRow = row
  },
  clearHoverRow () {
    XEUtils.arrayEach(this.$el.querySelectorAll('.vxe-body--row.row--hover'), elem => DomTools.removeClass(elem, 'row--hover'))
    this.hoverRow = null
  },
  triggerHeaderCellClickEvent (evnt, params) {
    const { _lastResizeTime, sortOpts } = this
    const { column, cell } = params
    const triggerResizable = _lastResizeTime && _lastResizeTime > Date.now() - 300
    const triggerSort = DomTools.getEventTargetNode(evnt, cell, 'vxe-cell--sort').flag
    const triggerFilter = DomTools.getEventTargetNode(evnt, cell, 'vxe-cell--filter').flag
    if (sortOpts.trigger === 'cell' && !(triggerResizable || triggerSort || triggerFilter)) {
      this.triggerSortEvent(evnt, column, column.order ? (column.order === 'desc' ? '' : 'desc') : 'asc')
    }
    UtilTools.emitEvent(this, 'header-cell-click', [Object.assign({ triggerResizable, triggerSort, triggerFilter }, params), evnt])
    if (this.highlightCurrentColumn) {
      return this.setCurrentColumn(column)
    }
    return this.$nextTick()
  },
  /**
   * 用于当前列，设置某列行为高亮状态
   * @param {ColumnConfig} column 列配置
   */
  setCurrentColumn (column) {
    this.clearCurrentRow()
    this.clearCurrentColumn()
    this.currentColumn = column
    return this.$nextTick()
  },
  /**
   * 用于当前列，手动清空当前高亮的状态
   */
  clearCurrentColumn () {
    this.currentColumn = null
    return this.$nextTick()
  },
  checkValidate (type) {
    if (VXETable._valid) {
      return this.triggerValidate(type)
    }
    return this.$nextTick()
  },
  /**
   * 当单元格发生改变时
   * 如果存在规则，则校验
   */
  handleChangeCell (evnt, params) {
    this.checkValidate('blur')
      .catch(e => e)
      .then(() => {
        this.handleActived(params, evnt)
          .then(() => this.checkValidate('change'))
          .catch(e => e)
      })
  },
  /**
   * 列点击事件
   * 如果是单击模式，则激活为编辑状态
   * 如果是双击模式，则单击后选中状态
   */
  triggerCellClickEvent (evnt, params) {
    const { $el, highlightCurrentRow, editStore, radioOpts, expandOpts, treeOpts, editConfig, editOpts, checkboxOpts, mouseConfig, mouseOpts } = this
    const { actived } = editStore
    const { row, column } = params
    // 在 v3.0 中废弃 mouse-config.checked
    const isMouseChecked = mouseConfig && (mouseOpts.range || mouseOpts.checked)
    // 解决 checkbox 重复触发两次问题
    if (isTargetRadioOrCheckbox(evnt, column, 'radio') || isTargetRadioOrCheckbox(evnt, column, 'checkbox', 'checkbox') || isTargetRadioOrCheckbox(evnt, column, 'selection', 'checkbox')) {
      // 在 v3.0 中废弃 type=selection
      return
    }
    // 如果是展开行
    if ((expandOpts.trigger === 'row' || (column.type === 'expand' && expandOpts.trigger === 'cell')) && !DomTools.getEventTargetNode(evnt, $el, 'vxe-table--expanded').flag) {
      this.triggerRowExpandEvent(evnt, params)
    }
    // 如果是树形表格
    if ((treeOpts.trigger === 'row' || (column.treeNode && treeOpts.trigger === 'cell'))) {
      this.triggerTreeExpandEvent(evnt, params)
    }
    if ((!column.treeNode || !DomTools.getEventTargetNode(evnt, $el, 'vxe-tree--btn-wrapper').flag) && (column.type !== 'expand' || !DomTools.getEventTargetNode(evnt, $el, 'vxe-table--expanded').flag)) {
      // 如果是高亮行
      if (highlightCurrentRow) {
        if (radioOpts.trigger === 'row' || (!DomTools.getEventTargetNode(evnt, $el, 'vxe-cell--checkbox').flag && !DomTools.getEventTargetNode(evnt, $el, 'vxe-cell--radio').flag)) {
          this.triggerCurrentRowEvent(evnt, params)
        }
      }
      // 如果是单选框
      if ((radioOpts.trigger === 'row' || (column.type === 'radio' && radioOpts.trigger === 'cell')) && !DomTools.getEventTargetNode(evnt, $el, 'vxe-cell--radio').flag) {
        this.triggerRadioRowEvent(evnt, params)
      }
      // 如果是复选框
      if ((checkboxOpts.trigger === 'row' || ((column.type === 'checkbox' || column.type === 'selection') && checkboxOpts.trigger === 'cell')) && !DomTools.getEventTargetNode(evnt, params.cell, 'vxe-cell--checkbox').flag) {
        // 在 v3.0 中废弃 type=selection
        this.handleToggleCheckRowEvent(params, evnt)
      }
      // 如果设置了单元格选中功能，则不会使用点击事件去处理（只能支持双击模式）
      if (!isMouseChecked) {
        if (editConfig) {
          if (editOpts.trigger === 'manual') {
            if (actived.args && actived.row === row && column !== actived.column) {
              this.handleChangeCell(evnt, params)
            }
          } else if (!actived.args || row !== actived.row || column !== actived.column) {
            if (editOpts.trigger === 'click') {
              this.handleChangeCell(evnt, params)
            } else if (editOpts.trigger === 'dblclick') {
              if (editOpts.mode === 'row' && actived.row === row) {
                this.handleChangeCell(evnt, params)
              }
            }
          }
        }
      }
    }
    UtilTools.emitEvent(this, 'cell-click', [params, evnt])
  },
  /**
   * 列双击点击事件
   * 如果是双击模式，则激活为编辑状态
   */
  triggerCellDBLClickEvent (evnt, params) {
    const { editStore, editConfig, editOpts } = this
    const { actived } = editStore
    if (editConfig && editOpts.trigger === 'dblclick') {
      if (!actived.args || evnt.currentTarget !== actived.args.cell) {
        if (editOpts.mode === 'row') {
          this.checkValidate('blur')
            .catch(e => e)
            .then(() => {
              this.handleActived(params, evnt)
                .then(() => this.checkValidate('change'))
                .catch(e => e)
            })
        } else if (editOpts.mode === 'cell') {
          this.handleActived(params, evnt)
            .then(() => this.checkValidate('change'))
            .catch(e => e)
        }
      }
    }
    UtilTools.emitEvent(this, 'cell-dblclick', [params, evnt])
  },
  handleDefaultSort () {
    const defaultSort = this.sortOpts.defaultSort
    if (defaultSort) {
      const { field, order } = defaultSort
      if (field && order) {
        const column = XEUtils.find(this.visibleColumn, item => item.property === field)
        if (column && !column.order) {
          this.sort(field, order)
        }
      }
    }
  },
  /**
   * 点击排序事件
   */
  triggerSortEvent (evnt, column, order) {
    const property = column.property
    if (column.sortable || column.remoteSort) {
      const evntParams = { column, property, field: property, prop: property, order, $table: this }
      if (!order || column.order === order) {
        evntParams.order = null
        this.clearSort()
      } else {
        this.sort(property, order)
      }
      UtilTools.emitEvent(this, 'sort-change', [evntParams, evnt])
    }
  },
  sort (field, order) {
    const { visibleColumn, tableFullColumn, remoteSort, sortOpts } = this
    const column = XEUtils.find(visibleColumn, item => item.property === field)
    if (column) {
      const isRemote = XEUtils.isBoolean(column.remoteSort) ? column.remoteSort : (sortOpts.remote || remoteSort)
      if (column.sortable || column.remoteSort) {
        if (!order) {
          order = column.order === 'desc' ? 'asc' : 'desc'
        }
        if (column.order !== order) {
          tableFullColumn.forEach(column => {
            column.order = null
          })
          column.order = order
          // 如果是服务端排序，则跳过本地排序处理
          if (!isRemote) {
            this.handleTableData(true)
          }
        }
        return this.$nextTick().then(this.updateStyle)
      }
    }
    return this.$nextTick()
  },
  /**
   * 手动清空排序条件，数据会恢复成未排序的状态
   */
  clearSort () {
    this.tableFullColumn.forEach(column => {
      column.order = null
    })
    return this.handleTableData(true)
  },
  getSortColumn () {
    return this.visibleColumn.find(column => column.sortable && column.order)
  },
  /**
   * 关闭筛选
   * @param {Event} evnt 事件
   */
  closeFilter () {
    Object.assign(this.filterStore, {
      isAllSelected: false,
      isIndeterminate: false,
      options: [],
      visible: false
    })
    return this.$nextTick()
  },
  /**
   * 判断指定列是否为筛选状态，如果为空则判断所有列
   * @param {String} field 字段名
   */
  isFilter (field) {
    if (field) {
      const column = this.getColumnByField(field)
      return column.filters && column.filters.some(option => option.checked)
    }
    return this.visibleColumn.some(column => column.filters && column.filters.some(option => option.checked))
  },
  /**
   * 判断展开行是否懒加载完成
   * @param {Row} row 行对象
   */
  isRowExpandLoaded (row) {
    const rest = this.fullAllDataRowMap.get(row)
    return rest && rest.expandLoaded
  },
  clearRowExpandLoaded (row) {
    const { expandOpts, expandLazyLoadeds, fullAllDataRowMap } = this
    const { lazy } = expandOpts
    const rest = fullAllDataRowMap.get(row)
    if (lazy && rest) {
      rest.expandLoaded = false
      XEUtils.remove(expandLazyLoadeds, item => row === item)
    }
    return this.$nextTick()
  },
  /**
   * 重新加载展开行的内容
   * @param {Row} row 行对象
   */
  reloadExpandContent (row) {
    const { expandOpts, expandLazyLoadeds } = this
    const { lazy } = expandOpts
    if (lazy && expandLazyLoadeds.indexOf(row) === -1) {
      this.clearRowExpandLoaded(row)
        .then(() => this.handleAsyncRowExpand(row))
    }
    return this.$nextTick()
  },
  /**
   * 展开行事件
   */
  triggerRowExpandEvent (evnt, params) {
    const { $listeners, expandOpts, expandLazyLoadeds, expandColumn: column } = this
    const { row } = params
    const { lazy } = expandOpts
    if (!lazy || expandLazyLoadeds.indexOf(row) === -1) {
      const expanded = !this.isExpandByRow(row)
      const columnIndex = this.getColumnIndex(column)
      const $columnIndex = this.$getColumnIndex(column)
      this.setRowExpansion(row, expanded)
      // 在 v3.0 中废弃 toggle-expand-change
      if ($listeners['toggle-expand-change']) {
        UtilTools.warn('vxe.error.delEvent', ['toggle-expand-change', 'toggle-row-expand'])
        UtilTools.emitEvent(this, 'toggle-expand-change', [{ expanded, column, columnIndex, $columnIndex, row, rowIndex: this.getRowIndex(row), $rowIndex: this.$getRowIndex(row), $table: this }, evnt])
      } else {
        UtilTools.emitEvent(this, 'toggle-row-expand', [{ expanded, column, columnIndex, $columnIndex, row, rowIndex: this.getRowIndex(row), $rowIndex: this.$getRowIndex(row), $table: this }, evnt])
      }
    }
  },
  /**
   * 切换展开行
   */
  toggleRowExpansion (row) {
    return this.setRowExpansion(row, !this.isExpandByRow(row))
  },
  /**
   * 处理默认展开行
   */
  handleDefaultRowExpand () {
    const { expandOpts, fullDataRowIdData } = this
    const { expandAll, expandRowKeys } = expandOpts
    if (expandAll) {
      this.setAllRowExpansion(true)
    } else if (expandRowKeys) {
      const defExpandeds = []
      expandRowKeys.forEach(rowid => {
        if (fullDataRowIdData[rowid]) {
          defExpandeds.push(fullDataRowIdData[rowid].row)
        }
      })
      this.setRowExpansion(defExpandeds, true)
    }
  },
  /**
   * 设置所有行的展开与否
   * @param {Boolean} expanded 是否展开
   */
  setAllRowExpansion (expanded) {
    return this.setRowExpansion(this.expandOpts.lazy ? this.tableData : this.tableFullData, expanded)
  },
  handleAsyncRowExpand (row) {
    const rest = this.fullAllDataRowMap.get(row)
    return new Promise(resolve => {
      this.expandLazyLoadeds.push(row)
      this.expandOpts.loadMethod({ $table: this, row, rowIndex: this.getRowIndex(row), $rowIndex: this.$getRowIndex(row) }).catch(e => e).then(() => {
        rest.expandLoaded = true
        XEUtils.remove(this.expandLazyLoadeds, item => item === row)
        this.rowExpandeds.push(row)
        resolve(this.$nextTick().then(this.recalculate))
      })
    })
  },
  /**
   * 设置展开行，二个参数设置这一行展开与否
   * 支持单行
   * 支持多行
   * @param {Array/Row} rows 行数据
   * @param {Boolean} expanded 是否展开
   */
  setRowExpansion (rows, expanded) {
    const { fullAllDataRowMap, expandLazyLoadeds, expandOpts, expandColumn: column } = this
    let { rowExpandeds } = this
    const { lazy, accordion, toggleMethod } = expandOpts
    const lazyRests = []
    const columnIndex = this.getColumnIndex(column)
    const $columnIndex = this.$getColumnIndex(column)
    if (rows) {
      if (!XEUtils.isArray(rows)) {
        rows = [rows]
      }
      if (accordion) {
        // 只能同时展开一个
        rowExpandeds = []
        rows = rows.slice(rows.length - 1, rows.length)
      }
      if (expanded) {
        rows.forEach(row => {
          if ((!toggleMethod || toggleMethod({ expanded, column, columnIndex, $columnIndex, row, rowIndex: this.getRowIndex(row), $rowIndex: this.$getRowIndex(row) })) && rowExpandeds.indexOf(row) === -1) {
            const rest = fullAllDataRowMap.get(row)
            const isLoad = lazy && !rest.expandLoaded && expandLazyLoadeds.indexOf(row) === -1
            if (isLoad) {
              lazyRests.push(this.handleAsyncRowExpand(row))
            } else {
              rowExpandeds.push(row)
            }
          }
        })
      } else {
        XEUtils.remove(rowExpandeds, row => (!toggleMethod || toggleMethod({ expanded, column, columnIndex, $columnIndex, row, rowIndex: this.getRowIndex(row), $rowIndex: this.$getRowIndex(row) })) && rows.indexOf(row) > -1)
      }
    }
    this.rowExpandeds = rowExpandeds
    return Promise.all(lazyRests).then(this.recalculate)
  },
  // 在 v3.0 中废弃 getRecords
  hasRowExpand (row) {
    UtilTools.warn('vxe.error.delFunc', ['hasRowExpand', 'isExpandByRow'])
    return this.isExpandByRow(row)
  },
  /**
   * 判断行是否为展开状态
   * @param {Row} row 行对象
   */
  isExpandByRow (row) {
    return this.rowExpandeds.indexOf(row) > -1
  },
  /**
   * 手动清空展开行状态，数据会恢复成未展开的状态
   */
  clearRowExpand () {
    const isExists = this.rowExpandeds.length
    this.rowExpandeds = []
    return this.$nextTick().then(() => isExists ? this.recalculate() : 0)
  },
  getRowExpandRecords () {
    return this.rowExpandeds.slice(0)
  },
  getTreeExpandRecords () {
    return this.treeExpandeds.slice(0)
  },
  /**
   * 获取数表格状态
   */
  getTreeStatus () {
    if (this.treeConfig) {
      return {
        config: this.treeOpts,
        rowExpandeds: this.getTreeExpandRecords()
      }
    }
    return null
  },
  /**
   * 判断树节点是否懒加载完成
   * @param {Row} row 行对象
   */
  isTreeExpandLoaded (row) {
    const rest = this.fullAllDataRowMap.get(row)
    return rest && rest.treeLoaded
  },
  clearTreeExpandLoaded (row) {
    const { treeOpts, treeExpandeds, fullAllDataRowMap } = this
    const { lazy } = treeOpts
    const rest = fullAllDataRowMap.get(row)
    if (lazy && rest) {
      rest.treeLoaded = false
      XEUtils.remove(treeExpandeds, item => row === item)
    }
    return this.$nextTick()
  },
  /**
   * 重新加载树的子节点
   * @param {Row} row 行对象
   */
  reloadTreeChilds (row) {
    const { treeOpts, treeLazyLoadeds } = this
    const { lazy, hasChild } = treeOpts
    if (lazy && row[hasChild] && treeLazyLoadeds.indexOf(row) === -1) {
      this.clearTreeExpandLoaded(row)
        .then(() => this.handleAsyncTreeExpandChilds(row))
    }
    return this.$nextTick()
  },
  /**
   * 展开树节点事件
   */
  triggerTreeExpandEvent (evnt, params) {
    const { $listeners, treeOpts, treeLazyLoadeds, expandColumn: column } = this
    const { row } = params
    const { lazy } = treeOpts
    if (!lazy || treeLazyLoadeds.indexOf(row) === -1) {
      const expanded = !this.isTreeExpandByRow(row)
      const columnIndex = this.getColumnIndex(column)
      const $columnIndex = this.$getColumnIndex(column)
      this.setTreeExpansion(row, expanded)
      // 在 v3.0 中废弃 toggle-tree-change
      if ($listeners['toggle-tree-change']) {
        UtilTools.warn('vxe.error.delEvent', ['toggle-tree-change', 'toggle-tree-expand'])
        UtilTools.emitEvent(this, 'toggle-tree-change', [{ expanded, column, columnIndex, $columnIndex, row, $table: this }, evnt])
      } else {
        UtilTools.emitEvent(this, 'toggle-tree-expand', [{ expanded, column, columnIndex, $columnIndex, row, $table: this }, evnt])
      }
    }
  },
  /**
   * 切换/展开树节点
   */
  toggleTreeExpansion (row) {
    return this.setTreeExpansion(row, !this.isTreeExpandByRow(row))
  },
  /**
   * 处理默认展开树节点
   */
  handleDefaultTreeExpand () {
    const { treeConfig, treeOpts, tableFullData } = this
    if (treeConfig) {
      const { expandAll, expandRowKeys } = treeOpts
      if (expandAll) {
        this.setAllTreeExpansion(true)
      } else if (expandRowKeys) {
        const defExpandeds = []
        const rowkey = UtilTools.getRowkey(this)
        expandRowKeys.forEach(rowid => {
          const matchObj = XEUtils.findTree(tableFullData, item => rowid === XEUtils.get(item, rowkey), treeOpts)
          if (matchObj) {
            defExpandeds.push(matchObj.item)
          }
        })
        this.setTreeExpansion(defExpandeds, true)
      }
    }
  },
  handleAsyncTreeExpandChilds (row) {
    const { fullAllDataRowMap, treeExpandeds, treeOpts, treeLazyLoadeds } = this
    const { loadMethod, children } = treeOpts
    const rest = fullAllDataRowMap.get(row)
    return new Promise(resolve => {
      treeLazyLoadeds.push(row)
      loadMethod({ $table: this, row }).catch(() => []).then(childs => {
        rest.treeLoaded = true
        XEUtils.remove(treeLazyLoadeds, item => item === row)
        if (!XEUtils.isArray(childs)) {
          childs = []
        }
        if (childs) {
          row[children] = childs
          this.appendTreeCache(row, childs)
          if (childs.length && treeExpandeds.indexOf(row) === -1) {
            treeExpandeds.push(row)
          }
          // 如果当前节点已选中，则展开后子节点也被选中
          if (this.isCheckedByCheckboxRow(row)) {
            this.setCheckboxRow(childs, true)
          }
        }
        resolve(this.$nextTick().then(this.recalculate))
      })
    })
  },
  /**
   * 设置所有树节点的展开与否
   * @param {Boolean} expanded 是否展开
   */
  setAllTreeExpansion (expanded) {
    const { tableFullData, treeOpts } = this
    const { lazy, children } = treeOpts
    const expandeds = []
    XEUtils.eachTree(tableFullData, row => {
      const rowChildren = row[children]
      if (lazy || (rowChildren && rowChildren.length)) {
        expandeds.push(row)
      }
    }, treeOpts)
    return this.setTreeExpansion(expandeds, expanded)
  },
  /**
   * 设置展开树形节点，二个参数设置这一行展开与否
   * 支持单行
   * 支持多行
   * @param {Array/Row} rows 行数据
   * @param {Boolean} expanded 是否展开
   */
  setTreeExpansion (rows, expanded) {
    const { fullAllDataRowMap, tableFullData, treeExpandeds, treeOpts, treeLazyLoadeds, expandColumn: column } = this
    const { lazy, hasChild, children, accordion, toggleMethod } = treeOpts
    const result = []
    const columnIndex = this.getColumnIndex(column)
    const $columnIndex = this.$getColumnIndex(column)
    if (rows) {
      if (!XEUtils.isArray(rows)) {
        rows = [rows]
      }
      if (rows.length) {
        if (accordion) {
          rows = rows.slice(rows.length - 1, rows.length)
          // 同一级只能展开一个
          const matchObj = XEUtils.findTree(tableFullData, item => item === rows[0], treeOpts)
          XEUtils.remove(treeExpandeds, item => matchObj.items.indexOf(item) > -1)
        }
        if (expanded) {
          rows.forEach(row => {
            if ((!toggleMethod || toggleMethod({ expanded, column, columnIndex, $columnIndex, row })) && treeExpandeds.indexOf(row) === -1) {
              const rest = fullAllDataRowMap.get(row)
              const isLoad = lazy && row[hasChild] && !rest.treeLoaded && treeLazyLoadeds.indexOf(row) === -1
              // 是否使用懒加载
              if (isLoad) {
                result.push(this.handleAsyncTreeExpandChilds(row))
              } else {
                if (row[children] && row[children].length) {
                  treeExpandeds.push(row)
                }
              }
            }
          })
        } else {
          XEUtils.remove(treeExpandeds, row => (!toggleMethod || toggleMethod({ expanded, column, columnIndex, $columnIndex, row })) && rows.indexOf(row) > -1)
        }
        return Promise.all(result).then(this.recalculate)
      }
    }
    return Promise.resolve()
  },
  // 在 v3.0 中废弃 hasTreeExpand
  hasTreeExpand (row) {
    UtilTools.warn('vxe.error.delFunc', ['hasTreeExpand', 'isTreeExpandByRow'])
    return this.isTreeExpandByRow(row)
  },
  /**
   * 判断行是否为树形节点展开状态
   * @param {Row} row 行对象
   */
  isTreeExpandByRow (row) {
    return this.treeExpandeds.indexOf(row) > -1
  },
  /**
   * 手动清空树形节点的展开状态，数据会恢复成未展开的状态
   */
  clearTreeExpand () {
    const isExists = this.treeExpandeds.length
    this.treeExpandeds = []
    return this.$nextTick().then(() => isExists ? this.recalculate() : 0)
  },
  getVirtualScroller () {
    UtilTools.warn('vxe.error.delFunc', ['getVirtualScroller', 'getScroll'])
    return this.getScroll()
  },
  getTableScroll () {
    UtilTools.warn('vxe.error.delFunc', ['getTableScroll', 'getScroll'])
    return this.getScroll()
  },
  /**
   * 获取表格的滚动状态
   */
  getScroll () {
    const { $refs, scrollXLoad, scrollYLoad } = this
    const bodyElem = $refs.tableBody.$el
    return {
      // v3 移除 scrollX 属性
      scrollX: scrollXLoad,
      virtualX: scrollXLoad,
      // v3 移除 scrollY 属性
      scrollY: scrollYLoad,
      virtualY: scrollYLoad,
      scrollTop: bodyElem.scrollTop,
      scrollLeft: bodyElem.scrollLeft
    }
  },
  /**
   * 横向 X 可视渲染事件处理
   */
  triggerScrollXEvent () {
    this.loadScrollXData()
  },
  loadScrollXData (force) {
    const { $refs, visibleColumn, scrollXStore } = this
    const { startIndex, renderSize, offsetSize, visibleSize } = scrollXStore
    const scrollBodyElem = $refs.tableBody.$el
    const scrollLeft = scrollBodyElem.scrollLeft
    let toVisibleIndex = 0
    let width = 0
    let preload = force || false
    const colLen = visibleColumn.length
    for (let colIndex = 0; colIndex < colLen; colIndex++) {
      width += visibleColumn[colIndex].renderWidth
      if (scrollLeft < width) {
        toVisibleIndex = colIndex
        break
      }
    }
    if (force || scrollXStore.visibleIndex !== toVisibleIndex) {
      const marginSize = Math.min(Math.floor((renderSize - visibleSize) / 2), visibleSize)
      if (scrollXStore.visibleIndex === toVisibleIndex) {
        scrollXStore.startIndex = toVisibleIndex
      } else if (scrollXStore.visibleIndex > toVisibleIndex) {
        // 向左
        preload = toVisibleIndex - offsetSize <= startIndex
        if (preload) {
          scrollXStore.startIndex = Math.max(0, Math.max(0, toVisibleIndex - marginSize))
        }
      } else {
        // 向右
        preload = toVisibleIndex + visibleSize + offsetSize >= startIndex + renderSize
        if (preload) {
          scrollXStore.startIndex = Math.max(0, Math.min(visibleColumn.length - renderSize, toVisibleIndex - marginSize))
        }
      }
      if (preload) {
        this.updateScrollXData()
      }
      scrollXStore.visibleIndex = toVisibleIndex
    }
    this.clostTooltip()
  },
  /**
   * 纵向 Y 可视渲染事件处理
   */
  triggerScrollYEvent (evnt) {
    // webkit 浏览器使用最佳的渲染方式
    if (isWebkit && this.scrollYStore.adaptive) {
      this.loadScrollYData(evnt)
    } else {
      this.debounceScrollY(evnt)
    }
  },
  debounceScrollY: XEUtils.debounce(function (evnt) {
    this.loadScrollYData(evnt)
  }, debounceScrollYDuration, { leading: false, trailing: true }),
  /**
   * 纵向 Y 可视渲染处理
   */
  loadScrollYData (evnt) {
    const { afterFullData, scrollYStore, isLoadData } = this
    const { startIndex, renderSize, offsetSize, visibleSize, rowHeight } = scrollYStore
    const scrollBodyElem = evnt.target
    const scrollTop = scrollBodyElem.scrollTop
    const toVisibleIndex = Math.ceil(scrollTop / rowHeight)
    let preload = false
    if (isLoadData || scrollYStore.visibleIndex !== toVisibleIndex) {
      const marginSize = Math.min(Math.floor((renderSize - visibleSize) / 2), visibleSize)
      if (scrollYStore.visibleIndex > toVisibleIndex) {
        // 向上
        preload = toVisibleIndex - offsetSize <= startIndex
        if (preload) {
          scrollYStore.startIndex = Math.max(0, toVisibleIndex - Math.max(marginSize, renderSize - visibleSize))
        }
      } else {
        // 向下
        preload = toVisibleIndex + visibleSize + offsetSize >= startIndex + renderSize
        if (preload) {
          scrollYStore.startIndex = Math.max(0, Math.min(afterFullData.length - renderSize, toVisibleIndex - marginSize))
        }
      }
      if (preload) {
        this.updateScrollYData()
      }
      scrollYStore.visibleIndex = toVisibleIndex
      this.isLoadData = false
    }
  },
  computeRowHeight () {
    const tableBody = this.$refs.tableBody
    const tableBodyElem = tableBody ? tableBody.$el : null
    const tableHeader = this.$refs.tableHeader
    let rowHeight
    if (tableBodyElem) {
      let firstTrElem = tableBodyElem.querySelector('tbody>tr')
      if (!firstTrElem && tableHeader) {
        firstTrElem = tableHeader.$el.querySelector('thead>tr')
      }
      if (firstTrElem) {
        rowHeight = firstTrElem.clientHeight
      }
    }
    // 默认的行高
    if (!rowHeight) {
      rowHeight = this.rowHeightMaps[this.vSize || 'default']
    }
    this.rowHeight = rowHeight
  },
  // 计算可视渲染相关数据
  computeScrollLoad () {
    return this.$nextTick().then(() => {
      const { vSize, scrollXLoad, scrollYLoad, scrollYStore, scrollXStore, visibleColumn, optimizeOpts, rowHeightMaps } = this
      const { scrollX, scrollY } = optimizeOpts
      const tableBody = this.$refs.tableBody
      const tableBodyElem = tableBody ? tableBody.$el : null
      const tableHeader = this.$refs.tableHeader
      if (tableBodyElem) {
        // 计算 X 逻辑
        if (scrollXLoad) {
          const bodyWidth = tableBodyElem.clientWidth
          let visibleXSize = XEUtils.toNumber(scrollX.vSize)
          if (!scrollX.vSize) {
            const len = visibleXSize = visibleColumn.length
            let countWidth = 0
            let column
            for (let colIndex = 0; colIndex < len; colIndex++) {
              column = visibleColumn[colIndex]
              countWidth += column.renderWidth
              if (countWidth > bodyWidth) {
                visibleXSize = colIndex + 1
                break
              }
            }
          }
          scrollXStore.visibleSize = visibleXSize
          // 自动优化
          if (!scrollX.oSize) {
            scrollXStore.offsetSize = visibleXSize
          }
          if (!scrollX.rSize) {
            scrollXStore.renderSize = visibleXSize + 4
          }
          this.updateScrollXData()
        } else {
          this.updateScrollXSpace()
        }
        // 计算 Y 逻辑
        if (scrollYLoad) {
          let rHeight
          if (scrollY.rHeight) {
            rHeight = scrollY.rHeight
          } else {
            let firstTrElem = tableBodyElem.querySelector('tbody>tr')
            if (!firstTrElem && tableHeader) {
              firstTrElem = tableHeader.$el.querySelector('thead>tr')
            }
            if (firstTrElem) {
              rHeight = firstTrElem.clientHeight
            }
          }
          // 默认的行高
          if (!rHeight) {
            rHeight = rowHeightMaps[vSize || 'default']
          }
          const visibleYSize = XEUtils.toNumber(scrollY.vSize || Math.ceil(tableBodyElem.clientHeight / rHeight))
          scrollYStore.visibleSize = visibleYSize
          scrollYStore.rowHeight = rHeight
          // 自动优化
          if (!scrollY.oSize) {
            scrollYStore.offsetSize = visibleYSize
          }
          if (!scrollY.rSize) {
            scrollYStore.renderSize = browse.edge ? visibleYSize * 10 : (isWebkit ? visibleYSize + 2 : visibleYSize * 6)
          }
          this.updateScrollYData()
        } else {
          this.updateScrollYSpace()
        }
      }
      this.$nextTick(this.updateStyle)
    })
  },
  updateScrollXData () {
    const { visibleColumn, scrollXStore } = this
    this.tableColumn = visibleColumn.slice(scrollXStore.startIndex, scrollXStore.startIndex + scrollXStore.renderSize)
    this.updateScrollXSpace()
  },
  // 更新横向 X 可视渲染上下剩余空间大小
  updateScrollXSpace () {
    const { $refs, elemStore, visibleColumn, scrollXStore, scrollXLoad, tableWidth, scrollbarWidth } = this
    const { tableHeader, tableBody, tableFooter } = $refs
    const headerElem = tableHeader ? tableHeader.$el.querySelector('.vxe-table--header') : null
    const bodyElem = tableBody.$el.querySelector('.vxe-table--body')
    const footerElem = tableFooter ? tableFooter.$el.querySelector('.vxe-table--footer') : null
    const leftSpaceWidth = visibleColumn.slice(0, scrollXStore.startIndex).reduce((previous, column) => previous + column.renderWidth, 0)
    let marginLeft = ''
    if (scrollXLoad) {
      marginLeft = `${leftSpaceWidth}px`
    }
    if (headerElem) {
      headerElem.style.marginLeft = marginLeft
    }
    bodyElem.style.marginLeft = marginLeft
    if (footerElem) {
      footerElem.style.marginLeft = marginLeft
    }
    const containerList = ['main']
    containerList.forEach(name => {
      const layoutList = ['header', 'body', 'footer']
      layoutList.forEach(layout => {
        const xSpaceElem = elemStore[`${name}-${layout}-xSpace`]
        if (xSpaceElem) {
          xSpaceElem.style.width = scrollXLoad ? `${tableWidth + (layout === 'header' ? scrollbarWidth : 0)}px` : ''
        }
      })
    })
    this.$nextTick(this.updateStyle)
  },
  updateScrollYData () {
    this.handleTableData()
    this.updateScrollYSpace()
  },
  // 更新纵向 Y 可视渲染上下剩余空间大小
  updateScrollYSpace () {
    const { elemStore, scrollYStore, scrollYLoad, afterFullData } = this
    const bodyHeight = afterFullData.length * scrollYStore.rowHeight
    const topSpaceHeight = Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0)
    const containerList = ['main', 'left', 'right']
    let marginTop = ''
    let ySpaceHeight = ''
    if (scrollYLoad) {
      marginTop = `${topSpaceHeight}px`
      ySpaceHeight = `${bodyHeight}px`
    }
    containerList.forEach(name => {
      const layoutList = ['header', 'body', 'footer']
      const tableElem = elemStore[`${name}-body-table`]
      if (tableElem) {
        tableElem.style.marginTop = marginTop
      }
      layoutList.forEach(layout => {
        const ySpaceElem = elemStore[`${name}-${layout}-ySpace`]
        if (ySpaceElem) {
          ySpaceElem.style.height = ySpaceHeight
        }
      })
    })
    this.$nextTick(this.updateStyle)
  },
  /**
   * 如果有滚动条，则滚动到对应的位置
   * @param {Number} scrollLeft 左距离
   * @param {Number} scrollTop 上距离
   */
  scrollTo (scrollLeft, scrollTop) {
    const bodyElem = this.$refs.tableBody.$el
    if (XEUtils.isNumber(scrollLeft)) {
      const tableFooter = this.$refs.tableFooter
      if (tableFooter) {
        tableFooter.$el.scrollLeft = scrollLeft
      } else {
        bodyElem.scrollLeft = scrollLeft
      }
    }
    if (XEUtils.isNumber(scrollTop)) {
      const rightBody = this.$refs.rightBody
      if (rightBody) {
        rightBody.$el.scrollTop = scrollTop
      }
      bodyElem.scrollTop = scrollTop
    }
    if (this.scrollXLoad || this.scrollYLoad) {
      return new Promise(resolve => setTimeout(() => resolve(this.$nextTick()), 50))
    }
    return this.$nextTick()
  },
  /**
   * 如果有滚动条，则滚动到对应的行
   * @param {Row} row 行对象
   * @param {ColumnConfig} column 列配置
   */
  scrollToRow (row, column) {
    const rest = []
    if (row) {
      if (this.treeConfig) {
        rest.push(this.scrollToTreeRow(row))
      } else if (this.fullAllDataRowMap.has(row)) {
        rest.push(DomTools.rowToVisible(this, row))
      }
    }
    rest.push(this.scrollToColumn(column))
    return Promise.all(rest)
  },
  /**
   * 如果有滚动条，则滚动到对应的列
   * @param {ColumnConfig} column 列配置
   */
  scrollToColumn (column) {
    if (column && this.fullColumnMap.has(column)) {
      return DomTools.colToVisible(this, column)
    }
    return this.$nextTick()
  },
  /**
   * 对于树形结构中，可以直接滚动到指定深层节点中
   * 对于某些特定的场景可能会用到，比如定位到某一节点
   * @param {Row} row 行对象
   */
  scrollToTreeRow (row) {
    const { tableFullData, treeConfig, treeOpts } = this
    if (treeConfig) {
      const matchObj = XEUtils.findTree(tableFullData, item => item === row, treeOpts)
      if (matchObj) {
        const nodes = matchObj.nodes
        nodes.forEach((row, index) => {
          if (index < nodes.length - 1 && !this.isTreeExpandByRow(row)) {
            this.setTreeExpansion(row, true)
          }
        })
      }
    }
    return this.$nextTick()
  },
  /**
   * 手动清除滚动相关信息，还原到初始状态
   */
  clearScroll () {
    const $refs = this.$refs
    const tableBody = $refs.tableBody
    const tableBodyElem = tableBody ? tableBody.$el : null
    const tableFooter = $refs.tableFooter
    const tableFooterElem = tableFooter ? tableFooter.$el : null
    const footerTargetElem = tableFooterElem || tableBodyElem
    if (tableBodyElem) {
      tableBodyElem.scrollTop = 0
    }
    if (footerTargetElem) {
      footerTargetElem.scrollLeft = 0
    }
    return new Promise(resolve => setTimeout(() => resolve(this.$nextTick())))
  },
  /**
   * 更新表尾合计
   */
  updateFooter () {
    const { showFooter, tableColumn, footerMethod } = this
    if (showFooter && footerMethod) {
      this.footerData = tableColumn.length ? footerMethod({ columns: tableColumn, data: this.afterFullData }) : []
    }
    return this.$nextTick()
  },
  /**
   * 更新列状态
   * 如果组件值 v-model 发生 change 时，调用改函数用于更新某一列编辑状态
   * 如果单元格配置了校验规则，则会进行校验
   */
  updateStatus (scope, cellValue) {
    const customVal = !XEUtils.isUndefined(cellValue)
    return this.$nextTick().then(() => {
      const { $refs, tableData, editRules, validStore } = this
      if (scope && $refs.tableBody && editRules) {
        const { row, column } = scope
        const type = 'change'
        if (this.hasCellRules(type, row, column)) {
          const rowIndex = tableData.indexOf(row)
          const cell = DomTools.getCell(this, { row, rowIndex, column })
          if (cell) {
            return this.validCellRules(type, row, column, cellValue)
              .then(() => {
                if (customVal && validStore.visible) {
                  UtilTools.setCellValue(row, column, cellValue)
                }
                this.clearValidate()
              })
              .catch(({ rule }) => {
                if (customVal) {
                  UtilTools.setCellValue(row, column, cellValue)
                }
                this.showValidTooltip({ rule, row, column, cell })
              })
          }
        }
      }
    })
  },
  updateZindex () {
    if (this.tZindex < UtilTools.getLastZIndex()) {
      this.tZindex = UtilTools.nextZIndex(this)
    }
  },

  /*************************
   * Publish methods
   *************************/
  // 与工具栏对接
  connect ({ toolbar }) {
    this.$toolbar = toolbar
  },
  // 检查触发源是否属于目标节点
  getEventTargetNode: DomTools.getEventTargetNode
  /*************************
   * Publish methods
   *************************/
}

// Module methods
const funcs = 'setFilter,filter,clearFilter,closeMenu,getMouseSelecteds,getMouseCheckeds,getSelectedCell,getSelectedRanges,clearCopyed,clearChecked,clearHeaderChecked,clearIndexChecked,clearSelected,insert,insertAt,remove,removeSelecteds,removeCheckboxRow,removeRadioRow,removeCurrentRow,getRecordset,getInsertRecords,getRemoveRecords,getUpdateRecords,clearActived,getActiveRecord,getActiveRow,hasActiveRow,isActiveByRow,setActiveRow,setActiveCell,setSelectCell,clearValidate,fullValidate,validate,exportCsv,openExport,exportData,openImport,importData,readFile,importByFile,print'.split(',')

funcs.forEach(name => {
  Methods[name] = function (...args) {
    return this[`_${name}`] ? this[`_${name}`](...args) : null
  }
})

export default Methods