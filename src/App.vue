<template>
  <el-container class="layout-container">
    <el-header>
      <h1>待办事项清单</h1>
    </el-header>
    
    <el-main>
      <el-card class="main-card">
        <to-do-form @todo-added="addToDo"></to-do-form>
        
        <el-divider>
          <el-tag size="large" :type="getTagType">{{listSummary}}</el-tag>
        </el-divider>
        
        <ul aria-labelledby="list-summary" class="stack-large">
          <li v-for="item in ToDoItems" :key="item.id">
            <to-do-item
              :label="item.label"
              :done="item.done"
              :id="item.id"
              @checkbox-changed="updateDoneStatus(item.id)"
              @item-deleted="deleteToDo(item.id)"
              @item-edited="editToDo(item.id, $event)">
            </to-do-item>
          </li>
        </ul>
        
        <el-divider>数据统计</el-divider>
        <to-do-chart :todoItems="ToDoItems"></to-do-chart>
      </el-card>
    </el-main>
    
    <el-footer>
      <p>Made with Vue.js & Element Plus</p>
    </el-footer>
  </el-container>
</template>

<script>
import ToDoItem from "./components/ToDoItem.vue";
import ToDoForm from "./components/ToDoForm.vue";
import ToDoChart from "./components/ToDoChart.vue";
import uniqueId from "lodash.uniqueid";

export default {
  name: "app",
  components: {
    ToDoItem,
    ToDoForm,
    ToDoChart,
  },
  data() {
    return {
      ToDoItems: [
        { id: uniqueId("todo-"), label: "学习 Vue", done: false },
        { id: uniqueId("todo-"), label: "用 CLI 创建 Vue 项目", done: true },
        { id: uniqueId("todo-"), label: "开心学习", done: true },
        { id: uniqueId("todo-"), label: "创建待办事项列表", done: false }
      ],
    };
  },
  methods: {
    addToDo(toDoLabel) {
      this.ToDoItems.push({
        id: uniqueId('todo-'),
        label: toDoLabel,
        done: false
      });
    },
    updateDoneStatus(toDoId) {
      const toDoToUpdate = this.ToDoItems.find((item) => item.id === toDoId)
      toDoToUpdate.done = !toDoToUpdate.done
    },
    deleteToDo(toDoId) {
      const itemIndex = this.ToDoItems.findIndex((item) => item.id === toDoId);
      this.ToDoItems.splice(itemIndex, 1);
    },
    editToDo(toDoId, newLabel) {
      const toDoToEdit = this.ToDoItems.find((item) => item.id === toDoId);
      toDoToEdit.label = newLabel;
    }
  },
  computed: {
    listSummary() {
      const numberFinishedItems = this.ToDoItems.filter((item) => item.done).length
      return `已完成 ${numberFinishedItems}/${this.ToDoItems.length} 项`
    },
    getTagType() {
      const numberFinishedItems = this.ToDoItems.filter((item) => item.done).length
      const ratio = numberFinishedItems / this.ToDoItems.length
      if (ratio === 1) return 'success'
      if (ratio >= 0.5) return 'warning'
      return 'info'
    }
  }
};
</script>

<style>
.layout-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  padding: 0;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-main {
  margin-top: 60px;
  padding: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  flex: 1;
}

.main-card {
  margin: 20px;
  border-radius: 8px;
}

.el-footer {
  text-align: center;
  color: #909399;
  padding: 20px;
}

h1 {
  font-size: 24px;
  color: #303133;
  margin: 0;
  padding: 0;
  position: static;
  width: auto;
  transform: none;
  line-height: normal;
}

.el-divider {
  margin: 24px 0;
}

/* 移除一些可能冲突的旧样式 */
#app {
  background: transparent;
  margin: 0;
  padding: 0;
  box-shadow: none;
}

#app > * {
  max-width: none;
}

/* 保留其他必要的样式 */
.stack-large > * + * {
  margin-top: 1.25rem;
}

.visually-hidden {
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px);
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .el-main {
    padding: 80px 10px 20px;
  }
  
  .main-card {
    margin: 10px;
  }
}
</style>
