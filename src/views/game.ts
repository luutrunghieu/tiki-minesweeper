import { Vue, Component, Watch } from 'vue-property-decorator';
import { Option } from '@/entities/option';

@Component
export default class Game extends Vue {
  options: Option[] = [
    {
      level: 'Beginner',
      dimension: 9,
      mine: 10
    },
    {
      level: 'Advanced',
      dimension: 16,
      mine: 40
    }
  ];

  selectedLevel: Option = {
    dimension: 0,
    mine: 0,
    level: ''
  };

  pattern: any[] = [];
  clickedMatrix: any[] = [];
  noBombLeft = 0;

  firstClicked = false;
  time = 0;
  countTimeInterval: any;

  mounted() {
    const foundOption = this.options.find(option => option.level === this.$route.query.level);
    this.selectedLevel = foundOption as Option;
    this.noBombLeft = Math.pow(this.selectedLevel.dimension, 2) - this.selectedLevel.mine;
    this.initPattern();
  }

  initPattern() {
    this.clickedMatrix = Array.from(Array(this.selectedLevel.dimension), _ =>
      Array(this.selectedLevel.dimension).fill(0)
    );

    this.pattern = Array.from(Array(this.selectedLevel.dimension), _ =>
      Array(this.selectedLevel.dimension).fill(0)
    );

    const numberOfMines = this.selectedLevel.mine;
    const dimension = this.selectedLevel.dimension;
    for (let i = 0; i < numberOfMines; i++) {
      const colIdx = Math.floor(Math.random() * dimension);
      const rowIdx = Math.floor(Math.random() * dimension);
      if (this.pattern[colIdx][rowIdx] !== 'bomb') {
        this.pattern[colIdx][rowIdx] = 'bomb';
      } else {
        i--;
      }
    }

    for (let rowIdx = 0; rowIdx < dimension; rowIdx++) {
      for (let colIdx = 0; colIdx < dimension; colIdx++) {
        if (this.pattern[rowIdx][colIdx] === 'bomb') {
          continue;
        }

        let bombArround = 0;
        if (rowIdx > 0 && colIdx > 0) {
          const upperLeft = this.pattern[rowIdx - 1][colIdx - 1];
          if (upperLeft === 'bomb') {
            bombArround++;
          }
        }

        if (rowIdx > 0) {
          const upper = this.pattern[rowIdx - 1][colIdx];
          if (upper === 'bomb') {
            bombArround++;
          }
        }

        if (rowIdx > 0 && colIdx < dimension - 1) {
          const upperRight = this.pattern[rowIdx - 1][colIdx + 1];
          if (upperRight === 'bomb') {
            bombArround++;
          }
        }

        if (colIdx > 0) {
          const left = this.pattern[rowIdx][colIdx - 1];
          if (left === 'bomb') {
            bombArround++;
          }
        }

        if (colIdx < dimension - 1) {
          const right = this.pattern[rowIdx][colIdx + 1];
          if (right === 'bomb') {
            bombArround++;
          }
        }

        if (rowIdx < dimension - 1 && colIdx > 0) {
          const belowLeft = this.pattern[rowIdx + 1][colIdx - 1];
          if (belowLeft === 'bomb') {
            bombArround++;
          }
        }

        if (rowIdx < dimension - 1) {
          const below = this.pattern[rowIdx + 1][colIdx];
          if (below === 'bomb') {
            bombArround++;
          }
        }

        if (rowIdx < dimension - 1 && colIdx < dimension - 1) {
          const belowRight = this.pattern[rowIdx + 1][colIdx + 1];
          if (belowRight === 'bomb') {
            bombArround++;
          }
        }

        this.pattern[rowIdx][colIdx] = bombArround;
      }
    }
  }

  countTime() {
    this.time++;
  }

  get hours() {
    return Math.floor(this.time / 3600);
  }

  get minutes() {
    return Math.floor((this.time - 3600 * this.hours) / 60);
  }

  get seconds() {
    return this.time - 3600 * this.hours - 60 * this.minutes;
  }

  clickBtn(rowIndex: number, colIndex: number) {
    if (!this.firstClicked) {
      this.firstClicked = true;
      this.countTimeInterval = setInterval(() => this.countTime(), 1000);
    }

    const newArr = [...this.clickedMatrix[rowIndex - 1]];
    newArr[colIndex - 1] = 1;
    this.clickedMatrix[rowIndex - 1] = newArr;
    this.clickedMatrix = [...this.clickedMatrix];

    if (this.pattern[rowIndex - 1][colIndex - 1] === 'bomb') {
      for (let rowIdx = 0; rowIdx < this.selectedLevel.dimension; rowIdx++) {
        for (let colIdx = 0; colIdx < this.selectedLevel.dimension; colIdx++) {
          if (this.pattern[rowIdx][colIdx] === 'bomb') {
            this.clickedMatrix[rowIdx][colIdx] = 1;
          }
        }
      }
      this.$buefy.dialog.confirm({
        message: `you lose in ${this.hours}:${this.minutes}:${this.seconds}`,
        cancelText: 'Go Home',
        confirmText: 'Restart',
        onCancel: () => {
          this.$router.push({ path: '/' });
        },
        onConfirm: () => {
          this.firstClicked = false;
          this.time = 0;
          this.noBombLeft = Math.pow(this.selectedLevel.dimension, 2) - this.selectedLevel.mine;
          this.initPattern();
        }
      });
      clearInterval(this.countTimeInterval);
    } else {
      this.noBombLeft--;
    }
  }

  @Watch('noBombLeft')
  private noBombLeftChanged() {
    if (this.noBombLeft === 0) {
      this.$buefy.dialog.confirm({
        message: `you win in ${this.hours}:${this.minutes}:${this.seconds}`,
        cancelText: 'Go Home',
        confirmText: 'Restart',
        onCancel: () => {
          this.$router.push({ path: '/' });
        },
        onConfirm: () => {
          this.firstClicked = false;
          this.time = 0;
          this.noBombLeft = Math.pow(this.selectedLevel.dimension, 2) - this.selectedLevel.mine;
          this.initPattern();
        }
      });
      clearInterval(this.countTimeInterval);
    }
  }
}
