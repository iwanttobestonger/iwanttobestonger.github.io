<template>
  <el-form @submit.prevent="onSubmit" class="todo-form">
    <el-form-item>
      <el-input
        v-model.trim="label"
        placeholder="需要做什么?"
        :prefix-icon="Edit"
        clearable
      >
        <template #append>
          <el-button type="primary" native-type="submit">
            添加
          </el-button>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { Edit } from '@element-plus/icons-vue'

export default {
  data() {
    return {
      label: "",
      Edit
    };
  },
  methods: {
    onSubmit() {
      if(this.label === "") {
        return;
      }
      this.$emit('todo-added', this.label);
      this.label = "";
    }
  }
};
</script>

<style scoped>
.todo-form {
  max-width: 600px;
  margin: 0 auto;
}
</style> 