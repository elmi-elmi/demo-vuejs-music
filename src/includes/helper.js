export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const second = Math.round(time - minutes * 60 || 0);

    return `${minutes}:${second < 10 ? '0' : ''}${second}`;
  },
};
