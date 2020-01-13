<template>
  <div class="home">
    <div class="container">
      <h1 class="is-size-1">Welcome to Minesweeper</h1>
      <b-select placeholder="Select your level" @input="handleSelectLevel">
        <option v-for="(option, index) in options" :key="index" :value="option">
          {{ option.level }} ({{ option.dimension }}x{{ option.dimension }})
        </option>
      </b-select>
      <br />
      <b-button
        type="is-primary"
        :disabled="!selectedLevel"
        @click="handleStartGame"
        >Start</b-button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Option } from '@/entities/option';
@Component
export default class WelcomePage extends Vue {
  options: Option[] = [
    {
      level: 'Beginner',
      dimension: 9,
      mine: 10,
    },
    {
      level: 'Advanced',
      dimension: 16,
      mine: 40,
    },
  ];

  selectedLevel: Option | null = null;

  handleSelectLevel(option: Option) {
    this.selectedLevel = option;
  }

  handleStartGame() {
    if (this.selectedLevel) {
      this.$router.push({
        path: 'game',
        query: { level: this.selectedLevel.level },
      });
    }
  }
}
</script>
