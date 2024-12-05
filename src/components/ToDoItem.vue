<template>
  <el-card class="todo-item" :shadow="isEditing ? 'hover' : 'never'">
    <div v-if="!isEditing" class="todo-content">
      <el-checkbox
        :model-value="isDone"
        @change="$emit('checkbox-changed')"
      >
        <span :class="{ 'done': isDone }">{{label}}</span>
      </el-checkbox>
      
      <div class="todo-actions">
        <el-button-group>
          <el-button
            ref="editButton"
            type="primary"
            :icon="Edit"
            @click="toggleToItemEditForm"
            text
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            @click="deleteToDo"
            text
          >
            删除
          </el-button>
        </el-button-group>
      </div>
    </div>
    
    <to-do-item-edit-form
      v-else
      :id="id"
      :label="label"
      @item-edited="itemEdited"
      @edit-cancelled="editCancelled">
    </to-do-item-edit-form>
  </el-card>
</template>

<script>
import { Edit, Delete } from '@element-plus/icons-vue'
import ToDoItemEditForm from "./ToDoItemEditForm.vue";

export default {
  components: {
    ToDoItemEditForm
  },
  props: {
    label: { required: true, type: String },
    done: { default: false, type: Boolean },
    id: { required: true, type: String }
  },
  data() {
    return {
      isEditing: false,
      Edit,
      Delete
    };
  },
  computed: {
    isDone() {
      return this.done;
    }
  },
  methods: {
    deleteToDo() {
      this.$emit('item-deleted');
    },
    toggleToItemEditForm() {
      this.isEditing = true;
    },
    itemEdited(newLabel) {
      this.$emit('item-edited', newLabel);
      this.isEditing = false;
      this.focusOnEditButton();
    },
    editCancelled() {
      this.isEditing = false;
      this.focusOnEditButton();
    },
    focusOnEditButton() {
      this.$nextTick(() => {
        const editButtonRef = this.$refs.editButton?.$el;
        if (editButtonRef) {
          editButtonRef.focus();
        }
      });
    }
  }
};
</script>

<style scoped>
.todo-item {
  margin-bottom: 10px;
}

.todo-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.done {
  text-decoration: line-through;
  color: #909399;
}

.todo-actions {
  opacity: 0;
  transition: opacity 0.3s;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}
</style> 