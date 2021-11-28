export default () => ({
  games: {
    monthsOldForDeletion:
      parseInt(process.env.TASKS_GAME_MONTHS_OLD_FOR_DELETION) || 18,
    startMonthsOldForDisscount:
      parseInt(process.env.TASKS_GAME_START_MONTHS_OLD_FOR_DISSCOUNT) || 18,
    endMonthsOldForDisscount:
      parseInt(process.env.TASKS_GAME_END_MONTHS_OLD_FOR_DISSCOUNT) || 12,
    disccount: parseInt(process.env.TASKS_GAME_DISSCOUNT) || 20,
  },
});
