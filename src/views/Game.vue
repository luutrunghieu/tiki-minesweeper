<template>
  <div class="game" v-if="selectedLevel">
    <h1 class="is-size-1">Game On</h1>
    <template v-for="rowIndex in selectedLevel.dimension">
      <div :key="rowIndex" class="row">
        <template v-for="colIndex in selectedLevel.dimension">
          <div :key="`${colIndex}-${rowIndex}`" class="btn" @click="clickBtn(rowIndex, colIndex)">
            <span v-if="clickedMatrix[rowIndex - 1][colIndex - 1] === 1">{{
              pattern[rowIndex - 1][colIndex - 1]
            }}</span>
            <span v-else>''</span>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.game {
  .row {
    height: 40px;
    .btn {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
        0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
<script lang="ts" src="./game.ts">
</script>
